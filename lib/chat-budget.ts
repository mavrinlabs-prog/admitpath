export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const MAX_RECENT_CHAT_CHARS = 10_000;
export const MAX_RECENT_CHAT_MESSAGES = 12;
export const MAX_SINGLE_CHAT_CHARS = 4_000;
export const MAX_CHAT_SYSTEM_CHARS = 9_000;
export const MAX_CHAT_SYSTEM_TOKENS = 3_500;

// Keep the complete counselor request below an 8K provider envelope. The
// response reservation and safety margin are explicit so a future prompt edit
// cannot silently consume the model's output space.
export const COUNSELOR_PROVIDER_TOKEN_ENVELOPE = 8_192;
export const MAX_PROVIDER_OUTPUT_TOKENS = 1_536;
export const PROVIDER_TOKEN_SAFETY_MARGIN = 656;
export const MAX_PROVIDER_INPUT_TOKENS =
  COUNSELOR_PROVIDER_TOKEN_ENVELOPE
  - MAX_PROVIDER_OUTPUT_TOKENS
  - PROVIDER_TOKEN_SAFETY_MARGIN;

const MESSAGE_TOKEN_OVERHEAD = 12;
const REQUEST_TOKEN_OVERHEAD = 16;
const TRUNCATION_MARKER = "\n[...earlier detail omitted...]\n";

/**
 * Conservative provider-side estimate. UTF-8 bytes / 3 deliberately
 * overestimates typical English and stays safe for punctuation and CJK text.
 */
export function estimateChatTokens(value: string): number {
  return Math.ceil(new TextEncoder().encode(value).length / 3);
}

function compactChatContent(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  if (maxChars <= TRUNCATION_MARKER.length) return value.slice(0, maxChars);

  const contentChars = maxChars - TRUNCATION_MARKER.length;
  const headChars = Math.ceil(contentChars * 0.65);
  const tailChars = contentChars - headChars;
  return `${value.slice(0, headChars)}${TRUNCATION_MARKER}${value.slice(-tailChars)}`;
}

function fitTextToTokenBudget(value: string, maxTokens: number): string {
  if (estimateChatTokens(value) <= maxTokens) return value;

  let low = 0;
  let high = value.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    const candidate = compactChatContent(value, middle);
    if (estimateChatTokens(candidate) <= maxTokens) low = middle;
    else high = middle - 1;
  }
  return compactChatContent(value, low);
}

export function selectRecentMessages(
  messages: ChatMessage[],
  maxChars = MAX_RECENT_CHAT_CHARS,
  maxMessages = MAX_RECENT_CHAT_MESSAGES,
): ChatMessage[] {
  const selected: ChatMessage[] = [];
  let used = 0;

  for (
    let index = messages.length - 1;
    index >= 0 && selected.length < maxMessages;
    index -= 1
  ) {
    const message = messages[index];
    const availableChars = Math.min(MAX_SINGLE_CHAT_CHARS, maxChars - used);
    if (availableChars <= 0) break;
    const content = compactChatContent(message.content, availableChars);
    selected.push({ ...message, content });
    used += content.length;
    if (used >= maxChars) break;
  }

  return selected.reverse();
}

export function buildBoundedSystemPrompt(
  base: string,
  sections: string[],
  maxChars = MAX_CHAT_SYSTEM_CHARS,
): string {
  let prompt = base.slice(0, maxChars);
  for (const section of sections) {
    if (!section) continue;
    const remaining = maxChars - prompt.length - 1;
    if (remaining <= 0) break;
    prompt += `\n${section.slice(0, remaining)}`;
  }
  return fitTextToTokenBudget(prompt, MAX_CHAT_SYSTEM_TOKENS);
}

export function fitMessagesToProviderBudget(
  systemPrompt: string,
  messages: ChatMessage[],
  maxInputTokens = MAX_PROVIDER_INPUT_TOKENS,
): ChatMessage[] {
  const available = Math.max(
    0,
    maxInputTokens - estimateChatTokens(systemPrompt) - REQUEST_TOKEN_OVERHEAD,
  );
  const selected: ChatMessage[] = [];
  let used = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    const cost = estimateChatTokens(message.content) + MESSAGE_TOKEN_OVERHEAD;
    if (used + cost > available) {
      if (selected.length > 0) break;
      let low = 0;
      let high = message.content.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        const candidate = compactChatContent(message.content, middle);
        if (estimateChatTokens(candidate) + MESSAGE_TOKEN_OVERHEAD <= available) low = middle;
        else high = middle - 1;
      }
      if (low > 0) {
        selected.push({ ...message, content: compactChatContent(message.content, low) });
      }
      break;
    }
    selected.push(message);
    used += cost;
  }

  return selected.reverse();
}
