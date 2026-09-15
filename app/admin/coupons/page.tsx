import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdminPage();

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const query = (params.q ?? "").trim().toUpperCase();
  const pageSize = 50;

  let coupons: Array<{
    code: string;
    discountPct: number | null;
    freeMonths: number | null;
    usedAt: Date | null;
    usedByUserId: string | null;
    issuedTo: string | null;
    expiresAt: Date | null;
    planGrant: string | null;
    createdAt: Date;
  }> = [];
  let totalCount = 0;
  let usedCount = 0;
  let availableCount = 0;

  try {
    const where = query ? { code: { contains: query } } : {};
    const [rows, total, used] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.coupon.count({ where }),
      prisma.coupon.count({ where: { usedAt: { not: null } } }),
    ]);
    coupons = rows;
    totalCount = total;
    usedCount = used;
    availableCount = totalCount - usedCount;
  } catch (err) {
    console.error("[admin/coupons]", err);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen px-8 py-12" style={{ backgroundColor: "#D5DCE8", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-bold" style={{ color: "#4A6FA5" }}>AdmitPath</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-500 mt-1">View and search promotional coupon codes.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Total Codes</p>
            <p className="text-4xl font-bold text-gray-900">{totalCount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Used</p>
            <p className="text-4xl font-bold text-red-600">{usedCount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Available</p>
            <p className="text-4xl font-bold text-green-600">{availableCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <form method="GET" className="flex gap-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by code..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: "#4A6FA5" } as React.CSSProperties}
            />
            <button
              type="submit"
              className="px-6 py-2 text-white text-sm font-semibold rounded-lg"
              style={{ backgroundColor: "#4A6FA5" }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Code</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Discount</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Free Months</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Plan Grant</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Used By</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{c.code}</td>
                    <td className="px-6 py-3 text-gray-700">{c.discountPct != null ? `${c.discountPct}%` : "--"}</td>
                    <td className="px-6 py-3 text-gray-700">{c.freeMonths ?? "--"}</td>
                    <td className="px-6 py-3 text-gray-700 capitalize">{c.planGrant ?? "--"}</td>
                    <td className="px-6 py-3">
                      {c.usedAt ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Used</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Available</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">{c.usedByUserId ?? "--"}</td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/coupons?page=${page - 1}${query ? `&q=${query}` : ""}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/admin/coupons?page=${page + 1}${query ? `&q=${query}` : ""}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Next
              </a>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          Data as of {new Date().toUTCString()} -- refreshes on page load.
        </p>
      </div>
    </div>
  );
}
