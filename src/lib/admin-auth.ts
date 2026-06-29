import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/* =====================================================================
 * Admin-panel auth — a single email+password (from env) guarded by an
 * httpOnly signed cookie. No DB, no extra deps.
 *
 * Env vars (set in Vercel):
 *   ADMIN_EMAIL    — login email
 *   ADMIN_PASSWORD — login password (also used as the HMAC signing key)
 * ===================================================================== */

const COOKIE = "bfi_admin_session";

function expectedToken(email: string, password: string): string {
  return createHmac("sha256", password).update(`bfi:${email}`).digest("hex");
}

export function credsConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

/** Verify submitted credentials against the env values (constant-time). */
export function verifyCredentials(email: string, password: string): boolean {
  const e = process.env.ADMIN_EMAIL ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!e || !p) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), e.trim().toLowerCase());
  const passOk = safeEqual(password, p);
  return emailOk && passOk;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Set the session cookie after a successful login. */
export async function createSession(): Promise<void> {
  const token = expectedToken(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin-panel",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** True if the current request carries a valid session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  if (!credsConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  const expected = expectedToken(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
  return safeEqual(token, expected);
}
