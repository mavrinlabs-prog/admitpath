import { describe, expect, it, vi, beforeEach } from "vitest";

const cookieJar = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined),
    set: (name: string, value: string) => cookieJar.set(name, value),
    delete: (name: string) => cookieJar.delete(name),
  }),
  headers: async () => new Headers(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({ prisma: { stripeWebhookEvent: { create: vi.fn() } }, withRetry: (fn: () => unknown) => fn() }));

describe("Stripe webhook", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_unit_placeholder";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_unit_placeholder";
  });
  it("rejects a missing signature with 400", async () => {
    const { POST } = await import("@/app/api/webhooks/stripe/route");
    const res = await POST(new Request("http://localhost/api/webhooks/stripe", { method: "POST", body: "{}" }));
    expect(res.status).toBe(400);
  });
  it("rejects an invalid signature with 400 before touching the database", async () => {
    const { POST } = await import("@/app/api/webhooks/stripe/route");
    const { prisma } = await import("@/lib/prisma");
    const res = await POST(new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=deadbeef" },
      body: JSON.stringify({ id: "evt_1", type: "checkout.session.completed" }),
    }));
    expect(res.status).toBe(400);
    expect((prisma as unknown as { stripeWebhookEvent: { create: ReturnType<typeof vi.fn> } }).stripeWebhookEvent.create).not.toHaveBeenCalled();
  });
});

describe("Google OAuth state validation", () => {
  beforeEach(() => cookieJar.clear());
  it("rejects a callback whose state does not match the cookie", async () => {
    cookieJar.set("oauth_state", "expected-state");
    const { GET } = await import("@/app/api/auth/google/callback/route");
    const { NextRequest } = await import("next/server");
    const res = await GET(new NextRequest("http://localhost:3000/api/auth/google/callback?code=abc&state=attacker"));
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.headers.get("location")).toContain("error=invalid_state");
  });
  it("rejects a callback with no state cookie", async () => {
    const { GET } = await import("@/app/api/auth/google/callback/route");
    const { NextRequest } = await import("next/server");
    const res = await GET(new NextRequest("http://localhost:3000/api/auth/google/callback?code=abc&state=x"));
    expect(res.headers.get("location")).toContain("error=invalid_state");
  });
  it("start route generates a random state and only keeps safe return paths", async () => {
    process.env.GOOGLE_CLIENT_ID = "unit-test-client-id";
    const { GET } = await import("@/app/api/auth/google/route");
    const { NextRequest } = await import("next/server");
    const res = await GET(new NextRequest("http://localhost:3000/api/auth/google?redirect_url=//evil.com"));
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("accounts.google.com");
    expect(new URL(location).searchParams.get("state")).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(res.cookies.get("oauth_return_to")?.value ?? "").toBe("");
  });
});
