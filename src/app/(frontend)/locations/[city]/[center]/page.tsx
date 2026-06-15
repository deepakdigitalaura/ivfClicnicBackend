import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CenterPage } from "@/components/center-page";
import { JsonLd } from "@/components/json-ld";
import { cityBySlug, centerGraph, builtCentreParams, cityHasOwnPage } from "@/lib/locations";
import { getCentre, getPublishedCentreParams, getPublishedCentresForCity } from "@/lib/payload";
import { abs } from "@/lib/seo";

/** Pre-render every built centre from both code defaults and DB. */
export async function generateStaticParams() {
  const codeParams = builtCentreParams();
  try {
    const dbParams = await getPublishedCentreParams();
    const seen = new Set(codeParams.map((p) => `${p.city}/${p.center}`));
    return [...codeParams, ...dbParams.filter((p) => !seen.has(`${p.city}/${p.center}`))];
  } catch {
    return codeParams;
  }
}

/**
 * A centre at /locations/[city]/[center] is only valid if the city has more
 * than one centre. Check code array first, then DB for new admin-added cities.
 */
async function cityIsMultiCentre(city: string): Promise<boolean> {
  if (cityHasOwnPage(city)) return true;
  const dbCentres = await getPublishedCentresForCity(city);
  return dbCentres.length > 1;
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; center: string }> },
): Promise<Metadata> {
  const { city, center } = await params;
  const c = await getCentre(city, center);
  if (!c || !c.built || !await cityIsMultiCentre(city)) return {};
  const cityName = cityBySlug(city)?.name ?? c.citySlug;
  const place = cityName && cityName !== c.area ? `${c.area}, ${cityName}` : c.area;
  const title = `Best IVF Centre in ${place} — Bavishi Fertility Institute`;
  const description = `${c.fullName} — IVF, ICSI & IUI with senior doctors since 1984. ${c.address}. Book a free consultation.`;
  return {
    title,
    description,
    alternates: { canonical: `/locations/${c.citySlug}/${c.slug}` },
    openGraph: { title, description, url: abs(`/locations/${c.citySlug}/${c.slug}`), type: "website", images: [c.image] },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string; center: string }> }) {
  const { city, center } = await params;
  const c = await getCentre(city, center);
  if (!c || !c.built || !await cityIsMultiCentre(city)) notFound();
  return (
    <>
      <JsonLd graph={centerGraph(c)} />
      <CenterPage centre={c} />
    </>
  );
}
