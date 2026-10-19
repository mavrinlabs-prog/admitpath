/**
 * "Calibrated against admissions data from" school strip.
 *
 * Rebuilt 2026-10 so every mark sits in an identical 196x56 tile with a
 * 32x32 logo box (object-contain), and the loop is seamless:
 *   - the list is rendered twice inside one track; the track animates
 *     translateX(0 → -50%), so the second copy lands exactly where the first
 *     started (no jump), because each group carries its own trailing gap;
 *   - hover / keyboard focus pauses the animation;
 *   - prefers-reduced-motion shows a static, wrapped grid (the duplicate group
 *     is hidden), instead of the old behaviour where the global reduced-motion
 *     rule truncated the animation mid-scroll.
 *
 * Logos: no official university logo files are bundled (trademark licensing —
 * LEGAL REVIEW NEEDED before adding any). Each tile shows a consistent
 * monogram mark in the school's primary color; if a licensed file is later
 * added at /public/colleges/<slug>.svg, set `logo` below and it renders with
 * object-fit: contain inside the same box. Pure server component.
 */
type School = { slug: string; name: string; mark: string; color: string; logo?: string };

const SCHOOLS: School[] = [
  { slug: "mit", name: "MIT", mark: "MIT", color: "#8A1538" },
  { slug: "stanford", name: "Stanford", mark: "S", color: "#8C1515" },
  { slug: "harvard", name: "Harvard", mark: "H", color: "#A51C30" },
  { slug: "princeton", name: "Princeton", mark: "P", color: "#C4560E" },
  { slug: "yale", name: "Yale", mark: "Y", color: "#00356B" },
  { slug: "uc-berkeley", name: "UC Berkeley", mark: "UCB", color: "#003262" },
  { slug: "columbia", name: "Columbia", mark: "C", color: "#1D4F91" },
  { slug: "upenn", name: "UPenn", mark: "P", color: "#011F5B" },
  { slug: "caltech", name: "Caltech", mark: "CT", color: "#C25E1F" },
  { slug: "duke", name: "Duke", mark: "D", color: "#012169" },
  { slug: "umich", name: "Michigan", mark: "M", color: "#00274C" },
  { slug: "uf", name: "Florida", mark: "UF", color: "#0021A5" },
];

function SchoolTile({ school }: { school: School }) {
  return (
    <li className="ap-school-tile">
      <span className="ap-school-logo">
        {school.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static local SVGs, fixed box
          <img src={school.logo} alt="" width={32} height={32} loading="lazy" />
        ) : (
          <span className="ap-school-mark" style={{ background: school.color }} aria-hidden>
            {school.mark}
          </span>
        )}
      </span>
      <span className="ap-school-name">{school.name}</span>
    </li>
  );
}

export function PressBar() {
  return (
    <section
      aria-labelledby="calibration-heading"
      style={{
        borderTop: "1px solid var(--dl-border)",
        borderBottom: "1px solid var(--dl-border)",
        background: "rgba(255, 255, 255, 0.4)",
        padding: "28px 0",
      }}
    >
      <p
        id="calibration-heading"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "var(--dl-text-secondary)",
          textTransform: "uppercase",
          fontFamily: "var(--dl-font-sans)",
          margin: "0 0 16px",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        Calibrated against admissions data from
      </p>

      <div className="ap-marquee" tabIndex={0} aria-label="Schools whose published admissions data informs scoring">
        <div className="ap-marquee-track">
          <ul className="ap-marquee-group">
            {SCHOOLS.map((school) => <SchoolTile key={school.slug} school={school} />)}
          </ul>
          <ul className="ap-marquee-group" aria-hidden="true">
            {SCHOOLS.map((school) => <SchoolTile key={`${school.slug}-dup`} school={school} />)}
          </ul>
        </div>
      </div>
      <p
        style={{ margin: "12px 0 0", textAlign: "center", fontSize: 11, color: "var(--dl-text-muted)", padding: "0 16px" }}
      >
        Uses each school&rsquo;s published Common Data Set. Not affiliated with or endorsed by these institutions.
      </p>
    </section>
  );
}
