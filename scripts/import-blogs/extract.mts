/* =====================================================================
 * WordPress blog extraction + cleaning + HTML→Lexical conversion.
 * ---------------------------------------------------------------------
 * Fetches a post from the live ivfclinic.com WP REST API, strips the
 * WordPress/Elementor furniture that doesn't belong in the new template
 * (table-of-contents widget, the repeated "Author bio" block — we render
 * our own structured byline from the `authors` collection instead — the
 * FAQ toggle widget — extracted separately into structured `faqs` — and
 * the "Other blogs related to X" card grid — replaced by our own
 * data-driven "Keep Reading" section), then converts the remaining real
 * article body into Payload's default Lexical JSON shape by hand (no
 * Payload runtime needed, so this can run as a plain tsx script).
 *
 * Internal links are best-effort rewritten to this project's own routes
 * (treatment pages, /contact, etc.) via TREATMENTS/CITIES; anything that
 * doesn't match a known route is left pointing at the live ivfclinic.com
 * page it already points to, so nothing is ever a dead link.
 * ===================================================================== */
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { TREATMENTS } from "@/lib/treatments";
import { CITIES, cityUrl } from "@/lib/locations";

const WP_BASE = "https://ivfclinic.com";

export type Faq = { question: string; answer: string };

export type ExtractedPost = {
  slug: string;
  title: string;
  excerpt: string;
  heroImageUrl: string | null;
  heroImageAlt: string;
  categoryName: string | null;
  datePublished: string;
  dateModified: string;
  lexicalBody: Record<string, unknown>;
  faqs: Faq[];
  /** Inline content images discovered in the body (rare in this content set). */
  inlineImages: { src: string; alt: string }[];
  wordCount: number;
};

/* ---------- WP fetch ---------- */

export async function fetchWpPost(slug: string): Promise<any> {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
  if (!res.ok) throw new Error(`WP fetch failed for "${slug}": HTTP ${res.status}`);
  const arr = (await res.json()) as any[];
  if (!arr.length) throw new Error(`WP post not found for slug "${slug}"`);
  return arr[0];
}

/* ---------- internal link resolution ---------- */

const MANUAL_ALIASES: Record<string, string> = {
  "cryopreservation-of-embryos": "/cryopreservation",
  "contact-us": "/contact",
  "what-is-ivf": "/what-is-ivf",
  "": "/",
};

function buildTreatmentPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const t of TREATMENTS) {
    const href = t.href; // e.g. "/pcos", "/what-is-ivf", "/#treatments"
    if (!href.startsWith("/") || href.includes("#")) continue;
    const path = href.replace(/^\/|\/$/g, "");
    if (path) map.set(path, href);
  }
  return map;
}

function buildLocationPathMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of CITIES) {
    const href = cityUrl(c.slug);
    map.set(href.replace(/^\/|\/$/g, ""), href);
  }
  return map;
}

const TREATMENT_PATHS = buildTreatmentPathMap();
const LOCATION_PATHS = buildLocationPathMap();

/** Resolve a WP-content href to this project's internal route when known;
 *  otherwise leave it pointing at the live ivfclinic.com page (never a dead link). */
export function rewriteHref(href: string): string {
  let url: URL;
  try {
    url = new URL(href, WP_BASE);
  } catch {
    return href;
  }
  if (url.hostname.replace(/^www\./, "") !== "ivfclinic.com") return href; // external — leave untouched
  const path = url.pathname.replace(/^\/|\/$/g, "");
  if (path in MANUAL_ALIASES) return MANUAL_ALIASES[path];
  if (TREATMENT_PATHS.has(path)) return TREATMENT_PATHS.get(path)!;
  if (LOCATION_PATHS.has(path)) return LOCATION_PATHS.get(path)!;
  return url.toString(); // unmapped — keep absolute link to the live site
}

/* ---------- Lexical node builders (Payload default lexicalEditor shape) ---------- */

type LexicalNode = Record<string, unknown>;

const textNode = (text: string, format = 0): LexicalNode => ({
  type: "text",
  text,
  version: 1,
  detail: 0,
  format,
  mode: "normal",
  style: "",
});

const linebreakNode = (): LexicalNode => ({ type: "linebreak", version: 1 });

