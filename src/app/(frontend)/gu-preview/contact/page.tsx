/* Demo-only Gujarati preview of /contact — for boss approval, not linked/indexed. */
import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { ContactPageTranslated, type THero, type TFaq, type TCard, type TCentre } from "@/components/contact-page-translated";
import { getGlobalSafe, getAllResolvedCentres } from "@/lib/payload";
import { resolveContactValues, resolveCardChannel, type ContactChannel } from "@/lib/contact";

export const dynamic = "force-dynamic";

const HERO_GU: THero = {
  eyebrow: "અમે તમારા માટે અહીં છીએ",
  lead: "સંપર્ક કરો",
  em: "બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ",
  subtitle:
    "કોઈ પ્રશ્ન છે અથવા શરૂ કરવા તૈયાર છો? ગોપનીય રીતે અને કોઈ પણ જવાબદારી વગર સંપર્ક કરો. અમારા ફર્ટિલિટી કાઉન્સેલર્સ તમારા પ્રથમ પગલા માટે માર્ગદર્શન આપવા અહીં છે.",
};

const FAQS_GU: TFaq[] = [
  { q: "બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટમાં એપોઇન્ટમેન્ટ કેવી રીતે બુક કરવી?", a: "આ પેજ પરનું ફોર્મ ભરો, અમને +91 97126 22288 પર કૉલ કરો, અથવા વોટ્સએપ પર સંદેશ મોકલો. અમારી ટીમ તમને નજીકનું કેન્દ્ર અને અનુકૂળ સમય પસંદ કરવામાં મદદ કરશે." },
  { q: "મારી સૌથી નજીક કયું બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ કેન્દ્ર છે?", a: "અમારા 8 શહેરો — અમદાવાદ, મુંબઈ, વડોદરા, સુરત, ભુજ, ભાવનગર, આણંદ અને વારાણસી — માં 14 કેન્દ્રો છે. અમને તમારું શહેર જણાવો, અમે તમને નજીકના કેન્દ્ર સાથે જોડીશું." },
  { q: "શું તમે મફત પરામર્શ આપો છો?", a: "અમે સમજીએ છીએ કે યોગ્ય ફર્ટિલિટી ક્લિનિક પસંદ કરવું એ મહત્વનો નિર્ણય છે. દરેક દંપતિને સમર્પિત સમય, નિષ્ણાત માર્ગદર્શન અને વ્યક્તિગત મૂલ્યાંકન મળે તે સુનિશ્ચિત કરવા, અમારા પરામર્શ મફત નથી. જોકે, અમે સમયાંતરે મર્યાદિત-સમયના કાર્યક્રમો હેઠળ ખાસ મફત પરામર્શ સ્લોટ આપીએ છીએ. હાલની ઉપલબ્ધતા જાણવા અમારો સંપર્ક કરો." },
  { q: "શું તમે આંતરરાષ્ટ્રીય દર્દીઓની સારવાર કરો છો?", a: "હા — દર વર્ષે 300+ આંતરરાષ્ટ્રીય દર્દીઓ બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ પસંદ કરે છે. અમે અમારા 14 કેન્દ્રોમાં સારવાર આયોજન અને સંકલન સહિત સંપૂર્ણ સહાય પૂરી પાડીએ છીએ." },
];

const UI_GU = {
  breadcrumbHome: "હોમ",
  breadcrumbContact: "સંપર્ક કરો",
  networkEyebrow: "અમારું નેટવર્ક",
  networkTitleLead: "તમારી નજીક બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ શોધો",
  networkTitleEm: "",
  networkSubtitle:
    "8 ભારતીય શહેરોમાં 14 ફર્ટિલિટી કેન્દ્રો — વિશ્વ કક્ષાની સંભાળ, તમારા ઘરની નજીક. ફોન અને વોટ્સએપ સપોર્ટ 24×7 ઉપલબ્ધ છે; કેન્દ્રના મુલાકાત સમય નીચે આપેલા છે.",
  call: "કૉલ",
  directions: "દિશા",
  needHelpTitle: "યોગ્ય કેન્દ્ર પસંદ કરવામાં મદદ જોઈએ છે?",
  needHelpSubtitle: "અમારા કાઉન્સેલર્સ તમને તમારા નજીકના બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ કેન્દ્ર સુધી માર્ગદર્શન આપશે.",
  bookConsultation: "પરામર્શ બુક કરો",
  faqEyebrow: "વારંવાર પુછાતા પ્રશ્નો",
  faqTitleLead: "સંપર્કમાં રહેવું —",
  faqTitleEm: "જવાબો સાથે",
  bottomHeading: "તમારી પેરેન્ટહુડની યાત્રા શરૂ થાય છે",
  bottomHeadingEm: "એક સંદેશથી.",
  whatsappUs: "વોટ્સએપ કરો",
};

const CARD_LABELS_GU: Record<string, { t: string; note: string }> = {
  "Call Us": { t: "કૉલ કરો", note: "24×7 ફોન સપોર્ટ — ક્લિનિકનો સમય કેન્દ્ર પ્રમાણે અલગ છે" },
  "WhatsApp": { t: "વોટ્સએપ", note: "ઝડપી જવાબો, દરરોજ" },
  "Email": { t: "ઈમેલ", note: "અમે 24 કલાકમાં જવાબ આપીશું" },
};

async function loadData() {
  // page/faqs CMS overrides are ignored for this demo — hero + FAQ copy below
  // is the fixed Gujarati translation of the current English fallback copy.
  const contact = resolveContactValues(await getGlobalSafe("site-settings"));
  const ci = await getGlobalSafe("contact-info");
  const cards: TCard[] = (ci?.cards?.length ? ci.cards : []).map((c) => {
    const r = resolveCardChannel(c.channel as ContactChannel | null, contact);
    const label = CARD_LABELS_GU[c.title ?? ""] ?? { t: c.title ?? "", note: c.note ?? "" };
    return { icon: c.icon, t: label.t, v: r.value ?? c.value ?? "", href: r.href ?? c.href, note: label.note };
  });
  const fallbackCards: TCard[] = [
    { icon: "Phone", t: CARD_LABELS_GU["Call Us"].t, v: contact.telephone ?? "+91 97126 22288", href: `tel:${contact.telephone ?? "+919712622288"}`, note: CARD_LABELS_GU["Call Us"].note },
    { icon: "MessageCircle", t: CARD_LABELS_GU.WhatsApp.t, v: "અમારી ટીમ સાથે ચેટ કરો", href: "https://wa.me/919712522289", note: CARD_LABELS_GU.WhatsApp.note },
    { icon: "Mail", t: CARD_LABELS_GU.Email.t, v: contact.email ?? "drbavishi@ivfclinic.com", href: `mailto:${contact.email ?? "drbavishi@ivfclinic.com"}`, note: CARD_LABELS_GU.Email.note },
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
    hero: HERO_GU,
    faqs: FAQS_GU,
    cards: cards.length ? cards : fallbackCards,
    directory,
  };
}

export default async function Page() {
  const { hero, faqs, cards, directory } = await loadData();
  return (
    <>
      <TranslationDemoBanner locale="gu" path="/contact" />
      <ContactPageTranslated hero={hero} faqs={faqs} cards={cards} directory={directory} ui={UI_GU} />
    </>
  );
}
