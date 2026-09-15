"use client";

import { SegmentError } from "@/components/segment-error";

export default function ProfileError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SegmentError {...props} backHref="/dashboard" backLabel="Back to dashboard" />;
}
