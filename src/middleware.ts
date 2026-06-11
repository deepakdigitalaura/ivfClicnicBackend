import { NextResponse, type NextRequest } from "next/server";

/* =====================================================================
 * Redirect middleware (Phase B.3) — applies the CMS-managed 301/302 rules.
 * ---------------------------------------------------------------------
 * Edge middleware can't reach the database, so it fetches the redirect map
 * from the cached `/redirect-map` route. To avoid a subrequest on every page
 * view, the fetched map is memoised in module scope with a short TTL; edits
 * still propagate within TTL (and the route's own cache is busted on save).
 *
 * The matcher below skips Next internals, the admin/api, uploads, static files
 * and the map route itself — so middleware only runs on real page requests and
 * never loops through its own fetch.
 * ===================================================================== */

type RedirectRule = { to: string; permanent: boolean };
type RedirectMap = Record<string, RedirectRule>;

const TTL_MS = 60_000;
let cache: { at: number; map: RedirectMap } | null = null;

async function loadMap(origin: string): Promise<RedirectMap> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.map;
  try {
    const res = await fetch(`${origin}/redirect-map`, { headers: { "x-mw-redirect": "1" } });
    if (!res.ok) return cache?.map ?? {};
    const map = (await res.json()) as RedirectMap;
    cache = { at: Date.now(), map };
    return map;
  } catch {
    // Endpoint unreachable (e.g. boot) → reuse last good map, else no-op.
    return cache?.map ?? {};
  }
}

/** Drop a trailing slash (except root) so lookups match the stored shape. */
const norm = (p: string): string => (p.length > 1 && p.endsWith("/") ? p.replace(/\/+$/, "") : p);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, origin, search } = req.nextUrl;
  const map = await loadMap(origin);
  const rule = map[norm(pathname)];
  if (!rule) return NextResponse.next();

  const isAbsolute = /^https?:\/\//i.test(rule.to);
  const target = isAbsolute ? rule.to : `${origin}${rule.to}${search}`;
  // 308/307 preserve the method; permanent flag distinguishes 301-equivalent.
  return NextResponse.redirect(target, rule.permanent ? 308 : 307);
}

export const config = {
  // Run on page-like requests only: exclude Next internals, admin/api, uploads,
  // the map route, and anything with a file extension (static assets).
  matcher: ["/((?!_next/|api|admin|media/|assets/|redirect-map|.*\\.).*)"],
};
