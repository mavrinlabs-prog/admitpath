type CounselorMessage = { role: "user" | "assistant"; content: string };

function contextValue(context: string, label: string): string | null {
  const match = context.match(new RegExp(`^- ${label}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() || null;
}

/** Profile-aware response used only when every external counselor provider fails. */
export function buildCounselorFallbackReply(
  context: string,
  messages: CounselorMessage[],
): string {
  const major = contextValue(context, "Intended major") ?? "your intended field";
  const grade = contextValue(context, "Grade");
  const score = contextValue(context, "Latest overall score");
  const dimensions = contextValue(context, "Dimension scores");
  const parsedDimensions = dimensions
    ?.split(",")
    .map((entry) => entry.trim().match(/^(.+?)\s+(\d+(?:\.\d+)?)$/))
    .filter((entry): entry is RegExpMatchArray => Boolean(entry))
    .map((entry) => ({ name: entry[1], score: Number(entry[2]) }))
    .sort((left, right) => left.score - right.score);
  const weakest = parsedDimensions?.[0];
  const latestQuestion = messages.filter((message) => message.role === "user").at(-1)?.content ?? "";
  const asksForNextStep = /highest-impact|next step|this month|what should i do/i.test(latestQuestion);
  const focus = weakest
    ? `${weakest.name} (${weakest.score}/100)`
    : `one measurable ${major} project`;
  const profileLead = [
    grade ? `grade ${grade}` : null,
    score ? `a latest profile score of ${score}` : null,
    `an interest in ${major}`,
  ].filter(Boolean).join(", ");

  return `Confirmed: Your saved profile currently shows ${profileLead}.

Interpretation: The current evidence makes ${focus} the most useful planning focus. That is an interpretation of the information on file, not a prediction or guarantee. ${asksForNextStep ? "For the next 30 days, choose one concrete result and finish it." : "Turn the question into one concrete result you can finish this month."}

Next action: This week, define the result in one sentence, identify who it helps or how it will be evaluated, and schedule the first two work sessions. By the end of the month, document the output with a link, number served, competition result, publication, presentation, or other verifiable evidence. You are done when the profile can cite that concrete output rather than only an activity title.

What measurable ${major} result can you realistically complete in the next 30 days?`;
}
