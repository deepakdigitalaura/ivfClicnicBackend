import { AboutPage } from "@/components/about-page";
import { TranslationDemoBanner } from "@/components/translation-demo-banner";
import { ABOUT_DEFAULTS, type AboutData } from "@/lib/about";

export const metadata = { title: "About BFI (Hindi Preview) — Bavishi Fertility Institute" };

// Demo-only translation of ABOUT_DEFAULTS into Hindi. Only human-readable
// string values are translated; structure, links, image paths, icon names
// and numeric stats are left untouched so the AboutData type stays satisfied.
const data: AboutData = {
  hero: {
    eyebrow: "बावीशी फर्टिलिटी इंस्टीट्यूट के बारे में — 1998 से IVF के अग्रणी",
    headline: "तीन दशकों से अधिक की फर्टिलिटी उत्कृष्टता — तकनीक और विश्वास पर निर्मित",
    headlineItalic: "फर्टिलिटी उत्कृष्टता",
    paragraph:
      'बावीशी परिवार के प्रसिद्ध विशेषज्ञों — <a href="/doctors/himanshu-bavishi" style="color:var(--plum)">डॉ. हिमांशु बावीशी</a> और <a href="/doctors/falguni-bavishi" style="color:var(--plum)">डॉ. फाल्गुनी बावीशी</a> — द्वारा स्थापित और नेतृत्वित, सभी Bavishi Fertility Institute क्लीनिक एक सुखद और आधुनिक वातावरण में अत्यंत उच्च स्तर की देखभाल प्रदान करते हैं ताकि आपका उपचार <a href="/simple-treatment" style="color:var(--plum)">सरल</a>, <a href="/safe-treatment" style="color:var(--plum)">सुरक्षित</a>, <a href="/smart-treatment" style="color:var(--plum)">स्मार्ट</a> और <a href="/success-benchmarks" style="color:var(--plum)">सफल</a> बन सके।',
    image: ABOUT_DEFAULTS.hero.image,
  },
  story: {
    eyebrow: "हमारी कहानी",
    heading: { lead: "एक परिवार का दृष्टिकोण, एक", em: "संस्थान की विरासत" },
    paragraphs: [
      'वर्ष 1998 से आज तक, हमारी समृद्ध और सांस्कृतिक विरासत ने हमें एक फर्टिलिटी क्लिनिक की सबसे उल्लेखनीय उपलब्धियां दी हैं। Bavishi Fertility Institute की औपचारिक स्थापना <a href="/doctors/himanshu-bavishi"><strong style="color:var(--plum)">डॉ. हिमांशु बावीशी</strong></a> और <a href="/doctors/falguni-bavishi"><strong style="color:var(--plum)">डॉ. फाल्गुनी बावीशी</strong></a> ने <a href="/locations/ahmedabad" style="color:var(--plum);text-decoration:underline">अहमदाबाद</a> में एक सरल किन्तु शक्तिशाली विश्वास के साथ की: कि विश्वस्तरीय फर्टिलिटी देखभाल हर परिवार की पहुंच में होनी चाहिए। जहां हर उपचार विज्ञान, ईमानदारी और गहरे मानवीय स्पर्श के साथ दिया जाता है। आज, हमारे केंद्र प्रतिवर्ष 3,000 से अधिक <a href="/what-is-ivf" style="color:var(--plum);text-decoration:underline">IVF</a> साइकिल करते हैं — दुनिया के सर्वश्रेष्ठ परिणामों में से एक के साथ।',
      'Bavishi Fertility Institute को 2020 में टाइम्स ऑफ इंडिया द्वारा पूरे भारत में नंबर 1 स्थान दिया गया और इसे The Economic Times द्वारा छह बार (2019, 2022, 2023, 2024, 2025 और 2026) <strong style="color:var(--plum)">&ldquo;भारत &ndash; पश्चिम की सर्वश्रेष्ठ <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> चेन&rdquo;</strong> के रूप में मान्यता दी गई। एक पारिवारिक टीम जो आपकी फर्टिलिटी यात्रा के हर कदम पर आपके साथ खड़ी है — यात्रा से पहले, दौरान और बाद में मरीजों का स्वागत, उनकी बात सुनना और उन्हें सलाह देना हमारी प्राथमिकता है।',
      'एक क्लिनिक के रूप में शुरू हुआ यह संस्थान आज एक मल्टी-सेंटर इंस्टीट्यूट बन चुका है जिसने भारत में <a href="/what-is-ivf" style="color:var(--plum);text-decoration:underline">IVF</a> की शुरुआत की, राष्ट्रीय स्तर की कई पहली उपलब्धियां हासिल कीं, और एक दशक से अधिक पहले बावीशी परिवार की दूसरी पीढ़ी — <a href="/doctors/parth-bavishi" style="color:var(--plum);text-decoration:underline">डॉ. पार्थ बावीशी</a> और <a href="/doctors/janki-bavishi" style="color:var(--plum);text-decoration:underline">डॉ. जांकी बावीशी</a> — इससे जुड़ीं। इस संस्थान ने \'देवना दीधेला, मांगीने लीधेला\', \'विघ्नदोड़\', \'आपणु अद्भुत सर्जन\' और \'Your Miracle in Making\' जैसी पुस्तकों तथा Divya Santan संगठन, Jan Jagruti Abhiyan और Parivar Milan अभियानों के माध्यम से जन-जागरूकता को भी बढ़ावा दिया है। हमारे मूल्य हर काम में हमारा मार्गदर्शन करते हैं: <strong style="color:var(--plum)"><a href="/simple-treatment" style="color:var(--plum)">सरल</a>, <a href="/safe-treatment" style="color:var(--plum)">सुरक्षित</a>, <a href="/smart-treatment" style="color:var(--plum)">स्मार्ट</a> और <a href="/success-benchmarks" style="color:var(--plum)">सफल</a></strong>।',
    ],
  },
  atAGlance: [
    { n: "Since 1998", l: "भारत में फर्टिलिटी देखभाल के अग्रणी" },
    { n: "30,000+", l: "सफल गर्भधारण" },
    { n: "3,000+", l: "प्रतिवर्ष IVF साइकिल" },
    { n: "14", l: "8 शहरों में केंद्र" },
    { n: "6×", l: "नेशनल फर्टिलिटी अवार्ड विजेता (2019–2026)" },
  ],
  legacy: {
    eyebrow: "30+ वर्षों की विरासत",
    heading: { lead: "वे मील के पत्थर जिन्होंने आकार दिया", em: "भारतीय फर्टिलिटी देखभाल को" },
  },
  milestones: ABOUT_DEFAULTS.milestones,
  trust: {
    eyebrow: "बावीशी फर्टिलिटी सेंटर क्यों",
    heading: { lead: "भारत भर के परिवार क्यों करते हैं", em: "Bavishi Fertility Institute पर भरोसा" },
  },
  trustPillars: [
    { icon: "Award", t: "30+ वर्षों का अनुभव", d: '1998 से, एक पारिवारिक संस्थान जिसने भारत में <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> की शुरुआत की और 30,000+ परिवारों को माता-पिता बनने में मार्गदर्शन दिया।' },
    { icon: "HeartPulse", t: "परिणाम जो मायने रखते हैं", d: 'सुरक्षित स्टिमुलेशन, उच्चतम गुणवत्ता वाले भ्रूण और स्वस्थ एकल गर्भधारण पर ध्यान देते हुए प्रतिवर्ष 3,000+ <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> साइकिल।' },
    { icon: "Users", t: "विशेषज्ञों का एक परिवार", d: 'स्त्रीरोग विशेषज्ञ, प्रसूति विशेषज्ञ, भ्रूणविज्ञानी, मनोवैज्ञानिक, पोषण विशेषज्ञ, सलाहकार, समन्वयक और प्रबंधक — विशेष रूप से मरीजों की समस्याओं को हल करने और उनका इलाज करने के लिए समर्पित। <a href="/doctors" style="color:var(--plum);text-decoration:underline">हमारे डॉक्टरों से मिलें</a> — 35+ वर्षों के साझा अनुभव के साथ।' },
    { icon: "Microscope", t: "विश्वस्तरीय तकनीक", d: 'क्लास 1000 <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> लैब्स — अंतरराष्ट्रीय मानक से 10× अधिक स्वच्छ — नवीनतम पीढ़ी की ICSI, <a href="/cryopreservation" style="color:var(--plum)">विट्रिफिकेशन</a> और PGT के साथ।' },
    { icon: "ShieldCheck", t: "पारदर्शिता और नैतिकता", d: "ईमानदार परामर्श, कोई छिपी हुई लागत नहीं, हर सैंपल की दोहरी जांच, और Suraksha Kavach आश्वासन।" },
    { icon: "Sparkles", t: "सरल · सुरक्षित · स्मार्ट · सफल", d: 'जब आप Bavishi Fertility Institute चुनते हैं, तो आपका चुनाव सही है। केवल सबसे नवीन और अनुभवी फर्टिलिटी क्लीनिक ही जटिल <a href="/what-is-ivf" style="color:var(--plum)">IVF</a> उपचार को <a href="/simple-treatment" style="color:var(--plum)">सरल</a>, <a href="/safe-treatment" style="color:var(--plum)">सुरक्षित</a>, <a href="/smart-treatment" style="color:var(--plum)">स्मार्ट</a> और <a href="/success-benchmarks" style="color:var(--plum)">सफल</a> बना सकते हैं — और यही हमारा \'EASY IVF\' है।' },
  ],
  patientFirst: {
    eyebrow: "मरीज सर्वप्रथम",
    heading: { lead: "उपचार से कहीं अधिक —", em: "आशा का एक समुदाय" },
    paragraphs: [
      "फर्टिलिटी एक गहरी व्यक्तिगत यात्रा है, और कोई भी दो कहानियां एक जैसी नहीं होतीं। उन्नत प्रयोगशालाओं और प्रोटोकॉल्स से परे, जो चीज़ Bavishi Fertility Institute को वास्तव में अलग बनाती है, वह है हर कदम पर धैर्य, पारदर्शिता और सच्ची देखभाल के साथ आपके साथ चलना।",
      "भावनात्मक परामर्श, पोषण मार्गदर्शन और हमारे मरीज सहायता समुदाय के माध्यम से, परिवार कभी अकेला महसूस नहीं करते। और <strong style=\"color:var(--plum)\">Suraksha Kavach</strong> आश्वासन के साथ, आप उस पर ध्यान केंद्रित कर सकते हैं जो सबसे महत्वपूर्ण है — अपने बच्चे तक की यात्रा।",
    ],
  },
  patientStats: [
    { n: "30,000+", l: "खुशहाल परिवार" },
    { n: "30+", l: "फर्टिलिटी विशेषज्ञता के वर्ष" },
    { n: "300+", l: "प्रतिवर्ष अंतरराष्ट्रीय मरीज" },
    { n: "8", l: "शहर, देखभाल का एक मानक" },
  ],
  meetSpecialists: {
    eyebrow: "विशेषज्ञों से मिलें",
    heading: { lead: "हमारे", em: "प्रवर्तक डॉक्टरों से मिलें।" },
    subtitle: "पीढ़ियों द्वारा भरोसा किया गया फर्टिलिटी विशेषज्ञों का परिवार।",
  },
  network: {
    eyebrow: "हमारा नेटवर्क",
    heading: { lead: "8 भारतीय शहरों में", em: "14 केंद्र" },
    subtitle: "विश्वस्तरीय फर्टिलिटी देखभाल, आपके घर के पास — जहां भी आप हों।",
    cities: ABOUT_DEFAULTS.network.cities,
  },
  finalCta: {
    heading: { lead: "अपनी यात्रा शुरू करें उन लोगों के साथ", em: "जो परवाह करते हैं।" },
    ctas: ABOUT_DEFAULTS.finalCta.ctas,
  },
  seo: ABOUT_DEFAULTS.seo,
};

export default function Page() {
  return (
    <>
      <TranslationDemoBanner locale="hi" path="/about-bfi" />
      <AboutPage data={data} />
    </>
  );
}
