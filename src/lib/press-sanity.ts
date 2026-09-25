import "server-only";
import { getSanityPress } from "@/sanity/lib/fetch";
import type { PressClipping } from "@/lib/press";

/** Sanity-backed replacement for PRESS_CLIPPINGS — fetches from the `press`
 *  collection and maps each doc into the exact PressClipping shape, so
 *  PressPage/PressArticlePage need no changes. `image`/`thumb` are plain
 *  URL strings for both migrated legacy clippings (public-folder path) and
 *  new ones added via the admin panel (Sanity CDN URL).
 *
 * Deliberately kept in its own module (not src/lib/press.ts) — press.ts is
 * imported by client components (home-page.tsx, press-page.tsx) for the
 * PRESS_CLIPPINGS/pressHref exports, and importing this "server-only" fetch
 * chain from there would break the client bundle even via a dynamic import,
 * since Next's server/client graph check follows all reachable imports. */
export async function getPressClippings(): Promise<PressClipping[]> {
  const docs = await getSanityPress();
  return docs
    .filter((d): d is typeof d & { slug: string; headline: string; publication: string; language: "English" | "Gujarati"; summary: string; image: string; thumb: string } =>
      Boolean(d.slug && d.headline && d.publication && d.language && d.summary && d.image && d.thumb),
    )
    .map((d) => ({
      slug: d.slug,
      headline: d.headline,
      headlineOriginal: d.headlineOriginal ?? undefined,
      standfirst: d.standfirst ?? undefined,
      publication: d.publication,
      edition: d.edition ?? undefined,
      date: d.date ?? undefined,
      byline: d.byline ?? undefined,
      language: d.language,
      summary: d.summary,
      bodyText: d.bodyText ?? [],
      doctorsQuoted: d.doctorsQuoted ?? [],
      image: d.image,
      thumb: d.thumb,
      width: d.width ?? 0,
      height: d.height ?? 0,
    }));
}
