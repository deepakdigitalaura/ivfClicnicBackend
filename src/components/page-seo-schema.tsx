import { getPageSeo } from "@/sanity/lib/fetch";

/** Renders the page-specific custom JSON-LD set in the admin's Page SEO
 *  section (by exact path), if any. Silently skipped when unset or invalid. */
export async function PageSeoSchema({ path }: { path: string }) {
  const o = await getPageSeo(path);
  const raw = o?.customSchemaJson?.trim();
  if (!raw) return null;

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const data = parsed["@context"] ? parsed : { "@context": "https://schema.org", ...parsed };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
