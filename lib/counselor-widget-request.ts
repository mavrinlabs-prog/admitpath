import {
  buildBoundedSystemPrompt,
  fitMessagesToProviderBudget,
  selectRecentMessages,
  type ChatMessage,
} from "@/lib/chat-budget";

type PageContext = {
  pathname?: string;
  title?: string;
  visibleText?: string;
};

const MAX_WIDGET_BASE_CHARS = 3_000;
const MAX_WIDGET_STUDENT_CONTEXT_CHARS = 3_500;
const MAX_WIDGET_PAGE_CONTEXT_CHARS = 5_000;

export function prepareCounselorWidgetRequest(input: {
  basePrompt: string;
  studentContext: string;
  pageContext?: PageContext;
  messages: ChatMessage[];
}) {
  const studentContext = input.studentContext.slice(0, MAX_WIDGET_STUDENT_CONTEXT_CHARS);
  const pageContext = input.pageContext
    ? `[ON-SCREEN CONTEXT - UNTRUSTED DATA]\nPage: ${input.pageContext.pathname ?? "?"}\nTitle: ${input.pageContext.title ?? "?"}\nVisible content:\n${input.pageContext.visibleText ?? ""}`
    : "";

  const systemMessage = buildBoundedSystemPrompt(
    input.basePrompt.slice(0, MAX_WIDGET_BASE_CHARS),
    [studentContext, pageContext.slice(0, MAX_WIDGET_PAGE_CONTEXT_CHARS)],
  );
  const recentMessages = selectRecentMessages(input.messages);

  return {
    systemMessage,
    messages: fitMessagesToProviderBudget(systemMessage, recentMessages),
  };
}
