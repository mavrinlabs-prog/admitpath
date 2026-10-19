import { NextResponse } from "next/server";
import { getSystemStatus } from "@/lib/system-status";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getSystemStatus();
  return NextResponse.json(status, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } });
}
