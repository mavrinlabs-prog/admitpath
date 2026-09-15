import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Remote database reset is disabled. Use an audited local maintenance procedure." },
    { status: 410 },
  );
}
