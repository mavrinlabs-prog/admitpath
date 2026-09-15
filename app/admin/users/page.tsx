import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const q = params.q ?? "";
  const PER_PAGE = 50;

  const where = {
    deletedAt: null,
    ...(q ? { email: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, name: true, plan: true, createdAt: true, analysisCount: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1
        className="text-xl font-bold mb-6"
        style={{ color: "var(--dl-text-primary, #1B2030)" }}
      >
        Users ({total})
      </h1>

      <form method="GET" className="mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by email..."
          className="rounded-lg border px-3 py-2 text-sm flex-1"
          style={{ borderColor: "rgba(0,0,0,0.1)", background: "white" }}
        />
        <button type="submit" className="dl-btn dl-btn-primary dl-btn-sm">Search</button>
      </form>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <table className="w-full text-sm" style={{ background: "rgba(255,255,255,0.8)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Email</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Name</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Plan</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Analyses</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--dl-text-muted)" }}>Signed Up</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--dl-text-primary)" }}>{u.email}</td>
                <td className="px-4 py-2.5" style={{ color: "var(--dl-text-secondary)" }}>{u.name ?? "—"}</td>
                <td className="px-4 py-2.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{
                      background: u.plan === "pro" ? "rgba(74,111,165,0.12)" : "rgba(0,0,0,0.04)",
                      color: u.plan === "pro" ? "#4A6FA5" : "var(--dl-text-muted)",
                    }}
                  >
                    {u.plan === "pro" ? "Pro" : "Free"}
                  </span>
                </td>
                <td className="px-4 py-2.5 tabular-nums" style={{ color: "var(--dl-text-secondary)" }}>{u.analysisCount}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: "var(--dl-text-muted)" }}>
                  {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {page > 1 && (
            <a href={`/admin/users?page=${page - 1}${q ? `&q=${q}` : ""}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>
              Previous
            </a>
          )}
          <span className="text-sm" style={{ color: "var(--dl-text-muted)" }}>Page {page} of {totalPages}</span>
          {page < totalPages && (
            <a href={`/admin/users?page=${page + 1}${q ? `&q=${q}` : ""}`} className="text-sm font-medium" style={{ color: "var(--dl-brand)" }}>
              Next
            </a>
          )}
        </div>
      )}
    </main>
  );
}
