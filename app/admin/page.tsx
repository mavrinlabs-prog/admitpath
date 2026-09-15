import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";
import Link from "next/link";
import { Users, Zap, Tag, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdminPage();

  const [userCount, proCount, genCount, couponUsed, couponTotal, referralCount] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { plan: "pro", deletedAt: null } }),
    prisma.generation.count(),
    prisma.coupon.count({ where: { usedAt: { not: null } } }),
    prisma.coupon.count(),
    prisma.referral.count(),
  ]);

  const cards = [
    { href: "/admin/users", icon: Users, label: "Users", value: `${userCount} total / ${proCount} Pro` },
    { href: "/admin/generations", icon: Zap, label: "Generations", value: `${genCount} total` },
    { href: "/admin/coupons", icon: Tag, label: "Coupons", value: `${couponUsed} used / ${couponTotal} total` },
    { href: "/admin/referrals", icon: Share2, label: "Referrals", value: `${referralCount} total` },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: "var(--dl-text-primary, #1B2030)", letterSpacing: "-0.02em" }}
      >
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border p-6 transition-shadow hover:shadow-md"
            style={{ background: "rgba(255,255,255,0.7)", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <card.icon className="h-5 w-5" style={{ color: "var(--dl-brand, #4A6FA5)" }} />
              <h2 className="text-sm font-bold" style={{ color: "var(--dl-text-primary)" }}>
                {card.label}
              </h2>
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--dl-brand, #4A6FA5)", fontFamily: "var(--dl-font-mono)" }}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
