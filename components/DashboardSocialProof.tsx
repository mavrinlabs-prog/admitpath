"use client";

import { SocialProofToast } from "@/components/SocialProofToast";

/**
 * DashboardSocialProof — thin client wrapper to render SocialProofToast
 * with the "dashboard" variant on the server-component dashboard page.
 *
 * The dashboard variant shows feature tips for logged-in users such as
 * score trajectory tracking, essay version control, and gap analysis.
 * No fabricated user names or activity counts.
 */
export function DashboardSocialProof() {
  return <SocialProofToast variant="dashboard" />;
}