const linkNode = (url: string, children: LexicalNode[]): LexicalNode => ({
  type: "link",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  fields: { linkType: "custom", url, newTab: !url.startsWith("/") },
  children,
});

const paragraphNode = (children: LexicalNode[]): LexicalNode => ({
  type: "paragraph",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  textFormat: 0,
  textStyle: "",
  children,
});

const headingNode = (tag: "h2" | "h3" | "h4", children: LexicalNode[]): LexicalNode => ({
  type: "heading",
  tag,
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  children,
});

const listNode = (ordered: boolean, children: LexicalNode[]): LexicalNode => ({
  type: "list",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  listType: ordered ? "number" : "bullet",
  tag: ordered ? "ol" : "ul",
  start: 1,
  children,
});

const listItemNode = (value: number, children: LexicalNode[]): LexicalNode => ({
  type: "listitem",
  version: 1,
  format: "",
  indent: 0,
  direction: "ltr",
  value,
  children,
});

/* ---------- inline (text-level) HTML → Lexical ---------- */

const BOLD = 1;
const ITALIC = 2;

function isBoldStyle(style: string | undefined): boolean {
  if (!style) return false;
  const m = /font-weight:\s*([0-9]+|bold)/i.exec(style);
  if (!m) return false;
  if (/bold/i.test(m[1])) return true;
  return Number(m[1]) >= 600;
}

/** Walk inline children of an element, returning a flat list of text/link/linebreak nodes. */
function parseInline($: cheerio.CheerioAPI, el: AnyNode, format = 0): LexicalNode[] {
  const out: LexicalNode[] = [];
  const children = ($ as any)(el).contents().toArray() as AnyNode[];
  for (const node of children) {
    if (node.type === "text") {
      const raw = (node as any).data as string;
      const text = raw.replace(/\s+/g, " ");
      if (text.trim().length === 0 && !/^\s+$/.test(text)) continue;
      if (text === "") continue;
      out.push(textNode(text, format));
      continue;
    }
    if (node.type !== "tag") continue;
    const tag = (node as any).name as string;
    const $el = ($ as any)(node);
    if (tag === "br") {
      out.push(linebreakNode());
      continue;
    }
    if (tag === "b" || tag === "strong") {
      out.push(...parseInline($, node, format | BOLD));
      continue;
    }
    if (tag === "i" || tag === "em") {
      out.push(...parseInline($, node, format | ITALIC));
      continue;
    }
    if (tag === "a") {
      // Some WP content has malformed hrefs with raw spaces (e.g. "tel: 079 4040
      // 4646") which fail Payload's link-field URL validation outright — strip
      // all whitespace; real URLs never contain literal spaces.
      const href = ($el.attr("href") || "").replace(/\s+/g, "");
      const inner = parseInline($, node, format);
      if (!href || inner.length === 0) {
        out.push(...inner);
        continue;
      }
      out.push(linkNode(rewriteHref(href), inner));
      continue;
    }
    if (tag === "span") {
      const nextFormat = isBoldStyle($el.attr("style")) ? format | BOLD : format;
      out.push(...parseInline($, node, nextFormat));
      continue;
    }
    // Unknown inline wrapper — recurse into its children with the same format.
    out.push(...parseInline($, node, format));
  }
  return out;
}

/* ---------- block-level HTML → Lexical ---------- */

function blockToNode($: cheerio.CheerioAPI, el: AnyNode): LexicalNode | null {
  const tag = (el as any).name as string;
  if (tag === "h2" || tag === "h3" || tag === "h4") {
    const children = parseInline($, el);
    if (!children.length) return null;
    return headingNode(tag as "h2" | "h3" | "h4", children);
  }
  if (tag === "p") {
    const children = parseInline($, el);
    if (!children.length) return null;
    return paragraphNode(children);
  }
  if (tag === "ul" || tag === "ol") {
    const items: LexicalNode[] = [];
    ($ as any)(el)
      .children("li")
      .each((i: number, li: AnyNode) => {
        const children = parseInline($, li);
        if (children.length) items.push(listItemNode(i + 1, children));
      });
    if (!items.length) return null;
    return listNode(tag === "ol", items);
  }
  return null;
}

