import { recordReferral, referralUserId } from "@/lib/referral";

type ReferralRecorder = typeof recordReferral;

export type OAuthReferralResult =
  | { status: "recorded" }
  | { status: "ignored"; reason: "missing" | "invalid" | "rejected" }
  | { status: "failed" };

export async function recordOAuthReferral(
  refereeId: string,
  referralCode: string | undefined,
  recorder: ReferralRecorder = recordReferral,
): Promise<OAuthReferralResult> {
  if (!referralCode) return { status: "ignored", reason: "missing" };
  if (!referralUserId(referralCode)) return { status: "ignored", reason: "invalid" };

  try {
    const result = await recorder(refereeId, referralCode);
    return result.success
      ? { status: "recorded" }
      : { status: "ignored", reason: "rejected" };
  } catch {
    return { status: "failed" };
  }
}
