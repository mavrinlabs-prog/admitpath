import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(name)) out.push(p);
  }
  return out;
}
const files = [...walk("app"), ...walk("components")];
const text = files.map((f) => [f, readFileSync(f, "utf8")] as const);

describe("content guards", () => {
  it("no free-pilot / free-school language", () => {
    const hits = text.filter(([, s]) => /free pilot|join the pilot|free for (the )?first 10 schools|\b(60|30|3)-day pilot/i.test(s)).map(([f]) => f);
    expect(hits).toEqual([]);
  });
  it("no conflicting launch-offer prices ($1,599 / $1,999)", () => {
    const hits = text.filter(([, s]) => /\$1,?599|\$1,?999/.test(s)).map(([f]) => f);
    expect(hits).toEqual([]);
  });
  it("no cross-promotion of the founder's other apps", () => {
    const hits = text.filter(([, s]) => /competeai|worksheetgen|cognify|midpath/i.test(s)).map(([f]) => f);
    expect(hits).toEqual([]);
  });
  it("no dead admitpath.com / admitpath.app links", () => {
    const hits = text.filter(([, s]) => /https?:\/\/(www\.)?admitpath\.(com|app)/i.test(s)).map(([f]) => f);
    expect(hits).toEqual([]);
  });
});
