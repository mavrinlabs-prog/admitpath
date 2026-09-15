import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFreePlanStatus } from "@/lib/trial";
import { parseSessionCookieValue } from "@/lib/session-cookie";
import { effectivePlan } from "@/lib/utils";

// User-specific data — never cache anywhere (browser, CDN, or proxy).
const PRIVATE_NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0",
} as const;

// /api/me is on the dashboard mount + every page that uses TrialChip / paywall
// logic. If Prisma blips, we don't want the entire app chrome to break — so on
// DB error we return a sensible "free plan / no usage" payload with X-Degraded
// so ops can see it. Free plan is the safe default: it won't grant paid
// features the user hasn't paid for.
const DEGRADED_PAYLOAD = {
  plan: "free",
  effectivePlan: "free",
  analysisCount: 0,
  freeUsage: {
    onFreePlan: true,
    active: true,
    usage: null,
    allExhausted: false,
  },
  degraded: true,
} as const;

const DEGRADED_HEADERS = {
  ...PRIVATE_NO_STORE,
  "X-Degraded": "true",
} as const;

export const dynamic = "force-dynamic";

export async function GET() {
  let userId: string | null = null;
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (session?.value) {
      userId = parseSessionCookieValue(session.value)?.id ?? null;
    }
  } catch (err) {
    console.error("[/api/me] session read failed", err);
    return NextResponse.json({ error: "Something went wrong. Please try again in a moment." }, { status: 503, headers: PRIVATE_NO_STORE });
  }
  if (!userId) {
    return NextResponse.json(
      { authenticated: false },
      { headers: PRIVATE_NO_STORE },
    );
  }

  // findFirst + deletedAt: null — /api/me drives every chrome surface
  // (TrialChip, paywall logic, plan badge). A soft-deleted user kept getting
  // their old plan + counters back here, so the dashboard rendered as if
  // their account still existed. Drop tombstoned rows so the UI matches the
  // gate.
  const fetchUser = () =>
    prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        plan: true,
        email: true,
        analysisCount: true,
        trialEssayCount: true,
        trialChatCount: true,
        stripeSubscriptionId: true,
        isInternal: true,
      },
    });

  // Parallel: user row + collegeList count are independent. Previously
  // sequential — saves ~1 DB roundtrip of latency on every /api/me call,
  // and /api/me runs on dashboard mount + every TrialChip refresh.
  let user: Awaited<ReturnType<typeof fetchUser>> = null;
  let collegeCount = 0;
  try {
    const [userResult, countResult] = await Promise.allSettled([
      fetchUser(),
      prisma.collegeList.count({ where: { userId, deletedAt: null } }),
    ]);
    if (userResult.status === "rejected") {
      console.error("[/api/me] prisma.user.findFirst failed — returning degraded payload:", userResult.reason);
      return NextResponse.json(DEGRADED_PAYLOAD, { headers: DEGRADED_HEADERS });
    }
    user = userResult.value;
    if (countResult.status === "fulfilled") {
      collegeCount = countResult.value;
    } else {
      // Non-fatal: a college-count blip shouldn't take the chrome down. The
      // trial gates on collegeCount will read 0 (no colleges saved yet) which
      // is the safe default.
      console.error("[/api/me] prisma.collegeList.count failed — defaulting to 0:", countResult.reason);
    }
  } catch (err) {
    console.error("[/api/me] parallel user+count fetch failed — returning degraded payload:", err);
    return NextResponse.json(DEGRADED_PAYLOAD, { headers: DEGRADED_HEADERS });
  }

  if (!user) {
    return NextResponse.json(
      {
      plan: "free",
      effectivePlan: "free",
      analysisCount: 0,
      freeUsage: {
        onFreePlan: true,
        active: true,
        usage: null,
        allExhausted: false,
      },
      },
      { headers: PRIVATE_NO_STORE },
    );
  }

  const status = getFreePlanStatus(
    {
      plan: user.plan,
      analysisCount: user.analysisCount,
      trialEssayCount: user.trialEssayCount,
      trialChatCount: user.trialChatCount,
      stripeSubscriptionId: user.stripeSubscriptionId,
      isInternal: user.isInternal,
    },
    collegeCount
  );

  const eff = effectivePlan(user);

  return NextResponse.json(
    {
    plan: eff,
    effectivePlan: eff,
    email: user.email,
    analysisCount: user.analysisCount,
    freeUsage: status,
    },
    { headers: PRIVATE_NO_STORE },
  );
}
