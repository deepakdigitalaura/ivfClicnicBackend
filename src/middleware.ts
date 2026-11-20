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
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto");
  // ponytail: proto === "http" force-redirect is disabled — on this
  // Cloudways Nginx->Varnish->Node chain, Varnish does not reliably forward
  // X-Forwarded-Proto: https through to Node, so every already-https request
  // was seen as "http" here and redirected to itself forever (outage
  // 2026-09-11). Re-enable only once Varnish's VCL is confirmed to forward
  // the header, or replace with a check that doesn't loop when the header
  // is simply wrong on this stack.
  if (host === "www.ivfclinic.com") {
    // Build the destination from scratch with a hardcoded public origin —
    // do NOT clone request.nextUrl and just swap the hostname. Behind the
    // Cloudways reverse proxy, request.nextUrl's protocol/port reflect what
    // the app itself was reached on internally (confirmed live: redirects
    // were pointing at "http://ivfclinic.com:3000", the container's internal
    // dev port, completely unreachable publicly) rather than the public
    // "https://ivfclinic.com" visitors actually use. Only the path and query
    // string come from the request; the origin is always the real one.
    // Same fix also covers plain-http requests (x-forwarded-proto: http) —
    // ivfclinic.com was serving full pages over http:// with no redirect
    // and no HSTS header.
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, "https://ivfclinic.com");
    return NextResponse.redirect(url, 301);
  }

  const rawPathname = request.nextUrl.pathname;
  const pathname = norm(rawPathname);
  const rules = await loadSanityRules();

  for (const rule of rules) {
    if (!rule.source || !rule.destination) continue;
    if (norm(rule.source) !== pathname) continue;
    // A rule whose destination normalizes to the same path as its source
    // (e.g. "/x/" -> "/x") would just redirect a page to itself once
    // trailing slashes are normalized on both sides above — skip it rather
    // than issuing a pointless (and potentially looping) redirect.
    if (!/^https?:\/\//i.test(rule.destination) && norm(rule.destination) === pathname) continue;

    if (/^https?:\/\//i.test(rule.destination)) {
      return NextResponse.redirect(rule.destination, { status: rule.permanent ? 301 : 302 });
    }
    const url = request.nextUrl.clone();
    url.pathname = rule.destination;
    return NextResponse.redirect(url, { status: rule.permanent ? 301 : 302 });
  }

  // No redirect rule matched. We used to 308 a trailing-slash request (e.g.
  // "/some-real-page/") to its slash-less form here — but the hosting layer
  // in front of this app has its own trailing-slash handling that conflicts
  // with that redirect, turning it into a self-redirect loop
  // ("/x/" -> "/x/" -> "/x/" ...), which made the slash form of every page
  // unreachable. Since we don't control that layer, we no longer redirect
  // for this case: both "/some-real-page" and "/some-real-page/" now render
  // the same page directly (Next's router already resolves either form to
  // the same route). The page's own <link rel="canonical"> tag (already
  // present sitewide, pointing at the slash-less form) tells search engines
  // which URL is authoritative, so this doesn't reintroduce a duplicate-
  // content problem — it just stops depending on a redirect that was being
  // broken outside this app.
  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets|studio|api|admin|.*\\.).*)"],
};
