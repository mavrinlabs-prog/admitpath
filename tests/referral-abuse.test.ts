import { beforeEach, describe, expect, it, vi } from "vitest";
import { assessPair, assessSignup, hashIp, normalizeEmail, similarity } from "@/lib/abuse-signals";

const store = vi.hoisted(() => ({
  users: new Map<string, Record<string, unknown>>(),
  referrals: [] as Array<Record<string, unknown>>,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(async ({ where }: { where: { id: string } }) => store.users.get(where.id) ?? null),
    },
    referral: {
      findUnique: vi.fn(async ({ where }: { where: { refereeId: string } }) => store.referrals.find((r) => r.refereeId === where.refereeId) ?? null),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        if (store.referrals.some((r) => r.refereeId === data.refereeId)) throw Object.assign(new Error("dup"), { code: "P2002" });
        store.referrals.push(data);
        return data;
      }),
    },
  },
}));

import { generateReferralCode, recordReferral, referralUserId } from "@/lib/referral";
import { buildReferralUrl } from "@/lib/site-url";

function user(id: string, email: string, extra: Record<string, unknown> = {}) {
  store.users.set(id, { id, email, name: null, deviceId: null, signupIpHash: null, stripeCustomerId: null, abuseReviewStatus: "clear", ...extra });
}

describe("abuse signals", () => {
  it("normalizes gmail dots and +aliases", () => {
    expect(normalizeEmail("Jane.Doe+college@GoogleMail.com")).toBe("janedoe@gmail.com");
    expect(normalizeEmail("jane+x@school.org")).toBe("jane@school.org");
  });
  it("hashes IPs (never stores raw)", () => {
    const h = hashIp("203.0.113.9");
    expect(h).not.toContain("203");
    expect(h).toHaveLength(40);
  });
  it("blocks same-person pairs, allows strangers on a shared school IP", () => {
    expect(assessPair({ email: "a.b@gmail.com" }, { email: "ab+1@gmail.com" }).decision).toBe("block");
    expect(assessPair({ email: "x@a.com", deviceHash: "d1" }, { email: "y@b.com", deviceHash: "d1" }).decision).toBe("block");
    expect(assessPair({ email: "maria@a.com", ipHash: "i" }, { email: "kevin@b.com", ipHash: "i" }).decision).toBe("allow");
    expect(similarity("jordanlee", "jordanlee2")).toBeGreaterThan(0.8);
  });
  it("sign-up never hard-blocks, only flags for review", () => {
    const a = assessSignup({ email: "j@gmail.com", deviceHash: "d" }, [{ email: "other@gmail.com", deviceHash: "d" }]);
    expect(a.decision).toBe("review");
    expect(a.flags).toContain("same_device_token");
  });
});

describe("referral codes", () => {
  beforeEach(() => {
    store.users.clear();
    store.referrals.length = 0;
  });

  it("round-trips and rejects tampering", () => {
    const code = generateReferralCode("user_abc123");
    expect(referralUserId(code)).toBe("user_abc123");
    expect(referralUserId(code.replace(/.$/, code.endsWith("A") ? "B" : "A"))).toBeNull();
    expect(referralUserId("garbage")).toBeNull();
  });

  it("builds links on the configured production origin, never a dead domain", () => {
    const url = buildReferralUrl(generateReferralCode("user_abc123"));
    expect(url.startsWith("https://admith.vercel.app/r/") || url.startsWith(process.env.NEXT_PUBLIC_APP_URL ?? "")).toBe(true);
  });

  it("records a valid referral once (no duplicate redemption)", async () => {
    user("ref_1", "maria@school.org");
    user("new_1", "kevin@other.org");
    const code = generateReferralCode("ref_1");
    expect(await recordReferral("new_1", code)).toEqual({ success: true });
    expect(await recordReferral("new_1", code)).toEqual({ success: false, error: "Referral already recorded" });
    expect(store.referrals[0]).toMatchObject({ status: "pending", refereeDiscountPct: 50 });
  });

  it("prevents self-referral", async () => {
    user("ref_2", "solo@school.org");
    expect(await recordReferral("ref_2", generateReferralCode("ref_2"))).toEqual({ success: false, error: "Cannot refer yourself" });
  });

  it("stores duplicate-account referrals as blocked (no discount)", async () => {
    user("ref_3", "jane.doe@gmail.com");
    user("new_3", "janedoe+2@gmail.com");
    const result = await recordReferral("new_3", generateReferralCode("ref_3"));
    expect(result.success).toBe(false);
    expect(store.referrals[0]).toMatchObject({ status: "blocked" });
    expect(String(store.referrals[0].blockedReason)).toContain("same_normalized_email");
  });
});
