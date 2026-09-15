import { z } from "zod";

export const checkoutRequestSchema = z
  .object({
    planId: z.enum(["pro", "plus"]).optional(),
    planKey: z.enum(["pro", "plus"]).optional(),
    interval: z.literal("monthly").optional().default("monthly"),
  })
  .transform((data) => ({
    // "plus" is a retired identifier accepted only for compatibility.
    planId: "pro" as const,
    interval: data.interval,
  }));
