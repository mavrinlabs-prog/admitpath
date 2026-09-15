import { permanentRedirect } from "next/navigation";

export default async function HowToGetIntoRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/colleges/${encodeURIComponent(slug)}`);
}
