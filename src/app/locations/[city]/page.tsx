import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPage } from "@/components/city-page";
import { CenterPage } from "@/components/center-page";
import { JsonLd } from "@/components/json-ld";
import {
  cityBySlug, cityGraph, centerGraph, builtCityParams, centresForCity, cityHasOwnPage,
} from "@/lib/locations";
import { abs } from "@/lib/seo";

/** Pre-render every built city. Multi-centre cities render the hub (CityPage);
 *  single-centre cities render their one centre (CenterPage) at this same path,
 *  so e.g. Bhuj is served at /locations/bhuj (no locality segment). */
export function generateStaticParams() {
  return builtCityParams();
}

/** The single built centre that a single-centre city collapses onto. */
const soleCentre = (citySlug: string) => centresForCity(citySlug).find((c) => c.built);

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> },
): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c || !c.built) return {};

  // Single-centre city → centre-level metadata (canonical = /locations/[city]).
  if (!cityHasOwnPage(city)) {
    const centre = soleCentre(city);
    if (!centre) return {};
    const place = c.name && c.name !== centre.area ? `${centre.area}, ${c.name}` : centre.area;
    const title = `Best IVF Centre in ${place} — Bavishi Fertility Institute`;
    const description = `${centre.fullName} — IVF, ICSI & IUI with senior doctors since 1984. ${centre.address}. Book a free consultation.`;
    return {
      title,
      description,
      alternates: { canonical: `/locations/${c.slug}` },
      openGraph: { title, description, url: abs(`/locations/${c.slug}`), type: "website", images: [centre.image] },
    };
  }

  const count = centresForCity(c.slug).length;
  const title = `Best IVF Centre in ${c.name} — Bavishi Fertility Institute`;
  const description = `Looking for the best IVF centre in ${c.name}? Bavishi Fertility Institute offers IVF, ICSI & IUI across ${count} ${count === 1 ? "centre" : "centres"} with Class 1000 labs and senior doctors since 1984.`;
  return {
    title,
    description,
    alternates: { canonical: `/locations/${c.slug}` },
    openGraph: { title, description, url: abs(`/locations/${c.slug}`), type: "website", images: [c.heroImage] },
  };
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c || !c.built) notFound();

  // Single-centre city → render the centre directly at the city path.
  if (!cityHasOwnPage(city)) {
    const centre = soleCentre(city);
    if (!centre) notFound();
    return (
      <>
        <JsonLd graph={centerGraph(centre)} />
        <CenterPage centre={centre} />
      </>
    );
  }

  return (
    <>
      <JsonLd graph={cityGraph(c)} />
      <CityPage city={c} />
    </>
  );
}
