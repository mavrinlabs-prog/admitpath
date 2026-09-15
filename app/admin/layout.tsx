import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | AdmitPath" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div className="min-h-screen" style={{ backgroundColor: "var(--dl-bg-root, #D5DCE8)" }}>
        <nav
          className="border-b px-6 py-3 flex items-center gap-6"
          style={{ background: "rgba(255,255,255,0.7)", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <Link
            href="/admin"
            className="text-sm font-bold"
            style={{ color: "var(--dl-brand, #4A6FA5)" }}
          >
            Admin
          </Link>
          {[
            { href: "/admin/users", label: "Users" },
            { href: "/admin/generations", label: "Generations" },
            { href: "/admin/coupons", label: "Coupons" },
            { href: "/admin/referrals", label: "Referrals" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--dl-text-secondary, #454B5E)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-auto text-xs font-medium"
            style={{ color: "var(--dl-text-muted, #5A6275)" }}
          >
            Back to app
          </Link>
        </nav>
        {children}
      </div>
    </>
  );
}
