import type { Metadata } from "next";
import { ParentDashboardClient } from "./parent-dashboard-client";

export const metadata: Metadata = {
  title: { absolute: "Parent Dashboard — AdmitPath" },
  description:
    "View your child's college application progress: profile completion, target schools, scores, and action items. Read-only parent view.",
  robots: { index: false, follow: false },
};

export default function ParentPage() {
  return <ParentDashboardClient />;
}
