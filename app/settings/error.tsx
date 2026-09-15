"use client";

import { SegmentError } from "@/components/segment-error";

export default function SettingsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SegmentError {...props} backHref="/dashboard" backLabel="Back to dashboard" />;
}
