import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const PER_PAGE = 50;

  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.referral.count(),
  ]);

  // Look up user emails
  const allUserIds = Array.from(new Set(
    referrals.map((r) => r.referrerId).concat(referrals.map((r) => r.refereeId))
  ));
  const users = await prisma.user.findMany({
    where: { id: { in: allUserIds } },
    select: { id: true, email: true },
  });
  const emailMap = Object.fromEntries(users.map((u) => [u.id, u.email]));

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1
        className="text-xl font-bold mb-6"
        style={{ color: "var(--dl-text-primary, #1B2030)" }}
      >
        Referrals ({total})
      </h1>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm" style={{ background: "rgba(255,255,255,0.8)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Referrer</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Referee</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Code</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Status</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--dl-text-primary)" }}>
                  {emailMap[r.referrerId] ?? r.referrerId.slice(0, 8)}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--dl-text-primary)" }}>
                  {emailMap[r.refereeId] ?? r.refereeId.slice(0, 8)}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--dl-text-secondary)" }}>
                  {r.referralCode}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: r.status === "credited" ? "rgba(34,197,94,0.1)" : "rgba(74,111,165,0.08)",
                      color: r.status === "credited" ? "#16A34A" : "var(--dl-brand)",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: "var(--dl-text-muted)" }}>
                  {r.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 && (
            <a href={`/admin/referrals?page=${page - 1}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Previous</a>
          )}
          <span className="text-sm" style={{ color: "var(--dl-text-muted)" }}>Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`/admin/referrals?page=${page + 1}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>Next</a>
          )}
        </div>
      )}
    </main>
  );
}
