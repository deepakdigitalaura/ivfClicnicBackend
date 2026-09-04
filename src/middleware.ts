import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Sanity-managed redirects — fetched from CDN and cached briefly in-memory.
// Existing treatment/calculator redirects are baked into next.config.mjs.
//
// NOTE: this cache is a plain module-level variable, not Next's fetch-tag
// cache — saveRedirects()'s revalidateTag() call does NOT reach it. Keep
// CACHE_TTL short so admin-panel edits take effect quickly rather than
// relying on invalidation that doesn't exist for this cache.

type SanityRule = { source: string; destination: string; permanent: boolean };

let ruleCache: { at: number; rules: SanityRule[] } | null = null;
const CACHE_TTL = 60_000; // 1 minute

async function loadSanityRules(): Promise<SanityRule[]> {
  if (ruleCache && Date.now() - ruleCache.at < CACHE_TTL) return ruleCache.rules;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  if (!projectId) return [];

  try {
    const query = encodeURIComponent(
      `*[_type == "redirectsConfig"][0]{rules[enabled == true]{source,destination,permanent}}`,
    );
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`,
    );
    if (!res.ok) return ruleCache?.rules ?? [];
    const data = (await res.json()) as { result?: { rules?: SanityRule[] } };
    const rules = data?.result?.rules ?? [];
    ruleCache = { at: Date.now(), rules };
    return rules;
  } catch {
    return ruleCache?.rules ?? [];
  }
}

const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // www.ivfclinic.com and ivfclinic.com currently serve identical content
  // with no redirect between them — Google treats this as duplicate content,
  // and the site's own canonical tag already declares non-www as correct.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  const rawPathname = request.nextUrl.pathname;
  const pathname = norm(rawPathname);
  const rules = await loadSanityRules();

  for (const rule of rules) {
    if (!rule.source || !rule.destination) continue;
    if (norm(rule.source) !== pathname) continue;
    // A rule whose destination normalizes to the same path as its source
    // (e.g. "/x/" -> "/x") is a self-redirect once trailing slashes are
    // normalized on both sides above — the trailing-slash fallback below
    // already covers that case, so skip it here instead of looping forever.
    if (!/^https?:\/\//i.test(rule.destination) && norm(rule.destination) === pathname) continue;

    if (/^https?:\/\//i.test(rule.destination)) {
      return NextResponse.redirect(rule.destination, { status: rule.permanent ? 301 : 302 });
    }
    const url = request.nextUrl.clone();
    url.pathname = rule.destination;
    return NextResponse.redirect(url, { status: rule.permanent ? 301 : 302 });
  }

  // No redirect rule matched. With `skipTrailingSlashRedirect` set in
  // next.config.mjs, Next no longer strips a trailing slash on our behalf —
  // this replaces that behaviour for everything else, so a request like
  // "/some-real-page/" still canonicalises to "/some-real-page" in one hop,
  // exactly as before. Root "/" is untouched (norm() already leaves it alone).
  if (rawPathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url, 308);
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets|studio|api|admin|.*\\.).*)"],
};
