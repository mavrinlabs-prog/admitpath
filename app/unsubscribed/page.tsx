import Link from "next/link";

export const metadata = { title: "Email preferences updated", robots: { index: false, follow: false } };

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const invalid = status === "invalid";
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
        {invalid ? "This unsubscribe link is invalid" : "Email preferences updated"}
      </h1>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        {invalid
          ? "The link may be incomplete or expired. Sign in to manage email preferences from Settings."
          : "Optional product and progress emails are now turned off for this address."}
      </p>
      <Link href={invalid ? "/settings" : "/"} className="dl-btn dl-btn-primary mx-auto mt-8">
        {invalid ? "Open settings" : "Return home"}
      </Link>
    </main>
  );
}
