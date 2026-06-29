import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getPageBySlug, getGlobalSafe, payloadClient } from "@/lib/payload";
import { resolveContactValues, resolveCardChannel, type ContactChannel } from "@/lib/contact";

const PATH = "/contact";
const DEFAULT_OG_IMAGE = "/assets/hero-mother-baby1.png";

/* Fallbacks — used only if the CMS `contact` page is missing, so the route
 * keeps working alongside the existing system during the migration. */
const FALLBACK = {
  hero: {
    eyebrow: "We're here for you",
    lead: "Contact",
    em: "Bavishi Fertility Institute",
    subtitle:
      "Have a question or ready to begin? Reach out — confidentially and without obligation. Our fertility counsellors are here to guide your very first step.",
  },
  seo: {
    metaTitle: "Contact Bavishi Fertility Institute — Book a Free IVF Consultation",
    metaDescription:
      "Contact Bavishi Fertility Institute — call +91 97126 22288, WhatsApp or email drbavishi@ivfclinic.com. Book a free fertility consultation across 14 centres in 8 Indian cities.",
    ogTitle: "Contact Bavishi Fertility Institute — Book a Free IVF Consultation",
    ogDescription:
      "Call, WhatsApp or message us to begin your fertility journey. 14 centres across 8 cities. Free initial consultation, online consultations available.",
  },
  faqs: [
    { question: "How do I book an appointment at Bavishi Fertility Institute?", answer: "Fill in the enquiry form on this page, call us on +91 97126 22288, or message us on WhatsApp. Our team will help you choose the nearest centre and a convenient time." },
    { question: "Which Bavishi Fertility Institute centre is nearest to me?", answer: "We have 14 centres across 8 cities — Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi. Tell us your city and we'll connect you to the closest one." },
    { question: "Is the first consultation free?", answer: "We offer a free initial consultation so you can understand your options with no obligation. Diagnostic tests and treatments are quoted transparently, with EMI options available." },
    { question: "Do you treat international patients?", answer: "Yes — 300+ international patients choose Bavishi Fertility Institute every year. We provide end-to-end support including treatment planning and coordination across our 14 centres." },
  ],
};

/** Resolve the Contact page from the CMS, falling back to the constants above. */
async function loadContact() {
  const page = await getPageBySlug("contact");
  // Coalesce per field so a null/empty CMS value falls back (and the type
  // stays `string`, which Next's Metadata requires).
  const hero = {
    eyebrow: page?.hero?.eyebrow ?? FALLBACK.hero.eyebrow,
    lead: page?.hero?.lead ?? FALLBACK.hero.lead,
    em: page?.hero?.em ?? FALLBACK.hero.em,
    subtitle: page?.hero?.subtitle ?? FALLBACK.hero.subtitle,
  };
  const seo = {
    metaTitle: page?.seo?.metaTitle ?? FALLBACK.seo.metaTitle,
    metaDescription: page?.seo?.metaDescription ?? FALLBACK.seo.metaDescription,
    ogTitle: page?.seo?.ogTitle ?? FALLBACK.seo.ogTitle,
    ogDescription: page?.seo?.ogDescription ?? FALLBACK.seo.ogDescription,
  };
  const faqsSource = page?.faqs?.length ? page.faqs : FALLBACK.faqs;
  // Single source of truth → drives BOTH the rendered FAQ list and faqSchema.
  const faqs = faqsSource.map((f) => ({ q: f.question ?? "", a: f.answer ?? "" }));
  const ogImage =
    page?.seo && typeof page.seo.ogImage === "object" && page.seo.ogImage?.url
      ? page.seo.ogImage.url
      : DEFAULT_OG_IMAGE;

  // Canonical contact values — single source of truth (Site Settings, with
  // SITE fallback). Drives BOTH the contact cards and the ContactPoint JSON-LD.
  const contact = resolveContactValues(await getGlobalSafe("site-settings"));

  // Contact cards from the contact-info global (undefined → component uses its
  // own defaults, preserving the original cards). Each card's value/link is
  // resolved from `contact` by its channel, so cards never duplicate numbers.
  const ci = await getGlobalSafe("contact-info");
  const cards = ci?.cards?.length
    ? ci.cards.map((c) => {
        const r = resolveCardChannel(c.channel as ContactChannel | null, contact);
        return { icon: c.icon, t: c.title, v: r.value ?? c.value ?? "", href: r.href ?? c.href, note: c.note };
      })
    : undefined;

  // Section-label overrides (typed loosely — the generated payload-types may
  // lag behind the schema until the next generate:types run).
  const sectionLabels = (page as { sectionLabels?: { networkEyebrow?: string | null; networkSubtitle?: string | null; faqEyebrow?: string | null } | null } | null)?.sectionLabels ?? undefined;

  // Centres directory — pulled live from the CMS so edits in /admin/collections/centres
  // are reflected immediately without any code change.
  let directory: { name: string; address: string; phone: string; phoneLabel: string; hours?: string; href?: string }[] | undefined;
  try {
    const payload = await payloadClient();
    const res = await payload.find({ collection: "centres", limit: 100, depth: 0, sort: "citySlug" });
    if (res.docs.length > 0) {
      directory = (res.docs as unknown as Array<Record<string, string | null | undefined>>).map((c) => ({
        name: c.fullName ?? `${c.citySlug ?? ""} — ${c.name ?? ""}`,
        address: c.address ?? "",
        phone: c.phone ?? "",
        phoneLabel: c.phoneLabel ?? "",
        hours: c.hours ?? undefined,
        href: `/locations/${c.citySlug}/${c.slug}`,
      }));
    }
  } catch {
    // Fall back to hardcoded directory in ContactPage
  }

  return { hero, seo, faqs, ogImage, cards, contact, sectionLabels, directory };
}

export async function generateMetadata(): Promise<Metadata> {
  const { seo, ogImage } = await loadContact();
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: PATH },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle,
      description: seo.ogDescription || seo.metaDescription,
      url: abs(PATH),
      type: "website",
      images: [ogImage],
    },
  };
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
      <ContactPage hero={hero} faqs={faqs} cards={cards} sectionLabels={sectionLabels} directory={directory} />
    </>
  );
}
