"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import type { DataPoint } from "@/data/scattergram-data";

/* ── Constants ──────────────────────────────────────────────────────── */
const COLORS = {
  admitted: "#16A34A",
  rejected: "#DC2626",
  waitlisted: "#CA8A04",
  user: "#4A6FA5",
  grid: "rgba(0,0,0,0.06)",
  axis: "var(--dl-text-muted, #8890A5)",
  percentile: "rgba(74,111,165,0.25)",
};

const PADDING = { top: 30, right: 30, bottom: 50, left: 55 };

type Props = {
  data: DataPoint[];
  sat25: number;
  sat75: number;
  gpaAvg: number;
  /** User's stats (optional — shows blue star) */
  userGpa?: number;
  userSat?: number;
  schoolName: string;
};

/* ── Tooltip state ──────────────────────────────────────────────────── */
type Tooltip = {
  x: number;
  y: number;
  point: DataPoint;
} | null;

export function Scattergram({ data, sat25, sat75, gpaAvg, userGpa, userSat, schoolName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Responsive sizing
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setDimensions({ width: w, height: Math.min(400, Math.max(280, w * 0.6)) });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { width, height } = dimensions;
  const plotW = width - PADDING.left - PADDING.right;
  const plotH = height - PADDING.top - PADDING.bottom;

  // Axis ranges
  const gpaMin = 2.5;
  const gpaMax = 4.0;
  const satMin = 900;
  const satMax = 1600;

  // Mappers
  const xOf = (gpa: number) => PADDING.left + ((gpa - gpaMin) / (gpaMax - gpaMin)) * plotW;
  const yOf = (sat: number) => PADDING.top + plotH - ((sat - satMin) / (satMax - satMin)) * plotH;

  // Percentile lines
  const sat25Y = yOf(sat25);
  const sat75Y = yOf(sat75);

  // Grid ticks
  const gpaTicks = [2.5, 3.0, 3.5, 4.0];
  const satTicks = [1000, 1100, 1200, 1300, 1400, 1500, 1600];

  // Outcome label
  const outcomeLabel = (o: DataPoint["outcome"]) =>
    o === "admitted" ? "Admitted" : o === "rejected" ? "Rejected" : "Waitlisted";

  // Summary for user
  const summary = useMemo(() => {
    if (!userGpa || !userSat) return null;
    const admitted = data.filter((d) => d.outcome === "admitted");
    const betterGpa = admitted.filter((d) => d.gpa <= userGpa!).length;
    const betterSat = admitted.filter((d) => d.sat <= userSat!).length;
    const gpaPct = Math.round((betterGpa / admitted.length) * 100);
    const satPct = Math.round((betterSat / admitted.length) * 100);
    const inRange = userSat >= sat25 && userSat <= sat75 && userGpa >= gpaAvg - 0.2;
    return { gpaPct, satPct, inRange };
  }, [data, userGpa, userSat, sat25, sat75, gpaAvg]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-xs font-medium" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.admitted }} />
          Admitted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.rejected }} />
          Rejected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.waitlisted }} />
          Waitlisted
        </span>
        {(userGpa !== undefined && userSat !== undefined) && (
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,4.5 8.25,7.5 9.75,12 6,9 2.25,12 3.75,7.5 0,4.5 4.5,4.5" fill={COLORS.user} /></svg>
            You
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ backgroundColor: COLORS.percentile }} />
          25th/75th SAT
        </span>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full h-auto select-none"
        style={{ maxWidth: width }}
        role="img"
        aria-label={`Scattergram showing GPA vs SAT for ${schoolName} applicants. ${data.length} data points: ${data.filter(d => d.outcome === "admitted").length} admitted, ${data.filter(d => d.outcome === "rejected").length} rejected, ${data.filter(d => d.outcome === "waitlisted").length} waitlisted. SAT 25th percentile: ${sat25}, 75th percentile: ${sat75}.`}
      >
        {/* Background */}
        <rect x={PADDING.left} y={PADDING.top} width={plotW} height={plotH} fill="rgba(255,255,255,0.5)" rx="4" />

        {/* Grid lines */}
        {gpaTicks.map((g) => (
          <line key={`gx-${g}`} x1={xOf(g)} y1={PADDING.top} x2={xOf(g)} y2={PADDING.top + plotH} stroke={COLORS.grid} strokeWidth={1} />
        ))}
        {satTicks.map((s) => (
          <line key={`gy-${s}`} x1={PADDING.left} y1={yOf(s)} x2={PADDING.left + plotW} y2={yOf(s)} stroke={COLORS.grid} strokeWidth={1} />
        ))}

        {/* Percentile band */}
        <rect
          x={PADDING.left}
          y={sat75Y}
          width={plotW}
          height={sat25Y - sat75Y}
          fill="rgba(74,111,165,0.05)"
        />
        <line x1={PADDING.left} y1={sat25Y} x2={PADDING.left + plotW} y2={sat25Y} stroke={COLORS.percentile} strokeWidth={1.5} strokeDasharray="6 4" />
        <line x1={PADDING.left} y1={sat75Y} x2={PADDING.left + plotW} y2={sat75Y} stroke={COLORS.percentile} strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={PADDING.left + plotW + 2} y={sat25Y + 3} fontSize="9" fill={COLORS.axis} textAnchor="start">25th</text>
        <text x={PADDING.left + plotW + 2} y={sat75Y + 3} fontSize="9" fill={COLORS.axis} textAnchor="start">75th</text>

        {/* Axis labels */}
        {gpaTicks.map((g) => (
          <text key={`gl-${g}`} x={xOf(g)} y={PADDING.top + plotH + 18} fontSize="11" fill={COLORS.axis} textAnchor="middle" fontFamily="var(--font-inter)">
            {g.toFixed(1)}
          </text>
        ))}
        {satTicks.map((s) => (
          <text key={`sl-${s}`} x={PADDING.left - 8} y={yOf(s) + 4} fontSize="11" fill={COLORS.axis} textAnchor="end" fontFamily="var(--font-inter)">
            {s}
          </text>
        ))}

        {/* Axis titles */}
        <text x={PADDING.left + plotW / 2} y={height - 4} fontSize="12" fill="var(--dl-text-secondary, #454B5E)" textAnchor="middle" fontWeight="600" fontFamily="var(--font-inter)">
          GPA (Unweighted)
        </text>
        <text
          x={14}
          y={PADDING.top + plotH / 2}
          fontSize="12"
          fill="var(--dl-text-secondary, #454B5E)"
          textAnchor="middle"
          fontWeight="600"
          fontFamily="var(--font-inter)"
          transform={`rotate(-90 14 ${PADDING.top + plotH / 2})`}
        >
          SAT Score
        </text>

        {/* Data points */}
        {data.map((d, i) => {
          const cx = xOf(d.gpa);
          const cy = yOf(d.sat);
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={4.5}
              fill={COLORS[d.outcome]}
              fillOpacity={0.65}
              stroke={COLORS[d.outcome]}
              strokeWidth={1}
              strokeOpacity={0.3}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ delay: i * 0.012, duration: 0.35, ease: "easeOut" }}
              onMouseEnter={() => setTooltip({ x: cx, y: cy, point: d })}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}

        {/* User star (pulsing) */}
        {userGpa !== undefined && userSat !== undefined && (
          <g>
            <motion.circle
              cx={xOf(userGpa)}
              cy={yOf(userSat)}
              r={14}
              fill="none"
              stroke={COLORS.user}
              strokeWidth={2}
              strokeOpacity={0.3}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={isInView ? { scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5, ease: "backOut" }}
            >
              <polygon
                points={starPoints(xOf(userGpa), yOf(userSat), 10, 5)}
                fill={COLORS.user}
                stroke="#fff"
                strokeWidth={1.5}
              />
            </motion.g>
          </g>
        )}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x + 10}
              y={tooltip.y - 45}
              width={140}
              height={38}
              rx={6}
              fill="rgba(30,51,82,0.95)"
            />
            <text x={tooltip.x + 18} y={tooltip.y - 28} fontSize="11" fill="#fff" fontWeight="600" fontFamily="var(--font-inter)">
              {outcomeLabel(tooltip.point.outcome)}
            </text>
            <text x={tooltip.x + 18} y={tooltip.y - 14} fontSize="10" fill="rgba(255,255,255,0.8)" fontFamily="var(--font-inter)">
              GPA {tooltip.point.gpa.toFixed(2)} · SAT {tooltip.point.sat}
            </text>
          </g>
        )}
      </svg>

      {/* User summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-5 rounded-2xl border p-5"
          style={{
            background: summary.inRange ? "rgba(22,163,74,0.06)" : "rgba(202,138,4,0.06)",
            borderColor: summary.inRange ? "rgba(22,163,74,0.2)" : "rgba(202,138,4,0.2)",
          }}
        >
          <h3
            className="text-base font-bold mb-1.5"
            style={{ color: "var(--dl-text-primary, #1B2030)", fontFamily: "var(--font-inter)" }}
          >
            Where You Stand at {schoolName}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text-secondary, #454B5E)" }}>
            Your GPA is higher than <strong>{summary.gpaPct}%</strong> of admitted students,
            and your SAT is higher than <strong>{summary.satPct}%</strong> of admitted students.
            {summary.inRange
              ? " Your stats fall within the typical admitted student range."
              : " Your stats are outside the typical range — strong extracurriculars, essays, and hooks will be critical."}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Star polygon helper ────────────────────────────────────────────── */
function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + (i * 2 * Math.PI) / 5;
    const innerAngle = outerAngle + Math.PI / 5;
    pts.push(`${cx - Math.cos(outerAngle) * outerR},${cy - Math.sin(outerAngle) * outerR}`);
    pts.push(`${cx - Math.cos(innerAngle) * innerR},${cy - Math.sin(innerAngle) * innerR}`);
  }
  return pts.join(" ");
}
