import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminGenerationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const typeFilter = params.type ?? "";
  const PER_PAGE = 50;

  const where = typeFilter ? { type: typeFilter } : {};

  const [generations, total] = await Promise.all([
    prisma.generation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.generation.count({ where }),
  ]);

  // Look up user emails for display
  const userIds = Array.from(new Set(generations.map((g) => g.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
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
        Generations ({total})
      </h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        {["", "analysis", "essay", "chat", "college_match"].map((t) => (
          <a
            key={t}
            href={`/admin/generations${t ? `?type=${t}` : ""}`}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors"
            style={{
              borderColor: typeFilter === t ? "var(--dl-brand)" : "rgba(0,0,0,0.08)",
              background: typeFilter === t ? "rgba(74,111,165,0.08)" : "white",
              color: typeFilter === t ? "var(--dl-brand)" : "var(--dl-text-secondary)",
            }}
          >
            {t || "All"}
          </a>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm" style={{ background: "rgba(255,255,255,0.8)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>User</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Type</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>App</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {generations.map((g) => (
              <tr key={g.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--dl-text-primary)" }}>
                  {emailMap[g.userId] ?? g.userId.slice(0, 8)}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: "rgba(74,111,165,0.08)", color: "var(--dl-brand)" }}
                  >
                    {g.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: "var(--dl-text-secondary)" }}>{g.app}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: "var(--dl-text-muted)" }}>
                  {g.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 && (
            <a href={`/admin/generations?page=${page - 1}${typeFilter ? `&type=${typeFilter}` : ""}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>
              Previous
            </a>
          )}
          <span className="text-sm" style={{ color: "var(--dl-text-muted)" }}>Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`/admin/generations?page=${page + 1}${typeFilter ? `&type=${typeFilter}` : ""}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>
              Next
            </a>
          )}
        </div>
      )}
    </main>
  );
}
