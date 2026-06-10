import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CenterPage } from "@/components/center-page";
import { JsonLd } from "@/components/json-ld";
import { cityBySlug, centerGraph, builtCentreParams, cityHasOwnPage } from "@/lib/locations";
import { getCentre } from "@/lib/payload";
import { abs } from "@/lib/seo";

/** Pre-render every built centre (static export). */
export function generateStaticParams() {
  return builtCentreParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; center: string }> },
): Promise<Metadata> {
  const { city, center } = await params;
  const c = await getCentre(city, center);
  // Single-centre cities are served at /locations/[city] — no locality route.
  if (!c || !c.built || !cityHasOwnPage(city)) return {};
  const cityName = cityBySlug(city)?.name ?? "";
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
  // Single-centre cities live at /locations/[city]; this nested route 404s for them.
  if (!c || !c.built || !cityHasOwnPage(city)) notFound();
  return (
    <>
      <JsonLd graph={centerGraph(c)} />
      <CenterPage centre={c} />
    </>
  );
}
