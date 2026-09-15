import type { Metadata } from "next";
import { TopicsClient } from "./topics-client";

export const metadata: Metadata = {
  title: { absolute: "Essay Topic Ideas — AdmitPath" },
  description:
    "Get 3-5 Common App essay topic ideas anchored in your actual profile — no clichés, no ghostwriting.",
  alternates: { canonical: "/essays/topics" },
  robots: { index: false, follow: false },
};

export default function EssayTopicsPage() {
  return <TopicsClient />;
}
