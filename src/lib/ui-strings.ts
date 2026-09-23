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
  "Book Consultation": { hi: "कंसल्टेशन बुक करें", gu: "કન્સલ્ટેશન બુક કરો" },
  "Check IVF Eligibility": { hi: "IVF पात्रता जांचें", gu: "IVF પાત્રતા ચકાસો" },
  "WhatsApp Now": { hi: "व्हाट्सऐप करें", gu: "વોટ્સએપ કરો" },
  "Call Now": { hi: "अभी कॉल करें", gu: "હમણાં કૉલ કરો" },

  // Contact page chrome
  "Home": { hi: "होम", gu: "હોમ" },
  "Contact Us": { hi: "संपर्क करें", gu: "અમારો સંપર્ક કરો" },
  "Call Us": { hi: "कॉल करें", gu: "કૉલ કરો" },
  "Chat with our team": { hi: "हमारी टीम से चैट करें", gu: "અમારી ટીમ સાથે ચેટ કરો" },
  "24×7 phone support — clinic visiting hours vary by centre": { hi: "24×7 फोन सपोर्ट — क्लिनिक विज़िटिंग आवर्स सेंटर के अनुसार अलग-अलग हैं", gu: "24×7 ફોન સપોર્ટ — ક્લિનિક વિઝિટિંગ અવર્સ સેન્ટર પ્રમાણે અલગ-અલગ છે" },
  "Quick replies, every day": { hi: "हर दिन त्वरित जवाब", gu: "દરરોજ ઝડપી જવાબ" },
  "We reply within 24 hours": { hi: "हम 24 घंटों के भीतर जवाब देते हैं", gu: "અમે 24 કલાકમાં જવાબ આપીએ છીએ" },
  "Our Network": { hi: "हमारा नेटवर्क", gu: "અમારું નેટવર્ક" },
  "Find a Bavishi Fertility Institute": { hi: "Bavishi Fertility Institute खोजें", gu: "Bavishi Fertility Institute શોધો" },
  "near you": { hi: "आपके पास", gu: "તમારી નજીક" },
  "14 fertility centres across 8 Indian cities — world-class care, close to home. Phone & WhatsApp support is available 24×7; centre visiting hours are listed below.": { hi: "8 भारतीय शहरों में 14 फर्टिलिटी सेंटर — विश्वस्तरीय देखभाल, घर के पास। फोन और व्हाट्सऐप सपोर्ट 24×7 उपलब्ध है; सेंटर के विज़िटिंग आवर्स नीचे दिए गए हैं।", gu: "8 ભારતીય શહેરોમાં 14 ફર્ટિલિટી સેન્ટર — વિશ્વસ્તરીય સંભાળ, ઘરની નજીક. ફોન અને વોટ્સએપ સપોર્ટ 24×7 ઉપલબ્ધ છે; સેન્ટરના વિઝિટિંગ અવર્સ નીચે આપેલા છે." },
  "Call": { hi: "कॉल", gu: "કૉલ" },
  "Directions": { hi: "दिशा-निर्देश", gu: "દિશા-નિર્દેશો" },
  "Need help choosing the right centre?": { hi: "सही सेंटर चुनने में मदद चाहिए?", gu: "યોગ્ય સેન્ટર પસંદ કરવામાં મદદ જોઈએ છે?" },
  "Our counsellors will guide you to the Bavishi Fertility Institute centre nearest you.": { hi: "हमारे काउंसलर आपको आपके नज़दीकी Bavishi Fertility Institute सेंटर तक मार्गदर्शन देंगे।", gu: "અમારા કાઉન્સેલર્સ તમને તમારા નજીકના Bavishi Fertility Institute સેન્ટર સુધી માર્ગદર્શન આપશે." },
  "FAQ": { hi: "सामान्य प्रश्न", gu: "વારંવાર પુછાતા પ્રશ્નો" },
  "Getting in touch —": { hi: "संपर्क करना —", gu: "સંપર્ક કરવો —" },
  "answered": { hi: "आसान बनाया गया", gu: "સરળ બનાવ્યું" },
  "Your journey to parenthood starts with": { hi: "पेरेंटहुड की आपकी यात्रा शुरू होती है", gu: "પેરેન્ટહુડની તમારી યાત્રા શરૂ થાય છે" },
  "one message.": { hi: "एक संदेश से।", gu: "એક સંદેશથી." },
  "WhatsApp Us": { hi: "व्हाट्सऐप करें", gu: "વોટ્સએપ કરો" },

  // Contact page hero + FAQ content (fallback copy — used when CMS has no hi/gu override)
  "We're here for you": { hi: "हम आपके लिए यहाँ हैं", gu: "અમે તમારા માટે અહીં છીએ" },
  "Contact": { hi: "संपर्क करें", gu: "સંપર્ક કરો" },
  "Have a question or ready to begin? Reach out — confidentially and without obligation. Our fertility counsellors are here to guide your very first step.": { hi: "कोई सवाल है या शुरुआत करने के लिए तैयार हैं? गोपनीय रूप से और बिना किसी दायित्व के संपर्क करें — हमारे फर्टिलिटी काउंसलर आपके पहले कदम में मार्गदर्शन के लिए यहाँ हैं।", gu: "કોઈ પ્રશ્ન છે અથવા શરૂઆત કરવા તૈયાર છો? ગોપનીય રીતે અને કોઈપણ જવાબદારી વિના સંપર્ક કરો — અમારા ફર્ટિલિટી કાઉન્સેલર્સ તમારા પ્રથમ પગલામાં માર્ગદર્શન આપવા માટે અહીં છે." },
  "How do I book an appointment at Bavishi Fertility Institute?": { hi: "मैं Bavishi Fertility Institute में अपॉइंटमेंट कैसे बुक करूं?", gu: "હું Bavishi Fertility Institute માં એપોઇન્ટમેન્ટ કેવી રીતે બુક કરું?" },
  "Fill in the enquiry form on this page, call us on +91 97126 22288, or message us on WhatsApp. Our team will help you choose the nearest centre and a convenient time.": { hi: "इस पेज पर पूछताछ फॉर्म भरें, हमें +91 97126 22288 पर कॉल करें, या व्हाट्सऐप पर संदेश भेजें। हमारी टीम आपको नज़दीकी सेंटर और सुविधाजनक समय चुनने में मदद करेगी।", gu: "આ પેજ પર પૂછપરછ ફોર્મ ભરો, અમને +91 97126 22288 પર કૉલ કરો, અથવા વોટ્સએપ પર સંદેશ મોકલો. અમારી ટીમ તમને નજીકનું સેન્ટર અને અનુકૂળ સમય પસંદ કરવામાં મદદ કરશે." },
  "Which Bavishi Fertility Institute centre is nearest to me?": { hi: "मेरे सबसे नज़दीक कौन सा Bavishi Fertility Institute सेंटर है?", gu: "મારી સૌથી નજીક કયું Bavishi Fertility Institute સેન્ટર છે?" },
  "We have 14 centres across 8 cities — Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi. Tell us your city and we'll connect you to the closest one.": { hi: "हमारे 8 शहरों — अहमदाबाद, मुंबई, वडोदरा, सूरत, भुज, भावनगर, आनंद और वाराणसी — में 14 सेंटर हैं। हमें अपना शहर बताएं, हम आपको सबसे नज़दीकी सेंटर से जोड़ देंगे।", gu: "અમારા 8 શહેરો — અમદાવાદ, મુંબઈ, વડોદરા, સુરત, ભુજ, ભાવનગર, આણંદ અને વારાણસી — માં 14 સેન્ટર છે. અમને તમારું શહેર જણાવો, અમે તમને સૌથી નજીકના સેન્ટર સાથે જોડીશું." },
  "Do you offer free consultations?": { hi: "क्या आप मुफ़्त कंसल्टेशन देते हैं?", gu: "શું તમે મફત કન્સલ્ટેશન આપો છો?" },
  "We understand that choosing the right fertility clinic is an important decision. To ensure every couple receives dedicated time, expert guidance, and a personalised evaluation, our consultations are not offered free of charge. However, we periodically offer special free consultation slots as part of limited-time programs. Please contact us to check current availability.": { hi: "हम समझते हैं कि सही फर्टिलिटी क्लिनिक चुनना एक महत्वपूर्ण निर्णय है। हर कपल को समर्पित समय, विशेषज्ञ मार्गदर्शन और व्यक्तिगत मूल्यांकन मिले, इसके लिए हमारे कंसल्टेशन मुफ़्त नहीं हैं। हालांकि, हम समय-समय पर सीमित अवधि के कार्यक्रमों के तहत विशेष मुफ़्त कंसल्टेशन स्लॉट भी देते हैं। वर्तमान उपलब्धता जानने के लिए कृपया हमसे संपर्क करें।", gu: "અમે સમજીએ છીએ કે યોગ્ય ફર્ટિલિટી ક્લિનિક પસંદ કરવો એ મહત્વનો નિર્ણય છે. દરેક કપલને સમર્પિત સમય, નિષ્ણાત માર્ગદર્શન અને વ્યક્તિગત મૂલ્યાંકન મળે તે માટે, અમારા કન્સલ્ટેશન મફત આપવામાં આવતા નથી. જોકે, અમે સમયાંતરે મર્યાદિત-સમયના કાર્યક્રમો હેઠળ ખાસ મફત કન્સલ્ટેશન સ્લોટ ઓફર કરીએ છીએ. હાલની ઉપલબ્ધતા ચકાસવા કૃપા કરી અમારો સંપર્ક કરો." },
  "Do you treat international patients?": { hi: "क्या आप अंतरराष्ट्रीय मरीज़ों का इलाज करते हैं?", gu: "શું તમે આંતરરાષ્ટ્રીય દર્દીઓની સારવાર કરો છો?" },
  "Yes — 300+ international patients choose Bavishi Fertility Institute every year. We provide end-to-end support including treatment planning and coordination across our 14 centres.": { hi: "हाँ — हर साल 300+ अंतरराष्ट्रीय मरीज़ Bavishi Fertility Institute चुनते हैं। हम अपने 14 सेंटरों में उपचार योजना और समन्वय सहित संपूर्ण सहायता प्रदान करते हैं।", gu: "હા — દર વર્ષે 300+ આંતરરાષ્ટ્રીય દર્દીઓ Bavishi Fertility Institute પસંદ કરે છે. અમે અમારા 14 સેન્ટરમાં સારવાર આયોજન અને સંકલન સહિત સંપૂર્ણ સહાય પૂરી પાડીએ છીએ." },
};

export function ui(key: string, locale: Locale): string {
  return locale === "en" ? key : UI_STRINGS[key]?.[locale] ?? key;
}
