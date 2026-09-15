import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withRetry } from "@/lib/prisma";
import { requireUser, parseJsonBody } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * Training-data consent. Student essays and profile data are only stored
 * as LLM training examples when this flag is true (see
 * lib/training-data-logger.ts, which fails closed without it).
 */
export async function GET() {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const user = await withRetry(() =>
    prisma.user.findUnique({
      where: { id: userId },
      select: { trainingConsent: true, trainingConsentAt: true },
    }),
  );
  return NextResponse.json({
    trainingConsent: user?.trainingConsent ?? false,
    trainingConsentAt: user?.trainingConsentAt ?? null,
  });
}

const consentSchema = z.object({ consent: z.boolean() });

export async function POST(req: Request) {
  const authed = await requireUser();
  if ("response" in authed) return authed.response;
  const { userId } = authed;

  const parsed = await parseJsonBody(req, consentSchema);
  if ("response" in parsed) return parsed.response;

  const updated = await withRetry(() =>
    prisma.user.update({
      where: { id: userId },
      data: {
        trainingConsent: parsed.data.consent,
        trainingConsentAt: parsed.data.consent ? new Date() : null,
      },
      select: { trainingConsent: true },
    }),
  );
  return NextResponse.json({ trainingConsent: updated.trainingConsent });
}
