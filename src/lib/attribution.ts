/* =====================================================================
 * Lead attribution — where an enquiry actually came from.
 * ---------------------------------------------------------------------
 * Until now an inquiry recorded only the page its form sat on, which told
 * us nothing about the channel that brought the person. This classifies the
 * visit instead: Google organic, Google Ads, Bing, an AI assistant, social,
 * a referral, or direct.
 *
 * The work has to happen on the LANDING page, not the form page. By the time
 * someone reaches /contact, document.referrer is an internal URL and the
 * original source is gone — so the visit is captured once, on arrival, and
 * carried forward in sessionStorage.
 *
 * Two touches are kept:
 *   firstTouch  the first visit we ever saw from this browser (localStorage)
 *   lastTouch   the visit that produced this enquiry (sessionStorage)
 * Most enquiries show the same value for both; where they differ, the pair
 * tells you what found them versus what brought them back.
 * ===================================================================== */

export type Channel =
  | "google-ads"
  | "google-organic"
  | "bing-organic"
  | "ai-assistant"
  | "social"
  | "email"
  | "referral"
  | "direct"
  | "internal";

export type Attribution = {
  channel: Channel;
  /** Human label for the admin list, e.g. "Organic Search (Google)". */
  label: string;
  /** The specific platform where we know it: "ChatGPT", "Perplexity", "Facebook". */
  detail?: string;
  referrer?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  capturedAt?: string;
};

/* AI assistants send ordinary referrers, so they are only distinguishable by
 * hostname. Kept as a list because it grows every few months. */
const AI_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$/i, "ChatGPT"],
  [/(^|\.)chat\.openai\.com$/i, "ChatGPT"],
  [/(^|\.)openai\.com$/i, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/i, "Perplexity"],
  [/(^|\.)gemini\.google\.com$/i, "Gemini"],
  [/(^|\.)bard\.google\.com$/i, "Gemini"],
  [/(^|\.)claude\.ai$/i, "Claude"],
  [/(^|\.)copilot\.microsoft\.com$/i, "Microsoft Copilot"],
  [/(^|\.)bing\.com$/i, "__bing__"], // resolved below: Copilot vs Bing search
  [/(^|\.)you\.com$/i, "You.com"],
  [/(^|\.)poe\.com$/i, "Poe"],
  [/(^|\.)grok\.com$/i, "Grok"],
  [/(^|\.)deepseek\.com$/i, "DeepSeek"],
];

const SOCIAL_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)facebook\.com$/i, "Facebook"],
  [/(^|\.)fb\.com$/i, "Facebook"],
  [/(^|\.)instagram\.com$/i, "Instagram"],
  [/(^|\.)youtube\.com$/i, "YouTube"],
  [/(^|\.)linkedin\.com$/i, "LinkedIn"],
  [/(^|\.)t\.co$/i, "X (Twitter)"],
  [/(^|\.)x\.com$/i, "X (Twitter)"],
  [/(^|\.)twitter\.com$/i, "X (Twitter)"],
  [/(^|\.)wa\.me$/i, "WhatsApp"],
  [/(^|\.)whatsapp\.com$/i, "WhatsApp"],
  [/(^|\.)pinterest\./i, "Pinterest"],
  [/(^|\.)reddit\.com$/i, "Reddit"],
  [/(^|\.)quora\.com$/i, "Quora"],
];

const SEARCH_HOSTS: Array<[RegExp, Channel, string]> = [
  [/(^|\.)google\./i, "google-organic", "Google"],
  [/(^|\.)duckduckgo\.com$/i, "referral", "DuckDuckGo"],
  [/(^|\.)yahoo\./i, "referral", "Yahoo"],
  [/(^|\.)ecosia\.org$/i, "referral", "Ecosia"],
  [/(^|\.)brave\.com$/i, "referral", "Brave Search"],
];

const OUR_HOSTS = /(^|\.)ivfclinic\.com$/i;

