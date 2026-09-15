import { permanentRedirect } from "next/navigation";

export default async function LegacyCollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/colleges/${encodeURIComponent(slug)}`);
}
