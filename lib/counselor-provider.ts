import { groqChatStream } from "@/lib/groq";
export {
  COUNSELOR_PROVIDER_TIMEOUT_MS,
  createCounselorDeadline,
} from "@/lib/counselor-request-lifecycle";

type ProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function collectCounselorReply(
  messages: ProviderMessage[],
  signal: AbortSignal,
): Promise<string> {
  let reply = "";
  for await (const delta of groqChatStream(messages, { signal })) {
    reply += delta;
  }
  if (!reply.trim()) throw new Error("Counselor provider returned an empty response");
  return reply;
}
