/** hi/gu strings for /history — keyed by the exact English text (data defaults in
 *  src/lib/history.ts + JSX literals in src/components/history-page.tsx).
 *  Merged into UI_STRINGS. The timeline itself comes from getAbout(locale). */
import { HISTORY_DEFAULTS as D } from "@/lib/history";

type S = Record<string, { hi: string; gu: string }>;

export const HISTORY_STRINGS: S = {
  // ---- page chrome / SEO ----
  "History": { hi: "हमारा इतिहास", gu: "અમારો ઇતિહાસ" },
  "History of Bavishi Fertility Institute": { hi: "Bavishi Fertility Institute का इतिहास", gu: "Bavishi Fertility Institute નો ઇતિહાસ" },
  "History — 35+ Years of Fertility Care | Bavishi Fertility Institute": {
    hi: "इतिहास — 35+ साल की फर्टिलिटी केयर | Bavishi Fertility Institute",
    gu: "ઇતિહાસ — 35+ વર્ષની ફર્ટિલિટી કેર | Bavishi Fertility Institute",
  },
  "From humble beginnings in 1986 to India's No. 1 ranked fertility clinic. Explore the landmark milestones and achievements of Bavishi Fertility Institute.": {
    hi: "1986 की छोटी-सी शुरुआत से भारत की नंबर 1 फर्टिलिटी क्लिनिक तक। Bavishi Fertility Institute के अहम पड़ावों और उपलब्धियों को जानिए।",
    gu: "1986 ની નાની શરૂઆતથી ભારતની નંબર 1 ફર્ટિલિટી ક્લિનિક સુધી. Bavishi Fertility Institute ના મહત્વના પડાવો અને સિદ્ધિઓ જાણો.",
  },
  "35+ years of landmark achievements in fertility care — from 1986 to present day.": {
    hi: "फर्टिलिटी केयर में 35+ साल की यादगार उपलब्धियाँ — 1986 से आज तक।",
    gu: "ફર્ટિલિટી કેરમાં 35+ વર્ષની યાદગાર સિદ્ધિઓ — 1986 થી આજ સુધી.",
  },
  "About BFI": { hi: "BFI के बारे में", gu: "BFI વિશે" },
  "Present Day": { hi: "आज", gu: "આજે" },
  "Be part of our": { hi: "हमारे", gu: "અમારા" },
  "next chapter.": { hi: "अगले अध्याय का हिस्सा बनें।", gu: "આગલા પ્રકરણનો ભાગ બનો." },
  "35+ years of trust, 30,000+ successful pregnancies, and counting. Book a consultation to start your own family's story with Bavishi Fertility Institute.": {
    hi: "35+ साल का भरोसा, 30,000+ सफल गर्भावस्था, और यह सिलसिला जारी है। कंसल्टेशन बुक करें और Bavishi Fertility Institute के साथ अपने परिवार की कहानी शुरू करें।",
    gu: "35+ વર્ષનો ભરોસો, 30,000+ સફળ ગર્ભાવસ્થા, અને આ સિલસિલો ચાલુ છે. કન્સલ્ટેશન બુક કરો અને Bavishi Fertility Institute સાથે તમારા પરિવારની વાર્તા શરૂ કરો.",
  },

  // ---- Sanity/default data ----
  [D.hero.eyebrow]: { hi: "हमारा इतिहास", gu: "અમારો ઇતિહાસ" },
  [D.hero.headline]: { hi: "छोटी-सी शुरुआत से भारत में सर्वश्रेष्ठ तक", gu: "નાની શરૂઆતથી ભારતમાં શ્રેષ્ઠ સુધી" },
  [D.hero.headlineEm]: { hi: "भारत में सर्वश्रेष्ठ", gu: "ભારતમાં શ્રેષ્ઠ" },
  [D.hero.paragraph]: {
    hi: "1986 से आज तक, इन सालों में हमने जो अहम उपलब्धियाँ हासिल की हैं, उनमें से कुछ यहाँ हैं।",
    gu: "1986 થી આજ સુધી, આ વર્ષોમાં અમે મેળવેલી મહત્વની સિદ્ધિઓમાંથી કેટલીક અહીં છે.",
  },
  [D.presentDay.heading]: { hi: "भारत का नंबर 1 फर्टिलिटी इंस्टीट्यूट", gu: "ભારતની નંબર 1 ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ" },
  [D.presentDay.paragraph]: {
    hi: 'आज Bavishi Fertility Institute 8 शहरों के 14 सेंटरों में <strong class="text-[color:var(--plum)]">30,000+ सफल गर्भावस्था</strong> का आँकड़ा पार कर चुका है। हमारा संकल्प पहले दिन जैसा ही है: बेहतरीन सेवा, आधुनिक रिप्रोडक्टिव तकनीक, और सफ़र के हर कदम पर मरीज़ का पूरा साथ।',
    gu: 'આજે Bavishi Fertility Institute 8 શહેરોના 14 સેન્ટરોમાં <strong class="text-[color:var(--plum)]">30,000+ સફળ ગર્ભાવસ્થા</strong> નો આંકડો પાર કરી ચૂક્યું છે. અમારો સંકલ્પ પહેલા દિવસ જેવો જ છે: શ્રેષ્ઠ સેવા, આધુનિક રિપ્રોડક્ટિવ ટેકનોલોજી, અને સફરના દરેક પગલે દર્દીનો સંપૂર્ણ સાથ.',
  },
};
