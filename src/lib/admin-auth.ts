import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "crypto";
import { readAdminUsers, type AdminUser } from "@/sanity/lib/admin";

/* =====================================================================
 * Admin-panel auth — multi-user accounts (email + hashed password + role)
 * stored in Sanity, guarded by an httpOnly signed session cookie.
 *
 * Roles:
 *   superadmin — full access, including Team & Access and Add Script
 *   seo        — can edit content, cannot delete anything, cannot access
 *                Team & Access or Add Script
 *
 * Bootstrap: if no adminUser documents exist yet (fresh install), login
 * falls back to the legacy ADMIN_EMAIL/ADMIN_PASSWORD env pair as a
 * superadmin — use it once to create real accounts on /admin-panel/users.
 * ===================================================================== */

export type Role = "superadmin" | "seo";
export type Session = { email: string; role: Role };

const COOKIE = "bfi_admin_session";

function signingKey(): string {
  // Reuses the Sanity write token as the HMAC key so no extra secret needs
  // provisioning; rotating that token also (harmlessly) invalidates sessions.
  return process.env.SANITY_API_TOKEN || process.env.ADMIN_PASSWORD || "bfi-admin-fallback";
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// ── Password hashing (scrypt, stdlib only) ──

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(candidate, hash);
}

export function credsConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

/** Verify submitted credentials against Sanity-stored users, falling back to
 *  the legacy env pair only when no accounts exist yet. */
export async function verifyCredentials(email: string, password: string): Promise<Session | null> {
  const users = await readAdminUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.length > 0) {
    const user = users.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
    if (user && verifyPassword(password, user.passwordHash)) {
      return { email: user.email, role: user.role };
    }
    return null;
  }

  // Bootstrap path — no accounts yet.
  const e = process.env.ADMIN_EMAIL ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!e || !p) return null;
  if (safeEqual(normalizedEmail, e.trim().toLowerCase()) && safeEqual(password, p)) {
    return { email: e, role: "superadmin" };
  }
  return null;
}

/** Set the session cookie after a successful login. */
export async function createSession(session: Session): Promise<void> {
  const payload = JSON.stringify(session);
  const token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete({ name: COOKIE, path: "/" });
}

/** Returns the current session, or null if absent/invalid/tampered. */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  if (!safeEqual(sig, sign(payload))) return null;
  try {
    const parsed = JSON.parse(payload) as Session;
    if (!parsed.email || (parsed.role !== "superadmin" && parsed.role !== "seo")) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

export async function isSuperadmin(): Promise<boolean> {
  return (await getSession())?.role === "superadmin";
}

export async function canDelete(): Promise<boolean> {
  return (await getSession())?.role === "superadmin";
}

export type { AdminUser };
