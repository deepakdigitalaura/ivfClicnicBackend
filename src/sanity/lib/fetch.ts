import "server-only";
import { unstable_cache } from "next/cache";
import { client } from "./client";
import {
  ROBOTS_QUERY,
  SCRIPTS_QUERY,
  REDIRECTS_QUERY,
  SITEMAP_QUERY,
  SCHEMA_ORG_QUERY,
  PAGE_SEO_BY_PATH_QUERY,
} from "./queries";

async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}

export type RobotsConfig = {
  discourageSearchEngines?: boolean;
  disallowPaths?: string[];
};

export type ScriptEntry = { name?: string; enabled?: boolean; code?: string };
export type ScriptsConfig = {
  headScripts?: ScriptEntry[];
  bodyScripts?: ScriptEntry[];
};

export type RedirectRule = { source: string; destination: string; permanent: boolean; enabled: boolean };
export type RedirectsConfig = { rules?: RedirectRule[] };

export type SitemapConfig = {
  excludePaths?: string[];
  additionalUrls?: { url: string; priority?: number; changefreq?: string }[];
};

export type SchemaOrgConfig = {
  organizationName?: string;
  organizationUrl?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  socialProfiles?: string[];
  customSchemas?: { name?: string; enabled?: boolean; jsonCode?: string }[];
};

export type PageSeo = {
  pagePath?: string;
  pageName?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export const getRobotsConfig = () =>
  unstable_cache(
    () => sanityFetch<RobotsConfig>(ROBOTS_QUERY),
    ["sanity-robots"],
    { revalidate: 3600, tags: ["sanity-robots"] },
  )();

export const getScriptsConfig = () =>
  unstable_cache(
    () => sanityFetch<ScriptsConfig>(SCRIPTS_QUERY),
    ["sanity-scripts"],
    { revalidate: 3600, tags: ["sanity-scripts"] },
  )();

export const getRedirectsConfig = () =>
  unstable_cache(
    () => sanityFetch<RedirectsConfig>(REDIRECTS_QUERY),
    ["sanity-redirects"],
    { revalidate: 3600, tags: ["sanity-redirects"] },
  )();

export const getSitemapConfig = () =>
  unstable_cache(
    () => sanityFetch<SitemapConfig>(SITEMAP_QUERY),
    ["sanity-sitemap"],
    { revalidate: 3600, tags: ["sanity-sitemap"] },
  )();

export const getSchemaOrgConfig = () =>
  unstable_cache(
    () => sanityFetch<SchemaOrgConfig>(SCHEMA_ORG_QUERY),
    ["sanity-schema-org"],
    { revalidate: 3600, tags: ["sanity-schema-org"] },
  )();

export const getPageSeo = (path: string) =>
  unstable_cache(
    () => sanityFetch<PageSeo>(PAGE_SEO_BY_PATH_QUERY, { path }),
    ["sanity-page-seo", path],
    { revalidate: 3600, tags: ["sanity-page-seo"] },
  )();
