import { permanentRedirect } from "next/navigation";
import {
  WORKSHEET_DESTINATIONS,
  type WorksheetSlug,
} from "@/lib/worksheet-redirects";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(WORKSHEET_DESTINATIONS).map((slug) => ({ slug }));
}

export default async function WorksheetExampleRedirectPage({
  params,
}: {
  params: Promise<{ slug: WorksheetSlug }>;
}) {
  const { slug } = await params;
  permanentRedirect(WORKSHEET_DESTINATIONS[slug] ?? "/resources");
}
