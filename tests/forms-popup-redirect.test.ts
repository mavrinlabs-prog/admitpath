import { describe, expect, it } from "vitest";
import { validateSchoolInquiry } from "@/lib/school-inquiry";
import { shouldShowPopup, isSuppressedPath } from "@/lib/popup-policy";
import { safeRelativeRedirect } from "@/lib/safe-redirect";

const valid = {
  name: "Ana Ruiz", email: "aruiz@district.k12.ca.us", schoolName: "Lincoln High", role: "counselor",
  phone: "(555) 010-2030", studentCount: "350", timeline: "next_school_year", needs: ["student_licenses"],
  message: "Interested for seniors", audience: "school", sourcePage: "/for-schools",
};

describe("school inquiry form validation", () => {
  it("accepts a complete inquiry", () => {
    const r = validateSchoolInquiry(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.studentCount).toBe(350);
  });
  it("requires every required field with a specific message", () => {
    const r = validateSchoolInquiry({ sourcePage: "/for-schools" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      for (const key of ["name", "email", "schoolName", "role", "studentCount", "timeline", "needs"]) expect(r.fieldErrors[key]).toBeTruthy();
    }
  });
  it("rejects bad email/phone and unknown source pages fall back safely", () => {
    const r = validateSchoolInquiry({ ...valid, email: "nope", phone: "abc" });
    expect(r.ok).toBe(false);
    const s = validateSchoolInquiry({ ...valid, sourcePage: "https://evil.example" });
    expect(s.ok && s.data.sourcePage).toBe("/for-schools");
  });
  it("trips the honeypot", () => {
    const r = validateSchoolInquiry({ ...valid, website: "spam" });
    expect(r.ok).toBe(false);
  });
});

describe("smart popup policy", () => {
  const ctx = { pathname: "/", signedIn: false, secondsOnPage: 30, scrollDepth: 0.6, exitIntent: false, isDesktop: true, now: Date.now(), lastShownAt: null, dismissedAt: null, shownThisSession: false };
  it("never on first paint", () => expect(shouldShowPopup({ ...ctx, secondsOnPage: 0, scrollDepth: 0 }).show).toBe(false));
  it("shows after time + scroll engagement", () => expect(shouldShowPopup(ctx).show).toBe(true));
  it("exit intent on desktop after brief engagement", () => expect(shouldShowPopup({ ...ctx, secondsOnPage: 10, scrollDepth: 0, exitIntent: true }).show).toBe(true));
  it("never for signed-in users", () => expect(shouldShowPopup({ ...ctx, signedIn: true }).show).toBe(false));
  it("suppressed on auth/checkout/legal pages", () => {
    for (const p of ["/sign-up", "/checkout/pro", "/privacy", "/dashboard"]) expect(isSuppressedPath(p)).toBe(true);
    expect(isSuppressedPath("/blog")).toBe(false);
  });
  it("frequency caps: once per session, 7 days, 30 days after dismiss", () => {
    expect(shouldShowPopup({ ...ctx, shownThisSession: true }).reason).toBe("session_cap");
    expect(shouldShowPopup({ ...ctx, lastShownAt: Date.now() - 2 * 86400000 }).reason).toBe("frequency_cap");
    expect(shouldShowPopup({ ...ctx, lastShownAt: Date.now() - 8 * 86400000 }).show).toBe(true);
    expect(shouldShowPopup({ ...ctx, dismissedAt: Date.now() - 10 * 86400000 }).reason).toBe("dismissed");
  });
});

describe("safe redirects (OAuth return URL)", () => {
  it("allows same-origin paths only", () => {
    expect(safeRelativeRedirect("/checkout/pro")).toBe("/checkout/pro");
    expect(safeRelativeRedirect("//evil.com")).toBeNull();
    expect(safeRelativeRedirect("/\\evil.com")).toBeNull();
    expect(safeRelativeRedirect("https://evil.com")).toBeNull();
  });
});
