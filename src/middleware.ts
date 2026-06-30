import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Sanity-managed redirects — fetched from CDN and cached for 1 hour.
// Existing treatment/calculator redirects are baked into next.config.mjs.

type SanityRule = { source: string; destination: string; permanent: boolean };

let ruleCache: { at: number; rules: SanityRule[] } | null = null;
const CACHE_TTL = 3_600_000; // 1 hour

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
  const pathname = norm(request.nextUrl.pathname);
  const rules = await loadSanityRules();

  for (const rule of rules) {
    if (!rule.source || !rule.destination) continue;
    if (norm(rule.source) !== pathname) continue;

    if (/^https?:\/\//i.test(rule.destination)) {
      return NextResponse.redirect(rule.destination, { status: rule.permanent ? 301 : 302 });
    }
    const url = request.nextUrl.clone();
    url.pathname = rule.destination;
    return NextResponse.redirect(url, { status: rule.permanent ? 301 : 302 });
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|assets|studio|api|admin|.*\\.).*)"],
};
