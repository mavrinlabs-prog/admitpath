export const MAX_PDF_PAGES = 20;

async function ensurePdfRuntime(): Promise<void> {
  // pdfjs loads these browser primitives during module initialization, even
  // when the caller only extracts text. Importing canvas directly also makes
  // Next/Vercel trace the native binding into this serverless function.
  const canvas = await import("@napi-rs/canvas");
  const descriptors: PropertyDescriptorMap = {};

  if (typeof globalThis.DOMMatrix === "undefined") {
    descriptors.DOMMatrix = { value: canvas.DOMMatrix, configurable: true, writable: true };
  }
  if (typeof globalThis.ImageData === "undefined") {
    descriptors.ImageData = { value: canvas.ImageData, configurable: true, writable: true };
  }
  if (typeof globalThis.Path2D === "undefined") {
    descriptors.Path2D = { value: canvas.Path2D, configurable: true, writable: true };
  }

  if (Object.keys(descriptors).length > 0) {
    Object.defineProperties(globalThis, descriptors);
  }
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  await ensurePdfRuntime();
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const parsed = await parser.getText({ first: MAX_PDF_PAGES + 1 });
    if (parsed.total > MAX_PDF_PAGES) {
      const error = new Error(`PDF exceeds ${MAX_PDF_PAGES} pages.`);
      error.name = "PDFPageLimitError";
      throw error;
    }
    return parsed.text.trim();
  } finally {
    await parser.destroy();
  }
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}
