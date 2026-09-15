import { NextResponse } from "next/server";
import { verifyBearerSecret } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** Returns deployment metadata only to authorized operational probes. */
export async function GET(request: Request) {
  const healthSecret = process.env.HEALTHCHECK_SECRET ?? process.env.CRON_SECRET;
  if (!verifyBearerSecret(request, healthSecret)) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown";
  const shortSha = sha.slice(0, 7);
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "unknown";
  const deployedAt = process.env.VERCEL_GIT_COMMIT_MESSAGE
    ? new Date().toISOString() // Vercel doesn't expose deploy timestamp directly
    : null;
  const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";
  const region = process.env.VERCEL_REGION ?? "unknown";

  return NextResponse.json(
    {
      app: "admitpath",
      version: shortSha,
      sha,
      branch,
      environment,
      region,
      deployedAt,
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