/** Convert a cleaned HTML fragment (the real article body) into a Lexical root. */
export function htmlToLexical(html: string): Record<string, unknown> {
  const $ = cheerio.load(html);
  const children: LexicalNode[] = [];
  $("body")
    .find("h2,h3,h4,p,ul,ol")
    .each((_, el) => {
      // Skip nodes nested inside a list/heading we already captured whole (e.g. a
      // stray <p> inside a <li>, which this content set doesn't really have, but
      // guards against double-counting if it ever does).
      const $el = $(el);
      if ($el.parents("ul,ol").length && el.name === "p") return;
      const node = blockToNode($, el);
      if (node) children.push(node);
    });
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children,
    },
  };
}

/* ---------- cleaning + extraction ---------- */

const decodeEntities = (s: string): string =>
  s
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…");

/** Cut the raw WP content at the first "Author bio" heading — everything
 *  after that (author box, FAQ toggle widget, related-posts grid) is WP
 *  furniture we replace with our own structured fields. */
function cutAtAuthorBio(raw: string): string {
  const m = /<h[23][^>]*>(?:(?!<\/h[23]>)[\s\S])*?Author\s*bio(?:(?!<\/h[23]>)[\s\S])*?<\/h[23]>/i.exec(raw);
  return m ? raw.slice(0, m.index) : raw;
}

/** Extract FAQ question/answer pairs from the Elementor "toggle" accordion
 *  widget that follows the Author bio block on every post. */
function extractFaqs(raw: string): Faq[] {
  const $ = cheerio.load(raw);
  const faqs: Faq[] = [];
  $(".elementor-toggle-item").each((_, item) => {
    const $item = $(item);
    const question = decodeEntities($item.find(".elementor-toggle-title").first().text().trim());
    const $answerEl = $item.find(".elementor-tab-content").first();
    const paras = $answerEl
      .find("p")
      .toArray()
      .map((p) => decodeEntities($(p).text().replace(/\s+/g, " ").trim()))
      .filter(Boolean);
    const answer = paras.length ? paras.join("\n\n") : decodeEntities($answerEl.text().replace(/\s+/g, " ").trim());
    if (question && answer) faqs.push({ question, answer });
  });
  return faqs;
}

function plainTextExcerpt(bodyHtml: string, maxLen = 160): string {
  const $ = cheerio.load(bodyHtml);
  const text = decodeEntities($("p").first().text().replace(/\s+/g, " ").trim());
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
}

function wordCount(bodyHtml: string): number {
  const $ = cheerio.load(bodyHtml);
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

export async function extract(slug: string): Promise<ExtractedPost> {
  const post = await fetchWpPost(slug);
  const rawTitle = decodeEntities(String(post.title?.rendered ?? "").trim());
  const rawContent = String(post.content?.rendered ?? "");

  const articleHtml = cutAtAuthorBio(rawContent);
  const $article = cheerio.load(articleHtml);
  $article("#ez-toc-container, .ez-toc-v2_0_80, script, style").remove();
  const cleanedArticleHtml = $article("body").html() ?? "";

  const lexicalBody = htmlToLexical(cleanedArticleHtml);
  const faqs = extractFaqs(rawContent);
  const excerpt = plainTextExcerpt(cleanedArticleHtml);

  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  const heroImageUrl: string | null = featured?.source_url ?? featured?.media_details?.sizes?.full?.source_url ?? null;
  const heroImageAlt = decodeEntities(String(featured?.alt_text || rawTitle));

  const terms: any[] = (post._embedded?.["wp:term"] ?? []).flat();
  const category = terms.find((t) => t.taxonomy === "category");
  const categoryName: string | null = category ? decodeEntities(String(category.name)) : null;

  const inlineImages: { src: string; alt: string }[] = [];
  $article("img").each((_, img) => {
    const $img = $article(img);
    const src = $img.attr("src");
    if (src) inlineImages.push({ src, alt: decodeEntities($img.attr("alt") || rawTitle) });
  });

  return {
    slug,
    title: rawTitle,
    excerpt,
    heroImageUrl,
    heroImageAlt,
    categoryName,
    datePublished: post.date,
    dateModified: post.modified,
    lexicalBody,
    faqs,
    inlineImages,
    wordCount: wordCount(cleanedArticleHtml),
  };
}
