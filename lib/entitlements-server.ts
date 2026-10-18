import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-helpers";
import { FEATURES, UPGRADE_URL, featureState, type FeatureKey } from "@/lib/entitlements";

/**
 * API guard for Pro-only features. Returns `{ response }` (401/403 JSON with
 * upgradeUrl) or `{ userId, user }`. Uses the shared entitlements registry so
 * downgrade relocks the API at the same moment the UI relocks.
 */
export async function requireFeature(key: FeatureKey) {
  const authed = await requireUser();
  if ("response" in authed) return authed;
  const state = featureState(authed.user, key);
  if (!state.unlocked) {
    return {
      response: NextResponse.json(
        {
          error: `${FEATURES[key].label} is part of AdmitPath Pro.`,
          reason: state.reason,
          feature: key,
          upgradeUrl: UPGRADE_URL,
        },
        { status: 403 },
      ),
    };
  }
  return authed;
}
