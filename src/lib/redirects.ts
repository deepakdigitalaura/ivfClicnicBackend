/* =====================================================================
 * Redirect map (server) — the ENABLED redirects shaped into a flat
 * { from → { to, permanent } } lookup, cached + tagged `redirects`.
 * ---------------------------------------------------------------------
 * Read by the `/redirect-map` route handler, which `src/middleware.ts` fetches
 * (edge can't touch the DB) to apply 301/302s. The expensive DB read is cached
 * via unstable_cache; the `redirects` collection hook busts the tag on edit so
 * changes propagate without a deploy.
 * ===================================================================== */
import "server-only";
import { unstable_cache } from "next/cache";
import { payloadClient } from "@/lib/payload";
import { cacheTags } from "@/lib/cache-tags";

export type RedirectRule = { to: string; permanent: boolean };
export type RedirectMap = Record<string, RedirectRule>;

/** Match the collection's stored shape: leading slash, no trailing slash. */
const normalizePath = (p: string): string => {
  let s = (p ?? "").trim();
  if (!s) return s;
  if (/^https?:\/\//i.test(s)) return s;
  if (!s.startsWith("/")) s = `/${s}`;
  if (s.length > 1) s = s.replace(/\/+$/, "");
  return s;
};

export const getRedirectMap = (): Promise<RedirectMap> =>
  unstable_cache(
    async () => {
      try {
        const payload = await payloadClient();
        const res = await payload.find({
          collection: "redirects",
          where: { enabled: { equals: true } },
          limit: 1000,
          depth: 0,
          overrideAccess: true,
        });
        const map: RedirectMap = {};
        for (const d of res.docs as { from?: string; to?: string; type?: string }[]) {
          const from = normalizePath(d.from ?? "");
          const to = (d.to ?? "").trim();
          if (!from || !to || from === to) continue;
          map[from] = { to, permanent: d.type !== "302" };
        }
        return map;
      } catch {
        // Table not pushed yet / read error → no redirects (site still serves).
        return {};
      }
    },
    ["redirect-map"],
    { tags: [cacheTags.collectionList("redirects")] },
  )();
