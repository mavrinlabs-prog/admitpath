import { prisma } from "@/lib/prisma";

export interface TrainingExample {
  id?: string;
  route: string;
  tierUsed: number;
  systemPrompt: string;
  userMessage: string;
  assistantResponse: string;
  metadata: {
    userId?: string;
    model?: string;
    timestamp: string;
    schoolsMentioned?: string[];
    profileScore?: number;
    responseLength: number;
  };
}

const ENABLED = process.env.COLLECT_TRAINING_DATA === "true";

function redactPII(text: string): string {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
    .replace(/\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g, "[PHONE]");
}

async function hasTrainingConsent(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { trainingConsent: true, deletedAt: true },
    });
    return user?.trainingConsent === true && user.deletedAt === null;
  } catch {
    return false;
  }
}

export async function logTrainingExample(example: TrainingExample): Promise<void> {
  if (!ENABLED || !(await hasTrainingConsent(example.metadata.userId))) return;

  try {
    await prisma.trainingExample.create({
      data: {
        route: example.route,
        tierUsed: example.tierUsed,
        systemPrompt: redactPII(example.systemPrompt).slice(0, 50_000),
        userMessage: redactPII(example.userMessage).slice(0, 10_000),
        assistantResponse: redactPII(example.assistantResponse).slice(0, 20_000),
        model: example.metadata.model || "unknown",
        userId: example.metadata.userId,
        schoolsMentioned: example.metadata.schoolsMentioned?.join(",") || "",
        responseLength: example.metadata.responseLength,
      },
    });
  } catch (error) {
    // Never fall back to console payloads: operational logs are not an
    // approved store for student prompts, even when training consent exists.
    console.warn("[training-data] persistence unavailable; example dropped", {
      route: example.route,
      error: error instanceof Error ? error.name : "unknown",
    });
  }
}

async function consentedUserIds(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { trainingConsent: true, deletedAt: null },
    select: { id: true },
  });
  return users.map((user) => user.id);
}

export async function exportTrainingData(): Promise<string> {
  try {
    const userIds = await consentedUserIds();
    if (userIds.length === 0) return "";

    const examples = await prisma.trainingExample.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "asc" },
    });

    return examples
      .map((example) => JSON.stringify({
        messages: [
          { role: "system", content: redactPII(example.systemPrompt) },
          { role: "user", content: redactPII(example.userMessage) },
          { role: "assistant", content: redactPII(example.assistantResponse) },
        ],
      }))
      .join("\n");
  } catch {
    return "";
  }
}

export async function getTrainingStats(): Promise<{
  total: number;
  byRoute: Record<string, number>;
  byModel: Record<string, number>;
  avgResponseLength: number;
}> {
  try {
    const userIds = await consentedUserIds();
    if (userIds.length === 0) {
      return { total: 0, byRoute: {}, byModel: {}, avgResponseLength: 0 };
    }

    const examples = await prisma.trainingExample.findMany({
      where: { userId: { in: userIds } },
      select: { route: true, model: true, responseLength: true },
    });

    const byRoute: Record<string, number> = {};
    const byModel: Record<string, number> = {};
    let totalLength = 0;
    for (const example of examples) {
      byRoute[example.route] = (byRoute[example.route] || 0) + 1;
      byModel[example.model] = (byModel[example.model] || 0) + 1;
      totalLength += example.responseLength;
    }

    return {
      total: examples.length,
      byRoute,
      byModel,
      avgResponseLength: examples.length > 0 ? Math.round(totalLength / examples.length) : 0,
    };
  } catch {
    return { total: 0, byRoute: {}, byModel: {}, avgResponseLength: 0 };
  }
}
