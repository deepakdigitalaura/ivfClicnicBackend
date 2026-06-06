/* =====================================================================
 * Seed the Contact page document (Phase 1 POC).
 * ---------------------------------------------------------------------
 * Idempotent: creates the `contact` page if missing, else updates it.
 * Content mirrors the values currently hardcoded in the Contact template
 * and route, so migrating the read path produces identical output.
 * Run: npx payload run scripts/seed-contact.ts
 * ===================================================================== */
import { getPayload } from "payload";
import config from "../src/payload.config";

const FAQS = [
  { question: "How do I book an appointment at Bavishi Fertility Institute?", answer: "Fill in the enquiry form on this page, call us on +91 97126 22288, or message us on WhatsApp. Our team will help you choose the nearest centre and a convenient time." },
  { question: "Can I have an online (video) consultation?", answer: "Yes. We offer video consultations for patients across India and abroad, so you can begin your fertility journey from the comfort of home before visiting a centre." },
  { question: "Which Bavishi Fertility Institute centre is nearest to me?", answer: "We have 15 centres across 8 cities — Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi. Tell us your city and we'll connect you to the closest one." },
  { question: "Is the first consultation free?", answer: "We offer a free initial consultation so you can understand your options with no obligation. Diagnostic tests and treatments are quoted transparently, with EMI options available." },
  { question: "Do you treat international patients?", answer: "Yes — 300+ international patients choose Bavishi Fertility Institute every year. We provide end-to-end support including pre-arrival video consultations and treatment planning." },
];

const data = {
  title: "Contact Us",
  slug: "contact",
  hero: {
    eyebrow: "We're here for you",
    lead: "Contact",
    em: "Bavishi Fertility Institute",
    subtitle:
      "Have a question or ready to begin? Reach out — confidentially and without obligation. Our fertility counsellors are here to guide your very first step.",
  },
  faqs: FAQS,
  seo: {
    metaTitle: "Contact Bavishi Fertility Institute — Book a Free IVF Consultation",
    metaDescription:
      "Contact Bavishi Fertility Institute — call +91 97126 22288, WhatsApp or email drbavishi@ivfclinic.com. Book a free fertility consultation across 15 centres in 8 Indian cities.",
  },
  _status: "published" as const,
};

const run = async () => {
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "pages",
    where: { slug: { equals: "contact" } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length) {
    const id = existing.docs[0].id;
    await payload.update({ collection: "pages", id, data });
    console.log("[seed-contact] updated existing contact page id=" + id);
  } else {
    const doc = await payload.create({ collection: "pages", data });
    console.log("[seed-contact] created contact page id=" + doc.id);
  }
  process.exit(0);
};

run().catch((e) => {
  console.error("[seed-contact] FAILED:", e);
  process.exit(1);
});
