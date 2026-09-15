import { permanentRedirect } from "next/navigation";

export default async function CollegeSubpageRedirect({ params }: { params: Promise<{ slug: string; subpage: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/colleges/${encodeURIComponent(slug)}`);
}
