import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-helpers";
import { rateLimitUserAndIp } from "@/lib/rate-limit";
import { extractTextFromDocx, extractTextFromPdf, MAX_PDF_PAGES } from "@/lib/resume-file-extraction";

/**
 * POST /api/profile/extract-file
 *
 * Accepts a PDF, DOCX, or TXT file upload and extracts the text content.
 * The extracted text is returned so the client can put it into the paste
 * textarea for review before calling /api/profile/parse-resume.
 *
 * For TXT files: reads directly as UTF-8.
 * For PDF: pdf-parse/pdfjs text extraction with its native Node canvas
 * dependency bundled explicitly for Vercel.
 * For DOCX: Mammoth text extraction from the document XML.
 *
 * Max file size: 5MB (enforced client-side and here).
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type ExtractionErrorCode =
  | "INVALID_FORM_DATA"
  | "FILE_REQUIRED"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "FILE_TYPE_MISMATCH"
  | "ENCRYPTED_PDF"
  | "MALFORMED_FILE"
  | "PDF_PAGE_LIMIT"
  | "EXTRACTION_RUNTIME_UNAVAILABLE"
  | "EXTRACTION_FAILED";

function extractionError(
  requestId: string,
  code: ExtractionErrorCode,
  message: string,
  status: number,
  recoverable = true,
) {
  return NextResponse.json(
    { error: { code, message, fieldErrors: { file: [message] }, requestId, recoverable } },
    { status, headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId } },
  );
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const authed = await requireUser();
    if ("response" in authed) return authed.response;
    const { userId, user } = authed;

    // Document processing must not bypass abuse controls when the limiter fails.
    let rl: { allowed: boolean };
    try {
      rl = await rateLimitUserAndIp(userId, req, user.plan);
    } catch (rlErr) {
      console.error("[extract-file] rate limiter unavailable:", rlErr instanceof Error ? rlErr.message : String(rlErr));
      return NextResponse.json(
        { error: { code: "RATE_LIMIT_UNAVAILABLE", message: "Request safety check is temporarily unavailable. Please try again shortly.", fieldErrors: {}, requestId, recoverable: true } },
        { status: 503, headers: { "Retry-After": "30", "X-Request-Id": requestId } },
      );
    }
    if (!rl.allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please wait a minute and try again.", fieldErrors: {}, requestId, recoverable: true } },
        { status: 429, headers: { "Retry-After": "60", "X-Request-Id": requestId } },
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return extractionError(requestId, "INVALID_FORM_DATA", "Invalid form data. Upload a file.", 400);
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return extractionError(requestId, "FILE_REQUIRED", "No file uploaded.", 400);
    }

    if (file.size === 0) {
      return extractionError(requestId, "EMPTY_FILE", "The uploaded file is empty. Try a different file or paste the content instead.", 400);
    }

    if (file.size > MAX_SIZE) {
      return extractionError(requestId, "FILE_TOO_LARGE", "File too large. Maximum 5MB.", 413);
    }

    const name = file.name.toLowerCase();
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch (bufErr) {
      console.error("[extract-file] failed to read file buffer:", bufErr instanceof Error ? bufErr.message : String(bufErr));
      return extractionError(requestId, "EXTRACTION_FAILED", "Could not read the uploaded file. Try pasting the content instead.", 422);
    }

    // Magic bytes verification — ensure file content matches claimed extension
    // to prevent disguised uploads (e.g. a .exe renamed to .pdf).
    const MAGIC_BYTES: Record<string, (b: Buffer) => boolean> = {
      ".pdf": (b) => b.length >= 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
      ".docx": (b) => b.length >= 2 && b[0] === 0x50 && b[1] === 0x4B, // PK (ZIP)
      ".txt": () => true, // Text files have no fixed magic bytes
    };

    const ext = name.slice(name.lastIndexOf("."));
    const magicCheck = MAGIC_BYTES[ext];
    const allowedMimeTypes: Record<string, Set<string>> = {
      ".pdf": new Set(["application/pdf", "application/octet-stream", ""]),
      ".docx": new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/octet-stream", ""]),
      ".txt": new Set(["text/plain", "application/octet-stream", ""]),
    };
    if (!magicCheck || !allowedMimeTypes[ext]?.has(file.type.toLowerCase())) {
      return extractionError(requestId, "UNSUPPORTED_FILE_TYPE", "Unsupported file type. Upload PDF, DOCX, or TXT.", 400, false);
    }
    if (magicCheck && !magicCheck(buffer)) {
      return extractionError(requestId, "FILE_TYPE_MISMATCH", "File content does not match its extension. Please upload a valid file.", 400, false);
    }

    let text = "";

    try {
      if (name.endsWith(".txt")) {
        // Strip BOM from UTF-8 text files
        text = buffer.toString("utf-8").replace(/^\xEF\xBB\xBF/, "").replace(/^﻿/, "");
      } else if (name.endsWith(".pdf")) {
        text = await extractTextFromPdf(buffer);
      } else if (name.endsWith(".docx")) {
        text = await extractTextFromDocx(buffer);
      } else {
        return extractionError(requestId, "UNSUPPORTED_FILE_TYPE", "Unsupported file type. Upload PDF, DOCX, or TXT.", 400, false);
      }
    } catch (err) {
      console.error("[extract-file] extraction failed:", {
        errorType: err instanceof Error ? err.name : "UnknownError",
        errorMessage: err instanceof Error ? err.message : String(err),
        requestId,
        extension: ext,
        fileSize: file.size,
      });
      const errorName = err instanceof Error ? err.name : "";
      if (errorName === "PasswordException") {
        return extractionError(requestId, "ENCRYPTED_PDF", "This PDF is password-protected. Remove the password or paste the resume text instead.", 422, false);
      }
      if (errorName === "InvalidPDFException" || errorName === "FormatError") {
        return extractionError(requestId, "MALFORMED_FILE", "This file is malformed or damaged. Export a new copy or paste the resume text instead.", 422, false);
      }
      if (errorName === "PDFPageLimitError") {
        return extractionError(requestId, "PDF_PAGE_LIMIT", `PDFs may contain at most ${MAX_PDF_PAGES} pages.`, 413, false);
      }
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (/DOMMatrix|ImageData|Path2D|@napi-rs\/canvas|pdf\.worker|fake worker/i.test(errorMessage)) {
        return extractionError(
          requestId,
          "EXTRACTION_RUNTIME_UNAVAILABLE",
          "PDF extraction is temporarily unavailable. Try again shortly or upload a DOCX/TXT file.",
          503,
        );
      }
      return extractionError(requestId, "EXTRACTION_FAILED", "Could not extract text from this file. Try pasting the content instead.", 422);
    }

    // Clean up extracted text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text.length < 50) {
      return NextResponse.json(
        {
          text,
          requestId,
          warning: "We couldn't read enough text from that file. It may be image-based or empty. Paste the resume text below or try a clearer PDF/DOCX.",
        },
        {
          headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId },
        },
      );
    }

    return NextResponse.json({ text, requestId }, {
      headers: { "Cache-Control": "private, no-store", "X-Request-Id": requestId },
    });
  } catch (err) {
    // Top-level guard: prevents bare 503 from unhandled throws in
    // requireUser, formData parsing, or any other unexpected path.
    console.error("[extract-file] unhandled error:", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: { code: "SERVICE_UNAVAILABLE", message: "File extraction service temporarily unavailable. Try pasting your resume text instead.", fieldErrors: {}, requestId, recoverable: true } },
      { status: 503, headers: { "Retry-After": "15", "X-Request-Id": requestId } },
    );
  }
}
