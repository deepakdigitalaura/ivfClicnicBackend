/** hi/gu strings for /safe-treatment — keyed by the exact English text (data defaults in
 *  src/lib/safe-treatment.ts + JSX literals in src/components/safe-treatment-page.tsx).
 *  Merged into UI_STRINGS. Brand names / numbers stay in Latin script. */
type S = Record<string, { hi: string; gu: string }>;

export const SAFE_TREATMENT_STRINGS: S = {
  // ---- page chrome / SEO ----
  "Safe Treatment": { hi: "सुरक्षित उपचार", gu: "સુરક્ષિત સારવાર" },
  "Safe IVF Treatment": { hi: "सुरक्षित IVF उपचार", gu: "સુરક્ષિત IVF સારવાર" },
  "Safe IVF Treatment — Safety First, Safety for All | Bavishi Fertility Institute": {
    hi: "सुरक्षित IVF उपचार — सुरक्षा पहले, सबके लिए सुरक्षा | Bavishi Fertility Institute",
    gu: "સુરક્ષિત IVF સારવાર — સુરક્ષા પહેલા, સૌ માટે સુરક્ષા | Bavishi Fertility Institute",
  },
  "Bavishi Fertility Institute's motto: Safety First. OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority.": {
    hi: "Bavishi Fertility Institute का मंत्र: सुरक्षा पहले। OHSS-फ्री क्लिनिक, Class 1000 लैब, डबल-विटनेस प्रोटोकॉल। आपकी सुरक्षा हमारी पहली प्राथमिकता है।",
    gu: "Bavishi Fertility Institute નો મંત્ર: સુરક્ષા પહેલા. OHSS-ફ્રી ક્લિનિક, Class 1000 લેબ, ડબલ-વિટનેસ પ્રોટોકોલ. તમારી સુરક્ષા અમારી પહેલી પ્રાથમિકતા છે.",
  },
  "OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority.": {
    hi: "OHSS-फ्री क्लिनिक, Class 1000 लैब, डबल-विटनेस प्रोटोकॉल। आपकी सुरक्षा हमारी पहली प्राथमिकता है।",
    gu: "OHSS-ફ્રી ક્લિનિક, Class 1000 લેબ, ડબલ-વિટનેસ પ્રોટોકોલ. તમારી સુરક્ષા અમારી પહેલી પ્રાથમિકતા છે.",
  },

  // ---- hero ----
  "Safety First, Safety for All": { hi: "सुरक्षा पहले, सबके लिए सुरक्षा", gu: "સુરક્ષા પહેલા, સૌ માટે સુરક્ષા" },
  "Absolute safety for your fertility treatment.": {
    hi: "आपके फ़र्टिलिटी उपचार की पूरी सुरक्षा।",
    gu: "તમારી ફર્ટિલિટી સારવારની સંપૂર્ણ સુરક્ષા.",
  },
  "fertility treatment.": { hi: "फ़र्टिलिटी उपचार की पूरी सुरक्षा।", gu: "ફર્ટિલિટી સારવારની સંપૂર્ણ સુરક્ષા." },
  "At Bavishi Fertility Institute, safety isn't a feature — it's the foundation of everything we do. Double witnessing, 24x7 cloud monitoring of IVF labs, OHSS free protocol, Class 1000 labs and much more, every detail is engineered to protect you and your future child.": {
    hi: "Bavishi Fertility Institute में सुरक्षा कोई अतिरिक्त सुविधा नहीं, बल्कि हमारे हर काम की बुनियाद है। डबल विटनेसिंग, IVF लैब की 24x7 क्लाउड मॉनिटरिंग, OHSS-फ्री प्रोटोकॉल, Class 1000 लैब और भी बहुत कुछ — हर छोटी बात आपकी और आपके होने वाले बच्चे की सुरक्षा के लिए सोची गई है।",
    gu: "Bavishi Fertility Institute માં સુરક્ષા કોઈ વધારાની સુવિધા નથી, પરંતુ અમારા દરેક કામનો પાયો છે. ડબલ વિટનેસિંગ, IVF લેબનું 24x7 ક્લાઉડ મોનિટરિંગ, OHSS-ફ્રી પ્રોટોકોલ, Class 1000 લેબ અને બીજું ઘણું — દરેક નાની બાબત તમારી અને તમારા ભાવિ બાળકની સુરક્ષા માટે ગોઠવવામાં આવી છે.",
  },
  "Our Motto": { hi: "हमारा मंत्र", gu: "અમારો મંત્ર" },
  "Safety First, Safety for All — the principle behind every procedure": {
    hi: "सुरक्षा पहले, सबके लिए सुरक्षा — हर प्रक्रिया के पीछे यही सिद्धांत है",
    gu: "સુરક્ષા પહેલા, સૌ માટે સુરક્ષા — દરેક પ્રક્રિયા પાછળનો આ જ સિદ્ધાંત છે",
  },

  // ---- safety features ----
  "Our Safety Standards": { hi: "हमारे सुरक्षा मानक", gu: "અમારા સુરક્ષા ધોરણો" },
  "Eight pillars of": { hi: "अटूट सुरक्षा के", gu: "અડગ સુરક્ષાના" },
  "uncompromising safety.": { hi: "आठ स्तंभ।", gu: "આઠ સ્તંભ." },
  "Every element of your treatment at Bavishi Fertility Institute is governed by world-class safety protocols — because your well-being comes before everything else.": {
    hi: "Bavishi Fertility Institute में आपके उपचार का हर हिस्सा विश्व-स्तरीय सुरक्षा प्रोटोकॉल के अनुसार होता है — क्योंकि आपकी सेहत हमारे लिए सबसे ऊपर है।",
    gu: "Bavishi Fertility Institute માં તમારી સારવારનો દરેક ભાગ વિશ્વ-કક્ષાના સુરક્ષા પ્રોટોકોલ મુજબ થાય છે — કારણ કે તમારું સ્વાસ્થ્ય અમારા માટે સૌથી ઉપર છે.",
  },
  "Genetic Safety": { hi: "जेनेटिक सुरक्षा", gu: "જેનેટિક સુરક્ષા" },
  "Strict sample tracking using IVF-grade labels with a rigorous \"double-witness\" protocol — two professionals oversee every critical procedure including sperm freezing, sperm capacitation, oocyte recovery, insemination, micro-injection, embryo transfer, and cryopreservation.": {
    hi: "IVF-ग्रेड लेबल से हर सैंपल की सख़्त ट्रैकिंग और सख़्त \"डबल-विटनेस\" प्रोटोकॉल — स्पर्म फ़्रीज़िंग, स्पर्म कैपेसिटेशन, अंडाणु निकालना, इनसेमिनेशन, माइक्रो-इंजेक्शन, एम्ब्रियो ट्रांसफ़र और क्रायोप्रिज़र्वेशन जैसी हर अहम प्रक्रिया पर दो विशेषज्ञ नज़र रखते हैं।",
    gu: "IVF-ગ્રેડ લેબલથી દરેક સેમ્પલનું ચુસ્ત ટ્રેકિંગ અને કડક \"ડબલ-વિટનેસ\" પ્રોટોકોલ — સ્પર્મ ફ્રીઝિંગ, સ્પર્મ કેપેસિટેશન, અંડકોષ કાઢવા, ઇનસેમિનેશન, માઇક્રો-ઇન્જેક્શન, એમ્બ્રિયો ટ્રાન્સફર અને ક્રાયોપ્રિઝર્વેશન જેવી દરેક મહત્વની પ્રક્રિયા પર બે નિષ્ણાતો નજર રાખે છે.",
  },
  "Infection Prevention": { hi: "संक्रमण से बचाव", gu: "ચેપ સામે રક્ષણ" },
  "Mandatory infection testing for every patient before treatment begins. Potentially infected samples are stored in separate, dedicated containers to eliminate any risk of cross-contamination.": {
    hi: "उपचार शुरू होने से पहले हर मरीज़ की संक्रमण जाँच अनिवार्य है। संभावित संक्रमित सैंपल अलग, समर्पित कंटेनरों में रखे जाते हैं ताकि आपस में संक्रमण फैलने का कोई ख़तरा न रहे।",
    gu: "સારવાર શરૂ થાય તે પહેલાં દરેક દર્દીની ચેપ તપાસ ફરજિયાત છે. સંભવિત ચેપગ્રસ્ત સેમ્પલ અલગ, ખાસ કન્ટેનરમાં રાખવામાં આવે છે જેથી એકબીજામાં ચેપ ફેલાવાનું કોઈ જોખમ ન રહે.",
  },
  "OHSS-Free Clinic": { hi: "OHSS-फ्री क्लिनिक", gu: "OHSS-ફ્રી ક્લિનિક" },
  "Bavishi Fertility Institute is an OHSS-free clinic. Our signature prevention protocols have ensured zero severe OHSS cases in over a decade — a record we are deeply proud of.": {
    hi: "Bavishi Fertility Institute एक OHSS-फ्री क्लिनिक है। हमारे ख़ास बचाव प्रोटोकॉल की बदौलत एक दशक से ज़्यादा समय में गंभीर OHSS का एक भी मामला नहीं हुआ — यह रिकॉर्ड हमारे लिए गर्व की बात है।",
    gu: "Bavishi Fertility Institute એક OHSS-ફ્રી ક્લિનિક છે. અમારા ખાસ નિવારણ પ્રોટોકોલને કારણે એક દાયકાથી વધુ સમયમાં ગંભીર OHSS નો એક પણ કેસ થયો નથી — આ રેકોર્ડ અમારા માટે ગર્વની વાત છે.",
  },
  "Class 1000 IVF Labs": { hi: "Class 1000 IVF लैब", gu: "Class 1000 IVF લેબ" },
  "Our labs maintain air quality ten times cleaner than European standards. HEPA-filtered laminar flow hoods, AI-integrated trigas incubators with smart alarm systems, and continuous temperature monitoring at 37°C.": {
    hi: "हमारी लैब की हवा यूरोपीय मानकों से दस गुना ज़्यादा साफ़ रहती है। HEPA-फ़िल्टर्ड लैमिनार फ़्लो हुड, स्मार्ट अलार्म वाले AI-इंटीग्रेटेड ट्राईगैस इनक्यूबेटर और 37°C पर लगातार तापमान की निगरानी।",
    gu: "અમારી લેબની હવા યુરોપિયન ધોરણો કરતાં દસ ગણી વધુ સ્વચ્છ રહે છે. HEPA-ફિલ્ટર્ડ લેમિનાર ફ્લો હૂડ, સ્માર્ટ એલાર્મ સાથેના AI-ઇન્ટિગ્રેટેડ ટ્રાઇગેસ ઇન્ક્યુબેટર અને 37°C પર સતત તાપમાનનું મોનિટરિંગ.",
  },
  "Personalised Embryo Transfer": { hi: "आपके अनुसार एम्ब्रियो ट्रांसफ़र", gu: "તમારા મુજબ એમ્બ્રિયો ટ્રાન્સફર" },
  "Your ET is personalized not prescribed. Single embryo transfer, where it protects you best. A two-embryo transfer, where it's clinically sound and clearly understood. Every decision made with you, in full light.": {
    hi: "आपका ET आपके हिसाब से तय होता है, थोपा नहीं जाता। जहाँ आपके लिए सबसे सुरक्षित हो वहाँ सिंगल एम्ब्रियो ट्रांसफ़र; जहाँ चिकित्सकीय रूप से सही हो और आपको साफ़ समझा दिया गया हो वहाँ दो एम्ब्रियो का ट्रांसफ़र। हर फ़ैसला आपके साथ, पूरी पारदर्शिता से।",
    gu: "તમારું ET તમારા મુજબ નક્કી થાય છે, લાદવામાં આવતું નથી. જ્યાં તમારા માટે સૌથી સુરક્ષિત હોય ત્યાં સિંગલ એમ્બ્રિયો ટ્રાન્સફર; જ્યાં તબીબી રીતે યોગ્ય હોય અને તમને સ્પષ્ટ સમજાવાયું હોય ત્યાં બે એમ્બ્રિયોનું ટ્રાન્સફર. દરેક નિર્ણય તમારી સાથે, સંપૂર્ણ પારદર્શિતાથી.",
  },
  "Clinical Safety": { hi: "क्लिनिकल सुरक्षा", gu: "ક્લિનિકલ સુરક્ષા" },
  "National Accreditation Board for Hospitals, an apex organization to accredit, has strict criteria for infrastructure and protocols and SOPs for patient safety. Our centers are NABH accredited or under plan to get accreditation.": {
    hi: "नेशनल एक्रेडिटेशन बोर्ड फ़ॉर हॉस्पिटल्स (NABH), मान्यता देने वाली शीर्ष संस्था, इंफ्रास्ट्रक्चर, प्रोटोकॉल और मरीज़ की सुरक्षा के SOP के लिए सख़्त मानदंड तय करती है। हमारे सेंटर NABH से मान्यता प्राप्त हैं या मान्यता पाने की प्रक्रिया में हैं।",
    gu: "નેશનલ એક્રેડિટેશન બોર્ડ ફોર હોસ્પિટલ્સ (NABH), માન્યતા આપતી સર્વોચ્ચ સંસ્થા, ઇન્ફ્રાસ્ટ્રક્ચર, પ્રોટોકોલ અને દર્દીની સુરક્ષાના SOP માટે કડક માપદંડો નક્કી કરે છે. અમારા સેન્ટર NABH માન્યતાપ્રાપ્ત છે અથવા માન્યતા મેળવવાની પ્રક્રિયામાં છે.",
  },
  "Patient Confidentiality": { hi: "मरीज़ की गोपनीयता", gu: "દર્દીની ગુપ્તતા" },
  "Your medical records, treatment details, and personal information are fully protected with strict confidentiality protocols. Your privacy is non-negotiable.": {
    hi: "आपके मेडिकल रिकॉर्ड, उपचार की जानकारी और निजी विवरण सख़्त गोपनीयता प्रोटोकॉल से पूरी तरह सुरक्षित रहते हैं। आपकी निजता से कोई समझौता नहीं होता।",
    gu: "તમારા મેડિકલ રેકોર્ડ, સારવારની વિગતો અને અંગત માહિતી કડક ગુપ્તતા પ્રોટોકોલથી સંપૂર્ણ સુરક્ષિત રહે છે. તમારી ગોપનીયતા સાથે કોઈ સમજૂતી થતી નથી.",
  },

  // ---- OHSS highlight ----
  "Zero severe OHSS cases in": { hi: "एक दशक से ज़्यादा में गंभीर OHSS का", gu: "એક દાયકાથી વધુ સમયમાં ગંભીર OHSS નો" },
  "over a decade.": { hi: "एक भी मामला नहीं।", gu: "એક પણ કેસ નહીં." },
  "Ovarian Hyperstimulation Syndrome (OHSS) is one of the most serious risks in IVF treatment. At Bavishi Fertility Institute, we have developed and refined signature prevention protocols that have completely eliminated severe OHSS from our practice.": {
    hi: "ओवेरियन हाइपरस्टिमुलेशन सिंड्रोम (OHSS) IVF उपचार के सबसे गंभीर जोखिमों में से एक है। Bavishi Fertility Institute में हमने ख़ास बचाव प्रोटोकॉल विकसित और बेहतर किए हैं, जिनसे हमारे यहाँ गंभीर OHSS पूरी तरह ख़त्म हो चुका है।",
    gu: "ઓવેરિયન હાઇપરસ્ટિમ્યુલેશન સિન્ડ્રોમ (OHSS) IVF સારવારના સૌથી ગંભીર જોખમોમાંનું એક છે. Bavishi Fertility Institute માં અમે ખાસ નિવારણ પ્રોટોકોલ વિકસાવ્યા અને સુધાર્યા છે, જેનાથી અમારે ત્યાં ગંભીર OHSS સંપૂર્ણપણે દૂર થયું છે.",
  },
  "Bavishi Fertility Institute is an OHSS-free clinic.": {
    hi: "Bavishi Fertility Institute एक OHSS-फ्री क्लिनिक है।",
    gu: "Bavishi Fertility Institute એક OHSS-ફ્રી ક્લિનિક છે.",
  },
  "This isn't just a claim — it's a track record backed by over a decade of safe treatments and thousands of successful cycles.": {
    hi: "यह सिर्फ़ दावा नहीं है — एक दशक से ज़्यादा की सुरक्षित उपचार यात्रा और हज़ारों सफल साइकिल इसका प्रमाण हैं।",
    gu: "આ માત્ર દાવો નથી — એક દાયકાથી વધુની સુરક્ષિત સારવાર અને હજારો સફળ સાઇકલ તેનો પુરાવો છે.",
  },
  "Our stimulation protocols are carefully tailored to each patient, using the latest trigger strategies and monitoring techniques to ensure your ovaries respond safely and your health is never compromised.": {
    hi: "हमारे स्टिमुलेशन प्रोटोकॉल हर मरीज़ के हिसाब से सोच-समझकर बनाए जाते हैं। नई ट्रिगर रणनीतियों और मॉनिटरिंग तकनीकों से यह पक्का किया जाता है कि आपकी ओवरी सुरक्षित तरीक़े से प्रतिक्रिया दें और आपकी सेहत पर कभी आँच न आए।",
    gu: "અમારા સ્ટિમ્યુલેશન પ્રોટોકોલ દરેક દર્દી મુજબ કાળજીપૂર્વક ગોઠવવામાં આવે છે. નવીનતમ ટ્રિગર વ્યૂહરચના અને મોનિટરિંગ તકનીકોથી ખાતરી કરાય છે કે તમારી ઓવરી સુરક્ષિત રીતે પ્રતિસાદ આપે અને તમારા સ્વાસ્થ્ય સાથે ક્યારેય સમાધાન ન થાય.",
  },
  "Our OHSS Prevention Record": { hi: "हमारा OHSS बचाव रिकॉर्ड", gu: "અમારો OHSS નિવારણ રેકોર્ડ" },
  "Customised stimulation protocols for every patient": { hi: "हर मरीज़ के लिए अलग स्टिमुलेशन प्रोटोकॉल", gu: "દરેક દર્દી માટે અલગ સ્ટિમ્યુલેશન પ્રોટોકોલ" },
  "Advanced trigger strategies to prevent hyperstimulation": { hi: "हाइपरस्टिमुलेशन रोकने के लिए उन्नत ट्रिगर रणनीतियाँ", gu: "હાઇપરસ્ટિમ્યુલેશન રોકવા માટે અદ્યતન ટ્રિગર વ્યૂહરચના" },
  "Continuous hormonal and ultrasound monitoring": { hi: "हार्मोन और अल्ट्रासाउंड की लगातार निगरानी", gu: "હોર્મોન અને અલ્ટ્રાસાઉન્ડનું સતત મોનિટરિંગ" },
  "Zero severe OHSS cases in 10+ years": { hi: "10+ वर्षों में गंभीर OHSS का एक भी मामला नहीं", gu: "10+ વર્ષમાં ગંભીર OHSS નો એક પણ કેસ નહીં" },
  "Thousands of safe, successful cycles completed": { hi: "हज़ारों सुरक्षित और सफल साइकिल पूरे हुए", gu: "હજારો સુરક્ષિત અને સફળ સાઇકલ પૂર્ણ થયા" },

  // ---- stats ----
  "+ Years": { hi: "+ वर्ष", gu: "+ વર્ષ" },
  "OHSS Free": { hi: "OHSS-फ्री", gu: "OHSS-ફ્રી" },
  "zero severe cases in over a decade": { hi: "एक दशक से ज़्यादा में गंभीर मामला शून्य", gu: "એક દાયકાથી વધુમાં ગંભીર કેસ શૂન્ય" },
  "Class 1000 (10X Clean Air) IVF Labs": { hi: "Class 1000 (10 गुना स्वच्छ हवा) IVF लैब", gu: "Class 1000 (10 ગણી સ્વચ્છ હવા) IVF લેબ" },
  "ten times cleaner than EU standards": { hi: "EU मानकों से दस गुना ज़्यादा साफ़", gu: "EU ધોરણો કરતાં દસ ગણી વધુ સ્વચ્છ" },
  "Double-Witness": { hi: "डबल-विटनेस", gu: "ડબલ-વિટનેસ" },
  "two professionals at every step": { hi: "हर क़दम पर दो विशेषज्ञ", gu: "દરેક પગલે બે નિષ્ણાતો" },
  "Infection Screened": { hi: "संक्रमण जाँच", gu: "ચેપ તપાસ" },
  "mandatory testing for every patient": { hi: "हर मरीज़ की अनिवार्य जाँच", gu: "દરેક દર્દીની ફરજિયાત તપાસ" },

  // ---- protocols ----
  "Safety Protocols": { hi: "सुरक्षा प्रोटोकॉल", gu: "સુરક્ષા પ્રોટોકોલ" },
  "Every procedure follows": { hi: "हर प्रक्रिया में", gu: "દરેક પ્રક્રિયામાં" },
  "a strict safety checklist.": { hi: "सख़्त सुरक्षा चेकलिस्ट का पालन।", gu: "કડક સુરક્ષા ચેકલિસ્ટનું પાલન." },
  "These are not aspirational goals — they are non-negotiable protocols followed in every procedure, every day, at every Bavishi Fertility Institute centre.": {
    hi: "ये कोई आदर्श लक्ष्य नहीं हैं — ये ऐसे प्रोटोकॉल हैं जिन पर कोई समझौता नहीं होता और जिनका पालन Bavishi Fertility Institute के हर सेंटर पर, हर प्रक्रिया में, हर दिन होता है।",
    gu: "આ કોઈ આદર્શ લક્ષ્યો નથી — આ એવા પ્રોટોકોલ છે જેમાં કોઈ સમાધાન નથી અને Bavishi Fertility Institute ના દરેક સેન્ટર પર, દરેક પ્રક્રિયામાં, દરરોજ તેનું પાલન થાય છે.",
  },
  "IVF-grade sample labelling and tracking": { hi: "IVF-ग्रेड सैंपल लेबलिंग और ट्रैकिंग", gu: "IVF-ગ્રેડ સેમ્પલ લેબલિંગ અને ટ્રેકિંગ" },
  "Double-witness protocol for all critical procedures": { hi: "सभी अहम प्रक्रियाओं के लिए डबल-विटनेस प्रोटोकॉल", gu: "બધી મહત્વની પ્રક્રિયાઓ માટે ડબલ-વિટનેસ પ્રોટોકોલ" },
  "Mandatory pre-treatment infection screening": { hi: "उपचार से पहले अनिवार्य संक्रमण जाँच", gu: "સારવાર પહેલાં ફરજિયાત ચેપ તપાસ" },
  "Separate storage for potentially infected samples": { hi: "संभावित संक्रमित सैंपल का अलग भंडारण", gu: "સંભવિત ચેપગ્રસ્ત સેમ્પલનો અલગ સંગ્રહ" },
  "HEPA-filtered Class 1000 air quality in all labs": { hi: "सभी लैब में HEPA-फ़िल्टर्ड Class 1000 हवा", gu: "બધી લેબમાં HEPA-ફિલ્ટર્ડ Class 1000 હવા" },
  "AI-integrated trigas incubators with smart alarms": { hi: "स्मार्ट अलार्म वाले AI-इंटीग्रेटेड ट्राईगैस इनक्यूबेटर", gu: "સ્માર્ટ એલાર્મ સાથેના AI-ઇન્ટિગ્રેટેડ ટ્રાઇગેસ ઇન્ક્યુબેટર" },
  "Continuous 37°C temperature monitoring": { hi: "37°C तापमान की लगातार निगरानी", gu: "37°C તાપમાનનું સતત મોનિટરિંગ" },
  "Regular equipment maintenance and calibration": { hi: "उपकरणों का नियमित रखरखाव और कैलिब्रेशन", gu: "સાધનોની નિયમિત જાળવણી અને કેલિબ્રેશન" },
  "Elective personalized embryo transfer (ET) protocol": { hi: "व्यक्तिगत (पर्सनलाइज़्ड) एम्ब्रियो ट्रांसफ़र (ET) प्रोटोकॉल", gu: "વ્યક્તિગત (પર્સનલાઇઝ્ડ) એમ્બ્રિયો ટ્રાન્સફર (ET) પ્રોટોકોલ" },
  "Strict patient data confidentiality measures": { hi: "मरीज़ के डेटा की सख़्त गोपनीयता", gu: "દર્દીના ડેટાની કડક ગુપ્તતા" },

  // ---- double witness ----
  "Double-Witness Protocol": { hi: "डबल-विटनेस प्रोटोकॉल", gu: "ડબલ-વિટનેસ પ્રોટોકોલ" },
  "Two professionals independently verify and oversee every critical step:": {
    hi: "दो विशेषज्ञ हर अहम चरण की अलग-अलग जाँच और निगरानी करते हैं:",
    gu: "બે નિષ્ણાતો દરેક મહત્વના તબક્કાની અલગ-અલગ ચકાસણી અને દેખરેખ રાખે છે:",
  },
  "Sperm freezing": { hi: "स्पर्म फ़्रीज़िंग", gu: "સ્પર્મ ફ્રીઝિંગ" },
  "Sperm capacitation": { hi: "स्पर्म कैपेसिटेशन", gu: "સ્પર્મ કેપેસિટેશન" },
  "Oocyte recovery": { hi: "अंडाणु निकालना", gu: "અંડકોષ કાઢવા" },
  "Insemination": { hi: "इनसेमिनेशन", gu: "ઇનસેમિનેશન" },
  "Micro-injection (ICSI)": { hi: "माइक्रो-इंजेक्शन (ICSI)", gu: "માઇક્રો-ઇન્જેક્શન (ICSI)" },
  "Embryo transfer": { hi: "एम्ब्रियो ट्रांसफ़र", gu: "એમ્બ્રિયો ટ્રાન્સફર" },
  "Cryopreservation": { hi: "क्रायोप्रिज़र्वेशन", gu: "ક્રાયોપ્રિઝર્વેશન" },
  "Two professionals, one": { hi: "दो विशेषज्ञ, एक ही", gu: "બે નિષ્ણાતો, એક જ" },
  "unwavering standard.": { hi: "अटल मानक।", gu: "અડગ ધોરણ." },
  "In fertility treatment, there is zero room for error. That's why Bavishi Fertility Institute follows the internationally recognised": {
    hi: "फ़र्टिलिटी उपचार में गलती की कोई गुंजाइश नहीं होती। इसीलिए Bavishi Fertility Institute अंतरराष्ट्रीय स्तर पर मान्य",
    gu: "ફર્ટિલિટી સારવારમાં ભૂલની કોઈ ગુંજાઇશ હોતી નથી. તેથી જ Bavishi Fertility Institute આંતરરાષ્ટ્રીય સ્તરે માન્ય",
  },
  "double-witness protocol": { hi: "डबल-विटनेस प्रोटोकॉल", gu: "ડબલ-વિટનેસ પ્રોટોકોલ" },
  "— where two qualified professionals independently verify every critical procedure.": {
    hi: "अपनाता है — जिसमें दो योग्य विशेषज्ञ हर अहम प्रक्रिया की अलग-अलग जाँच करते हैं।",
    gu: "અપનાવે છે — જેમાં બે લાયક નિષ્ણાતો દરેક મહત્વની પ્રક્રિયાની અલગ-અલગ ચકાસણી કરે છે.",
  },
  "From the moment your samples are collected to the final embryo transfer, every step is tracked using IVF-grade labels and verified by two sets of eyes. This eliminates the possibility of mix-ups and ensures absolute genetic safety.": {
    hi: "सैंपल लेने के पल से लेकर आख़िरी एम्ब्रियो ट्रांसफ़र तक, हर क़दम IVF-ग्रेड लेबल से ट्रैक होता है और दो जोड़ी आँखें उसे जाँचती हैं। इससे सैंपल आपस में बदलने की संभावना ख़त्म हो जाती है और पूरी जेनेटिक सुरक्षा मिलती है।",
    gu: "સેમ્પલ લેવાની ક્ષણથી અંતિમ એમ્બ્રિયો ટ્રાન્સફર સુધી, દરેક પગલું IVF-ગ્રેડ લેબલથી ટ્રેક થાય છે અને બે જોડી આંખો તેને ચકાસે છે. આથી સેમ્પલ ભળી જવાની શક્યતા દૂર થાય છે અને સંપૂર્ણ જેનેટિક સુરક્ષા મળે છે.",
  },
  "This protocol is considered the gold standard in reproductive medicine worldwide, and it's standard practice at every Bavishi Fertility Institute centre.": {
    hi: "यह प्रोटोकॉल दुनिया भर में रिप्रोडक्टिव मेडिसिन का गोल्ड स्टैंडर्ड माना जाता है, और Bavishi Fertility Institute के हर सेंटर पर यह सामान्य प्रक्रिया है।",
    gu: "આ પ્રોટોકોલ વિશ્વભરમાં રિપ્રોડક્ટિવ મેડિસિનનું ગોલ્ડ સ્ટાન્ડર્ડ ગણાય છે, અને Bavishi Fertility Institute ના દરેક સેન્ટર પર તે સામાન્ય પ્રથા છે.",
  },

  // ---- promise banner ----
  "Your safety is not a feature —": { hi: "आपकी सुरक्षा कोई ख़ास सुविधा नहीं —", gu: "તમારી સુરક્ષા કોઈ ખાસ સુવિધા નથી —" },
  "it's our foundation.": { hi: "यह हमारी बुनियाद है।", gu: "તે અમારો પાયો છે." },
  "Every protocol, every lab standard, every training session — everything at Bavishi Fertility Institute is built around one principle: your safety comes first. Always.": {
    hi: "हर प्रोटोकॉल, हर लैब मानक, हर ट्रेनिंग — Bavishi Fertility Institute में सब कुछ एक ही सिद्धांत पर बना है: आपकी सुरक्षा सबसे पहले। हमेशा।",
    gu: "દરેક પ્રોટોકોલ, દરેક લેબ ધોરણ, દરેક તાલીમ — Bavishi Fertility Institute માં બધું એક જ સિદ્ધાંત પર બનેલું છે: તમારી સુરક્ષા સૌથી પહેલા. હંમેશાં.",
  },

  // ---- final CTA ----
  "Experience fertility treatment": { hi: "ऐसा फ़र्टिलिटी उपचार अनुभव करें", gu: "એવી ફર્ટિલિટી સારવારનો અનુભવ કરો" },
  "where safety comes first.": { hi: "जहाँ सुरक्षा सबसे पहले है।", gu: "જ્યાં સુરક્ષા સૌથી પહેલા છે." },
  "Book a consultation to see our world-class safety standards in action. Walk through our Class 1000 labs, meet our team, and start your journey with complete confidence.": {
    hi: "कंसल्टेशन बुक करें और हमारे विश्व-स्तरीय सुरक्षा मानकों को अपनी आँखों से देखें। हमारी Class 1000 लैब देखें, हमारी टीम से मिलें और पूरे भरोसे के साथ अपनी यात्रा शुरू करें।",
    gu: "કન્સલ્ટેશન બુક કરો અને અમારા વિશ્વ-કક્ષાના સુરક્ષા ધોરણો જાતે જુઓ. અમારી Class 1000 લેબ જુઓ, અમારી ટીમને મળો અને પૂરા વિશ્વાસ સાથે તમારી સફર શરૂ કરો.",
  },
};
