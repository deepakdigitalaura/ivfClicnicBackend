/**
 * Resize a Sanity CDN image at the URL.
 *
 * Images uploaded through the admin panel are stored at whatever size they were
 * uploaded at, and several are 1500-1600px PNGs weighing 1.8-2.2 MB each. Where
 * such a URL is handed straight to an `<img src>` the browser downloads all of
 * it — on /blogs four of these together came to about 7.9 MB for thumbnails
 * displayed at roughly 450px wide.
 *
 * Sanity's CDN resizes and re-encodes on request, so the fix is a query string
 * rather than a pipeline: that same 2,192 KB PNG comes back as a 27 KB WebP at
 * `?w=800&fm=webp&q=75`.
 *
 * Next's own `/_next/image` would also work, but it would mean routing an
 * external host through the optimiser and paying for the transform on our
 * server; Sanity already does it for free, at the edge, on a URL we control.
 *
 * Anything that is not a Sanity CDN URL is returned untouched, so this is safe
 * to wrap around a field that might hold a local `/assets/...` path instead.
 */
export function sanityImg(url: string | null | undefined, width: number, quality = 75): string {
  if (!url) return "";
  if (!url.includes("cdn.sanity.io")) return url;
  // A URL that already carries parameters was sized deliberately somewhere else.
  if (url.includes("?")) return url;
  return `${url}?w=${width}&fm=webp&q=${quality}`;
}

/** The `srcset` companion, for images that need to look right on a 2x screen. */
export function sanityImgSrcSet(url: string | null | undefined, width: number, quality = 75): string | undefined {
  if (!url || !url.includes("cdn.sanity.io") || url.includes("?")) return undefined;
  return `${sanityImg(url, width, quality)} 1x, ${sanityImg(url, width * 2, quality)} 2x`;
}
