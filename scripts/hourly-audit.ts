#!/usr/bin/env npx ts-node
/**
 * Hourly health check audit for AdmitPath.
 *
 * Enhanced: more comprehensive checks, timing metrics, clear pass/fail
 * output with scores, actionable recommendations, structured JSON
 * report, exit code reflects overall pass/fail.
 *
 * Run: npx tsx scripts/hourly-audit.ts
 */
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const t0 = performance.now();
const APP = "admitpath";
const ROOT = path.resolve(__dirname, "..");
const ts = new Date().toISOString().replace(/[:.]/g, "-");

type AuditCheck = {
  name: string;
  passed: boolean;
  detail: string;
  category: "code-quality" | "branding" | "security" | "data" | "config";
  recommendation?: string;
};

const checks: AuditCheck[] = [];

function safeExec(cmd: string): string {
  try {
    return execSync(cmd, { stdio: "pipe", cwd: ROOT, timeout: 15000 }).toString().trim();
  } catch {
    return "";
  }
}

function check(name: string, pass: boolean, detail: string, category: AuditCheck["category"], recommendation?: string) {
  checks.push({ name, passed: pass, detail, category, recommendation });
}

/** Cross-platform recursive file search: returns files matching extensions under dirs */
function findFiles(dirs: string[], exts: string[]): string[] {
  const result: string[] = [];
  function walk(dir: string) {
    let entries: fs.Dirent[];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next") continue;
        walk(full);
      } else if (exts.some(ext => e.name.endsWith(ext))) {
        result.push(full);
      }
    }
  }
  for (const d of dirs) walk(d);
  return result;
}

/** Cross-platform grep: search for pattern in files under dirs with given extensions */
function grepFiles(pattern: RegExp, dirs: string[], exts: string[]): string[] {
  const files = findFiles(dirs, exts);
  const hits: string[] = [];
  for (const f of files) {
    try {
      const content = fs.readFileSync(f, "utf8");
      if (pattern.test(content)) hits.push(f);
    } catch { /* skip */ }
  }
  return hits;
}

/** Count matches of pattern across files */
function countMatches(pattern: RegExp, dirs: string[], exts: string[]): number {
  const files = findFiles(dirs, exts);
  let count = 0;
  for (const f of files) {
    try {
      const content = fs.readFileSync(f, "utf8");
      const matches = content.match(new RegExp(pattern.source, pattern.flags + (pattern.flags.includes("g") ? "" : "g")));
      if (matches) count += matches.length;
    } catch { /* skip */ }
  }
  return count;
}

console.log("=".repeat(60));
console.log("  AdmitPath Hourly Health Check (Enhanced)");
console.log("=".repeat(60));
console.log(`  Time: ${new Date().toISOString()}`);
console.log();

// ── CODE QUALITY CHECKS ──
console.log("--- Code Quality ---");

const appDir = path.join(ROOT, "app");
const libDir = path.join(ROOT, "lib");
const compDir = path.join(ROOT, "components");
const apiDir = path.join(ROOT, "app", "api");

