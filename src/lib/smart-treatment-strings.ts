/** hi/gu strings for /smart-treatment — keyed by the exact English text (data defaults in
 *  src/lib/smart-treatment.ts + JSX literals in src/components/smart-treatment-page.tsx).
 *  Merged into UI_STRINGS. Brand names / numbers stay in Latin script. */
type S = Record<string, { hi: string; gu: string }>;

export const SMART_TREATMENT_STRINGS: S = {
  // ---- page chrome / SEO ----
  "Smart Treatment": { hi: "स्मार्ट उपचार", gu: "સ્માર્ટ સારવાર" },
  "Smart IVF Treatment": { hi: "स्मार्ट IVF उपचार", gu: "સ્માર્ટ IVF સારવાર" },
  "Smart IVF Treatment — Intelligent Care, Optimal Results | Bavishi Fertility Institute": {
    hi: "स्मार्ट IVF उपचार — समझदार देखभाल, बेहतरीन नतीजे | Bavishi Fertility Institute",
    gu: "સ્માર્ટ IVF સારવાર — સમજદાર સંભાળ, શ્રેષ્ઠ પરિણામો | Bavishi Fertility Institute",
  },
  "Smart treatments and steady care at Bavishi Fertility Institute. Smart use of technology, smart monitoring, smart diagnosis, and calibrated cost package options.": {
    hi: "Bavishi Fertility Institute में स्मार्ट उपचार और भरोसेमंद देखभाल। तकनीक का स्मार्ट इस्तेमाल, स्मार्ट मॉनिटरिंग, स्मार्ट डायग्नोसिस और सोच-समझकर बनाए गए किफायती पैकेज।",
    gu: "Bavishi Fertility Institute માં સ્માર્ટ સારવાર અને વિશ્વસનીય સંભાળ. ટેકનોલોજીનો સ્માર્ટ ઉપયોગ, સ્માર્ટ મોનિટરિંગ, સ્માર્ટ ડાયગ્નોસિસ અને વિચારપૂર્વક બનાવેલા પોસાય તેવા પેકેજ.",
  },
  "Smart treatments and steady care. Intelligent technology, monitoring, diagnosis, and affordable packages.": {
    hi: "स्मार्ट उपचार और भरोसेमंद देखभाल। समझदार तकनीक, मॉनिटरिंग, डायग्नोसिस और किफायती पैकेज।",
    gu: "સ્માર્ટ સારવાર અને વિશ્વસનીય સંભાળ. સમજદાર ટેકનોલોજી, મોનિટરિંગ, ડાયગ્નોસિસ અને પોસાય તેવા પેકેજ.",
  },

  // ---- hero ----
  "Intelligent Fertility Care": { hi: "समझदार फर्टिलिटी केयर", gu: "સમજદાર ફર્ટિલિટી કેર" },
  "Smart Treatments and Steady Care Meets the Goal.": { hi: "स्मार्ट उपचार और भरोसेमंद देखभाल, मंज़िल तक पहुंचाए।", gu: "સ્માર્ટ સારવાર અને વિશ્વસનીય સંભાળ, લક્ષ્ય સુધી પહોંચાડે." },
  "Meets the Goal.": { hi: "मंज़िल तक पहुंचाए।", gu: "લક્ષ્ય સુધી પહોંચાડે." },
  "The most important decision of your life — having a child and starting a family — calls for a personalized smart strategy. At Bavishi Fertility Institute, every step is intelligent, every choice is data-driven, and every outcome is optimized for your success.": {
    hi: "आपकी ज़िंदगी का सबसे अहम फ़ैसला — बच्चा पाना और परिवार शुरू करना — एक सोची-समझी, आपके लिए बनी स्मार्ट योजना मांगता है। Bavishi Fertility Institute में हर कदम समझदारी से उठता है, हर फ़ैसला डेटा पर टिका होता है, और हर नतीजा आपकी सफलता के लिए बेहतर बनाया जाता है।",
    gu: "તમારા જીવનનો સૌથી મહત્વનો નિર્ણય — બાળક મેળવવું અને પરિવાર શરૂ કરવો — તમારા માટે ખાસ બનાવેલી સ્માર્ટ યોજના માગે છે. Bavishi Fertility Institute માં દરેક પગલું સમજદારીથી લેવાય છે, દરેક નિર્ણય ડેટા પર આધારિત હોય છે, અને દરેક પરિણામ તમારી સફળતા માટે વધુ સારું બનાવાય છે.",
  },

  // ---- pillars ----
  "Smart Technology": { hi: "स्मार्ट तकनीक", gu: "સ્માર્ટ ટેકનોલોજી" },
  "Smart Monitoring": { hi: "स्मार्ट मॉनिटरिंग", gu: "સ્માર્ટ મોનિટરિંગ" },
  "Smart Selection": { hi: "स्मार्ट चयन", gu: "સ્માર્ટ પસંદગી" },
  "AI & Big Data": { hi: "AI और बिग डेटा", gu: "AI અને બિગ ડેટા" },
  "Cloud Computing": { hi: "क्लाउड कंप्यूटिंग", gu: "ક્લાઉડ કમ્પ્યુટિંગ" },
  "IoT Enabled": { hi: "IoT से लैस", gu: "IoT સક્ષમ" },

  // ---- intro ----
  "The Smart Approach": { hi: "स्मार्ट तरीका", gu: "સ્માર્ટ અભિગમ" },
  "Why “smart” isn't just a": { hi: "हमारे लिए “स्मार्ट” सिर्फ़ एक", gu: "અમારા માટે “સ્માર્ટ” માત્ર એક" },
  "buzzword for us.": { hi: "फ़ैशनेबल शब्द नहीं है।", gu: "ફેશનેબલ શબ્દ નથી." },
  "Most fertility clinics offer treatment. We offer intelligent treatment — where every decision is backed by data, every process is optimized for efficiency, and every recommendation is tailored to your unique biology. From diagnosis to delivery, our smart approach means fewer unnecessary procedures, lower costs, and higher success rates.": {
    hi: "ज़्यादातर फर्टिलिटी क्लिनिक इलाज देते हैं। हम समझदारी भरा इलाज देते हैं — जहां हर फ़ैसला डेटा पर टिका होता है, हर प्रक्रिया कुशलता के लिए बेहतर बनाई जाती है, और हर सलाह आपके शरीर की खास ज़रूरतों के हिसाब से होती है। जांच से लेकर डिलीवरी तक, हमारे स्मार्ट तरीके का मतलब है कम गैर-ज़रूरी प्रक्रियाएं, कम खर्च और ज़्यादा सफलता।",
    gu: "મોટા ભાગના ફર્ટિલિટી ક્લિનિક સારવાર આપે છે. અમે સમજદાર સારવાર આપીએ છીએ — જ્યાં દરેક નિર્ણય ડેટા પર આધારિત હોય છે, દરેક પ્રક્રિયા કાર્યક્ષમતા માટે શ્રેષ્ઠ બનાવાય છે, અને દરેક સલાહ તમારા શરીરની ખાસ જરૂરિયાત મુજબ હોય છે. તપાસથી લઈને ડિલિવરી સુધી, અમારા સ્માર્ટ અભિગમનો અર્થ છે ઓછી બિનજરૂરી પ્રક્રિયાઓ, ઓછો ખર્ચ અને વધુ સફળતા.",
  },

  // ---- features grid ----
  "Smart Care Pillars": { hi: "स्मार्ट केयर के स्तंभ", gu: "સ્માર્ટ કેરના સ્તંભ" },
  "Eight pillars of": { hi: "समझदार फर्टिलिटी केयर के", gu: "સમજદાર ફર્ટિલિટી કેરના" },
  "intelligent fertility care.": { hi: "आठ स्तंभ।", gu: "આઠ સ્તંભ." },
  "Each pillar works together to create a treatment ecosystem that is efficient, affordable, and optimized for the best possible outcome.": {
    hi: "हर स्तंभ मिलकर ऐसा इलाज-तंत्र बनाता है जो कुशल है, किफायती है और सबसे अच्छे नतीजे के लिए तैयार किया गया है।",
    gu: "દરેક સ્તંભ સાથે મળીને એવી સારવાર-વ્યવસ્થા બનાવે છે જે કાર્યક્ષમ છે, પોસાય તેવી છે અને શ્રેષ્ઠ પરિણામ માટે તૈયાર કરાયેલી છે.",
  },

  "Smart Use of Technology": { hi: "तकनीक का स्मार्ट इस्तेमाल", gu: "ટેકનોલોજીનો સ્માર્ટ ઉપયોગ" },
  "All technology under one roof — advanced IVF labs, ultrasound suites, operation theatres, and diagnostic centres. We carefully suggest only the treatment options worth the extra cost for your individual case, never unnecessary add-ons.": {
    hi: "सारी तकनीक एक ही छत के नीचे — एडवांस्ड IVF लैब, अल्ट्रासाउंड सूट, ऑपरेशन थिएटर और डायग्नोस्टिक सेंटर। हम आपके केस के लिए सिर्फ़ वही विकल्प सुझाते हैं जिनका अतिरिक्त खर्च वाकई सार्थक हो, फ़ालतू ऐड-ऑन कभी नहीं।",
    gu: "બધી ટેકનોલોજી એક જ છત નીચે — એડવાન્સ્ડ IVF લેબ, અલ્ટ્રાસાઉન્ડ સ્યુટ, ઓપરેશન થિયેટર અને ડાયગ્નોસ્ટિક સેન્ટર. અમે તમારા કેસ માટે માત્ર એવા જ વિકલ્પો સૂચવીએ છીએ જેનો વધારાનો ખર્ચ ખરેખર યોગ્ય હોય, બિનજરૂરી ઍડ-ઑન ક્યારેય નહીં.",
  },
  "State-of-the-art IVF laboratory": { hi: "अत्याधुनिक IVF लैबोरेटरी", gu: "અત્યાધુનિક IVF લેબોરેટરી" },
  "Integrated diagnostic centre": { hi: "एकीकृत डायग्नोस्टिक सेंटर", gu: "સંકલિત ડાયગ્નોસ્ટિક સેન્ટર" },
  "Cost-effective technology recommendations": { hi: "किफायती तकनीक की सलाह", gu: "ખર્ચ-અસરકારક ટેકનોલોજી સલાહ" },

  "We monitor all clinical and IVF lab KPIs — fertilization rate, embryo formation rate, embryo quality index, and more. Early problem detection before it affects your outcomes gives us the advantage of course-correcting in real time.": {
    hi: "हम सभी क्लिनिकल और IVF लैब KPI पर नज़र रखते हैं — फर्टिलाइज़ेशन रेट, एम्ब्रियो बनने की दर, एम्ब्रियो क्वालिटी इंडेक्स और भी बहुत कुछ। नतीजों पर असर पड़ने से पहले ही समस्या पकड़ लेने से हम उसी समय सुधार कर पाते हैं।",
    gu: "અમે બધા ક્લિનિકલ અને IVF લેબ KPI પર નજર રાખીએ છીએ — ફર્ટિલાઇઝેશન રેટ, એમ્બ્રિયો બનવાનો દર, એમ્બ્રિયો ક્વોલિટી ઇન્ડેક્સ અને બીજું ઘણું. પરિણામોને અસર થાય તે પહેલાં જ સમસ્યા પકડાઈ જવાથી અમે તે જ સમયે સુધારો કરી શકીએ છીએ.",
  },
  "Real-time lab KPI tracking": { hi: "लैब KPI की रियल-टाइम ट्रैकिंग", gu: "લેબ KPI નું રિયલ-ટાઇમ ટ્રેકિંગ" },
  "Fertilization & embryo quality index": { hi: "फर्टिलाइज़ेशन और एम्ब्रियो क्वालिटी इंडेक्स", gu: "ફર્ટિલાઇઝેશન અને એમ્બ્રિયો ક્વોલિટી ઇન્ડેક્સ" },
  "Early anomaly detection": { hi: "गड़बड़ी की शुरुआती पहचान", gu: "ગરબડની વહેલી ઓળખ" },

  "Smart Treatment Selection": { hi: "उपचार का स्मार्ट चयन", gu: "સારવારની સ્માર્ટ પસંદગી" },
  "Correct and smart choice of treatment is the first step to your success. Our team has a unique ability to predict IVF success at the start of treatment and again at embryo transfer — giving you clarity and confidence at every stage.": {
    hi: "सही और समझदारी भरा उपचार चुनना आपकी सफलता की पहली सीढ़ी है। हमारी टीम इलाज की शुरुआत में और फिर एम्ब्रियो ट्रांसफ़र के समय IVF की सफलता का अनुमान लगाने में खास महारत रखती है — जिससे हर चरण पर आपको स्पष्टता और भरोसा मिलता है।",
    gu: "સાચી અને સમજદાર સારવારની પસંદગી તમારી સફળતાનું પહેલું પગલું છે. અમારી ટીમ સારવારની શરૂઆતમાં અને ફરી એમ્બ્રિયો ટ્રાન્સફર વખતે IVF ની સફળતાનું અનુમાન લગાવવાની ખાસ ક્ષમતા ધરાવે છે — જેથી દરેક તબક્કે તમને સ્પષ્ટતા અને વિશ્વાસ મળે.",
  },
  "Predictive success modelling": { hi: "सफलता का पूर्वानुमान मॉडल", gu: "સફળતાનું અનુમાન મોડેલ" },
  "Personalized protocol selection": { hi: "आपके लिए खास प्रोटोकॉल का चयन", gu: "તમારા માટે ખાસ પ્રોટોકોલની પસંદગી" },
  "Evidence-based decision making": { hi: "प्रमाण पर आधारित निर्णय", gu: "પુરાવા આધારિત નિર્ણય" },

  "Smart Use of Latest Techniques": { hi: "नई तकनीकों का स्मार्ट इस्तेमाल", gu: "નવી ટેકનિકનો સ્માર્ટ ઉપયોગ" },
  "We harness big data, cloud computing, and artificial intelligence to refine treatment protocols. IoT technology powers our smart fertility clinic — from incubator monitoring to environmental control in the embryology lab.": {
    hi: "हम उपचार प्रोटोकॉल को बेहतर बनाने के लिए बिग डेटा, क्लाउड कंप्यूटिंग और आर्टिफ़िशियल इंटेलिजेंस का उपयोग करते हैं। IoT तकनीक हमारे स्मार्ट फर्टिलिटी क्लिनिक को चलाती है — इन्क्यूबेटर की निगरानी से लेकर एम्ब्रियोलॉजी लैब के वातावरण के नियंत्रण तक।",
    gu: "અમે સારવાર પ્રોટોકોલ સુધારવા માટે બિગ ડેટા, ક્લાઉડ કમ્પ્યુટિંગ અને આર્ટિફિશિયલ ઇન્ટેલિજન્સનો ઉપયોગ કરીએ છીએ. IoT ટેકનોલોજી અમારા સ્માર્ટ ફર્ટિલિટી ક્લિનિકને ચલાવે છે — ઇન્ક્યુબેટરની દેખરેખથી લઈને એમ્બ્રિયોલોજી લેબના વાતાવરણના નિયંત્રણ સુધી.",
  },
  "AI-assisted embryo selection": { hi: "AI की मदद से एम्ब्रियो का चयन", gu: "AI ની મદદથી એમ્બ્રિયોની પસંદગી" },
  "Cloud-based data analytics": { hi: "क्लाउड-आधारित डेटा एनालिटिक्स", gu: "ક્લાઉડ-આધારિત ડેટા એનાલિટિક્સ" },
  "IoT-enabled lab environment": { hi: "IoT से लैस लैब वातावरण", gu: "IoT સક્ષમ લેબ વાતાવરણ" },

  "Patient Convenience": { hi: "मरीज़ की सुविधा", gu: "દર્દીની સુવિધા" },
  "Your treatment is managed at your local town or city. You visit the centre only for key procedures — no unnecessary trips. We stay flexible with your schedule so that fertility treatment fits into your life, not the other way around.": {
    hi: "आपका इलाज आपके अपने शहर या कस्बे में ही संभाला जाता है। आप सिर्फ़ ज़रूरी प्रक्रियाओं के लिए सेंटर आते हैं — बेवजह चक्कर नहीं। हम आपके शेड्यूल के हिसाब से चलते हैं, ताकि फर्टिलिटी इलाज आपकी ज़िंदगी में फ़िट हो, न कि आपकी ज़िंदगी इलाज में।",
    gu: "તમારી સારવાર તમારા પોતાના શહેર કે નગરમાં જ સંભાળાય છે. તમે માત્ર મહત્વની પ્રક્રિયાઓ માટે જ સેન્ટર પર આવો છો — બિનજરૂરી ધક્કા નહીં. અમે તમારા શેડ્યૂલ મુજબ લવચીક રહીએ છીએ, જેથી ફર્ટિલિટી સારવાર તમારા જીવનમાં બંધબેસતી થાય, તમારું જીવન સારવારમાં નહીં.",
  },
  "Local treatment management": { hi: "स्थानीय स्तर पर इलाज की देखरेख", gu: "સ્થાનિક સ્તરે સારવારનું સંચાલન" },
  "Visit only for procedures": { hi: "सिर्फ़ प्रक्रियाओं के लिए आना", gu: "માત્ર પ્રક્રિયાઓ માટે જ આવવું" },
  "Flexible scheduling": { hi: "लचीला शेड्यूल", gu: "લવચીક શેડ્યૂલ" },

  "Canny Blueprint of Timeline": { hi: "समय-सारिणी का सधा हुआ खाका", gu: "સમયપત્રકનો ચોક્કસ નકશો" },
  "Our team walks the extra mile to streamline your journey. Reports and prescriptions are prepared in advance. Complete notes for future planning ensure you always know the next step — no surprises, no confusion.": {
    hi: "हमारी टीम आपका सफ़र आसान बनाने के लिए एक कदम आगे चलती है। रिपोर्ट और पर्चियां पहले से तैयार रखी जाती हैं। आगे की योजना के पूरे नोट्स से आपको हमेशा पता रहता है कि अगला कदम क्या है — न कोई अचरज, न कोई उलझन।",
    gu: "અમારી ટીમ તમારી યાત્રા સરળ બનાવવા માટે વધારાનો પ્રયાસ કરે છે. રિપોર્ટ અને પ્રિસ્ક્રિપ્શન અગાઉથી તૈયાર રખાય છે. આગળના આયોજનની પૂરી નોંધથી તમને હંમેશાં ખબર હોય છે કે આગળનું પગલું શું છે — કોઈ આશ્ચર્ય નહીં, કોઈ મૂંઝવણ નહીં.",
  },
  "Advance report preparation": { hi: "रिपोर्ट की पहले से तैयारी", gu: "રિપોર્ટની અગાઉથી તૈયારી" },
  "Streamlined prescriptions": { hi: "सुव्यवस्थित पर्चियां", gu: "વ્યવસ્થિત પ્રિસ્ક્રિપ્શન" },
  "Clear future planning notes": { hi: "आगे की योजना के स्पष्ट नोट्स", gu: "આગળના આયોજનની સ્પષ્ટ નોંધ" },

  "Smart Diagnosis": { hi: "स्मार्ट डायग्नोसिस", gu: "સ્માર્ટ ડાયગ્નોસિસ" },
  "Diagnosis first, treatment later. We follow a step-by-step approach to identify the exact cause of infertility. Only pertinent tests are ordered — no blanket panels, no unnecessary investigations, no wasted time or money.": {
    hi: "पहले जांच, फिर इलाज। हम बांझपन का सही कारण पता करने के लिए कदम-दर-कदम तरीका अपनाते हैं। सिर्फ़ ज़रूरी जांचें कराई जाती हैं — न थोक में पैनल, न गैर-ज़रूरी जांचें, न समय या पैसे की बर्बादी।",
    gu: "પહેલાં તપાસ, પછી સારવાર. વંધ્યત્વનું ચોક્કસ કારણ શોધવા અમે પગલે-પગલે અભિગમ અપનાવીએ છીએ. માત્ર જરૂરી તપાસો જ કરાવાય છે — કોઈ બધી તપાસના પેનલ નહીં, બિનજરૂરી તપાસ નહીં, સમય કે પૈસાનો બગાડ નહીં.",
  },
  "Systematic cause identification": { hi: "कारण की व्यवस्थित पहचान", gu: "કારણની વ્યવસ્થિત ઓળખ" },
  "Only pertinent tests ordered": { hi: "सिर्फ़ ज़रूरी जांचें", gu: "માત્ર જરૂરી તપાસ" },
  "Evidence-based diagnostics": { hi: "प्रमाण पर आधारित जांच", gu: "પુરાવા આધારિત તપાસ" },

  "Patient-Centric Architecture": { hi: "मरीज़ को केंद्र में रखकर बनी बनावट", gu: "દર્દીને કેન્દ્રમાં રાખીને બનાવેલી રચના" },
  "Every department in our centres is designed to be patient-centric. Consultations, labs, scans, and procedures are all under one roof — no transferring from one end of the building to another, no navigating a maze of corridors.": {
    hi: "हमारे सेंटरों का हर विभाग मरीज़ को केंद्र में रखकर बनाया गया है। कंसल्टेशन, लैब, स्कैन और प्रक्रियाएं सब एक ही छत के नीचे — इमारत के एक कोने से दूसरे कोने तक भागना नहीं, गलियारों की भूलभुलैया में भटकना नहीं।",
    gu: "અમારા સેન્ટરોનો દરેક વિભાગ દર્દીને કેન્દ્રમાં રાખીને બનાવાયો છે. કન્સલ્ટેશન, લેબ, સ્કેન અને પ્રક્રિયાઓ બધું એક જ છત નીચે — ઇમારતના એક છેડેથી બીજા છેડે દોડવું નહીં, કોરિડોરની ભુલભુલામણીમાં ભટકવું નહીં.",
  },
  "All departments under one roof": { hi: "सभी विभाग एक ही छत के नीचे", gu: "બધા વિભાગ એક જ છત નીચે" },
  "Seamless patient flow": { hi: "मरीज़ों का सहज प्रवाह", gu: "દર્દીઓનો સરળ પ્રવાહ" },
  "Comfort-first clinic design": { hi: "आराम को प्राथमिकता देने वाला क्लिनिक डिज़ाइन", gu: "આરામને પ્રાથમિકતા આપતી ક્લિનિક ડિઝાઇન" },

  // ---- diagnosis highlight ----
  "Diagnosis first,": { hi: "पहले जांच,", gu: "પહેલાં તપાસ," },
  "treatment later.": { hi: "इलाज बाद में।", gu: "સારવાર પછી." },
  "At Bavishi Fertility Institute, we believe that the right diagnosis is the foundation of successful treatment. Before recommending any procedure, our specialists follow a systematic, step-by-step approach to identify the exact cause of infertility.": {
    hi: "Bavishi Fertility Institute में हम मानते हैं कि सही जांच ही सफल इलाज की नींव है। कोई भी प्रक्रिया सुझाने से पहले हमारे विशेषज्ञ बांझपन का सही कारण पता करने के लिए व्यवस्थित, कदम-दर-कदम तरीका अपनाते हैं।",
    gu: "Bavishi Fertility Institute માં અમે માનીએ છીએ કે સાચું નિદાન જ સફળ સારવારનો પાયો છે. કોઈ પણ પ્રક્રિયા સૂચવતા પહેલાં અમારા નિષ્ણાતો વંધ્યત્વનું ચોક્કસ કારણ શોધવા વ્યવસ્થિત, પગલે-પગલે અભિગમ અપનાવે છે.",
  },
  "We order only the tests that are pertinent to your case — no blanket panels, no unnecessary investigations. This means": {
    hi: "हम सिर्फ़ वही जांचें कराते हैं जो आपके केस के लिए ज़रूरी हैं — न थोक में पैनल, न गैर-ज़रूरी जांचें। इसका मतलब है",
    gu: "અમે માત્ર એવી જ તપાસ કરાવીએ છીએ જે તમારા કેસ માટે જરૂરી હોય — કોઈ બધી તપાસના પેનલ નહીં, બિનજરૂરી તપાસ નહીં. એનો અર્થ છે",
  },
  "less time waiting, lower costs, and a faster path to the right treatment.": {
    hi: "कम इंतज़ार, कम खर्च और सही इलाज तक पहुंचने का तेज़ रास्ता।",
    gu: "ઓછી રાહ, ઓછો ખર્ચ અને સાચી સારવાર સુધી પહોંચવાનો ઝડપી રસ્તો.",
  },
  "Our predictive models assess your likelihood of success before treatment even begins, giving you honest guidance and realistic expectations from day one.": {
    hi: "हमारे पूर्वानुमान मॉडल इलाज शुरू होने से पहले ही आपकी सफलता की संभावना आंकते हैं, ताकि पहले दिन से आपको ईमानदार मार्गदर्शन और सही उम्मीदें मिलें।",
    gu: "અમારા અનુમાન મોડેલ સારવાર શરૂ થતા પહેલાં જ તમારી સફળતાની શક્યતા આંકે છે, જેથી પહેલા દિવસથી તમને પ્રામાણિક માર્ગદર્શન અને વાસ્તવિક અપેક્ષાઓ મળે.",
  },
  "Get Your Diagnosis": { hi: "अपनी जांच कराएं", gu: "તમારી તપાસ કરાવો" },
  "Detailed medical history and lifestyle assessment": { hi: "विस्तृत मेडिकल हिस्ट्री और जीवनशैली का आकलन", gu: "વિગતવાર મેડિકલ હિસ્ટ્રી અને જીવનશૈલીનું મૂલ્યાંકન" },
  "Targeted hormonal and diagnostic blood work": { hi: "ज़रूरी हॉर्मोन और डायग्नोस्टिक ब्लड टेस्ट", gu: "જરૂરી હોર્મોન અને ડાયગ્નોસ્ટિક બ્લડ ટેસ્ટ" },
  "3D sonography and structural evaluation": { hi: "3D सोनोग्राफी और संरचना की जांच", gu: "3D સોનોગ્રાફી અને રચનાની તપાસ" },
  "Male partner semen analysis and testing": { hi: "पुरुष साथी का सीमन एनालिसिस और जांच", gu: "પુરુષ સાથીનું સીમન એનાલિસિસ અને તપાસ" },
  "Predictive success modelling and treatment plan": { hi: "सफलता का पूर्वानुमान और उपचार योजना", gu: "સફળતાનું અનુમાન અને સારવાર યોજના" },

  // ---- cost packages ----
  "Calibrated Cost Packages": { hi: "सोच-समझकर बने किफायती पैकेज", gu: "વિચારપૂર્વક બનાવેલા પોસાય તેવા પેકેજ" },
  "World-class care,": { hi: "विश्व स्तरीय देखभाल,", gu: "વિશ્વ કક્ષાની સંભાળ," },
  "smartly priced.": { hi: "समझदारी भरी कीमत पर।", gu: "સમજદારીભર્યા ભાવે." },
  "We believe the best fertility treatment should be accessible. Smart packages designed for every pocket — with no compromise on quality.": {
    hi: "हमारा मानना है कि सबसे अच्छा फर्टिलिटी इलाज हर किसी की पहुंच में होना चाहिए। हर बजट के लिए स्मार्ट पैकेज — गुणवत्ता से कोई समझौता किए बिना।",
    gu: "અમારું માનવું છે કે શ્રેષ્ઠ ફર્ટિલિટી સારવાર દરેકની પહોંચમાં હોવી જોઈએ. દરેક બજેટ માટે સ્માર્ટ પેકેજ — ગુણવત્તા સાથે કોઈ સમાધાન વિના.",
  },
  "Best Treatment at Optimal Pricing": { hi: "बेहतरीन इलाज, सही कीमत पर", gu: "શ્રેષ્ઠ સારવાર, યોગ્ય ભાવે" },
  "Economy of scale across 14 centres means you receive world-class treatment at a fraction of the cost charged by standalone clinics. Smart packages for every pocket.": {
    hi: "14 सेंटरों का बड़ा दायरा होने से आपको विश्व स्तरीय इलाज अकेले चलने वाले क्लिनिकों के खर्च के एक अंश में मिलता है। हर बजट के लिए स्मार्ट पैकेज।",
    gu: "14 સેન્ટરોના મોટા વ્યાપને કારણે તમને વિશ્વ કક્ષાની સારવાર એકલા ચાલતા ક્લિનિકના ખર્ચના એક અંશમાં મળે છે. દરેક બજેટ માટે સ્માર્ટ પેકેજ.",
  },
  "Three-Cycle Packages": { hi: "थ्री-साइकल पैकेज", gu: "થ્રી-સાયકલ પેકેજ" },
  "Our multi-cycle packages maximise your chances of success while reducing per-cycle cost. A structured plan that gives you the best shot at parenthood.": {
    hi: "हमारे मल्टी-साइकल पैकेज सफलता की संभावना बढ़ाते हैं और प्रति साइकल खर्च घटाते हैं। एक सुव्यवस्थित योजना जो माता-पिता बनने का सबसे अच्छा मौका देती है।",
    gu: "અમારા મલ્ટી-સાયકલ પેકેજ સફળતાની શક્યતા વધારે છે અને પ્રતિ સાયકલ ખર્ચ ઘટાડે છે. એક વ્યવસ્થિત યોજના જે માતા-પિતા બનવાની શ્રેષ્ઠ તક આપે છે.",
  },
  "Suraksha Kavach Package": { hi: "सुरक्षा कवच पैकेज", gu: "સુરક્ષા કવચ પેકેજ" },
  "India's only IVF protection program. It promises at least one healthy baby — and if medical circumstances prevent your success, the package is fully transferable to a loved one.": {
    hi: "भारत का एकमात्र IVF प्रोटेक्शन प्रोग्राम। यह कम से कम एक स्वस्थ बच्चे का वादा करता है — और अगर मेडिकल कारणों से आपको सफलता नहीं मिल पाती, तो यह पैकेज किसी अपने को पूरी तरह ट्रांसफ़र किया जा सकता है।",
    gu: "ભારતનો એકમાત્ર IVF પ્રોટેક્શન પ્રોગ્રામ. તે ઓછામાં ઓછા એક સ્વસ્થ બાળકનું વચન આપે છે — અને જો તબીબી કારણોસર તમને સફળતા ન મળે, તો આ પેકેજ કોઈ પોતાના વ્યક્તિને સંપૂર્ણપણે ટ્રાન્સફર કરી શકાય છે.",
  },
  "Easy EMI at 0% Interest": { hi: "0% ब्याज पर आसान EMI", gu: "0% વ્યાજે સરળ EMI" },
  "Digital payment options, secure online portals, and 0% interest EMI available — because financial barriers should never stand between you and parenthood.": {
    hi: "डिजिटल पेमेंट के विकल्प, सुरक्षित ऑनलाइन पोर्टल और 0% ब्याज पर EMI उपलब्ध — क्योंकि पैसों की रुकावट आपके और माता-पिता बनने के बीच कभी नहीं आनी चाहिए।",
    gu: "ડિજિટલ પેમેન્ટના વિકલ્પો, સુરક્ષિત ઓનલાઇન પોર્ટલ અને 0% વ્યાજે EMI ઉપલબ્ધ — કારણ કે નાણાકીય અવરોધ તમારી અને માતા-પિતા બનવાની વચ્ચે ક્યારેય ન આવવો જોઈએ.",
  },
  "Suraksha Kavach — India's Only IVF Protection Program": {
    hi: "सुरक्षा कवच — भारत का एकमात्र IVF प्रोटेक्शन प्रोग्राम",
    gu: "સુરક્ષા કવચ — ભારતનો એકમાત્ર IVF પ્રોટેક્શન પ્રોગ્રામ",
  },
  "Our flagship IVF protection program covers multiple cycles, is fully transferable, and designed for complete financial peace of mind. Thousands of couples have trusted Suraksha Kavach for their parenthood journey.": {
    hi: "हमारा प्रमुख IVF प्रोटेक्शन प्रोग्राम कई साइकल कवर करता है, पूरी तरह ट्रांसफ़र किया जा सकता है, और आर्थिक चिंता से पूरी राहत देने के लिए बनाया गया है। हज़ारों दंपतियों ने अपने माता-पिता बनने के सफ़र में सुरक्षा कवच पर भरोसा किया है।",
    gu: "અમારો મુખ્ય IVF પ્રોટેક્શન પ્રોગ્રામ ઘણા સાયકલને આવરી લે છે, સંપૂર્ણપણે ટ્રાન્સફર કરી શકાય છે, અને નાણાકીય ચિંતામાંથી પૂરી રાહત આપવા માટે બનાવાયો છે. હજારો દંપતીઓએ માતા-પિતા બનવાની યાત્રામાં સુરક્ષા કવચ પર વિશ્વાસ મૂક્યો છે.",
  },
  "Learn More": { hi: "और जानें", gu: "વધુ જાણો" },

  // ---- promise banner ----
  "Smart treatment isn't about doing more —": { hi: "स्मार्ट उपचार का मतलब ज़्यादा करना नहीं है —", gu: "સ્માર્ટ સારવાર એટલે વધુ કરવું નહીં —" },
  "it's about doing what's right.": { hi: "बल्कि वही करना है जो सही है।", gu: "પણ જે સાચું છે તે કરવું." },
  "Every protocol, every test, and every decision at Bavishi Fertility Institute is guided by intelligence, experience, and a genuine commitment to your success. No unnecessary procedures. No inflated costs. Just the smartest path to parenthood.": {
    hi: "Bavishi Fertility Institute में हर प्रोटोकॉल, हर जांच और हर फ़ैसला समझदारी, अनुभव और आपकी सफलता के प्रति सच्ची प्रतिबद्धता से तय होता है। कोई गैर-ज़रूरी प्रक्रिया नहीं। कोई बढ़ा-चढ़ाकर लिया गया खर्च नहीं। बस माता-पिता बनने का सबसे समझदार रास्ता।",
    gu: "Bavishi Fertility Institute માં દરેક પ્રોટોકોલ, દરેક તપાસ અને દરેક નિર્ણય સમજદારી, અનુભવ અને તમારી સફળતા પ્રત્યેની સાચી પ્રતિબદ્ધતાથી નક્કી થાય છે. કોઈ બિનજરૂરી પ્રક્રિયા નહીં. કોઈ ફુલાવેલો ખર્ચ નહીં. બસ માતા-પિતા બનવાનો સૌથી સમજદાર રસ્તો.",
  },
  "Technology Under One Roof": { hi: "सारी तकनीक एक ही छत के नीचे", gu: "બધી ટેકનોલોજી એક જ છત નીચે" },
  "Real-Time Monitoring": { hi: "रियल-टाइम मॉनिटरिंग", gu: "રિયલ-ટાઇમ મોનિટરિંગ" },
  "Predictive Success": { hi: "सफलता का पूर्वानुमान", gu: "સફળતાનું અનુમાન" },
  "Smart Pricing": { hi: "स्मार्ट कीमत", gu: "સ્માર્ટ ભાવ" },

  // ---- final CTA ----
  "Ready to experience": { hi: "क्या आप अनुभव करने के लिए तैयार हैं", gu: "શું તમે અનુભવ કરવા તૈયાર છો" },
  "smarter fertility care?": { hi: "ज़्यादा स्मार्ट फर्टिलिटी केयर?", gu: "વધુ સ્માર્ટ ફર્ટિલિટી કેર?" },
  "Book a consultation to see how our smart approach can give you the best chance of success — with fewer procedures, lower costs, and a treatment plan tailored entirely to you.": {
    hi: "कंसल्टेशन बुक करें और देखें कि हमारा स्मार्ट तरीका कैसे आपको सफलता का सबसे अच्छा मौका दे सकता है — कम प्रक्रियाओं, कम खर्च और पूरी तरह आपके लिए बनी उपचार योजना के साथ।",
    gu: "કન્સલ્ટેશન બુક કરો અને જુઓ કે અમારો સ્માર્ટ અભિગમ તમને સફળતાની શ્રેષ્ઠ તક કેવી રીતે આપી શકે — ઓછી પ્રક્રિયાઓ, ઓછા ખર્ચ અને સંપૂર્ણપણે તમારા માટે બનેલી સારવાર યોજના સાથે.",
  },
  "Book a consultation at any of our 14 centres across India.": {
    hi: "भारत भर में हमारे किसी भी 14 सेंटर पर कंसल्टेशन बुक करें।",
    gu: "ભારતભરમાં અમારા કોઈ પણ 14 સેન્ટર પર કન્સલ્ટેશન બુક કરો.",
  },
};
