import { prisma } from "@/lib/prisma";

export type ComponentStatus = "operational" | "degraded";
export type SystemStatus = {
  status: ComponentStatus;
  components: { website: ComponentStatus; database: ComponentStatus; aiServices: ComponentStatus; payments: ComponentStatus };
  checkedAt: string;
};

/**
 * Public, non-sensitive status (no secrets, no error messages). Database is a
 * live SELECT 1 with a 3s budget; AI and payments report whether they are
 * configured (an unconfigured provider means AI features run on fallbacks).
 */
export async function getSystemStatus(): Promise<SystemStatus> {
  let database: ComponentStatus = "degraded";
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 3000)),
    ]);
    database = "operational";
  } catch {
    database = "degraded";
  }
  const aiConfigured = Boolean(process.env.CEREBRAS_API_KEY || process.env.GROQ_API_KEY_1 || process.env.ANTHROPIC_API_KEY);
  const paymentsConfigured = Boolean(process.env.STRIPE_SECRET_KEY && (process.env.STRIPE_PRICE_PRO || process.env.STRIPE_PRO_PRICE_ID));
  const components = {
    website: "operational" as const,
    database,
    aiServices: (aiConfigured ? "operational" : "degraded") as ComponentStatus,
    payments: (paymentsConfigured ? "operational" : "degraded") as ComponentStatus,
  };
  const status: ComponentStatus = Object.values(components).every((value) => value === "operational") ? "operational" : "degraded";
  return { status, components, checkedAt: new Date().toISOString() };
}
