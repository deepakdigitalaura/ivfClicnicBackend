import type { Metadata } from "next";
import { MaternityServicesHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";
import { WOMENS_HEALTH_SERVICES } from "@/lib/womens-health";
import { getService, getPublishedServiceSlugs } from "@/lib/payload";

const PATH = "/services/maternity-services";

/* Any service added in the admin panel that isn't one of the 6 code-registered
 * cards above — rendered as additional cards so new services show up here
 * automatically. The 6 built-in cards never change; this only ever adds. */
async function getExtraServiceCards() {
  try {
    const codeSlugs = new Set(Object.values(WOMENS_HEALTH_SERVICES).map((s) => s.key));
    const allSlugs = await getPublishedServiceSlugs();
    const extraSlugs = allSlugs.filter((s) => !codeSlugs.has(s));
    const extras = await Promise.all(
      extraSlugs.map(async (slug) => {
        const content = await getService(slug);
        if (!content) return null;
        return {
          title: content.shortName || content.hero.h1 || slug,
          desc: content.hero.tagline || content.overview.paragraphs[0] || "",
          href: `/services/${slug}`,
        };
      }),
    );
    return extras.filter((c): c is NonNullable<typeof c> => c !== null);
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Maternity Services — Safe, Caring Pregnancy & Delivery",
    description:
      "Comprehensive maternity care at Bavishi Fertility & Birthing — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, twin pregnancy care, and 3D/4D sonography.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Maternity Services — Bavishi Fertility & Birthing",
      description:
        "Comprehensive maternity care — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, and more.",
      url: PATH,
      type: "website",
    },
  });
}

export default async function Page() {
  const extraCards = await getExtraServiceCards();
  return (
    <>
      <PageSeoSchema path={PATH} />
      <MaternityServicesHub extraCards={extraCards} />
    </>
  );
}
