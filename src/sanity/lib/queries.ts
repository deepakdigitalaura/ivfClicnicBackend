// Singleton documents use a fixed _id so there is always exactly one per type.
export const ROBOTS_QUERY = `*[_type == "robotsConfig"][0]`;
export const SCRIPTS_QUERY = `*[_type == "scriptsConfig"][0]`;
export const REDIRECTS_QUERY = `*[_type == "redirectsConfig"][0]{rules}`;
export const SITEMAP_QUERY = `*[_type == "sitemapConfig"][0]`;
export const SCHEMA_ORG_QUERY = `*[_type == "schemaOrgConfig"][0]`;
export const PAGE_SEO_BY_PATH_QUERY = `*[_type == "pageSeo" && pagePath == $path][0]`;
export const ALL_PAGE_SEO_QUERY = `*[_type == "pageSeo"]{pagePath, pageName, metaTitle, metaDescription}`;

// Admin-accumulated Google reviews for one centre/"brand" key. New fetches get
// today's fetchedAt, so ordering by fetchedAt puts the newest batch on top
// regardless of the reviews' own (older) publish dates.
export const REVIEWS_BY_KEY_QUERY = `{
  "meta": *[_type == "reviewMeta" && centreSlug == $key][0]{ratingValue, reviewCount, mapsUrl},
  "reviews": *[_type == "googleReview" && centreSlug == $key] | order(fetchedAt desc, publishedAt desc)[0...24]{
    author, rating, text, "publishedAtISO": publishedAt, relativeTime, profilePhoto, manual
  }
}`;
