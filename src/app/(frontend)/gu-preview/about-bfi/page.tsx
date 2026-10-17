import { AboutPage } from "@/components/about-page";
import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { ABOUT_DEFAULTS, type AboutData } from "@/lib/about";

export const metadata = { title: "About BFI (Gujarati Preview) — Bavishi Fertility Institute" };

// Demo-only translation of ABOUT_DEFAULTS into Gujarati. Only human-readable
// string values are translated; structure, links, image paths, icon names
// and numeric stats are left untouched so the AboutData type stays satisfied.
const data: AboutData = {
  hero: {
    eyebrow: "બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ વિશે — 1998થી IVF ના અગ્રણી",
    headline: "ત્રણ દાયકાથી વધુની ફર્ટિલિટી શ્રેષ્ઠતા — ટેકનોલોજી અને વિશ્વાસ પર બંધાયેલ",
    headlineItalic: "ફર્ટિલિટી શ્રેષ્ઠતા",
    paragraph:
      'બાવીશી પરિવારના જાણીતા નિષ્ણાતો — <a href="/doctors/himanshu-bavishi" style="color:var(--plum)">ડૉ. હિમાંશુ બાવીશી</a> અને <a href="/doctors/falguni-bavishi" style="color:var(--plum)">ડૉ. ફાલ્ગુની બાવીશી</a> — દ્વારા સ્થાપિત અને દોરવાયેલ, બધા Bavishi Fertility Institute ક્લિનિક્સ સુખદ અને આધુનિક વાતાવરણમાં ઉચ્ચતમ કક્ષાની કાળજી પ્રદાન કરે છે જેથી તમારી સારવાર <a href="/simple-treatment" style="color:var(--plum)">સરળ</a>, <a href="/safe-treatment" style="color:var(--plum)">સુરક્ષિત</a>, <a href="/smart-treatment" style="color:var(--plum)">સ્માર્ટ</a> અને <a href="/success-benchmarks" style="color:var(--plum)">સફળ</a> બને.',
    image: ABOUT_DEFAULTS.hero.image,
  },
  story: {
    eyebrow: "અમારી કહાણી",
    heading: { lead: "એક પરિવારનું સ્વપ્ન, એક", em: "સંસ્થાનો વારસો" },
    paragraphs: [
      '1998થી આજ સુધી, અમારા સમૃદ્ધ અને સાંસ્કૃતિક વારસાએ અમને એક ફર્ટિલિટી ક્લિનિક પ્રાપ્ત કરી શકે તેવી સૌથી નોંધપાત્ર સિદ્ધિઓ આપી છે. Bavishi Fertility Institute ની ઔપચારિક સ્થાપના <a href="/doctors/himanshu-bavishi"><strong style="color:var(--plum)">ડૉ. હિમાંશુ બાવીશી</strong></a> અને <a href="/doctors/falguni-bavishi"><strong style="color:var(--plum)">ડૉ. ફાલ્ગુની બાવીશી</strong></a> એ <a href="/locations/ahmedabad" style="color:var(--plum);text-decoration:underline">અમદાવાદ</a> માં એક સરળ પણ શક્તિશાળી માન્યતા સાથે કરી: કે વિશ્વસ્તરીય ફર્ટિલિટી કાળજી દરેક પરિવારની પહોંચમાં હોવી જોઈએ. જ્યાં દરેક સારવાર વિજ્ઞાન, નિષ્ઠા અને ઊંડા માનવીય સ્પર્શ સાથે આપવામાં આવે છે. આજે, અમારા કેન્દ્રો દર વર્ષે 3,000 થી વધુ <a href="/what-is-ivf" style="color:var(--plum);text-decoration:underline">IVF</a> સાયકલ કરે છે — વિશ્વના શ્રેષ્ઠ પરિણામોમાંના એક સાથે.',
      'Bavishi Fertility Institute ને 2020 માં ટાઇમ્સ ઓફ ઇન્ડિયા દ્વારા સમગ્ર ભારતમાં નંબર 1 ક્રમાંક આપવામાં આવ્યો અને The Economic Times દ્વારા છ વખત (2019, 2022, 2023, 2024, 2025 અને 2026) <strong style="color:var(--plum)">&ldquo;ભારત &ndash; પશ્ચિમની શ્રેષ્ઠ <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> ચેઇન&rdquo;</strong> તરીકે માન્યતા આપવામાં આવી. એક પારિવારિક ટીમ જે તમારી ફર્ટિલિટી યાત્રાના દરેક પગલે તમારી સાથે ઊભી છે — યાત્રા પહેલાં, દરમિયાન અને પછી દર્દીઓનું સ્વાગત, સાંભળવું અને સલાહ આપવી એ અમારી પ્રાથમિકતા છે.',
      'એક ક્લિનિકથી શરૂ થયેલી આ સંસ્થા આજે એક મલ્ટી-સેન્ટર ઇન્સ્ટિટ્યૂટ બની ગઈ છે જેણે ભારતમાં <a href="/what-is-ivf" style="color:var(--plum);text-decoration:underline">IVF</a> ની શરૂઆત કરી, રાષ્ટ્રીય સ્તરની અનેક પ્રથમ સિદ્ધિઓ મેળવી, અને એક દાયકાથી વધુ પહેલાં બાવીશી પરિવારની બીજી પેઢી — <a href="/doctors/parth-bavishi" style="color:var(--plum);text-decoration:underline">ડૉ. પાર્થ બાવીશી</a> અને <a href="/doctors/janki-bavishi" style="color:var(--plum);text-decoration:underline">ડૉ. જાનકી બાવીશી</a> — તેની સાથે જોડાયા. આ સંસ્થાએ \'દેવના દીધેલા, માંગીને લીધેલા\', \'વિઘ્નદોડ\', \'આપણું અદ્ભુત સર્જન\' અને \'Your Miracle in Making\' જેવા પુસ્તકો તથા Divya Santan સંસ્થા, Jan Jagruti Abhiyan અને Parivar Milan અભિયાનો દ્વારા જાહેર જાગૃતિને પણ પ્રોત્સાહન આપ્યું છે. અમારા મૂલ્યો દરેક કાર્યમાં અમને માર્ગદર્શન આપે છે: <strong style="color:var(--plum)"><a href="/simple-treatment" style="color:var(--plum)">સરળ</a>, <a href="/safe-treatment" style="color:var(--plum)">સુરક્ષિત</a>, <a href="/smart-treatment" style="color:var(--plum)">સ્માર્ટ</a> અને <a href="/success-benchmarks" style="color:var(--plum)">સફળ</a></strong>.',
    ],
  },
  atAGlance: [
    { n: "Since 1998", l: "ભારતમાં ફર્ટિલિટી કાળજીના અગ્રણી" },
    { n: "30,000+", l: "સફળ ગર્ભધારણ" },
    { n: "3,000+", l: "દર વર્ષે IVF સાયકલ" },
    { n: "14", l: "8 શહેરોમાં કેન્દ્રો" },
    { n: "6×", l: "નેશનલ ફર્ટિલિટી એવોર્ડ વિજેતા (2019–2026)" },
  ],
  legacy: {
    eyebrow: "30+ વર્ષોનો વારસો",
    heading: { lead: "એ સીમાચિહ્નો જેણે આકાર આપ્યો", em: "ભારતીય ફર્ટિલિટી કાળજીને" },
  },
  milestones: ABOUT_DEFAULTS.milestones,
  trust: {
    eyebrow: "શા માટે બાવીશી ફર્ટિલિટી સેન્ટર",
    heading: { lead: "ભારતભરના પરિવારો શા માટે કરે છે", em: "Bavishi Fertility Institute પર વિશ્વાસ" },
  },
  trustPillars: [
    { icon: "Award", t: "30+ વર્ષોનો અનુભવ", d: '1998 થી, એક પારિવારિક સંસ્થા જેણે ભારતમાં <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> ની શરૂઆત કરી અને 30,000+ પરિવારોને માતાપિતા બનવામાં માર્ગદર્શન આપ્યું.' },
    { icon: "HeartPulse", t: "પરિણામો જે મહત્વ ધરાવે છે", d: 'સુરક્ષિત સ્ટિમ્યુલેશન, ઉચ્ચ ગુણવત્તાવાળા ભ્રૂણ અને તંદુરસ્ત એકલ ગર્ભધારણ પર ધ્યાન કેન્દ્રિત કરીને દર વર્ષે 3,000+ <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> સાયકલ.' },
    { icon: "Users", t: "નિષ્ણાતોનો પરિવાર", d: 'સ્ત્રીરોગ નિષ્ણાતો, પ્રસૂતિ નિષ્ણાતો, ભ્રૂણવિજ્ઞાનીઓ, મનોવૈજ્ઞાનિકો, પોષણ નિષ્ણાતો, સલાહકારો, સંયોજકો અને મેનેજરો — ફક્ત દર્દીઓની સમસ્યાઓ ઉકેલવા અને તેમની સારવાર માટે સમર્પિત. <a href="/doctors" style="color:var(--plum);text-decoration:underline">અમારા ડોક્ટરોને મળો</a> — 35+ વર્ષોના સહિયારા અનુભવ સાથે.' },
    { icon: "Microscope", t: "વિશ્વસ્તરીય ટેકનોલોજી", d: 'ક્લાસ 1000 <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> લેબ્સ — આંતરરાષ્ટ્રીય ધોરણ કરતાં 10× વધુ સ્વચ્છ — નવીનતમ પેઢીના ICSI, <a href="/cryopreservation" style="color:var(--plum)">વિટ્રિફિકેશન</a> અને PGT સાથે.' },
    { icon: "ShieldCheck", t: "પારદર્શિતા અને નૈતિકતા", d: "પ્રામાણિક પરામર્શ, કોઈ છુપાયેલ ખર્ચ નહીં, દરેક નમૂનાની બમણી ચકાસણી, અને Suraksha Kavach ખાતરી." },
    { icon: "Sparkles", t: "સરળ · સુરક્ષિત · સ્માર્ટ · સફળ", d: 'જ્યારે તમે Bavishi Fertility Institute પસંદ કરો છો, ત્યારે તમારી પસંદગી સાચી છે. ફક્ત સૌથી નવીન અને અનુભવી ફર્ટિલિટી ક્લિનિક્સ જ જટિલ <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> સારવારને <a href="/simple-treatment" style="color:var(--plum)">સરળ</a>, <a href="/safe-treatment" style="color:var(--plum)">સુરક્ષિત</a>, <a href="/smart-treatment" style="color:var(--plum)">સ્માર્ટ</a> અને <a href="/success-benchmarks" style="color:var(--plum)">સફળ</a> બનાવી શકે છે — અને એ જ અમારું \'EASY IVF\' છે.' },
  ],
  patientFirst: {
    eyebrow: "દર્દી પ્રથમ",
    heading: { lead: "સારવાર કરતાં પણ વધુ —", em: "આશાનો સમુદાય" },
    paragraphs: [
      "ફર્ટિલિટી એ એક ઊંડી વ્યક્તિગત યાત્રા છે, અને કોઈ બે વાર્તાઓ સરખી નથી. અદ્યતન પ્રયોગશાળાઓ અને પ્રોટોકોલ્સથી પણ આગળ, જે ખરેખર Bavishi Fertility Institute ને અલગ બનાવે છે તે છે દરેક પગલે ધીરજ, પારદર્શિતા અને સાચી કાળજી સાથે તમારી સાથે ચાલવું.",
      "ભાવનાત્મક પરામર્શ, પોષણ માર્ગદર્શન અને અમારા દર્દી સહાય સમુદાય દ્વારા, પરિવારો ક્યારેય એકલા અનુભવતા નથી. અને <strong style=\"color:var(--plum)\">Suraksha Kavach</strong> ખાતરી સાથે, તમે તમારા બાળક સુધીની યાત્રા પર ધ્યાન કેન્દ્રિત કરી શકો છો.",
    ],
  },
  patientStats: [
    { n: "30,000+", l: "ખુશ પરિવારો" },
    { n: "30+", l: "ફર્ટિલિટી નિપુણતાના વર્ષો" },
    { n: "300+", l: "દર વર્ષે આંતરરાષ્ટ્રીય દર્દીઓ" },
    { n: "8", l: "શહેરો, કાળજીનું એક ધોરણ" },
  ],
  meetSpecialists: {
    eyebrow: "નિષ્ણાતોને મળો",
    heading: { lead: "અમારા", em: "પ્રમોટર ડોક્ટરોને મળો." },
    subtitle: "પેઢીઓ દ્વારા વિશ્વસનીય ફર્ટિલિટી નિષ્ણાતોનો પરિવાર.",
  },
  network: {
    eyebrow: "અમારું નેટવર્ક",
    heading: { lead: "8 ભારતીય શહેરોમાં", em: "14 કેન્દ્રો" },
    subtitle: "વિશ્વસ્તરીય ફર્ટિલિટી કાળજી, તમારા ઘરની નજીક — તમે ગમે ત્યાં હો.",
    cities: ABOUT_DEFAULTS.network.cities,
  },
  finalCta: {
    heading: { lead: "તમારી યાત્રા શરૂ કરો એવા લોકો સાથે", em: "જે કાળજી રાખે છે." },
    ctas: ABOUT_DEFAULTS.finalCta.ctas,
  },
  seo: ABOUT_DEFAULTS.seo,
};

export default function Page() {
  return (
    <>
      <TranslationDemoBanner locale="gu" path="/about-bfi" />
      <AboutPage data={data} />
    </>
  );
}
