import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID, SITE } from "@/lib/seo";

const PATH = "/contact";

export const metadata: Metadata = {
  title: "Contact Bavishi Fertility Institute — Book a Free IVF Consultation",
  description:
    "Contact Bavishi Fertility Institute — call +91 97126 22288, WhatsApp or email drbavishi@ivfclinic.com. Book a free fertility consultation across 15 centres in 8 Indian cities.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Contact Bavishi Fertility Institute — Book a Free IVF Consultation",
    description:
      "Call, WhatsApp or message us to begin your fertility journey. 15 centres across 8 cities. Free initial consultation, online consultations available.",
    url: abs(PATH),
    type: "website",
    images: ["/assets/hero-mother-baby1.png"],
  },
};

const faqs = [
  { q: "How do I book an appointment at Bavishi Fertility Institute?", a: "Fill in the enquiry form, call +91 97126 22288, or message us on WhatsApp. Our team will help you choose the nearest centre and a convenient time." },
  { q: "Can I have an online (video) consultation?", a: "Yes. We offer video consultations for patients across India and abroad, so you can begin your fertility journey from home before visiting a centre." },
  { q: "Which Bavishi Fertility Institute centre is nearest to me?", a: "We have 15 centres across 8 cities — Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi. Tell us your city and we'll connect you to the closest one." },
  { q: "Is the first consultation free?", a: "We offer a free initial consultation with no obligation. Diagnostic tests and treatments are quoted transparently, with EMI options available." },
  { q: "Do you treat international patients?", a: "Yes — 300+ international patients choose Bavishi Fertility Institute every year, with end-to-end support including pre-arrival video consultations." },
];

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
      telephone: SITE.telephone,
      email: SITE.email,
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

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <ContactPage />
    </>
  );
}
