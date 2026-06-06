/* NOTE: no `import "server-only"` here — this module is imported by the Payload
 * config (collections/globals), which the Payload CLI loads outside the Next
 * bundler where the server-only guard cannot resolve. It is server-context by
 * construction (collection hooks never run on the client). The hard boundary
 * guard lives in src/lib/payload.ts, which the config never imports. */
import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";
import { cacheTags } from "@/lib/cache-tags";

/**
 * Revalidation hook factories.
 *
 * On create/update/delete we bust the relevant Next cache tags so the Node
 * server regenerates the affected statically-cached routes on the next request
 * (on-demand ISR). `revalidateTag` must run inside a request scope (Payload's
 * REST/admin route handlers qualify); mutations made OUTSIDE that scope (e.g. a
 * CLI seed) are wrapped in `safe()` so they no-op instead of throwing.
 */
function safe(fn: () => void) {
  try {
    fn();
  } catch {
    // Called outside a Next request scope (CLI / standalone) — nothing to
    // revalidate there; ignore.
  }
}

/** afterChange + afterDelete hooks for a slug-keyed collection. */
export function revalidateCollection(collection: string) {
  const afterChange: CollectionAfterChangeHook = ({ doc }) => {
    safe(() => {
      revalidateTag(cacheTags.collectionList(collection));
      if (doc?.slug) revalidateTag(cacheTags.collectionItem(collection, doc.slug));
    });
    return doc;
  };
  const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
    safe(() => {
      revalidateTag(cacheTags.collectionList(collection));
      if (doc?.slug) revalidateTag(cacheTags.collectionItem(collection, doc.slug));
    });
    return doc;
  };
  return { afterChange: [afterChange], afterDelete: [afterDelete] };
}

/** afterChange hook for a global (busts its tag — which every consuming route shares). */
export function revalidateGlobal(slug: string) {
  const afterChange: GlobalAfterChangeHook = ({ doc }) => {
    safe(() => revalidateTag(cacheTags.global(slug)));
    return doc;
  };
  return { afterChange: [afterChange] };
}
