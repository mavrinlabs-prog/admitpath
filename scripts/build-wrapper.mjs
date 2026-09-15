#!/usr/bin/env node
/**
 * Build wrapper — patches Next.js 14's 500.html bug, then runs the build.
 *
 * Next.js 14 expects `.next/export/500.html` to exist after static generation
 * so it can copy it to `.next/server/pages/500.html`. In App Router projects
 * without a `pages/` directory, this file is never generated, causing the build
 * to fail with ENOENT. Adding a `pages/500.tsx` doesn't work either because
 * the Clerk webpack alias override breaks pages directory resolution.
 *
 * Fix: temporarily patch the Next.js build code to make the 500.html rename
 * non-fatal, run `next build`, then restore the original file.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const BUILD_FILE = join(ROOT, "node_modules", "next", "dist", "build", "index.js");
const BACKUP_FILE = BUILD_FILE + ".bak";

// The specific line that fails — wrap it in a try/catch
const ORIGINAL = `if (useDefaultStatic500) {
                        await moveExportedPage("/_error", "/500", "/500", false, "html");
                    }`;

const PATCHED = `if (useDefaultStatic500) {
                        try {
                            await moveExportedPage("/_error", "/500", "/500", false, "html");
                        } catch (_e500) {
                            console.log("[build-patch] 500.html export skipped (App Router, no pages dir)");
                        }
                    }`;

function patch() {
  if (!existsSync(BUILD_FILE)) {
    console.log("[build-wrapper] Next.js build file not found, skipping patch.");
    return false;
  }

  const src = readFileSync(BUILD_FILE, "utf8");

  if (!src.includes(ORIGINAL)) {
    console.log("[build-wrapper] Patch target not found (already patched or different Next.js version). Proceeding.");
    return false;
  }

  copyFileSync(BUILD_FILE, BACKUP_FILE);

  const patched = src.replace(ORIGINAL, PATCHED);
  writeFileSync(BUILD_FILE, patched, "utf8");
  console.log("[build-wrapper] Patched Next.js build to handle missing 500.html gracefully.");
  return true;
}

function restore() {
  if (existsSync(BACKUP_FILE)) {
    copyFileSync(BACKUP_FILE, BUILD_FILE);
    console.log("[build-wrapper] Restored original Next.js build file.");
  }
}

const wasPatched = patch();

try {
  execSync("node scripts/next-build-runner.cjs build --webpack", { stdio: "inherit", cwd: ROOT });
  console.log("[build-wrapper] Build succeeded.");
} finally {
  if (wasPatched) restore();
}
