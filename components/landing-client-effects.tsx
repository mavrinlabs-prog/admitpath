"use client";

import dynamic from "next/dynamic";

const ExitIntentPopup = dynamic(
  () =>
    import("@/components/ExitIntentPopup").then((m) => ({
      default: m.ExitIntentPopup,
    })),
  { ssr: false },
);

const SocialProofToast = dynamic(
  () =>
    import("@/components/SocialProofToast").then((m) => ({
      default: m.SocialProofToast,
    })),
  { ssr: false },
);

export function LandingClientEffects() {
  return (
    <>
      <ExitIntentPopup />
      <SocialProofToast />
    </>
  );
}