const openaiHitFiles = grepFiles(/openai|gpt-4|gpt-3\.5/i, [appDir, libDir], [".ts", ".tsx"])
  .filter(f => {
    // Exclude comment-only references (guard comments are OK)
    const content = fs.readFileSync(f, "utf8");
    return content.split("\n").some(line => {
      if (/^\s*(\/\/|\/\*|\*)/.test(line)) return false;
      return /import.*openai|from\s+['"]openai|require\s*\(\s*['"]openai/i.test(line);
    });
  });
check("No OpenAI references", openaiHitFiles.length === 0, openaiHitFiles.length > 0 ? `Found in: ${openaiHitFiles.map(f => path.relative(ROOT, f)).join(", ")}` : "Clean", "code-quality", openaiHitFiles.length > 0 ? "Remove all OpenAI references per CLAUDE.md" : undefined);

// Check for console.log in API routes (exclude cron/webhook routes which use logging intentionally)
const consoleLogFiles = grepFiles(/console\.log/, [apiDir], [".ts"])
  .filter(f => {
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    // Cron jobs, webhooks, and admin backfill scripts legitimately use console.log
    return !rel.includes("/cron/") && !rel.includes("/webhooks/") && !rel.includes("/admin/");
  });
check("No console.log in API routes", consoleLogFiles.length === 0, consoleLogFiles.length > 0 ? `Found in: ${consoleLogFiles.map(f => path.relative(ROOT, f)).join(", ")}` : "Clean", "code-quality", consoleLogFiles.length > 0 ? "Replace console.log with structured logging in API routes" : undefined);

// Check for TODO/FIXME/HACK comments
const todoNum = countMatches(/TODO|FIXME|HACK|XXX/i, [appDir, libDir], [".ts", ".tsx"]);
check("Low TODO/FIXME count", todoNum <= 20, `${todoNum} instances found`, "code-quality", todoNum > 20 ? "Address or document TODO items" : undefined);

// ── BRANDING CHECKS ──
console.log("--- Branding ---");

const brandHitFiles = grepFiles(/4A6FA5/i, [appDir, libDir], [".ts", ".tsx", ".css"]);
check("Brand color #4A6FA5 present", brandHitFiles.length > 0, brandHitFiles.length > 0 ? "Found" : "Missing", "branding", brandHitFiles.length === 0 ? "Ensure primary brand color #4A6FA5 is used" : undefined);

const bgHitFiles = grepFiles(/D5DCE8/i, [appDir], [".css", ".ts", ".tsx"]);
check("Background #D5DCE8 present", bgHitFiles.length > 0, bgHitFiles.length > 0 ? "Found" : "Missing", "branding", bgHitFiles.length === 0 ? "Ensure background color #D5DCE8 is used per design system" : undefined);

// Check for banned orange colors
const bannedOrange = ["E67635", "F5A468", "C45220", "B34A1C"];
const orangePattern = new RegExp(bannedOrange.join("|"), "i");
const orangeFoundFiles = grepFiles(orangePattern, [appDir, libDir, compDir], [".ts", ".tsx", ".css"]);
check("No banned orange colors", orangeFoundFiles.length === 0, orangeFoundFiles.length > 0 ? "Banned orange color found" : "Clean", "branding", orangeFoundFiles.length > 0 ? "Remove all orange colors per CLAUDE.md" : undefined);

// Check for banned fonts (skip comment-only references)
const bannedFonts = ["DM Serif Display", "Instrument Sans", "Roboto"];
const fontPattern = new RegExp(bannedFonts.join("|"), "i");
const bannedFontFiles = grepFiles(fontPattern, [appDir, compDir], [".ts", ".tsx", ".css"])
  .filter(f => {
    const content = fs.readFileSync(f, "utf8");
    return content.split("\n").some(line => {
      const trimmed = line.trim();
      // Skip comment lines
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return false;
      return fontPattern.test(line);
    });
  });
check("No banned fonts", bannedFontFiles.length === 0, bannedFontFiles.length > 0 ? "Banned font found" : "Clean (Inter/Lora/JetBrains Mono only)", "branding", bannedFontFiles.length > 0 ? "Replace banned fonts with Inter per design system" : undefined);

// ── PRICING CHECKS ──
console.log("--- Pricing ---");

// Plus tier removed — only Free + Pro ($19.99) exist now
const noPlusPriceFiles = grepFiles(/Plus.*9\.99|9\.99.*Plus/i, [libDir], [".ts"]);
check("No stale Plus $9.99 in lib/", noPlusPriceFiles.length === 0, noPlusPriceFiles.length === 0 ? "Clean" : "Stale Plus reference found", "config", noPlusPriceFiles.length > 0 ? "Remove legacy Plus plan pricing references" : undefined);

const proPriceFiles = grepFiles(/19\.99/, [libDir], [".ts"]);
check("Pro price $19.99 in lib/", proPriceFiles.length > 0, proPriceFiles.length > 0 ? "Found" : "Missing", "config", proPriceFiles.length === 0 ? "Ensure Pro plan pricing ($19.99/mo) is configured" : undefined);

const seasonPassFiles = grepFiles(/Season Pass/i, [libDir], [".ts"]);
check("No Season Pass in lib/", seasonPassFiles.length === 0, seasonPassFiles.length === 0 ? "Clean" : "Stale reference", "config", seasonPassFiles.length > 0 ? "Remove Season Pass references from lib/" : undefined);

// ── SECURITY CHECKS ──
console.log("--- Security ---");

let envTracked = false;
try { execSync(`git -C "${ROOT}" ls-files --error-unmatch .env.local`, { stdio: "pipe" }); envTracked = true; } catch { /* good */ }
check(".env.local not git-tracked", !envTracked, envTracked ? "TRACKED (bad!)" : "Not tracked", "security", envTracked ? "Remove .env.local from git tracking immediately" : undefined);

const envExample = fs.existsSync(path.join(ROOT, ".env.example"));
check(".env.example present", envExample, envExample ? "Present" : "Missing", "security", !envExample ? "Create .env.example as a template" : undefined);

// Check middleware exists (auth protection)
const middlewareExists = fs.existsSync(path.join(ROOT, "middleware.ts"));
check("middleware.ts present", middlewareExists, middlewareExists ? "Present" : "Missing", "security", !middlewareExists ? "Create middleware.ts for auth route protection" : undefined);

// ── DATA CHECKS ──
console.log("--- Data ---");

const compJson = path.join(ROOT, "public/competitions.json");
check("competitions.json exists", fs.existsSync(compJson), fs.existsSync(compJson) ? "Present" : "Missing", "data");
if (fs.existsSync(compJson)) {
  try {
    const comps = JSON.parse(fs.readFileSync(compJson, "utf8"));
    check("competitions.json has 40+ entries", comps.length >= 40, `${comps.length} entries`, "data", comps.length < 40 ? "Add more competition entries" : undefined);
  } catch { check("competitions.json valid JSON", false, "Parse error", "data"); }
}

const collegesFile = path.join(ROOT, "data/colleges.ts");
check("data/colleges.ts exists", fs.existsSync(collegesFile), fs.existsSync(collegesFile) ? "Present" : "Missing", "data");

const scholarshipsFile = path.join(ROOT, "data/scholarships-db.ts");
check("data/scholarships-db.ts exists", fs.existsSync(scholarshipsFile), fs.existsSync(scholarshipsFile) ? "Present" : "Missing", "data");

// Check public/data envelope files
const envelopeFiles = ["scorecard.json", "ipeds.json", "cds-c7.json", "fairtest.json", "common-app.json", "opportunity-insights.json", "compass.json", "uc.json"];
let envelopesPresent = 0;
for (const file of envelopeFiles) {
  if (fs.existsSync(path.join(ROOT, "public/data", file))) envelopesPresent++;
}
check("Data envelopes present", envelopesPresent >= 4, `${envelopesPresent}/${envelopeFiles.length} present`, "data", envelopesPresent < 4 ? "Run ingestion scripts: npx tsx scripts/ingest/run-all.ts" : undefined);

// ── CONFIG CHECKS ──
console.log("--- Config ---");

const clPath = path.join(ROOT, "CHANGELOG.md");
const clMtime = fs.existsSync(clPath) ? fs.statSync(clPath).mtime : null;
const clFresh = clMtime ? (Date.now() - clMtime.getTime()) < 7 * 24 * 60 * 60 * 1000 : false;
check("CHANGELOG.md fresh (< 7 days)", clFresh, clMtime ? `Last modified: ${clMtime.toISOString()}` : "File missing", "config", !clFresh ? "Update CHANGELOG.md with recent changes" : undefined);

const prismaSchema = path.join(ROOT, "prisma/schema.prisma");
check("prisma/schema.prisma exists", fs.existsSync(prismaSchema), fs.existsSync(prismaSchema) ? "Present" : "Missing", "config");

// ── SUMMARY ──
const totalMs = Math.round(performance.now() - t0);
const passedCount = checks.filter(c => c.passed).length;
const failedCount = checks.filter(c => !c.passed).length;
const score = Math.round((passedCount / checks.length) * 100);

console.log();
console.log("=".repeat(60));
console.log("  HOURLY AUDIT RESULTS");
console.log("=".repeat(60));
console.log();

// Group by category
const categories = ["code-quality", "branding", "security", "data", "config"] as const;
for (const cat of categories) {
  const catChecks = checks.filter(c => c.category === cat);
  const catPassed = catChecks.filter(c => c.passed).length;
  console.log(`  [${cat}] ${catPassed}/${catChecks.length}`);
  for (const c of catChecks) {
    const status = c.passed ? "PASS" : "FAIL";
    console.log(`    ${status}  ${c.name}: ${c.detail}`);
    if (!c.passed && c.recommendation) {
      console.log(`           -> ${c.recommendation}`);
    }
  }
  console.log();
}

console.log(`  Overall: ${passedCount}/${checks.length} passed (${score}%)`);
console.log(`  Time: ${totalMs}ms`);
console.log("=".repeat(60));

// Write report
const reportDir = path.join(ROOT, "test-reports");
if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

const report = {
  timestamp: new Date().toISOString(),
  durationMs: totalMs,
  score,
  passed: passedCount,
  failed: failedCount,
  total: checks.length,
  checks,
};

const reportPath = path.join(reportDir, "hourly-audit.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nReport saved to: ${reportPath}`);

// Write markdown report
const mdLines = [`# Hourly Audit -- ${APP}`, `**Time:** ${new Date().toISOString()}`, `**Score:** ${score}%`, ""];
for (const c of checks) {
  mdLines.push(`${c.passed ? "PASS" : "FAIL"} ${c.name} -- ${c.detail}`);
}
const mdPath = path.join(ROOT, "test-reports", `hourly-audit-${ts}.md`);
fs.writeFileSync(mdPath, mdLines.join("\n"));

if (failedCount > 0) {
  process.exit(1);
}
