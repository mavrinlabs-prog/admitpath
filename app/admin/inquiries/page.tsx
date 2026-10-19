import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-auth";
import { INQUIRY_NEEDS, INQUIRY_ROLES, INQUIRY_TIMELINES, labelFor } from "@/lib/school-inquiry";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminPage();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const PER_PAGE = 50;

  const [rows, total] = await Promise.all([
    prisma.schoolInquiry.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.schoolInquiry.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-2 text-xl font-bold" style={{ color: "var(--dl-text-primary, #1B2030)" }}>
        School &amp; counselor inquiries ({total})
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--dl-text-muted)" }}>
        Saved from /for-schools and /for-counselors. &ldquo;Emailed&rdquo; shows whether the team notification was delivered.
      </p>
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <table className="w-full text-xs" style={{ background: "rgba(255,255,255,0.8)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {["Received", "Name", "Email", "School / district", "Role", "Phone", "Students", "Timeline", "Needs", "Message", "Source", "Emailed", "Status"].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-3 text-left font-semibold" style={{ color: "var(--dl-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={13} className="px-3 py-6 text-center" style={{ color: "var(--dl-text-muted)" }}>No inquiries yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="align-top" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <td className="whitespace-nowrap px-3 py-2.5">{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                <td className="px-3 py-2.5 font-semibold">{r.name}</td>
                <td className="px-3 py-2.5"><a href={`mailto:${r.email}`} className="underline">{r.email}</a></td>
                <td className="px-3 py-2.5">{r.schoolName}</td>
                <td className="px-3 py-2.5">{labelFor(INQUIRY_ROLES, r.role)}</td>
                <td className="px-3 py-2.5">{r.phone ?? "—"}</td>
                <td className="px-3 py-2.5 tabular-nums">{r.studentCount?.toLocaleString() ?? "—"}</td>
                <td className="px-3 py-2.5">{labelFor(INQUIRY_TIMELINES, r.timeline)}</td>
                <td className="px-3 py-2.5">{Array.isArray(r.needs) ? (r.needs as string[]).map((n) => labelFor(INQUIRY_NEEDS, n)).join(", ") : "—"}</td>
                <td className="max-w-xs px-3 py-2.5">{r.message ?? "—"}</td>
                <td className="px-3 py-2.5 font-mono">{r.sourcePage}</td>
                <td className="px-3 py-2.5">{r.emailDelivered ? "Yes" : "No"}</td>
                <td className="px-3 py-2.5">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 1 && <a href={`/admin/inquiries?page=${page - 1}`}>Previous</a>}
          <span>Page {page} of {totalPages}</span>
          {page < totalPages && <a href={`/admin/inquiries?page=${page + 1}`}>Next</a>}
        </div>
      )}
    </main>
  );
}
