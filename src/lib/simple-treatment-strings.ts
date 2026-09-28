/** hi/gu strings for /simple-treatment — keyed by the exact English text (data defaults in
 *  src/lib/simple-treatment.ts + JSX literals in src/components/simple-treatment-page.tsx).
 *  Merged into UI_STRINGS. Brand names / numbers stay in Latin script. */
type S = Record<string, { hi: string; gu: string }>;

export const SIMPLE_TREATMENT_STRINGS: S = {
  // ---- page chrome / SEO ----
  "Simple Treatment": { hi: "सरल उपचार", gu: "સરળ સારવાર" },
  "Simple IVF Treatment": { hi: "सरल IVF उपचार", gu: "સરળ IVF સારવાર" },
  "Simple IVF Treatment — Easy to Understand, Plan & Undergo | Bavishi Fertility Institute": {
    hi: "सरल IVF उपचार — समझने, योजना बनाने और कराने में आसान | Bavishi Fertility Institute",
    gu: "સરળ IVF સારવાર — સમજવામાં, આયોજનમાં અને કરાવવામાં સહેલી | Bavishi Fertility Institute",
  },
  "At Bavishi Fertility Institute, we make complex IVF treatment simple — simple to understand, simple to plan, and simple to undergo. Minimum injections, fewer visits, maximum comfort.": {
    hi: "Bavishi Fertility Institute में हम जटिल IVF उपचार को सरल बनाते हैं — समझने में सरल, योजना बनाने में सरल और कराने में सरल। कम से कम इंजेक्शन, कम विज़िट, ज़्यादा आराम।",
    gu: "Bavishi Fertility Institute માં અમે જટિલ IVF સારવારને સરળ બનાવીએ છીએ — સમજવામાં સરળ, આયોજનમાં સરળ અને કરાવવામાં સરળ. ઓછામાં ઓછા ઇન્જેક્શન, ઓછી વિઝિટ, વધુ આરામ.",
  },
  "We make complex IVF treatment simple — minimum injections, fewer visits, maximum comfort.": {
    hi: "हम जटिल IVF उपचार को सरल बनाते हैं — कम से कम इंजेक्शन, कम विज़िट, ज़्यादा आराम।",
    gu: "અમે જટિલ IVF સારવારને સરળ બનાવીએ છીએ — ઓછામાં ઓછા ઇન્જેક્શન, ઓછી વિઝિટ, વધુ આરામ.",
  },

  // ---- hero ----
  "Simple by Design": { hi: "डिज़ाइन से ही सरल", gu: "ડિઝાઇનથી જ સરળ" },
  "Most Complex things can be made Simple with Science & Care.": {
    hi: "सबसे जटिल चीज़ें भी विज्ञान और देखभाल से सरल बन सकती हैं।",
    gu: "સૌથી જટિલ બાબતો પણ વિજ્ઞાન અને કાળજીથી સરળ બની શકે છે.",
  },
  "Simple with Science & Care.": {
    hi: "विज्ञान और देखभाल से सरल बन सकती हैं।",
    gu: "વિજ્ઞાન અને કાળજીથી સરળ બની શકે છે.",
  },
  "At Bavishi Fertility Institute, with 100+ years combined IVF experience, we have made the most complex IVF treatment SIMPLE.": {
    hi: "Bavishi Fertility Institute में, 100+ वर्षों के संयुक्त IVF अनुभव के साथ, हमने सबसे जटिल IVF उपचार को सरल बना दिया है।",
    gu: "Bavishi Fertility Institute માં, 100+ વર્ષના સંયુક્ત IVF અનુભવ સાથે, અમે સૌથી જટિલ IVF સારવારને સરળ બનાવી દીધી છે.",
  },

  // ---- philosophy ----
  "Our Philosophy": { hi: "हमारी सोच", gu: "અમારી વિચારધારા" },
  "IVF doesn't have to be": { hi: "IVF को", gu: "IVF ને" },
  "complicated.": { hi: "जटिल होना ज़रूरी नहीं।", gu: "જટિલ હોવું જરૂરી નથી." },
  "We strip away the unnecessary — fewer injections, fewer visits, less stress. What remains is a treatment designed around your comfort and confidence.": {
    hi: "हम गैर-ज़रूरी चीज़ें हटा देते हैं — कम इंजेक्शन, कम विज़िट, कम तनाव। जो बचता है, वह है आपके आराम और आत्मविश्वास को ध्यान में रखकर बनाया गया उपचार।",
    gu: "અમે બિનજરૂરી બાબતો દૂર કરીએ છીએ — ઓછા ઇન્જેક્શન, ઓછી વિઝિટ, ઓછો તણાવ. જે બાકી રહે છે તે તમારા આરામ અને આત્મવિશ્વાસને ધ્યાનમાં રાખીને બનાવેલી સારવાર છે.",
  },
  "Minimum Injections": { hi: "कम से कम इंजेक्शन", gu: "ઓછામાં ઓછા ઇન્જેક્શન" },
  "Only essential injections for optimum response — your comfort is our priority.": {
    hi: "बेहतर रिस्पॉन्स के लिए सिर्फ़ ज़रूरी इंजेक्शन — आपका आराम हमारी प्राथमिकता है।",
    gu: "શ્રેષ્ઠ પ્રતિભાવ માટે ફક્ત જરૂરી ઇન્જેક્શન — તમારો આરામ અમારી પ્રાથમિકતા છે.",
  },
  "Fewer Hospital Visits": { hi: "अस्पताल की कम विज़िट", gu: "હોસ્પિટલની ઓછી વિઝિટ" },
  "Sonography at your hometown. Reduced travel, reduced stress.": {
    hi: "सोनोग्राफी आपके अपने शहर में। कम यात्रा, कम तनाव।",
    gu: "સોનોગ્રાફી તમારા પોતાના શહેરમાં. ઓછી મુસાફરી, ઓછો તણાવ.",
  },
  "Zero Error Technique": { hi: "ज़ीरो एरर तकनीक", gu: "ઝીરો એરર ટેકનિક" },
  "Our signature embryo transfer technique — simple, painless, precise.": {
    hi: "हमारी विशिष्ट एम्ब्रियो ट्रांसफर तकनीक — सरल, दर्द-रहित, सटीक।",
    gu: "અમારી વિશિષ્ટ એમ્બ્રિયો ટ્રાન્સફર ટેકનિક — સરળ, પીડારહિત, ચોક્કસ.",
  },
  "Maximum Comfort": { hi: "ज़्यादा से ज़्यादा आराम", gu: "વધુમાં વધુ આરામ" },
  "No unnecessary rest. Return to your routine. Live your life normally.": {
    hi: "गैर-ज़रूरी आराम नहीं। अपनी दिनचर्या में लौटें। सामान्य जीवन जिएँ।",
    gu: "બિનજરૂરી આરામ નહીં. તમારી દિનચર્યામાં પાછા ફરો. સામાન્ય જીવન જીવો.",
  },

  // ---- steps ----
  "The 5-Step Simple IVF Journey": { hi: "सरल IVF की 5 चरणों की यात्रा", gu: "સરળ IVF ની 5 તબક્કાની સફર" },
  "Every step designed for": { hi: "हर चरण आपके", gu: "દરેક તબક્કો તમારા" },
  "your comfort.": { hi: "आराम के लिए बनाया गया।", gu: "આરામ માટે બનાવેલો." },
  "From evaluation to pregnancy test — we have simplified every stage so you can focus on what truly matters.": {
    hi: "जाँच से लेकर प्रेग्नेंसी टेस्ट तक — हमने हर चरण को सरल बनाया है ताकि आप उस पर ध्यान दे सकें जो सच में मायने रखता है।",
    gu: "તપાસથી લઈને પ્રેગ્નન્સી ટેસ્ટ સુધી — અમે દરેક તબક્કાને સરળ બનાવ્યો છે, જેથી તમે ખરેખર મહત્વની બાબત પર ધ્યાન આપી શકો.",
  },
  "Pre-treatment Evaluation": { hi: "उपचार से पहले की जाँच", gu: "સારવાર પહેલાંની તપાસ" },
  "Highly individualized, personalized, minimalistic. You are involved in the decision process — we explain every option, every outcome, so you make informed choices about your own body.": {
    hi: "पूरी तरह आपके अनुसार, व्यक्तिगत और न्यूनतम। निर्णय में आप शामिल रहते हैं — हम हर विकल्प और हर परिणाम समझाते हैं, ताकि आप अपने शरीर के बारे में सोच-समझकर फ़ैसला ले सकें।",
    gu: "સંપૂર્ણપણે વ્યક્તિગત, તમારા અનુસાર અને ન્યૂનતમ. નિર્ણયમાં તમે સામેલ રહો છો — અમે દરેક વિકલ્પ અને દરેક પરિણામ સમજાવીએ છીએ, જેથી તમે તમારા શરીર વિશે સમજી-વિચારીને નિર્ણય લઈ શકો.",
  },
  "Personalized assessment": { hi: "व्यक्तिगत आकलन", gu: "વ્યક્તિગત મૂલ્યાંકન" },
  "Minimalistic approach": { hi: "न्यूनतम दृष्टिकोण", gu: "ન્યૂનતમ અભિગમ" },
  "You decide, we guide": { hi: "फ़ैसला आपका, मार्गदर्शन हमारा", gu: "નિર્ણય તમારો, માર્ગદર્શન અમારું" },
  "Focuses on maximizing your comfort by reducing injections and hospital visits to the bare minimum. Only essential injections for optimum response. Oral and vaginal drugs preferred. Self-injection encouraged. Sonography at your hometown.": {
    hi: "इंजेक्शन और अस्पताल की विज़िट को बिल्कुल न्यूनतम रखकर आपका आराम बढ़ाने पर ध्यान। बेहतर रिस्पॉन्स के लिए सिर्फ़ ज़रूरी इंजेक्शन। मुँह से लेने वाली और वजाइनल दवाओं को प्राथमिकता। खुद इंजेक्शन लगाने को प्रोत्साहन। सोनोग्राफी आपके अपने शहर में।",
    gu: "ઇન્જેક્શન અને હોસ્પિટલની વિઝિટ બિલકુલ ન્યૂનતમ રાખીને તમારો આરામ વધારવા પર ધ્યાન. શ્રેષ્ઠ પ્રતિભાવ માટે ફક્ત જરૂરી ઇન્જેક્શન. મોં દ્વારા લેવાની અને વજાઇનલ દવાઓને પ્રાથમિકતા. જાતે ઇન્જેક્શન લેવાને પ્રોત્સાહન. સોનોગ્રાફી તમારા પોતાના શહેરમાં.",
  },
  "Minimum injections & dosage": { hi: "कम से कम इंजेक्शन और डोज़", gu: "ઓછામાં ઓછા ઇન્જેક્શન અને ડોઝ" },
  "Oral/vaginal drugs preferred": { hi: "मुँह/वजाइनल दवाओं को प्राथमिकता", gu: "મોં/વજાઇનલ દવાઓને પ્રાથમિકતા" },
  "Sonography at hometown": { hi: "अपने शहर में सोनोग्राफी", gu: "પોતાના શહેરમાં સોનોગ્રાફી" },
  "Ovum Pickup": { hi: "एग रिट्रीवल (ओवम पिकअप)", gu: "ઇંડા કાઢવાની પ્રક્રિયા (ઓવમ પિકઅપ)" },
  "Very light and short anaesthesia — you are comfortable throughout. Discharged in just 2 hours. We use the most comfortable OT position and minimize nil-by-mouth time so you can eat sooner.": {
    hi: "बहुत हल्का और कम समय का एनेस्थीसिया — आप पूरे समय आराम में रहते हैं। सिर्फ़ 2 घंटे में डिस्चार्ज। हम OT में सबसे आरामदायक पोज़िशन रखते हैं और खाली पेट रहने का समय कम से कम रखते हैं, ताकि आप जल्दी खा सकें।",
    gu: "ખૂબ હળવું અને ટૂંકા સમયનું એનેસ્થેસિયા — તમે આખો સમય આરામમાં રહો છો. ફક્ત 2 કલાકમાં ડિસ્ચાર્જ. અમે OT માં સૌથી આરામદાયક પોઝિશન રાખીએ છીએ અને ભૂખ્યા રહેવાનો સમય ઓછામાં ઓછો રાખીએ છીએ, જેથી તમે વહેલા જમી શકો.",
  },
  "Light, short anaesthesia": { hi: "हल्का, कम समय का एनेस्थीसिया", gu: "હળવું, ટૂંકું એનેસ્થેસિયા" },
  "Discharged in 2 hours": { hi: "2 घंटे में डिस्चार्ज", gu: "2 કલાકમાં ડિસ્ચાર્જ" },
  "Minimum fasting time": { hi: "खाली पेट रहने का कम समय", gu: "ભૂખ્યા રહેવાનો ઓછો સમય" },
  "Embryo Transfer": { hi: "एम्ब्रियो ट्रांसफर", gu: "એમ્બ્રિયો ટ્રાન્સફર" },
  "Our signature 'Zero Error' technique makes this simple, painless, and easy. After the procedure, you enjoy a brief relaxation session — and can leave and start work after just a few hours.": {
    hi: "हमारी विशिष्ट 'ज़ीरो एरर' तकनीक इसे सरल, दर्द-रहित और आसान बनाती है। प्रक्रिया के बाद आप थोड़ी देर आराम करते हैं — और कुछ ही घंटों में घर जाकर काम शुरू कर सकते हैं।",
    gu: "અમારી વિશિષ્ટ 'ઝીરો એરર' ટેકનિક આને સરળ, પીડારહિત અને સહેલું બનાવે છે. પ્રક્રિયા પછી તમે થોડો સમય આરામ કરો છો — અને થોડા કલાકોમાં જ ઘરે જઈને કામ શરૂ કરી શકો છો.",
  },
  "Signature 'Zero Error' technique": { hi: "विशिष्ट 'ज़ीरो एरर' तकनीक", gu: "વિશિષ્ટ 'ઝીરો એરર' ટેકનિક" },
  "Simple, painless, easy": { hi: "सरल, दर्द-रहित, आसान", gu: "સરળ, પીડારહિત, સહેલું" },
  "Back to work in hours": { hi: "कुछ ही घंटों में काम पर वापसी", gu: "થોડા કલાકોમાં કામ પર પાછા" },
  "Post Embryo Transfer": { hi: "एम्ब्रियो ट्रांसफर के बाद", gu: "એમ્બ્રિયો ટ્રાન્સફર પછી" },
  "NO REST required. We actively encourage you to maintain your routine lifestyle and work. Only minimum required medicines are prescribed. A simple blood pregnancy test can be done at home.": {
    hi: "बेड रेस्ट की कोई ज़रूरत नहीं। हम आपको अपनी सामान्य दिनचर्या और काम जारी रखने के लिए प्रोत्साहित करते हैं। सिर्फ़ ज़रूरी दवाएँ दी जाती हैं। प्रेग्नेंसी का सरल ब्लड टेस्ट घर पर भी कराया जा सकता है।",
    gu: "બેડ રેસ્ટની કોઈ જરૂર નથી. અમે તમને તમારી સામાન્ય દિનચર્યા અને કામ ચાલુ રાખવા પ્રોત્સાહિત કરીએ છીએ. ફક્ત જરૂરી દવાઓ જ આપવામાં આવે છે. પ્રેગ્નન્સીનો સરળ બ્લડ ટેસ્ટ ઘરે પણ કરાવી શકાય છે.",
  },
  "No bed rest needed": { hi: "बेड रेस्ट की ज़रूरत नहीं", gu: "બેડ રેસ્ટની જરૂર નથી" },
  "Routine lifestyle encouraged": { hi: "सामान्य दिनचर्या को प्रोत्साहन", gu: "સામાન્ય દિનચર્યાને પ્રોત્સાહન" },
  "Pregnancy test at home": { hi: "प्रेग्नेंसी टेस्ट घर पर", gu: "પ્રેગ્નન્સી ટેસ્ટ ઘરે" },

  // ---- quote ----
  "We believe the hardest journey deserves the simplest path. Decades of expertise & the most advanced reproductive technology, brought together to make your IVF Simple": {
    hi: "हमारा मानना है कि सबसे कठिन सफ़र को सबसे सरल रास्ता मिलना चाहिए। दशकों का अनुभव और सबसे उन्नत प्रजनन तकनीक, एक साथ — आपकी IVF को सरल बनाने के लिए।",
    gu: "અમારું માનવું છે કે સૌથી કઠિન સફરને સૌથી સરળ માર્ગ મળવો જોઈએ. દાયકાઓનો અનુભવ અને સૌથી અદ્યતન પ્રજનન ટેકનોલોજી, એકસાથે — તમારી IVF ને સરળ બનાવવા માટે.",
  },
  "With over 100 years of combined IVF experience, our specialists have refined every protocol to deliver maximum results with minimum complexity. Simple is not a compromise — it is the result of deep expertise.": {
    hi: "100 से अधिक वर्षों के संयुक्त IVF अनुभव के साथ, हमारे विशेषज्ञों ने हर प्रोटोकॉल को इस तरह निखारा है कि कम से कम जटिलता में ज़्यादा से ज़्यादा परिणाम मिलें। सरल होना समझौता नहीं है — यह गहरे अनुभव का नतीजा है।",
    gu: "100 થી વધુ વર્ષના સંયુક્ત IVF અનુભવ સાથે, અમારા નિષ્ણાતોએ દરેક પ્રોટોકોલને એવો સુધાર્યો છે કે ઓછામાં ઓછી જટિલતામાં વધુમાં વધુ પરિણામ મળે. સરળ હોવું એ સમાધાન નથી — એ ઊંડા અનુભવનું પરિણામ છે.",
  },
  "100+ Years Combined Experience": { hi: "100+ वर्षों का संयुक्त अनुभव", gu: "100+ વર્ષનો સંયુક્ત અનુભવ" },

  // ---- pillars ----
  "Simple to Understand, Plan & Undergo": { hi: "समझने, योजना बनाने और कराने में सरल", gu: "સમજવામાં, આયોજનમાં અને કરાવવામાં સરળ" },
  "Three pillars of": { hi: "सरल IVF के", gu: "સરળ IVF ના" },
  "Simple IVF.": { hi: "तीन स्तंभ।", gu: "ત્રણ સ્તંભ." },
  "Simple to Understand": { hi: "समझने में सरल", gu: "સમજવામાં સરળ" },
  "We explain every step in plain language. No jargon, no confusion. You know exactly what is happening, why it is happening, and what comes next.": {
    hi: "हम हर चरण आसान भाषा में समझाते हैं। कोई कठिन शब्द नहीं, कोई उलझन नहीं। आप जानते हैं कि क्या हो रहा है, क्यों हो रहा है और आगे क्या होगा।",
    gu: "અમે દરેક તબક્કો સરળ ભાષામાં સમજાવીએ છીએ. કોઈ અઘરા શબ્દો નહીં, કોઈ ગૂંચવણ નહીં. તમે જાણો છો કે શું થઈ રહ્યું છે, કેમ થઈ રહ્યું છે અને આગળ શું થશે.",
  },
  "Simple to Plan": { hi: "योजना बनाने में सरल", gu: "આયોજનમાં સરળ" },
  "Fewer hospital visits, hometown sonography, self-injection guidance. We fit the treatment around your life — not the other way around.": {
    hi: "अस्पताल की कम विज़िट, अपने शहर में सोनोग्राफी, खुद इंजेक्शन लगाने का मार्गदर्शन। हम उपचार को आपकी ज़िंदगी के हिसाब से ढालते हैं — आपको उपचार के हिसाब से नहीं।",
    gu: "હોસ્પિટલની ઓછી વિઝિટ, પોતાના શહેરમાં સોનોગ્રાફી, જાતે ઇન્જેક્શન લેવાનું માર્ગદર્શન. અમે સારવારને તમારા જીવન પ્રમાણે ગોઠવીએ છીએ — તમને સારવાર પ્રમાણે નહીં.",
  },
  "Simple to Undergo": { hi: "कराने में सरल", gu: "કરાવવામાં સરળ" },
  "Minimum injections, light anaesthesia, no bed rest. Our Zero Error technique makes embryo transfer painless. You can return to work the same day.": {
    hi: "कम से कम इंजेक्शन, हल्का एनेस्थीसिया, बेड रेस्ट नहीं। हमारी ज़ीरो एरर तकनीक एम्ब्रियो ट्रांसफर को दर्द-रहित बनाती है। आप उसी दिन काम पर लौट सकते हैं।",
    gu: "ઓછામાં ઓછા ઇન્જેક્શન, હળવું એનેસ્થેસિયા, બેડ રેસ્ટ નહીં. અમારી ઝીરો એરર ટેકનિક એમ્બ્રિયો ટ્રાન્સફરને પીડારહિત બનાવે છે. તમે એ જ દિવસે કામ પર પાછા ફરી શકો છો.",
  },

  // ---- final CTA ----
  "Ready to experience": { hi: "क्या आप", gu: "શું તમે" },
  "IVF made simple?": { hi: "सरल IVF का अनुभव करने के लिए तैयार हैं?", gu: "સરળ IVF નો અનુભવ કરવા તૈયાર છો?" },
  "Book a consultation at Bavishi Fertility Institute. Let us show you how science, care, and 100+ years of experience make your journey simple.": {
    hi: "Bavishi Fertility Institute में कंसल्टेशन बुक करें। हम आपको दिखाएँगे कि विज्ञान, देखभाल और 100+ वर्षों का अनुभव आपकी यात्रा को कैसे सरल बनाते हैं।",
    gu: "Bavishi Fertility Institute માં કન્સલ્ટેશન બુક કરો. અમે તમને બતાવીશું કે વિજ્ઞાન, કાળજી અને 100+ વર્ષનો અનુભવ તમારી સફરને કેવી રીતે સરળ બનાવે છે.",
  },
};
