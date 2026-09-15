import { prisma } from "@/lib/prisma";
import { FREE_LIMITS } from "@/lib/trial";

export type CountedFreeFeature = "analyses" | "essays" | "chat";

export class FreePlanLimitReachedError extends Error {
  constructor(readonly feature: CountedFreeFeature) {
    super(`Free-plan ${feature} limit reached`);
    this.name = "FreePlanLimitReachedError";
  }
}

export async function reserveFreeUsage(userId: string, feature: CountedFreeFeature): Promise<void> {
  const result = feature === "analyses"
    ? await prisma.user.updateMany({
        where: { id: userId, deletedAt: null, analysisCount: { lt: FREE_LIMITS.analyses } },
        data: { analysisCount: { increment: 1 } },
      })
    : feature === "essays"
      ? await prisma.user.updateMany({
          where: { id: userId, deletedAt: null, trialEssayCount: { lt: FREE_LIMITS.essays } },
          data: { trialEssayCount: { increment: 1 } },
        })
      : await prisma.user.updateMany({
          where: { id: userId, deletedAt: null, trialChatCount: { lt: FREE_LIMITS.chat } },
          data: { trialChatCount: { increment: 1 } },
        });
  if (result.count !== 1) throw new FreePlanLimitReachedError(feature);
}

export async function releaseFreeUsage(userId: string, feature: CountedFreeFeature): Promise<void> {
  if (feature === "analyses") {
    await prisma.user.updateMany({
      where: { id: userId, deletedAt: null, analysisCount: { gt: 0 } },
      data: { analysisCount: { decrement: 1 } },
    });
    return;
  }
  if (feature === "essays") {
    await prisma.user.updateMany({
      where: { id: userId, deletedAt: null, trialEssayCount: { gt: 0 } },
      data: { trialEssayCount: { decrement: 1 } },
    });
    return;
  }
  await prisma.user.updateMany({
    where: { id: userId, deletedAt: null, trialChatCount: { gt: 0 } },
    data: { trialChatCount: { decrement: 1 } },
  });
}

export function freeUsageLimitBody(feature: CountedFreeFeature) {
  const limit = FREE_LIMITS[feature];
  return {
    error: `You've used all ${limit} Free-plan ${feature}. Upgrade to Pro to remove that cap.`,
    reason: "free_limit_reached",
    feature,
    upgradeUrl: "/pricing",
  } as const;
}
