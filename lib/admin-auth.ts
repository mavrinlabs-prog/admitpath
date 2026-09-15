import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/clerk-shim-server";
import { prisma, withRetry } from "@/lib/prisma";

type AdminUser = {
  id: string;
  email: string;
};

export type AdminAuthorization =
  | { ok: true; user: AdminUser }
  | {
      ok: false;
      status: 401 | 403 | 503;
      reason: "unauthenticated" | "not_configured" | "forbidden" | "unavailable";
    };

export function parseAdminEmailAllowlist(raw: string | undefined): ReadonlySet<string> {
  return new Set(
    (raw ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Authorize an admin from the signed application session and the current user
 * record. An absent allowlist is a configuration error and always denies.
 */
export async function authorizeAdminUser(): Promise<AdminAuthorization> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, status: 401, reason: "unauthenticated" };
  }

  const allowlist = parseAdminEmailAllowlist(process.env.ADMIN_EMAILS);
  if (allowlist.size === 0) {
    console.error("[admin-auth] ADMIN_EMAILS is not configured; denying access");
    return { ok: false, status: 503, reason: "not_configured" };
  }

  let user: AdminUser | null;
  try {
    user = await withRetry(() =>
      prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        select: { id: true, email: true },
      }),
    );
  } catch (error) {
    console.error(
      "[admin-auth] Failed to verify admin user; denying access:",
      error instanceof Error ? error.message : String(error),
    );
    return { ok: false, status: 503, reason: "unavailable" };
  }

  if (!user || !allowlist.has(user.email.trim().toLowerCase())) {
    return { ok: false, status: 403, reason: "forbidden" };
  }

  return { ok: true, user };
}

/**
 * Server Component guard. Call before loading any admin-only data.
 */
export async function requireAdminPage(): Promise<AdminUser> {
  const authorization = await authorizeAdminUser();
  if (authorization.ok) return authorization.user;
  if (authorization.status === 401) redirect("/sign-in");
  notFound();
}
