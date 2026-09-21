import type { Locale } from "@/lib/i18n";

/** Hardcoded UI chrome strings (not CMS content). English is the key + fallback.
 *  hi/gu are AI-written — flag for review before go-live. */
export const UI_STRINGS: Record<string, { hi: string; gu: string }> = {
  "Learn more": { hi: "और जानें", gu: "વધુ જાણો" },
  "Patient Story": { hi: "मरीज़ की कहानी", gu: "દર્દીની વાર્તા" },
  "Use Calculator": { hi: "कैलकुलेटर उपयोग करें", gu: "કેલ્ક્યુલેટર વાપરો" },
  "View Centre": { hi: "सेंटर देखें", gu: "સેન્ટર જુઓ" },
  "View all awards & achievements": { hi: "सभी पुरस्कार और उपलब्धियाँ देखें", gu: "બધા એવોર્ડ અને સિદ્ધિઓ જુઓ" },
  "View More Events": { hi: "और कार्यक्रम देखें", gu: "વધુ કાર્યક્રમો જુઓ" },
  "Patient review": { hi: "मरीज़ की समीक्षा", gu: "દર્દીની સમીક્ષા" },
  "Google review": { hi: "Google समीक्षा", gu: "Google સમીક્ષા" },
  "* Terms and conditions apply.": { hi: "* नियम एवं शर्तें लागू।", gu: "* નિયમો અને શરતો લાગુ." },
  "Full Name *": { hi: "पूरा नाम *", gu: "પૂરું નામ *" },
  "Phone *": { hi: "फ़ोन *", gu: "ફોન *" },
  "Email": { hi: "ईमेल", gu: "ઇમેઇલ" },
  "Treatment of Interest": { hi: "रुचि का उपचार", gu: "રસની સારવાર" },
  "Preferred Centre": { hi: "पसंदीदा सेंटर", gu: "પસંદગીનું સેન્ટર" },
  "Message": { hi: "संदेश", gu: "સંદેશ" },
  "Sending…": { hi: "भेजा जा रहा है…", gu: "મોકલી રહ્યા છીએ…" },
  "Request a Callback": { hi: "कॉलबैक का अनुरोध करें", gu: "કૉલબેકની વિનંતી કરો" },
  "India's Trusted Fertility Experts · Since 1998": { hi: "भारत के विश्वसनीय फर्टिलिटी विशेषज्ञ · 1998 से", gu: "ભારતના વિશ્વસનીય ફર્ટિલિટી નિષ્ણાતો · 1998 થી" },
  "WhatsApp": { hi: "व्हाट्सऐप", gu: "વોટ્સએપ" },
  "24×7 Care": { hi: "24×7 देखभाल", gu: "24×7 સંભાળ" },
};

export function ui(key: string, locale: Locale): string {
  return locale === "en" ? key : UI_STRINGS[key]?.[locale] ?? key;
}
