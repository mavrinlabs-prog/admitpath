import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getGoogleUser, hasSessionCookie } from "@/lib/google-auth";
import { TrackerClient } from "./tracker-client";

export const metadata: Metadata = {
  title: { absolute: "Application Tracker — AdmitPath" },
  description:
    "Common-App-style status board for every school you're applying to. Track essays, recs, transcripts, FAFSA, and decisions.",
  robots: { index: false, follow: false },
};

export default async function TrackerPage() {
  // Tracker is auth-gated end-to-end — no point rendering the UI if the
  // student would only see a sign-in wall after the first fetch fires.
  const googleUser = await getGoogleUser();
  if (!googleUser) {
    if (!(await hasSessionCookie())) redirect("/sign-in");
  }
  return <TrackerClient />;
}
