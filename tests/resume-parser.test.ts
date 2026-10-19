import { describe, expect, it } from "vitest";
import { parseResumeLocally } from "@/lib/resume-local-parser";
import { buildLocalResumeFallback } from "@/lib/profile-contract";

const RESUME = `Jordan Lee
Grade 11, Westfield High School, Austin, TX
Unweighted GPA: 3.92 | Weighted GPA: 4.48 | SAT: 1490 | ACT: 33
Intended Major: Computer Science

ACTIVITIES
President, Robotics Club — 10 hrs/week, 3 years. Led team of 24 to state finals.
Founder, Code for Kids — 6 hrs/week, 2 years. Taught Python to 80 middle schoolers.
Varsity Tennis — 12 hrs/week, 3 years.

AWARDS
USACO Gold Division (2025)
AP Scholar with Distinction

COURSES
AP Calculus BC, AP Physics C, Honors Chemistry`;

describe("local resume parser (upload auto-fill)", () => {
  const r = parseResumeLocally(RESUME);
  it("fills academic fields into the right slots", () => {
    expect(r.academic).toMatchObject({ gpa: 3.92, weightedGpa: 4.48, satScore: 1490, actScore: 33, grade: 11, state: "Texas", intendedMajor: "Computer Science", school: "Westfield High School" });
  });
  it("keeps impact sentences with their activity instead of creating new activities", () => {
    expect(r.activities.map((a) => a.name)).toEqual(["Robotics Club", "Code for Kids", "Varsity Tennis"]);
    expect(r.activities[0]).toMatchObject({ role: "President", hoursPerWeek: 10, yearsInvolved: 3 });
    expect(r.activities[0].impact).toMatch(/Led team of 24/);
  });
  it("does not echo awards into courses", () => {
    expect(r.courses.map((c) => c.name)).toEqual(["AP Calculus BC", "AP Physics C", "Honors Chemistry"]);
    expect(r.awards.map((a) => a.name)).toContain("AP Scholar with Distinction");
  });
  it("handles inline headings", () => {
    const inline = parseResumeLocally("GPA: 3.7\nCourses: AP Biology, AP Statistics\nAwards: State Science Fair 2nd Place");
    expect(inline.courses.map((c) => c.name)).toEqual(["AP Biology", "AP Statistics"]);
    expect(inline.awards[0].level).toBe("State");
  });
  it("never throws on out-of-range numbers (previously a 503)", () => {
    expect(() => buildLocalResumeFallback("GPA: 4.9\nSAT: 2400\nACT: 50\nsome text to reach fifty characters easily here")).not.toThrow();
  });
});
