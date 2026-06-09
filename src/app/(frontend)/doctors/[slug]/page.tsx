import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorProfile } from "@/components/doctor-page";
import { JsonLd } from "@/components/json-ld";
import { DOCTORS, physicianSchema } from "@/lib/doctors";
import { getDoctor } from "@/lib/payload";
import { breadcrumbSchema, abs } from "@/lib/seo";

/* Pre-render every doctor profile. The slug registry stays code-driven (DOCTORS),
 * so the static route set is identical regardless of CMS/DB state — only the
 * per-doctor CONTENT resolves from the CMS (with a per-field fallback to the
 * typed defaults). */
export function generateStaticParams() {
  return DOCTORS.map((d) => ({ slug: d.slug }));
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
