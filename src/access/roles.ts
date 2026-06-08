import type { Access, FieldAccess, PayloadRequest } from "payload";

/* =====================================================================
 * Role-based access helpers (Phase 3.5B, Item 0).
 * ---------------------------------------------------------------------
 * Pure functions (no server-only / no next imports) — safe to import from
 * collection/global configs, which the Payload CLI loads outside the bundler.
 * Roles live on `users.roles` (saveToJWT) so req.user.roles is available here.
 *   - admin  : full access (globals, users, structure)
 *   - editor : day-to-day content (blogs, pages content, authors, categories, media)
 * ===================================================================== */
type Role = "admin" | "editor";

const hasRole = (user: unknown, role: Role): boolean => {
  const roles = (user as { roles?: unknown } | null | undefined)?.roles;
  return Array.isArray(roles) && roles.includes(role);
};

/** Admin role only. */
export const isAdmin: Access = ({ req }) => hasRole(req.user, "admin");

/** Editor or Admin. */
export const isEditor: Access = ({ req }) =>
  hasRole(req.user, "admin") || hasRole(req.user, "editor");

/** Panel-access gate (Editor or Admin). Typed to return a plain boolean
 *  because Payload's collection `access.admin` does not accept a Where query. */
export const canAccessPanel = ({ req }: { req: PayloadRequest }): boolean =>
  hasRole(req.user, "admin") || hasRole(req.user, "editor");

/** Field-level guard (admin only) — used to lock the `roles` field itself
 *  so an editor can never escalate their own privileges. */
export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, "admin");
