import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPage } from "@/components/city-page";
import { CenterPage } from "@/components/center-page";
import { JsonLd } from "@/components/json-ld";
import {
  cityGraph, centerGraph, builtCityParams, centresForCity, cityHasOwnPage,
} from "@/lib/locations";
import {
  getCity, getCentre, getPublishedCitySlugs, getPublishedCentresForCity, getBlogsByLocationSlug,
} from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";
import { abs } from "@/lib/seo";

/** Pre-render every built city from both code defaults and DB. */
export async function generateStaticParams() {
  const codeParams = builtCityParams();
  try {
    const dbSlugs = await getPublishedCitySlugs();
    const seen = new Set(codeParams.map((p) => p.city));
    return [...codeParams, ...dbSlugs.filter((s) => !seen.has(s)).map((s) => ({ city: s }))];
  } catch {
    return codeParams;
  }
}

/**
 * For a given city slug, determine whether it should render a city hub (multiple
 * centres) or a single-centre view, checking code array first then DB.
 */
async function isMultiCentreCity(city: string): Promise<boolean> {
  if (cityHasOwnPage(city)) return true;
  const dbCentres = await getPublishedCentresForCity(city);
  return dbCentres.length > 1;
}

/**
 * Resolve the sole centre slug for a single-centre city — code array first,
 * then DB (for new admin-added cities).
 */
async function resolveSoleCentreSlug(city: string): Promise<string | undefined> {
  const codeC = centresForCity(city).find((c) => c.built);
  if (codeC) return codeC.slug;
  const dbCentres = await getPublishedCentresForCity(city);
  return dbCentres[0]?.slug;
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> },
): Promise<Metadata> {
  const { city } = await params;
  const c = await getCity(city);
  if (!c || !c.built) return {};

  if (!await isMultiCentreCity(city)) {
    const soleCentreSlug = await resolveSoleCentreSlug(city);
    if (!soleCentreSlug) return {};
    const centre = await getCentre(city, soleCentreSlug);
    if (!centre) return {};
    const place = c.name && c.name !== centre.area ? `${centre.area}, ${c.name}` : centre.area;
    const title = `Best IVF Centre in ${place} — Bavishi Fertility Institute`;
    const description = `${centre.fullName} — IVF, ICSI & IUI with senior doctors since 1998. ${centre.address}. Book a free consultation.`;
    return {
      title,
      description,
      alternates: { canonical: `/locations/${c.slug}` },
      openGraph: { title, description, url: abs(`/locations/${c.slug}`), type: "website", images: [centre.image] },
    };
  }

  const count = centresForCity(c.slug).length || (await getPublishedCentresForCity(c.slug)).length;
  const title = `Best IVF Centre in ${c.name} — Bavishi Fertility Institute`;
  const description = `Looking for the best IVF centre in ${c.name}? Bavishi Fertility Institute offers IVF, ICSI & IUI across ${count} ${count === 1 ? "centre" : "centres"} with Class 1000 labs and senior doctors since 1998.`;
  return {
    title,
    description,
    alternates: { canonical: `/locations/${c.slug}` },
    openGraph: { title, description, url: abs(`/locations/${c.slug}`), type: "website", images: [c.heroImage] },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = await getCity(city);
  if (!c || !c.built) notFound();

  if (!await isMultiCentreCity(city)) {
    const soleCentreSlug = await resolveSoleCentreSlug(city);
    if (!soleCentreSlug) notFound();
    const centre = await getCentre(city, soleCentreSlug!);
    if (!centre) notFound();
    return (
      <>
        <JsonLd graph={centerGraph(centre)} />
        <CenterPage centre={centre} />
      </>
    );
  }

  const cmsBlogs = (await getBlogsByLocationSlug(c.slug)).map(toBlogPost);
  return (
    <>
      <JsonLd graph={cityGraph(c)} />
      <CityPage city={c} cmsBlogs={cmsBlogs} />
    </>
  );
}
