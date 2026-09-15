import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
const deadlines = JSON.parse(readFileSync(join(process.cwd(), "public/deadlines.json"), "utf8"));

type Deadline = {
  school: string;
  slug: string;
  ed: string | null;
  ea: string | null;
  rd: string;
  rea: boolean;
  supplements: number;
  portalOpens: string;
  finAid: string;
};

/**
 * Convert "Nov 1" / "Jan 5" / "Feb 15" → ICS DATE field "20261101".
 * Cycle assumption: ED/EA/REA = current calendar year for fall–spring,
 * RD/finAid = following year. The site is updated annually for the
 * 2026–2027 cycle so the year offsets are hard-coded here.
 */
function parseDateToken(token: string, defaultYear: number): string | null {
  const m = token.trim().match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (!m) return null;
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const monthCode = months[m[1]!.toLowerCase().slice(0, 3)];
  if (!monthCode) return null;
  const day = m[2]!.padStart(2, "0");
  return `${defaultYear}${monthCode}${day}`;
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function buildEvent(opts: {
  uid: string;
  date: string;       // YYYYMMDD
  summary: string;
  description: string;
  url: string;
}): string {
  return [
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${opts.date}`,
    `DTEND;VALUE=DATE:${opts.date}`,
    `SUMMARY:${escapeIcsText(opts.summary)}`,
    `DESCRIPTION:${escapeIcsText(opts.description)}`,
    `URL:${opts.url}`,
    "END:VEVENT",
  ].join("\r\n");
}

/**
 * GET /api/deadlines/ics?slugs=harvard-university,yale-university
 *
 * Returns an iCalendar file containing every ED/EA/REA/RD/FinAid date
 * for the requested schools. If no `slugs` param, exports all deadlines.
 *
 * Months Sep-Dec land in the application year (2026); months Jan-Aug
 * land in the following year (2027). FinAid month parsing follows the
 * same rule.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slugs = searchParams.get("slugs")?.split(",").filter(Boolean);
  const all = deadlines as Deadline[];

  const filtered = slugs && slugs.length > 0
    ? all.filter((d) => slugs.includes(d.slug))
    : all;

  if (filtered.length === 0 && slugs && slugs.length > 0) {
    return NextResponse.json({ error: "No matching schools" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://admith.vercel.app";
  const events: string[] = [];

  for (const d of filtered) {
    const profileUrl = `${baseUrl}/college/${d.slug}`;

    const pushDate = (token: string | null, label: string, fallYear: number) => {
      if (!token) return;
      // If month token is Jan-Aug, use spring year; otherwise fall year.
      const monthAbbrev = token.trim().split(/\s+/)[0]?.slice(0, 3).toLowerCase();
      const isSpring = monthAbbrev && ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug"].includes(monthAbbrev);
      const year = isSpring ? fallYear + 1 : fallYear;
      const dt = parseDateToken(token, year);
      if (!dt) return;
      events.push(
        buildEvent({
          uid: `${d.slug}-${label.toLowerCase().replace(/\s+/g, "-")}-${dt}@admitpath.vercel.app`,
          date: dt,
          summary: `${d.school} — ${label}`,
          description: `${label} deadline for ${d.school}. ${d.supplements} supplement essay${d.supplements === 1 ? "" : "s"}. View profile: ${profileUrl}`,
          url: profileUrl,
        })
      );
    };

    const fallYear = 2026;
    if (d.rea) pushDate(d.ea, "Restrictive Early Action", fallYear);
    else pushDate(d.ea, "Early Action", fallYear);
    pushDate(d.ed, "Early Decision", fallYear);
    pushDate(d.rd, "Regular Decision", fallYear);
    pushDate(d.finAid, "Financial Aid", fallYear);
  }

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AdmitPath//Application Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:AdmitPath College Deadlines",
    "X-WR-CALDESC:Application deadlines for the schools you're applying to.",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=admitpath-deadlines.ics",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
