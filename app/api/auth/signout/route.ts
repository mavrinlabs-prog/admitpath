import { NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/app-url";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", getAppBaseUrl()), 303);
  for (const name of [
    "session",
    "session_user",
    "adm_usage",
    "oauth_state",
    "oauth_return_to",
    "oauth_email_consent",
  ]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}
