/* =====================================================================
 * Cache-tag convention — single source of truth for Next cache tags.
 * ---------------------------------------------------------------------
 * Pure strings (no server-only) so both the data layer (unstable_cache)
 * and the revalidation hooks reference identical tags. Frozen convention,
 * reused by every future collection:
 *   - collection list : "<collection>"          e.g. "pages"
 *   - collection item : "<collection>:<slug>"    e.g. "pages:contact"
 *   - global          : "global:<slug>"          e.g. "global:site-settings"
 * ===================================================================== */
export const cacheTags = {
  collectionList: (collection: string) => collection,
  collectionItem: (collection: string, slug: string) => `${collection}:${slug}`,
  global: (slug: string) => `global:${slug}`,
};
