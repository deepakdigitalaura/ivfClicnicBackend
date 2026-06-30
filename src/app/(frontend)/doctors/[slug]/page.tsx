import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorProfile } from "@/components/doctor-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { physicianSchema } from "@/lib/doctors";
import { getDoctor, getDoctors } from "@/lib/payload";
import { breadcrumbSchema, abs } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

/** ISR: re-render every hour so admin edits go live without a full redeploy. */
export const revalidate = 3600;

/** Union of code-known + Sanity doctor slugs (getDoctors merges both). New
 *  admin-created doctors not in this set still render on-demand (dynamicParams). */
export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDoctor(slug);
  if (!d) return {};
  const title = `${d.name} — ${d.specialty} | Bavishi Fertility Institute`;
  return withPageSeoOverride(`/doctors/${d.slug}`, {
    title,
    description: d.shortBio,
    alternates: { canonical: `/doctors/${d.slug}` },
    openGraph: {
      title,
      description: d.shortBio,
      url: abs(`/doctors/${d.slug}`),
      type: "profile",
      images: [d.image],
    },
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDoctor(slug);
  if (!d) notFound();

  const graph = [
    physicianSchema(d),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Doctors", url: "/doctors" },
      { name: d.name, url: `/doctors/${d.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={`/doctors/${d.slug}`} />
      <DoctorProfile doctor={d} />
    </>
  );
}
