/**
 * Sentinel error class so call sites can distinguish "AI returned garbage we
 * can't parse" (HTTP 502 — bad upstream gateway) from "AI service errored"
 * (HTTP 503 — service unavailable).
 */
export class JsonParseError extends Error {
  readonly name = "JsonParseError";
  readonly raw: string;
  constructor(message: string, raw: string) {
    super(message);
    this.raw = raw;
  }
}

/**
 * Tolerant JSON parser for LLM outputs. Strips markdown fences, trailing
 * commentary, smart quotes, and trailing commas, then parses.
 *
 * Call sites retry up to twice on parse failure; this handles the 95% case
 * where Groq wraps JSON in ```json ... ``` or appends "Here's your answer:".
 */
export function repairAndParse<T = unknown>(raw: string): T {
  const cleaned = raw
    .trim()
    // Strip markdown fences (```json, ```javascript, ```typescript, ``` etc.)
    .replace(/```(?:json|javascript|typescript|text)?\s*/gi, "")
    .replace(/```\s*$/g, "")
    .trim();

  // Try straight parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {}

  // Extract the outermost JSON object/array
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  const start =
    firstBrace === -1 ? firstBracket
    : firstBracket === -1 ? firstBrace
    : Math.min(firstBrace, firstBracket);
  if (start === -1) throw new JsonParseError("No JSON object/array in LLM output", raw);

  const lastBrace = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);
  if (end === -1 || end <= start) throw new JsonParseError("Truncated JSON in LLM output", raw);

  let slice = cleaned.slice(start, end + 1);

  // Normalize smart quotes → straight
  slice = slice.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

  // Replace NaN / Infinity literals (not valid JSON) with null
  slice = slice.replace(/:\s*NaN\b/g, ": null");
  slice = slice.replace(/:\s*-?Infinity\b/g, ": null");

  // Escape unescaped control characters inside JSON string values.
  // LLMs sometimes emit literal newlines/tabs inside string values.
  slice = slice.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
    return match
      .replace(/\t/g, "\\t")
      .replace(/\r\n/g, "\\n")
      .replace(/\r/g, "\\n")
      .replace(/\n/g, "\\n");
  });

  // Strip trailing commas before closing bracket/brace
  slice = slice.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(slice) as T;
  } catch {
    // Incomplete JSON — LLM stopped mid-response (hit max_tokens). Try to
    // close open brackets/braces so we can salvage a partial result.

    // Strip trailing partial value (unfinished string, dangling comma,
    // partial key). Trim back to the last structurally complete token.
    let patched = slice
      .replace(/,\s*$/, "")           // trailing comma
      .replace(/,\s*"[^"]*$/, "")     // trailing partial key
      .replace(/"[^"]*$/, '""');       // unterminated string -> empty string

    // Count unclosed braces/brackets (outside strings) and append closers.
    let inString = false;
    let escaped = false;
    const stack: string[] = [];
    for (const ch of patched) {
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
    patched += stack.reverse().join("");

    try {
      return JSON.parse(patched) as T;
    } catch (finalErr) {
      throw new JsonParseError(
        `JSON repair failed: ${finalErr instanceof Error ? finalErr.message : "unknown parse error"}`,
        raw,
      );
    }
  }
}

/**
 * Validate a parsed result against a zod schema (optional). If a schema
 * is provided and validation fails, throws so the retry loop can try again.
 */
function validateResult<T>(result: unknown, schema?: { parse: (data: unknown) => T }): T {
  if (!schema) return result as T;
  return schema.parse(result);
}

/**
 * Retry an async LLM call up to N times on parse failure.
 *
 * Implements ONIX Error Handler patterns:
 *   - Retry Handler (Agent 3.5): retries on transient parse failures
 *   - Error Classifier (Agent 6.2): distinguishes parse vs network vs auth errors
 *   - Propagation Preventer (Agent 6.6): non-retryable errors break immediately
 *
 * @param call      — async function that returns a raw LLM string
 * @param attempts  — max attempts (default 2)
 * @param schema    — optional zod schema to validate the parsed result
 * @param label     — optional caller label for structured logging
 */
export async function callWithJsonRetry<T>(
  call: () => Promise<string>,
  attempts = 2,
  schema?: { parse: (data: unknown) => T },
  label?: string,
): Promise<T> {
  let lastErr: unknown;
  let lastRaw = "";
  let lastWasParseError = false;
  const callerLabel = label ?? "unknown";
  for (let i = 0; i < attempts; i++) {
    let raw = "";
    try {
      raw = await call();
      lastRaw = raw;
      lastWasParseError = false;
      try {
        const parsed = repairAndParse<T>(raw);
        return validateResult(parsed, schema);
      } catch (parseErr) {
        lastWasParseError = true;
        lastErr = parseErr;
        // Log parse failures with a truncated snippet so devs can diagnose
        // whether the LLM truncated output, wrapped in markdown, etc.
        console.error(JSON.stringify({
          ts: Date.now(),
          level: "warn",
          scope: "json-repair",
          event: "parse_failed",
          caller: callerLabel,
          attempt: i + 1,
          maxAttempts: attempts,
          rawLength: raw.length,
          rawSnippet: raw.slice(0, 200),
          error: parseErr instanceof Error ? parseErr.message : String(parseErr),
        }));
      }
    } catch (callErr) {
      lastWasParseError = false;
      lastErr = callErr;
      const status = (callErr as { status?: number }).status;
      // Error classification: non-retryable errors break immediately to
      // prevent cascade — a second call to a 401/403 endpoint wastes time
      // and may trigger rate-limit penalties.
      if (status === 401 || status === 403) {
        console.error(JSON.stringify({
          ts: Date.now(),
          level: "error",
          scope: "json-repair",
          event: "non_retryable_error",
          caller: callerLabel,
          status,
          error: (callErr as Error).message,
        }));
        break;
      }
      // 429 (rate-limited): break — another attempt will hit the same wall
      // unless the router rotates keys (which happens at the groq layer).
      if (status === 429) {
        console.error(JSON.stringify({
          ts: Date.now(),
          level: "warn",
          scope: "json-repair",
          event: "rate_limited",
          caller: callerLabel,
          attempt: i + 1,
        }));
        break;
      }
    }
  }
  if (lastWasParseError) {
    throw new JsonParseError(
      lastErr instanceof Error ? lastErr.message : "Failed to parse LLM JSON",
      lastRaw,
    );
  }
  throw lastErr ?? new Error("LLM JSON retry exhausted");
}
