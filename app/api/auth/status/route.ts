import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSessionCookieValue } from "@/lib/session-cookie";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user") || cookieStore.get("session");
    if (!session?.value) {
      return NextResponse.json({ userId: null });
    }

    const parsed = parseSessionCookieValue(session.value);
    if (!parsed) return NextResponse.json({ userId: null });

    return NextResponse.json({
      userId: parsed.id ?? null,
      email: parsed.email ?? null,
      name: parsed.name ?? null,
    });
  } catch {
    return NextResponse.json({ userId: null });
  }
}
