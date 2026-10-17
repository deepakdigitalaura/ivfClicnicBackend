/* Demo-only Hindi preview of /contact — for boss approval, not linked/indexed. */
import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { ContactPageTranslated, type THero, type TFaq, type TCard, type TCentre } from "@/components/contact-page-translated";
import { getGlobalSafe, getAllResolvedCentres } from "@/lib/payload";
import { resolveContactValues, resolveCardChannel, type ContactChannel } from "@/lib/contact";

export const dynamic = "force-dynamic";

const HERO_HI: THero = {
  eyebrow: "हम आपके लिए यहां हैं",
  lead: "संपर्क करें",
  em: "बाविशी फर्टिलिटी इंस्टिट्यूट",
  subtitle:
    "कोई सवाल है या शुरू करने के लिए तैयार हैं? गोपनीय रूप से और बिना किसी बाध्यता के संपर्क करें। हमारे फर्टिलिटी काउंसलर आपके पहले कदम में मार्गदर्शन के लिए यहां हैं।",
};

const FAQS_HI: TFaq[] = [
  { q: "बाविशी फर्टिलिटी इंस्टिट्यूट में अपॉइंटमेंट कैसे बुक करें?", a: "इस पेज पर दिए गए फॉर्म को भरें, हमें +91 97126 22288 पर कॉल करें, या व्हाट्सएप पर संदेश भेजें। हमारी टीम आपको नज़दीकी केंद्र और सुविधाजनक समय चुनने में मदद करेगी।" },
  { q: "मेरे सबसे नज़दीक कौन सा बाविशी फर्टिलिटी इंस्टिट्यूट केंद्र है?", a: "हमारे 8 शहरों — अहमदाबाद, मुंबई, वडोदरा, सूरत, भुज, भावनगर, आणंद और वाराणसी — में 14 केंद्र हैं। हमें अपना शहर बताएं, हम आपको नज़दीकी केंद्र से जोड़ देंगे।" },
  { q: "क्या आप मुफ्त परामर्श देते हैं?", a: "हम समझते हैं कि सही फर्टिलिटी क्लिनिक चुनना एक महत्वपूर्ण निर्णय है। हर दंपति को समर्पित समय, विशेषज्ञ मार्गदर्शन और व्यक्तिगत मूल्यांकन देने के लिए, हमारे परामर्श निःशुल्क नहीं हैं। हालांकि, हम समय-समय पर सीमित अवधि के कार्यक्रमों के तहत विशेष मुफ्त परामर्श स्लॉट प्रदान करते हैं। मौजूदा उपलब्धता जानने के लिए हमसे संपर्क करें।" },
  { q: "क्या आप अंतरराष्ट्रीय मरीज़ों का इलाज करते हैं?", a: "हां — हर साल 300+ अंतरराष्ट्रीय मरीज़ बाविशी फर्टिलिटी इंस्टिट्यूट को चुनते हैं। हम अपने 14 केंद्रों में उपचार योजना और समन्वय सहित संपूर्ण सहायता प्रदान करते हैं।" },
];

const UI_HI = {
  breadcrumbHome: "होम",
  breadcrumbContact: "संपर्क करें",
  networkEyebrow: "हमारा नेटवर्क",
  networkTitleLead: "अपने पास बाविशी फर्टिलिटी इंस्टिट्यूट खोजें",
  networkTitleEm: "",
  networkSubtitle:
    "8 भारतीय शहरों में 14 फर्टिलिटी केंद्र — विश्व स्तरीय देखभाल, आपके घर के करीब। फोन और व्हाट्सएप सहायता 24×7 उपलब्ध है; केंद्र के आने के समय नीचे दिए गए हैं।",
  call: "कॉल",
  directions: "दिशा-निर्देश",
  needHelpTitle: "सही केंद्र चुनने में मदद चाहिए?",
  needHelpSubtitle: "हमारे काउंसलर आपको आपके नज़दीकी बाविशी फर्टिलिटी इंस्टिट्यूट केंद्र तक मार्गदर्शन देंगे।",
  bookConsultation: "परामर्श बुक करें",
  faqEyebrow: "सामान्य प्रश्न",
  faqTitleLead: "संपर्क में रहना —",
  faqTitleEm: "उत्तर सहित",
  bottomHeading: "आपकी माता-पिता बनने की यात्रा शुरू होती है",
  bottomHeadingEm: "एक संदेश से।",
  whatsappUs: "व्हाट्सएप करें",
};

const CARD_LABELS_HI: Record<string, { t: string; note: string }> = {
  "Call Us": { t: "कॉल करें", note: "24×7 फोन सहायता — क्लिनिक के आने का समय केंद्र अनुसार अलग-अलग है" },
  "WhatsApp": { t: "व्हाट्सएप", note: "त्वरित उत्तर, हर दिन" },
  "Email": { t: "ईमेल", note: "हम 24 घंटे के भीतर उत्तर देंगे" },
};

async function loadData() {
  // page/faqs CMS overrides are ignored for this demo — hero + FAQ copy below
  // is the fixed Hindi translation of the current English fallback copy.
  const contact = resolveContactValues(await getGlobalSafe("site-settings"));
  const ci = await getGlobalSafe("contact-info");
  const cards: TCard[] = (ci?.cards?.length ? ci.cards : []).map((c) => {
    const r = resolveCardChannel(c.channel as ContactChannel | null, contact);
    const label = CARD_LABELS_HI[c.title ?? ""] ?? { t: c.title ?? "", note: c.note ?? "" };
    return { icon: c.icon, t: label.t, v: r.value ?? c.value ?? "", href: r.href ?? c.href, note: label.note };
  });
  const fallbackCards: TCard[] = [
    { icon: "Phone", t: CARD_LABELS_HI["Call Us"].t, v: contact.telephone ?? "+91 97126 22288", href: `tel:${contact.telephone ?? "+919712622288"}`, note: CARD_LABELS_HI["Call Us"].note },
    { icon: "MessageCircle", t: CARD_LABELS_HI.WhatsApp.t, v: "हमारी टीम से चैट करें", href: "https://wa.me/919712522289", note: CARD_LABELS_HI.WhatsApp.note },
    { icon: "Mail", t: CARD_LABELS_HI.Email.t, v: contact.email ?? "drbavishi@ivfclinic.com", href: `mailto:${contact.email ?? "drbavishi@ivfclinic.com"}`, note: CARD_LABELS_HI.Email.note },
  ];

  // Real, live centre directory (Sanity) — addresses/phones/names kept as-is (not translated).
  const resolvedCentres = await getAllResolvedCentres();
  const directory: TCentre[] = resolvedCentres.map((c) => ({
    name: c.fullName || `${c.citySlug} — ${c.name}`,
    address: c.address,
    phone: c.phone,
    phoneLabel: c.phoneLabel,
    hours: c.hours,
    href: `/locations/${c.citySlug}/${c.slug}`,
  }));

  return {
    hero: HERO_HI,
    faqs: FAQS_HI,
    cards: cards.length ? cards : fallbackCards,
    directory,
  };
}

export default async function Page() {
  const { hero, faqs, cards, directory } = await loadData();
  return (
    <>
      <TranslationDemoBanner locale="hi" path="/contact" />
      <ContactPageTranslated hero={hero} faqs={faqs} cards={cards} directory={directory} ui={UI_HI} />
    </>
  );
}
