import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorProfile } from "@/components/doctor-page";
import { JsonLd } from "@/components/json-ld";
import { DOCTORS, physicianSchema } from "@/lib/doctors";
import { getDoctor, payloadClient } from "@/lib/payload";
import { breadcrumbSchema, abs } from "@/lib/seo";

/** DB-first: union of Payload-published slugs + code-known DOCTORS slugs. */
export async function generateStaticParams() {
  const codeSlugs = DOCTORS.map((d) => d.slug);
  try {
    const payload = await payloadClient();
    const res = await payload.find({
      collection: "doctors",
      limit: codeSlugs.length + 200,
      depth: 0,
      select: { slug: true },
    });
    const dbSlugs = res.docs.map((d) => (d as { slug: string }).slug);
    const all = [...new Set([...codeSlugs, ...dbSlugs])];
    return all.map((slug) => ({ slug }));
  } catch {
    return codeSlugs.map((slug) => ({ slug }));
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDoctor(slug);
  if (!d) return {};
  const title = `${d.name} — ${d.specialty} | Bavishi Fertility Institute`;
  return {
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
  };
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
      <DoctorProfile doctor={d} />
    </>
  );
}
