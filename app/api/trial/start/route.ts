import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      error: "Pro trials are no longer offered.",
      code: "PRO_TRIAL_REMOVED",
      message: "Use the monthly Pro checkout to upgrade.",
      checkoutUrl: "/billing",
      recoverable: false,
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
