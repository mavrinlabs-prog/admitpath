import { describe, expect, it } from "vitest";
import { normalizeAnalyzeRequest, parseAnalyzeRequest, ANALYZE_LIMITS } from "@/lib/analyze-contract";

describe("analyze contract (reported /api/analyze 400 on manual fill)", () => {
  it("accepts a typical manual-fill payload with string numbers", () => {
    const r = parseAnalyzeRequest({ gpa: "3.85", weightedGpa: "4.4", satScore: "1450", grade: "11", activities: [{ name: "Debate captain" }], awards: [], courses: [], targetColleges: ["Duke"] });
    expect(r.ok).toBe(true);
  });

  it("no longer rejects >30 activity lines — keeps the first 30 and warns", () => {
    const activities = Array.from({ length: 35 }, (_, i) => ({ name: `Activity ${i}` }));
    const r = parseAnalyzeRequest({ gpa: 3.8, activities });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.activities).toHaveLength(ANALYZE_LIMITS.activities);
    expect(r.warnings.some((w) => w.field === "activities")).toBe(true);
  });

  it("accepts a 6.0-scale weighted GPA and ignores out-of-range weighted values with a warning", () => {
    expect(parseAnalyzeRequest({ gpa: 4, weightedGpa: 5.6 }).ok).toBe(true);
    const r = parseAnalyzeRequest({ gpa: 4, weightedGpa: 9 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.weightedGpa).toBeUndefined();
  });

  it("truncates long activity/award lines instead of failing", () => {
    const long = "x".repeat(400);
    const r = parseAnalyzeRequest({ gpa: 3.5, activities: [{ name: long }], awards: [long] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.activities[0].name.length).toBe(ANALYZE_LIMITS.activityName);
      expect(r.data.awards[0].length).toBe(ANALYZE_LIMITS.award);
    }
  });

  it("returns field-level errors for invalid GPA / SAT / ACT", () => {
    const r = parseAnalyzeRequest({ gpa: 94, satScore: 1700, actScore: 40 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.fieldErrors.gpa?.[0]).toMatch(/0–5 scale/);
      expect(r.fieldErrors.satScore).toBeTruthy();
      expect(r.fieldErrors.actScore).toBeTruthy();
    }
  });

  it("accepts newline strings for textareas and comma-separated colleges", () => {
    const n = normalizeAnalyzeRequest({ gpa: "3.9", activities: "Robotics\nTennis", targetColleges: "MIT, Stanford" });
    expect(n.data.activities).toHaveLength(2);
    expect(n.data.targetColleges).toEqual(["MIT", "Stanford"]);
  });
});
