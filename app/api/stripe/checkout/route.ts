import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";

export function GET() {
  return NextResponse.redirect(getAppUrl("/pricing"));
}

export async function POST(req: NextRequest) {
  return NextResponse.redirect(new URL("/api/stripe/create-checkout", req.url), 307);
}
