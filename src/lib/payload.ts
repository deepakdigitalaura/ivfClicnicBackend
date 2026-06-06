/* =====================================================================
 * Server-side Payload access (local API).
 * ---------------------------------------------------------------------
 * Payload's local API talks to Postgres directly — server only, never the
 * client. The instance is memoised so repeated calls in one runtime reuse a
 * single connection pool. Used by server components / generateMetadata to
 * read CMS content; the existing templates stay client components and receive
 * the data as props.
 * ===================================================================== */
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import type { Page } from "@/payload-types";

let cached: Promise<Payload> | null = null;

export function payloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

/**
 * Fetch a single Page by slug. Returns null if not found (caller decides the
 * fallback). Public/unauthenticated context → access control returns only
 * published docs, so drafts never leak to the live site.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1, // resolve ogImage upload relation
  });
  return res.docs[0] ?? null;
}
