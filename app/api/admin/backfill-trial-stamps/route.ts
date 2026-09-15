import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      error: "This one-time maintenance endpoint has been retired.",
      code: "TRIAL_BACKFILL_RETIRED",
      message: "No new trial timestamps can be created or modified.",
      recoverable: false,
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
