/* =====================================================================
 * SEO parity extractor (shared by snapshot.mjs + diff.mjs).
 * ---------------------------------------------------------------------
 * Pulls the SEO-relevant surface out of a rendered HTML string in a
 * NORMALISED, deterministic form so two renders can be compared exactly:
 *   - title
 *   - meta[name=...] and meta[property=...]  (description, og:*, twitter:*, robots…)
 *   - link[rel=canonical]
 *   - every <script type="application/ld+json"> (parsed + deep key-sorted)
 *   - the set of internal links (href starting with "/" or the site origin)
 * Zero dependencies (regex-based) — robust enough for our static markup.
 * ===================================================================== */

const SITE_ORIGIN = "https://ivfclinic.com";

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/* JSON-LD keys whose VALUE is a data-driven timestamp (content freshness),
 * NOT a code-defined SEO fact. `dateModified` is sourced from the row's
 * `updatedAt`, which a harmless content re-save bumps — so its exact instant is
 * meaningless for *code* regression testing and was the source of the
 * seo:diff "dateModified flake". We do NOT drop the field: we canonicalise a
 * VALID ISO-8601 instant to a stable token so harmless re-saves stop tripping
 * the gate, while still asserting the field is PRESENT and well-formed. If the
 * field disappears, or stops being a real ISO datetime, the token is not
 * substituted and the change still surfaces as a diff — preserving real
 * regression detection (e.g. a refactor that breaks date emission). */
const VOLATILE_DATE_KEYS = new Set(["dateModified"]);
const ISO_DATE_TOKEN = "<iso8601>";
const isIsoDateTime = (v) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v) && !Number.isNaN(Date.parse(v));

/** Recursively sort object keys so JSON.stringify is order-independent, and
 *  canonicalise volatile date values (see VOLATILE_DATE_KEYS) to a token. */
function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        const v = value[k];
        acc[k] = VOLATILE_DATE_KEYS.has(k) && isIsoDateTime(v) ? ISO_DATE_TOKEN : sortDeep(v);
        return acc;
      }, {});
  }
  return value;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decode(m[1].trim()) : null;
}

function extractMetas(html) {
  const metas = {};
  const re = /<meta\s+([^>]*?)\/?>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const name = /(?:name|property)\s*=\s*"([^"]+)"/i.exec(attrs);
    const content = /content\s*=\s*"([^"]*)"/i.exec(attrs);
    if (name && content) metas[name[1]] = decode(content[1]);
  }
  // Drop volatile/non-SEO metas if any appear (none expected today).
  delete metas["next-size-adjust"];
  return Object.keys(metas).sort().reduce((a, k) => ((a[k] = metas[k]), a), {});
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i);
  return m ? decode(m[1]) : null;
}

function extractJsonLd(html) {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(sortDeep(JSON.parse(m[1].trim())));
    } catch {
      blocks.push({ __unparseable__: m[1].trim().slice(0, 200) });
    }
  }
  // Sort blocks by their stringified form for order-independence.
  return blocks
    .map((b) => JSON.stringify(b))
    .sort()
    .map((s) => JSON.parse(s));
}

function extractInternalLinks(html) {
  const re = /<a\s+[^>]*href="([^"]+)"/gi;
  const set = new Set();
  let m;
  while ((m = re.exec(html))) {
    let href = decode(m[1]);
    if (href.startsWith(SITE_ORIGIN)) href = href.slice(SITE_ORIGIN.length) || "/";
    if (href.startsWith("/")) set.add(href);
  }
  return [...set].sort();
}

export function extractSeo(html) {
  return {
    title: extractTitle(html),
    canonical: extractCanonical(html),
    meta: extractMetas(html),
    jsonLd: extractJsonLd(html),
    internalLinks: extractInternalLinks(html),
  };
}
