import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { loadContact, PATH } from "@/lib/contact-page-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, ogImage } = await loadContact();
  return withPageSeoOverride(PATH, {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: localeAlternates(PATH),
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url: abs(PATH),
      type: "website",
      images: [ogImage],
    },
  });
}

export default async function Page() {
  const { hero, faqs, cards, contact, sectionLabels, directory } = await loadContact();

  const graph = [
    {
      "@type": "ContactPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: "Contact Bavishi Fertility Institute",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      // A page-level ContactPoint that references the sitewide organization.
      mainEntity: {
        "@type": "ContactPoint",
        telephone: contact.telephone,
        email: contact.email,
        contactType: "customer service",
        availableLanguage: ["English", "Hindi", "Gujarati"],
        areaServed: "IN",
      },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Contact Us", url: PATH },
    ]),
    faqSchema(faqs),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <ContactPage hero={hero} faqs={faqs} cards={cards} sectionLabels={sectionLabels} directory={directory} />
    </>
  );
}