function host(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const match = <T,>(h: string, table: Array<[RegExp, T]>): T | undefined =>
  table.find(([re]) => re.test(h))?.[1];

/**
 * Work out the channel from a referrer and the landing URL's query string.
 * Paid beats organic: a gclid means Google Ads even though the referrer is
 * google.com, which is exactly the case a referrer-only reading gets wrong.
 */
export function classify(referrer: string, search: string): Attribution {
  const params = new URLSearchParams(search || "");
  const get = (k: string) => params.get(k)?.trim() || undefined;

  const utmSource = get("utm_source");
  const utmMedium = get("utm_medium");
  const gclid = get("gclid") || get("wbraid") || get("gbraid");
  const fbclid = get("fbclid");
  const h = host(referrer);

  const base: Attribution = {
    channel: "direct",
    label: "Direct",
    referrer: referrer || undefined,
    utmSource,
    utmMedium,
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    gclid,
    capturedAt: new Date().toISOString(),
  };

  // 1. Paid click ids are the most reliable signal there is.
  if (gclid || utmMedium === "cpc" || utmMedium === "ppc" || utmMedium === "paid") {
    return { ...base, channel: "google-ads", label: "Google Ads", detail: get("utm_campaign") };
  }
  if (fbclid) {
    return { ...base, channel: "social", label: "Social", detail: "Facebook (paid or organic)" };
  }

  // 2. An explicit utm_source the campaign author set.
  if (utmSource && !/^google$/i.test(utmSource)) {
    const medium = utmMedium ? ` (${utmMedium})` : "";
    if (/mail|newsletter/i.test(`${utmSource}${utmMedium ?? ""}`)) {
      return { ...base, channel: "email", label: "Email", detail: utmSource };
    }
    return { ...base, channel: "referral", label: `Campaign${medium}`, detail: utmSource };
  }

  // 3. No referrer at all: typed, bookmarked, or stripped by the browser.
  if (!h) return base;

  // 4. Our own pages — the visit started somewhere else and we lost it.
  if (OUR_HOSTS.test(h)) {
    return { ...base, channel: "internal", label: "Internal", detail: h };
  }

  // 5. AI assistants. Bing is ambiguous, so it is resolved separately.
  const ai = match(h, AI_HOSTS);
  if (ai && ai !== "__bing__") {
    return { ...base, channel: "ai-assistant", label: `AI Assistant (${ai})`, detail: ai };
  }
  if (ai === "__bing__") {
    // Copilot answers link back through bing.com with this marker; without it
    // the visit is ordinary Bing search.
    const isCopilot = /copilot|chat/i.test(referrer);
    return isCopilot
      ? { ...base, channel: "ai-assistant", label: "AI Assistant (Copilot)", detail: "Microsoft Copilot" }
      : { ...base, channel: "bing-organic", label: "Organic Search (Bing)", detail: "Bing" };
  }

  // 6. Search engines.
  const se = SEARCH_HOSTS.find(([re]) => re.test(h));
  if (se) {
    const [, channel, name] = se;
    return {
      ...base,
      channel,
      label: channel === "google-organic" ? "Organic Search (Google)" : `Search (${name})`,
      detail: name,
    };
  }

  // 7. Social.
  const social = match(h, SOCIAL_HOSTS);
  if (social) return { ...base, channel: "social", label: "Social", detail: social };

  // 8. Anything else is a plain referral from another site.
  return { ...base, channel: "referral", label: "Referral", detail: h };
}

/** Short badge colours for the admin list, matching the panel's palette. */
export const CHANNEL_STYLE: Record<Channel, { bg: string; fg: string }> = {
  "google-ads": { bg: "#fff1e0", fg: "#9a5b00" },
  "google-organic": { bg: "#e6f5ec", fg: "#1f7a44" },
  "bing-organic": { bg: "#e8f0fb", fg: "#1c4f9c" },
  "ai-assistant": { bg: "#f1e9fb", fg: "#6b3fa0" },
  social: { bg: "#fdeaf1", fg: "#a62d6b" },
  email: { bg: "#fdf3dc", fg: "#8a6100" },
  referral: { bg: "#eef1f5", fg: "#44515f" },
  direct: { bg: "#f0f0ef", fg: "#555" },
  internal: { bg: "#f0f0ef", fg: "#888" },
};
