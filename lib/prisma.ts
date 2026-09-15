import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Non-interactive props that shouldn't trigger the error proxy. */
const PASSTHROUGH_PROPS = new Set<string | symbol>([
  "then",
  "catch",
  "finally",
  Symbol.toPrimitive,
  Symbol.toStringTag,
  "toJSON",
  "toString",
  "valueOf",
  "constructor",
  "$connect",
  "$disconnect",
  "$on",
]);

function cleanDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  // Strip BOM, whitespace, and invisible characters that Vercel env var editors sometimes add
  return raw.replace(/^\xEF\xBB\xBF/, "").replace(/^﻿/, "").trim();
}

function createPrismaClient(): PrismaClient {
  try {
    const dbUrl = cleanDatabaseUrl(process.env.DATABASE_URL);
    if (!dbUrl) {
      console.error("[prisma] DATABASE_URL is not set. All database operations will fail.");
    }
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
      // Connection pooling for 1M-user scale. Prisma's default connection
      // limit is 5 per instance, which is too low for serverless at scale.
      // Neon / Supabase poolers handle actual pooling; these settings
      // govern the Prisma-side connection behavior.
      datasourceUrl: dbUrl,
    });
  } catch (err) {
    // When DATABASE_URL is missing/invalid, PrismaClient constructor throws.
    // Return a proxy that rejects every call with a clear error instead of
    // crashing the entire module (which would hang routes that transitively
    // import this file even if they never issue a query).
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("PrismaClient failed to initialise:", errorMessage);
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Allow typeof / toJSON / Symbol checks to pass through harmlessly
        if (typeof prop === "symbol" || PASSTHROUGH_PROPS.has(prop)) return undefined;
        return new Proxy(() => {}, {
          get() {
            return (..._args: unknown[]) => {
              throw new Error(
                `Database unavailable — PrismaClient failed to initialise (${String(prop)}). Original error: ${errorMessage}`,
              );
            };
          },
          apply() {
            throw new Error(
              `Database unavailable — PrismaClient failed to initialise (${String(prop)}). Original error: ${errorMessage}`,
            );
          },
        });
      },
    });
  }
}

let prismaClient: PrismaClient | null = globalForPrisma.prisma ?? null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    const client = createPrismaClient();
    prismaClient = client;
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
  }
  return prismaClient;
}

// Preserve the existing `prisma.user...` API while deferring construction
// until a route actually performs a database operation.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (prop === "then" || typeof prop === "symbol") return undefined;
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * Wrapper that retries a Prisma operation once on transient connection
 * errors (Neon cold-start timeouts, ECONNREFUSED, P1001, etc.).
 * Usage: `const user = await withRetry(() => prisma.user.findUnique({...}));`
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const code = (err as { code?: string })?.code;
      const message = (err as { message?: string })?.message ?? "";
      const isTransient =
        code === "P1001" ||                                  // Can't reach database server
        code === "P1002" ||                                  // Database server timed out
        code === "P1017" ||                                  // Server has closed the connection
        message.includes("ECONNREFUSED") ||
        message.includes("ENOTFOUND") ||
        message.includes("ECONNRESET") ||
        message.includes("ETIMEDOUT") ||
        message.includes("Connection reset") ||
        message.includes("Connection terminated unexpectedly");
      if (isTransient && attempt < retries) {
        console.warn(`[prisma] Transient error (${code ?? "unknown"}), retrying in 500ms...`);
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry exhausted"); // unreachable
}
