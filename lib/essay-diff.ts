/**
 * Word-level diff for essay revisions.
 *
 * We diff at the word boundary (not character or line) because essay
 * revisions are usually word/phrase substitutions, not whole-line rewrites.
 * Character diffs produce noisy output ("change → changed" looks like a
 * 3-char insert); line diffs miss in-line edits because essays are mostly
 * one paragraph per line.
 *
 * Algorithm: Myers' LCS — O(n*m) memory but fine here since essays are
 * capped at ~650 words. No external dep so we don't pull in `diff` (~80KB)
 * just for this.
 */

export type DiffOp =
  | { type: "equal"; text: string }
  | { type: "insert"; text: string }
  | { type: "delete"; text: string };

const WORD_RE = /(\s+|[^\w\s]+|\w+)/g;

function tokenize(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

function lcsTable(a: string[], b: string[]): number[][] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/** Max token count before we bail out to prevent O(n*m) explosion. */
const MAX_TOKENS = 3000;

export function diffWords(oldText: string, newText: string): DiffOp[] {
  // Handle trivial cases
  if (oldText === newText) return oldText ? [{ type: "equal", text: oldText }] : [];
  if (!oldText.trim()) return newText ? [{ type: "insert", text: newText }] : [];
  if (!newText.trim()) return oldText ? [{ type: "delete", text: oldText }] : [];

  const a = tokenize(oldText);
  const b = tokenize(newText);

  // Safety: if either side exceeds MAX_TOKENS, fall back to a simple
  // delete-old + insert-new to avoid unbounded memory/CPU.
  if (a.length > MAX_TOKENS || b.length > MAX_TOKENS) {
    return [
      { type: "delete", text: oldText },
      { type: "insert", text: newText },
    ];
  }

  const dp = lcsTable(a, b);

  const ops: DiffOp[] = [];
  let i = a.length;
  let j = b.length;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      ops.push({ type: "equal", text: a[i - 1] });
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      ops.push({ type: "delete", text: a[i - 1] });
      i--;
    } else {
      ops.push({ type: "insert", text: b[j - 1] });
      j--;
    }
  }
  while (i > 0) { ops.push({ type: "delete", text: a[i - 1] }); i--; }
  while (j > 0) { ops.push({ type: "insert", text: b[j - 1] }); j--; }
  ops.reverse();

  // Coalesce adjacent ops of the same type so the UI renders one
  // <ins>strong improvements</ins> block instead of word-by-word noise.
  const merged: DiffOp[] = [];
  for (const op of ops) {
    const last = merged[merged.length - 1];
    if (last && last.type === op.type) {
      last.text += op.text;
    } else {
      merged.push({ ...op });
    }
  }
  return merged;
}

export type DiffSummary = {
  wordsAdded: number;
  wordsRemoved: number;
  wordsKept: number;
  similarity: number; // 0-1; words kept / max(old, new)
};

export function summarizeDiff(ops: DiffOp[]): DiffSummary {
  let added = 0, removed = 0, kept = 0;
  const wordCount = (s: string) => (s.match(/\w+/g) ?? []).length;
  for (const op of ops) {
    const w = wordCount(op.text);
    if (op.type === "insert") added += w;
    else if (op.type === "delete") removed += w;
    else kept += w;
  }
  const denom = Math.max(kept + added, kept + removed, 1);
  return {
    wordsAdded: added,
    wordsRemoved: removed,
    wordsKept: kept,
    similarity: kept / denom,
  };
}
