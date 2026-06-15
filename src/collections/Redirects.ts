import type { CollectionConfig } from "payload";
import { isAdmin, isEditor } from "@/access/roles";
import { revalidateRelated } from "@/lib/revalidate";

/**
 * Redirects (SEO tools, Phase B.3) — a simple 301/302 manager for staff. When a
 * page is renamed or removed, add a redirect so old links (and search-engine
 * equity) land on the new address instead of a 404.
 *
 * Application: `src/middleware.ts` looks up the incoming path against the ENABLED
 * redirects (served as a cached JSON map by `/redirect-map`, busted on edit via
 * the `redirects` tag). The collection itself only stores the rules.
 *
 * `from` is normalised (leading slash, no trailing slash) on save so lookups are
 * exact, and a rule may not point to itself (loop guard).
 */

/** Normalise a stored path: ensure a leading slash, drop a trailing slash
 *  (except root). Full URLs (http/https) are left untouched. Pure — safe in the
 *  config bundle (no server-only). */
const normalizePath = (p: string): string => {
  let s = (p ?? "").trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1) s = s.replace(/\/+$/, "");
  return s;
};

export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: { singular: "Redirect", plural: "Redirects" },
  admin: {
    useAsTitle: "from",
    defaultColumns: ["from", "to", "type", "enabled"],
    group: "SEO Tools",
    description:
      "Send an old or changed web address to a new one (e.g. after renaming a page) so visitors and search engines never hit a dead link.",
  },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isAdmin },
  hooks: {
    // Store `from`/`to` in a canonical shape so middleware lookups are exact.
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (typeof data.from === "string") data.from = normalizePath(data.from);
        if (typeof data.to === "string") data.to = normalizePath(data.to);
        return data;
      },
    ],
    // Bust the cached redirect map (read by /redirect-map → middleware) on edit.
    ...revalidateRelated(["redirects"]),
  },
  fields: [
    {
      name: "from",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Old address (From)",
      admin: { description: "The path to redirect FROM, e.g. /old-page. Must start with /." },
    },
    {
      name: "to",
      type: "text",
      required: true,
      label: "New address (To)",
      validate: (value: string | null | undefined, { data }: { data?: Partial<{ from: string }> }) => {
        if (!value || !value.trim()) return "Please enter where this redirect should go.";
        if (normalizePath(value) === data?.from) return "The 'To' address must be different from the 'From' address.";
        return true;
      },
      admin: { description: "Where to send visitors — a path like /new-page, or a full https:// address." },
    },
    {
      name: "type",
      type: "select",
      defaultValue: "301",
      required: true,
      label: "Redirect type",
      options: [
        { label: "Permanent (301) — recommended", value: "301" },
        { label: "Temporary (302)", value: "302" },
      ],
      admin: { description: "Permanent (301) for renamed/moved pages. Temporary (302) only for short-term diversions." },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      label: "Active",
      admin: { description: "Untick to switch this redirect off without deleting it." },
    },
    {
      name: "note",
      type: "text",
      label: "Note (optional)",
      admin: { description: "A reminder of why this redirect exists, for your team." },
    },
  ],
};
