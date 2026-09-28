/** hi/gu strings for /easy-emi — keyed by the exact English text (data arrays + JSX literals
 *  in src/components/easy-emi-page.tsx). Merged into UI_STRINGS via ui(). */
type S = Record<string, { hi: string; gu: string }>;

export const EASY_EMI_STRINGS: S = {
  // ---- SEO / chrome ----
  "Easy EMI at 0% Interest — Affordable IVF Treatment | Bavishi Fertility Institute": {
    hi: "0% ब्याज पर आसान EMI — किफायती IVF इलाज | Bavishi Fertility Institute",
    gu: "0% વ્યાજ પર સરળ EMI — પરવડે તેવી IVF સારવાર | Bavishi Fertility Institute",
  },
  "Making IVF affordable for all. 0% interest EMI, smart payment options, value-based packages, and Suraksha Kavach — calibrated cost packages at Bavishi Fertility Institute.": {
    hi: "IVF को सबके लिए किफायती बनाना। 0% ब्याज पर EMI, स्मार्ट भुगतान विकल्प, वैल्यू-आधारित पैकेज और सुरक्षा कवच — Bavishi Fertility Institute में सोच-समझकर तय किए गए पैकेज।",
    gu: "IVF ને બધા માટે પરવડે તેવી બનાવવી. 0% વ્યાજે EMI, સ્માર્ટ ચુકવણી વિકલ્પો, વેલ્યુ-આધારિત પેકેજ અને સુરક્ષા કવચ — Bavishi Fertility Institute માં સમજી-વિચારીને નક્કી કરેલા પેકેજ.",
  },
  "Easy EMI & Affordable IVF | Bavishi Fertility Institute": {
    hi: "आसान EMI और किफायती IVF | Bavishi Fertility Institute",
    gu: "સરળ EMI અને પરવડે તેવી IVF | Bavishi Fertility Institute",
  },
  "0% interest EMI, smart packages, digital payments — IVF made affordable for everyone.": {
    hi: "0% ब्याज पर EMI, स्मार्ट पैकेज, डिजिटल भुगतान — IVF अब सबकी पहुँच में।",
    gu: "0% વ્યાજે EMI, સ્માર્ટ પેકેજ, ડિજિટલ ચુકવણી — IVF હવે બધાની પહોંચમાં.",
  },
  "Easy EMI & Affordable IVF": { hi: "आसान EMI और किफायती IVF", gu: "સરળ EMI અને પરવડે તેવી IVF" },
  "Easy / Interest Free EMI": { hi: "आसान / ब्याज-मुक्त EMI", gu: "સરળ / વ્યાજ-મુક્ત EMI" },

  // ---- Zero-EMI benefits ----
  "0% Interest Rate": { hi: "0% ब्याज दर", gu: "0% વ્યાજ દર" },
  "Absolutely zero interest on your EMI. The amount you see is the amount you pay — no hidden charges, no extra cost.": {
    hi: "आपकी EMI पर बिल्कुल भी ब्याज नहीं। जो रकम दिखती है, वही आप चुकाते हैं — कोई छिपा शुल्क नहीं, कोई अतिरिक्त खर्च नहीं।",
    gu: "તમારી EMI પર બિલકુલ વ્યાજ નહીં. જે રકમ દેખાય છે તે જ તમે ચૂકવો છો — કોઈ છુપો ચાર્જ નહીં, કોઈ વધારાનો ખર્ચ નહીં.",
  },
  "Flexible Tenure": { hi: "अपनी सुविधा की अवधि", gu: "તમારી અનુકૂળતા મુજબની મુદત" },
  "Choose a repayment plan that suits your budget. Spread your treatment cost over comfortable monthly instalments.": {
    hi: "अपने बजट के हिसाब से भुगतान योजना चुनें। इलाज का खर्च आराम से छोटी-छोटी मासिक किस्तों में बाँट लें।",
    gu: "તમારા બજેટને અનુકૂળ ચુકવણી યોજના પસંદ કરો. સારવારનો ખર્ચ આરામદાયક માસિક હપ્તાઓમાં વહેંચી લો.",
  },
  "Quick Approval": { hi: "जल्दी मंज़ूरी", gu: "ઝડપી મંજૂરી" },
  "Minimal documentation and fast processing. Get approved and start your treatment without delays.": {
    hi: "कम से कम कागज़ात और तेज़ प्रक्रिया। मंज़ूरी पाएँ और बिना देरी इलाज शुरू करें।",
    gu: "ઓછામાં ઓછા દસ્તાવેજો અને ઝડપી પ્રક્રિયા. મંજૂરી મેળવો અને વિલંબ વગર સારવાર શરૂ કરો.",
  },
  "No Financial Stress": { hi: "पैसों की चिंता नहीं", gu: "પૈસાની ચિંતા નહીં" },
  "Focus entirely on your treatment journey. Our EMI plans ensure finances never come in the way of your dream of parenthood.": {
    hi: "अपना पूरा ध्यान इलाज पर रखें। हमारी EMI योजनाएँ पक्का करती हैं कि पैसे आपके माता-पिता बनने के सपने के आड़े न आएँ।",
    gu: "તમારું પૂરું ધ્યાન સારવાર પર રાખો. અમારી EMI યોજનાઓ ખાતરી કરે છે કે પૈસા તમારા માતા-પિતા બનવાના સપનામાં આડે ન આવે.",
  },

  // ---- Payment options ----
  "UPI & Net Banking": { hi: "UPI और नेट बैंकिंग", gu: "UPI અને નેટ બેન્કિંગ" },
  "Pay seamlessly through Google Pay, PhonePe, Paytm, and all major UPI apps, or via secure online transfers from all major banks — from the comfort of your home with bank-level encryption.": {
    hi: "Google Pay, PhonePe, Paytm और सभी प्रमुख UPI ऐप से, या सभी बड़े बैंकों के सुरक्षित ऑनलाइन ट्रांसफ़र से आसानी से भुगतान करें — घर बैठे, बैंक-स्तर की सुरक्षा के साथ।",
    gu: "Google Pay, PhonePe, Paytm અને તમામ મુખ્ય UPI એપ દ્વારા, અથવા તમામ મોટી બેંકોના સુરક્ષિત ઓનલાઇન ટ્રાન્સફર દ્વારા સરળતાથી ચુકવણી કરો — ઘરે બેઠા, બેંક-સ્તરની સુરક્ષા સાથે.",
  },
  "Credit & Debit Cards": { hi: "क्रेडिट और डेबिट कार्ड", gu: "ક્રેડિટ અને ડેબિટ કાર્ડ" },
  "All major credit and debit cards accepted — Visa, Mastercard, and RuPay.": {
    hi: "सभी प्रमुख क्रेडिट और डेबिट कार्ड स्वीकार — Visa, Mastercard और RuPay।",
    gu: "તમામ મુખ્ય ક્રેડિટ અને ડેબિટ કાર્ડ સ્વીકાર્ય — Visa, Mastercard અને RuPay.",
  },
  "0% Interest EMI": { hi: "0% ब्याज EMI", gu: "0% વ્યાજ EMI" },
  "Split your treatment cost into easy, zero-interest instalments on select cards — no extra charges, no hidden fees.": {
    hi: "चुनिंदा कार्ड पर इलाज का खर्च आसान, बिना ब्याज की किस्तों में बाँटें — कोई अतिरिक्त शुल्क नहीं, कोई छिपी फ़ीस नहीं।",
    gu: "પસંદ કરેલા કાર્ડ પર સારવારનો ખર્ચ સરળ, વ્યાજ વગરના હપ્તાઓમાં વહેંચો — કોઈ વધારાનો ચાર્જ નહીં, કોઈ છુપી ફી નહીં.",
  },
  "Cash & Cheque": { hi: "नकद और चेक", gu: "રોકડ અને ચેક" },
  "Traditional payment methods are always welcome at our centres. Pay in person at any Bavishi Fertility Institute location.": {
    hi: "हमारे केंद्रों पर पारंपरिक भुगतान का हमेशा स्वागत है। किसी भी Bavishi Fertility Institute केंद्र पर खुद आकर भुगतान करें।",
    gu: "અમારા કેન્દ્રો પર પરંપરાગત ચુકવણીનું હંમેશા સ્વાગત છે. કોઈપણ Bavishi Fertility Institute કેન્દ્ર પર રૂબરૂ ચુકવણી કરો.",
  },

  // ---- Value packages ----
  "Best Treatment at Optimal Pricing": { hi: "सही कीमत पर बेहतरीन इलाज", gu: "યોગ્ય કિંમતે શ્રેષ્ઠ સારવાર" },
  "We leverage our scale across 14 centres to negotiate the best rates for medications, consumables, and lab services — savings we pass directly to you.": {
    hi: "हम अपने 14 केंद्रों के पैमाने का फ़ायदा उठाकर दवाइयों, उपभोग्य सामग्री और लैब सेवाओं के सबसे अच्छे दाम तय कराते हैं — और यह बचत सीधे आप तक पहुँचाते हैं।",
    gu: "અમે અમારા 14 કેન્દ્રોના વ્યાપનો લાભ લઈને દવાઓ, વપરાશી સામગ્રી અને લેબ સેવાઓના શ્રેષ્ઠ ભાવ નક્કી કરીએ છીએ — અને આ બચત સીધી તમને આપીએ છીએ.",
  },
  "Highest Quality Products": { hi: "सर्वोच्च गुणवत्ता वाले उत्पाद", gu: "સર્વોચ્ચ ગુણવત્તાના ઉત્પાદનો" },
  "No compromise on quality. We use premium-grade medications, culture media, and lab consumables — sourced at competitive costs through our pan-India procurement network.": {
    hi: "गुणवत्ता से कोई समझौता नहीं। हम प्रीमियम दर्जे की दवाइयाँ, कल्चर मीडिया और लैब सामग्री इस्तेमाल करते हैं — जो हमारे पूरे भारत के खरीद नेटवर्क से किफायती दामों पर मिलती है।",
    gu: "ગુણવત્તા સાથે કોઈ સમાધાન નહીં. અમે પ્રીમિયમ ગ્રેડની દવાઓ, કલ્ચર મીડિયા અને લેબ સામગ્રી વાપરીએ છીએ — જે અમારા સમગ્ર ભારતના ખરીદ નેટવર્ક દ્વારા સ્પર્ધાત્મક ખર્ચે મેળવીએ છીએ.",
  },
  "Optimal Resource Utilisation": { hi: "संसाधनों का बेहतर उपयोग", gu: "સંસાધનોનો શ્રેષ્ઠ ઉપયોગ" },
  "Our high patient volume and efficient operations mean optimal utilisation of world-class labs, equipment, and specialist time — delivering more value per rupee.": {
    hi: "हमारे यहाँ मरीज़ों की अधिक संख्या और कुशल संचालन का मतलब है विश्व-स्तरीय लैब, उपकरण और विशेषज्ञों के समय का सही उपयोग — यानी हर रुपये में ज़्यादा फ़ायदा।",
    gu: "અમારે ત્યાં દર્દીઓની વધુ સંખ્યા અને કાર્યક્ષમ સંચાલનનો અર્થ છે વિશ્વ-કક્ષાની લેબ, ઉપકરણો અને નિષ્ણાતોના સમયનો શ્રેષ્ઠ ઉપયોગ — એટલે દરેક રૂપિયામાં વધુ મૂલ્ય.",
  },

  // ---- Smart packages ----
  "Single Cycle Package": { hi: "सिंगल साइकल पैकेज", gu: "સિંગલ સાયકલ પેકેજ" },
  "Ideal for patients with a good prognosis. A comprehensive single IVF/ICSI cycle with all consultations, procedures, and lab work included.": {
    hi: "अच्छे परिणाम की संभावना वाले मरीज़ों के लिए उत्तम। एक पूरा IVF/ICSI साइकल, जिसमें सभी परामर्श, प्रक्रियाएँ और लैब का काम शामिल है।",
    gu: "સારા પરિણામની શક્યતા ધરાવતા દર્દીઓ માટે ઉત્તમ. એક સંપૂર્ણ IVF/ICSI સાયકલ, જેમાં તમામ પરામર્શ, પ્રક્રિયાઓ અને લેબનું કામ સામેલ છે.",
  },
  "Complete IVF/ICSI cycle": { hi: "पूरा IVF/ICSI साइकल", gu: "સંપૂર્ણ IVF/ICSI સાયકલ" },
  "All consultations included": { hi: "सभी परामर्श शामिल", gu: "તમામ પરામર્શ સામેલ" },
  "Lab & embryology charges covered": { hi: "लैब और एम्ब्रियोलॉजी शुल्क शामिल", gu: "લેબ અને એમ્બ્રિયોલોજી ચાર્જ સામેલ" },
  "Transparent pricing — no hidden costs": { hi: "साफ़ कीमत — कोई छिपा खर्च नहीं", gu: "પારદર્શક કિંમત — કોઈ છુપો ખર્ચ નહીં" },
  "Three-Cycle Package": { hi: "थ्री-साइकल पैकेज", gu: "થ્રી-સાયકલ પેકેજ" },
  "Triple your chances of success. Our three-cycle package gives you the highest probability of achieving pregnancy at the most competitive pricing.": {
    hi: "सफलता के मौके तीन गुना करें। हमारा तीन-साइकल पैकेज सबसे किफायती कीमत पर गर्भधारण की सबसे ज़्यादा संभावना देता है।",
    gu: "સફળતાની તકો ત્રણ ગણી કરો. અમારું ત્રણ-સાયકલ પેકેજ સૌથી સ્પર્ધાત્મક કિંમતે ગર્ભધારણની સૌથી વધુ શક્યતા આપે છે.",
  },
  "Three complete IVF/ICSI cycles": { hi: "तीन पूरे IVF/ICSI साइकल", gu: "ત્રણ સંપૂર્ણ IVF/ICSI સાયકલ" },
  "Maximum cost savings": { hi: "अधिकतम खर्च की बचत", gu: "મહત્તમ ખર્ચની બચત" },
  "Extended support & monitoring": { hi: "अतिरिक्त सहयोग और निगरानी", gu: "વિસ્તૃત સહાય અને દેખરેખ" },
  "Best success probability": { hi: "सफलता की सबसे अधिक संभावना", gu: "સફળતાની સૌથી વધુ શક્યતા" },
  "Suraksha Kavach Package": { hi: "सुरक्षा कवच पैकेज", gu: "સુરક્ષા કવચ પેકેજ" },
  "India's only IVF protection program. Multiple IVF cycles covered under a single package with complete financial peace of mind.": {
    hi: "भारत का एकमात्र IVF सुरक्षा प्रोग्राम। एक ही पैकेज में कई IVF साइकल शामिल, पूरी आर्थिक निश्चिंतता के साथ।",
    gu: "ભારતનો એકમાત્ર IVF સુરક્ષા પ્રોગ્રામ. એક જ પેકેજમાં ઘણા IVF સાયકલ સામેલ, સંપૂર્ણ આર્થિક નિશ્ચિંતતા સાથે.",
  },
  "Multiple IVF/ICSI cycles covered": { hi: "कई IVF/ICSI साइकल शामिल", gu: "ઘણા IVF/ICSI સાયકલ સામેલ" },
  "Complete financial protection": { hi: "पूरी आर्थिक सुरक्षा", gu: "સંપૂર્ણ આર્થિક સુરક્ષા" },
  "One package, one price": { hi: "एक पैकेज, एक कीमत", gu: "એક પેકેજ, એક કિંમત" },
  "No hidden costs": { hi: "कोई छिपा खर्च नहीं", gu: "કોઈ છુપો ખર્ચ નહીં" },

  // ---- FAQs ----
  "How does 0% interest EMI work?": { hi: "0% ब्याज वाली EMI कैसे काम करती है?", gu: "0% વ્યાજવાળી EMI કેવી રીતે કામ કરે છે?" },
  "Our 0% interest EMI program means you pay no additional cost beyond the treatment price. The total amount is simply divided into equal monthly instalments. There is no processing fee, no hidden charges, and no interest — the total you pay is exactly the treatment cost.": {
    hi: "हमारे 0% ब्याज EMI प्रोग्राम का मतलब है कि आप इलाज की कीमत से एक रुपया भी ज़्यादा नहीं देते। कुल रकम को बस बराबर मासिक किस्तों में बाँट दिया जाता है। कोई प्रोसेसिंग फ़ीस नहीं, कोई छिपा शुल्क नहीं, कोई ब्याज नहीं — आप कुल उतना ही चुकाते हैं जितना इलाज का खर्च है।",
    gu: "અમારા 0% વ્યાજ EMI પ્રોગ્રામનો અર્થ છે કે તમે સારવારની કિંમત કરતાં એક રૂપિયો પણ વધુ ચૂકવતા નથી. કુલ રકમ ફક્ત સરખા માસિક હપ્તાઓમાં વહેંચી દેવામાં આવે છે. કોઈ પ્રોસેસિંગ ફી નહીં, કોઈ છુપો ચાર્જ નહીં, કોઈ વ્યાજ નહીં — તમે કુલ એટલું જ ચૂકવો છો જેટલો સારવારનો ખર્ચ છે.",
  },
  "What documents are needed for EMI approval?": { hi: "EMI मंज़ूरी के लिए कौन-से कागज़ात चाहिए?", gu: "EMI મંજૂરી માટે કયા દસ્તાવેજો જોઈએ?" },
  "Minimal documentation is required — typically a valid ID proof (Aadhaar/PAN), address proof, income proof (salary slips or bank statements for the last 3 months), and a cancelled cheque. Our finance team will guide you through the quick approval process.": {
    hi: "बहुत कम कागज़ात चाहिए — आमतौर पर वैध पहचान पत्र (आधार/PAN), पते का प्रमाण, आय का प्रमाण (पिछले 3 महीनों की सैलरी स्लिप या बैंक स्टेटमेंट) और एक कैंसल चेक। हमारी फ़ाइनेंस टीम तेज़ मंज़ूरी की प्रक्रिया में आपका मार्गदर्शन करेगी।",
    gu: "ખૂબ ઓછા દસ્તાવેજો જોઈએ — સામાન્ય રીતે માન્ય ઓળખ પુરાવો (આધાર/PAN), સરનામાનો પુરાવો, આવકનો પુરાવો (છેલ્લા 3 મહિનાની સેલરી સ્લિપ અથવા બેંક સ્ટેટમેન્ટ) અને એક કેન્સલ ચેક. અમારી ફાઇનાન્સ ટીમ ઝડપી મંજૂરીની પ્રક્રિયામાં તમને માર્ગદર્શન આપશે.",
  },
  "Can I combine EMI with a package?": { hi: "क्या मैं पैकेज के साथ EMI ले सकता/सकती हूँ?", gu: "શું હું પેકેજ સાથે EMI લઈ શકું?" },
  "Yes, absolutely. You can opt for any of our value-based packages — single cycle, multi-cycle, or three-cycle — and pay for it via 0% interest EMI. This gives you the dual benefit of package savings and easy monthly payments.": {
    hi: "जी हाँ, बिल्कुल। आप हमारा कोई भी वैल्यू-आधारित पैकेज — सिंगल साइकल, मल्टी-साइकल या थ्री-साइकल — चुन सकते हैं और उसका भुगतान 0% ब्याज EMI से कर सकते हैं। इससे आपको पैकेज की बचत और आसान मासिक भुगतान, दोनों का फ़ायदा मिलता है।",
    gu: "હા, બિલકુલ. તમે અમારા કોઈપણ વેલ્યુ-આધારિત પેકેજ — સિંગલ સાયકલ, મલ્ટી-સાયકલ કે થ્રી-સાયકલ — પસંદ કરી શકો છો અને તેની ચુકવણી 0% વ્યાજ EMI દ્વારા કરી શકો છો. આનાથી તમને પેકેજની બચત અને સરળ માસિક ચુકવણી, બંનેનો લાભ મળે છે.",
  },
  "What payment methods do you accept?": { hi: "आप भुगतान के कौन-से तरीके स्वीकार करते हैं?", gu: "તમે ચુકવણીની કઈ રીતો સ્વીકારો છો?" },
  "We accept all major payment modes — cash, cheque, credit/debit cards (Visa, Mastercard, RuPay), net banking, and UPI (Google Pay, PhonePe, Paytm). You can choose the method most convenient for you.": {
    hi: "हम सभी प्रमुख भुगतान तरीके स्वीकार करते हैं — नकद, चेक, क्रेडिट/डेबिट कार्ड (Visa, Mastercard, RuPay), नेट बैंकिंग और UPI (Google Pay, PhonePe, Paytm)। आप अपनी सुविधा का तरीका चुन सकते हैं।",
    gu: "અમે ચુકવણીની તમામ મુખ્ય રીતો સ્વીકારીએ છીએ — રોકડ, ચેક, ક્રેડિટ/ડેબિટ કાર્ડ (Visa, Mastercard, RuPay), નેટ બેન્કિંગ અને UPI (Google Pay, PhonePe, Paytm). તમે તમારી અનુકૂળતા મુજબની રીત પસંદ કરી શકો છો.",
  },
  "Is the pricing transparent? Are there hidden costs?": { hi: "क्या कीमतें साफ़ हैं? क्या कोई छिपा खर्च है?", gu: "શું કિંમતો પારદર્શક છે? શું કોઈ છુપો ખર્ચ છે?" },
  "Complete transparency is our policy. Every package clearly lists what is included — consultations, procedures, lab work, medications, and monitoring. There are no surprise bills or hidden charges. Your coordinator will walk you through the detailed cost breakup before you begin.": {
    hi: "पूरी पारदर्शिता हमारी नीति है। हर पैकेज में साफ़ लिखा होता है कि क्या-क्या शामिल है — परामर्श, प्रक्रियाएँ, लैब का काम, दवाइयाँ और निगरानी। कोई अचानक बिल या छिपा शुल्क नहीं होता। शुरू करने से पहले आपके कोऑर्डिनेटर खर्च का पूरा ब्योरा आपको समझाएँगे।",
    gu: "સંપૂર્ણ પારદર્શિતા અમારી નીતિ છે. દરેક પેકેજમાં સ્પષ્ટ લખેલું હોય છે કે શું સામેલ છે — પરામર્શ, પ્રક્રિયાઓ, લેબનું કામ, દવાઓ અને દેખરેખ. કોઈ અચાનક બિલ કે છુપો ચાર્જ હોતો નથી. શરૂ કરતાં પહેલાં તમારા કોઓર્ડિનેટર ખર્ચનું પૂરું વિવરણ સમજાવશે.",
  },
  "What is Suraksha Kavach and how is it different?": { hi: "सुरक्षा कवच क्या है और यह अलग कैसे है?", gu: "સુરક્ષા કવચ શું છે અને તે અલગ કેવી રીતે છે?" },
  "Suraksha Kavach is our exclusive IVF protection program — the only one of its kind in the world. It covers multiple IVF cycles. It goes beyond affordability to offer complete peace of mind.": {
    hi: "सुरक्षा कवच हमारा खास IVF सुरक्षा प्रोग्राम है — दुनिया में अपनी तरह का एकमात्र। इसमें कई IVF साइकल शामिल होते हैं। यह सिर्फ़ किफायती होने से आगे बढ़कर पूरी निश्चिंतता देता है।",
    gu: "સુરક્ષા કવચ અમારો વિશિષ્ટ IVF સુરક્ષા પ્રોગ્રામ છે — વિશ્વમાં પોતાની રીતનો એકમાત્ર. તેમાં ઘણા IVF સાયકલ સામેલ છે. તે માત્ર પરવડે તેવા હોવાથી આગળ વધીને સંપૂર્ણ નિશ્ચિંતતા આપે છે.",
  },

  // ---- Page chrome ----
  "Home": { hi: "होम", gu: "હોમ" },
  "Affordable Fertility Care": { hi: "किफायती फ़र्टिलिटी केयर", gu: "પરવડે તેવી ફર્ટિલિટી કેર" },
  "Making IVF Affordable ": { hi: "IVF को किफायती बनाना ", gu: "IVF ને પરવડે તેવી બનાવવી " },
  "for Every Family": { hi: "हर परिवार के लिए", gu: "દરેક પરિવાર માટે" },
  "Your dream of parenthood shouldn't be limited by finances. We offer smart payment solutions to make world-class fertility treatment accessible to all.": {
    hi: "माता-पिता बनने का आपका सपना पैसों की वजह से अधूरा नहीं रहना चाहिए। हम स्मार्ट भुगतान समाधान देते हैं ताकि विश्व-स्तरीय फ़र्टिलिटी इलाज सबकी पहुँच में हो।",
    gu: "માતા-પિતા બનવાનું તમારું સપનું પૈસાને કારણે અધૂરું રહેવું ન જોઈએ. અમે સ્માર્ટ ચુકવણી ઉકેલો આપીએ છીએ જેથી વિશ્વ-કક્ષાની ફર્ટિલિટી સારવાર બધાની પહોંચમાં હોય.",
  },
  "Book Consultation": { hi: "परामर्श बुक करें", gu: "પરામર્શ બુક કરો" },
  "WhatsApp Us": { hi: "WhatsApp पर संपर्क करें", gu: "WhatsApp પર સંપર્ક કરો" },
  "0% Interest EMI ": { hi: "0% ब्याज EMI ", gu: "0% વ્યાજ EMI " },
  "on IVF Treatment": { hi: "IVF इलाज पर", gu: "IVF સારવાર પર" },
  "Budget planning made easy. Easy EMI at 0% interest available for all patients at Bavishi Fertility Institute. No financial stress during your treatment journey — just focus on building your family.": {
    hi: "बजट बनाना अब आसान। Bavishi Fertility Institute में सभी मरीज़ों के लिए 0% ब्याज पर आसान EMI उपलब्ध है। इलाज के सफ़र में पैसों का कोई तनाव नहीं — बस अपना परिवार बढ़ाने पर ध्यान दें।",
    gu: "બજેટનું આયોજન હવે સરળ. Bavishi Fertility Institute માં તમામ દર્દીઓ માટે 0% વ્યાજે સરળ EMI ઉપલબ્ધ છે. સારવારની સફરમાં પૈસાનો કોઈ તણાવ નહીં — બસ તમારો પરિવાર વધારવા પર ધ્યાન આપો.",
  },
  "Zero Interest EMI": { hi: "ज़ीरो ब्याज EMI", gu: "ઝીરો વ્યાજ EMI" },
  "Why 0% EMI makes ": { hi: "0% EMI कैसे बनाती है ", gu: "0% EMI કેવી રીતે બનાવે છે " },
  "your journey easier": { hi: "आपका सफ़र आसान", gu: "તમારી સફર સરળ" },
  "Spread your IVF treatment cost over comfortable monthly instalments — without paying a single rupee in interest.": {
    hi: "अपने IVF इलाज का खर्च आराम से मासिक किस्तों में बाँटें — ब्याज का एक रुपया भी दिए बिना।",
    gu: "તમારી IVF સારવારનો ખર્ચ આરામદાયક માસિક હપ્તાઓમાં વહેંચો — વ્યાજનો એક રૂપિયો પણ ચૂકવ્યા વગર.",
  },
  "Smart Payment Options": { hi: "स्मार्ट भुगतान विकल्प", gu: "સ્માર્ટ ચુકવણી વિકલ્પો" },
  "Pay where and how ": { hi: "जहाँ और जैसे चाहें ", gu: "જ્યાં અને જેમ ઇચ્છો તેમ " },
  "you want": { hi: "भुगतान करें", gu: "ચુકવણી કરો" },
  "Digital payments, cards, net banking, or cash — we support every payment channel so you can pay the way that is most convenient for you.": {
    hi: "डिजिटल भुगतान, कार्ड, नेट बैंकिंग या नकद — हम हर भुगतान माध्यम स्वीकार करते हैं ताकि आप अपनी सबसे सुविधाजनक तरीके से भुगतान कर सकें।",
    gu: "ડિજિટલ ચુકવણી, કાર્ડ, નેટ બેન્કિંગ કે રોકડ — અમે દરેક ચુકવણી માધ્યમ સ્વીકારીએ છીએ જેથી તમે તમારી સૌથી અનુકૂળ રીતે ચુકવણી કરી શકો.",
  },
  "Calibrated Packages": { hi: "सोच-समझकर बने पैकेज", gu: "સમજી-વિચારીને બનાવેલા પેકેજ" },
  "Best treatment at ": { hi: "बेहतरीन इलाज, ", gu: "શ્રેષ્ઠ સારવાર, " },
  "optimal pricing": { hi: "सही कीमत पर", gu: "યોગ્ય કિંમતે" },
  "Economy of scale means we deliver the highest quality products and treatments at the most competitive cost — without ever compromising on care.": {
    hi: "बड़े पैमाने का फ़ायदा यह है कि हम सर्वोच्च गुणवत्ता के उत्पाद और इलाज सबसे किफायती लागत पर देते हैं — देखभाल से कभी समझौता किए बिना।",
    gu: "મોટા પાયાનો લાભ એ છે કે અમે સર્વોચ્ચ ગુણવત્તાના ઉત્પાદનો અને સારવાર સૌથી સ્પર્ધાત્મક ખર્ચે આપીએ છીએ — સંભાળ સાથે ક્યારેય સમાધાન કર્યા વગર.",
  },
  "Smart Package Options": { hi: "स्मार्ट पैकेज विकल्प", gu: "સ્માર્ટ પેકેજ વિકલ્પો" },
  "Packages for ": { hi: "पैकेज ", gu: "પેકેજ " },
  "every pocket": { hi: "हर बजट के लिए", gu: "દરેક બજેટ માટે" },
  "Multi-cycle packages at reduced costs. Choose a three-cycle package to triple your chances — and save significantly.": {
    hi: "कम कीमत पर मल्टी-साइकल पैकेज। अपने मौके तीन गुना करने के लिए थ्री-साइकल पैकेज चुनें — और काफ़ी बचत करें।",
    gu: "ઓછી કિંમતે મલ્ટી-સાયકલ પેકેજ. તમારી તકો ત્રણ ગણી કરવા થ્રી-સાયકલ પેકેજ પસંદ કરો — અને નોંધપાત્ર બચત કરો.",
  },
  "Best Value": { hi: "सबसे किफायती", gu: "શ્રેષ્ઠ મૂલ્ય" },
  "Learn More": { hi: "और जानें", gu: "વધુ જાણો" },
  "Enquire Now": { hi: "अभी पूछताछ करें", gu: "હમણાં પૂછપરછ કરો" },
  "IVF Cost Calculator": { hi: "IVF कॉस्ट कैलकुलेटर", gu: "IVF કોસ્ટ કેલ્ક્યુલેટર" },
  "Estimate your ": { hi: "अपने ", gu: "તમારા " },
  "treatment expenses": { hi: "इलाज के खर्च का अंदाज़ा लगाएँ", gu: "સારવારના ખર્ચનો અંદાજ લગાવો" },
  "Use our expert IVF cost calculator to get a personalised estimate of your treatment expenses. Know what to expect before you begin.": {
    hi: "हमारे विशेषज्ञ IVF कॉस्ट कैलकुलेटर से अपने इलाज के खर्च का व्यक्तिगत अनुमान पाएँ। शुरू करने से पहले जानें कि क्या उम्मीद रखनी है।",
    gu: "અમારા નિષ્ણાત IVF કોસ્ટ કેલ્ક્યુલેટરથી તમારી સારવારના ખર્ચનો વ્યક્તિગત અંદાજ મેળવો. શરૂ કરતાં પહેલાં જાણો કે શું અપેક્ષા રાખવી.",
  },
  "Open Cost Calculator": { hi: "कॉस्ट कैलकुलेटर खोलें", gu: "કોસ્ટ કેલ્ક્યુલેટર ખોલો" },
  "Talk to Our Team": { hi: "हमारी टीम से बात करें", gu: "અમારી ટીમ સાથે વાત કરો" },
  "Frequently Asked Questions": { hi: "अक्सर पूछे जाने वाले प्रश्न", gu: "વારંવાર પૂછાતા પ્રશ્નો" },
  "Have questions? ": { hi: "कोई सवाल है? ", gu: "કોઈ પ્રશ્ન છે? " },
  "We have answers.": { hi: "हमारे पास जवाब हैं।", gu: "અમારી પાસે જવાબ છે." },
  "We believe in complete transparency when it comes to finances. Here are the most common questions about our payment options and EMI plans. For anything else, our team is always ready to help.": {
    hi: "पैसों के मामले में हम पूरी पारदर्शिता में विश्वास रखते हैं। यहाँ हमारे भुगतान विकल्पों और EMI योजनाओं के बारे में सबसे आम सवाल हैं। और कुछ भी पूछना हो तो हमारी टीम हमेशा मदद के लिए तैयार है।",
    gu: "પૈસાની બાબતમાં અમે સંપૂર્ણ પારદર્શિતામાં માનીએ છીએ. અહીં અમારા ચુકવણી વિકલ્પો અને EMI યોજનાઓ વિશેના સૌથી સામાન્ય પ્રશ્નો છે. બીજું કંઈ પણ પૂછવું હોય તો અમારી ટીમ હંમેશા મદદ માટે તૈયાર છે.",
  },
  "Don't let finances hold you back from ": { hi: "पैसों को माता-पिता बनने की राह में ", gu: "પૈસાને માતા-પિતા બનવાની રાહમાં " },
  "becoming a parent.": { hi: "रोड़ा न बनने दें।", gu: "અવરોધ ન બનવા દો." },
  "Book a consultation to discuss your treatment plan and explore the payment options that work best for you. No obligation, no pressure — just honest, transparent guidance.": {
    hi: "अपनी इलाज योजना पर बात करने और आपके लिए सबसे अच्छे भुगतान विकल्प जानने के लिए परामर्श बुक करें। कोई बाध्यता नहीं, कोई दबाव नहीं — बस ईमानदार और साफ़ मार्गदर्शन।",
    gu: "તમારી સારવાર યોજના પર ચર્ચા કરવા અને તમારા માટે સૌથી યોગ્ય ચુકવણી વિકલ્પો જાણવા પરામર્શ બુક કરો. કોઈ બંધનકર્તા નહીં, કોઈ દબાણ નહીં — બસ પ્રામાણિક અને પારદર્શક માર્ગદર્શન.",
  },
  "* EMI eligibility subject to approval. Terms and conditions apply.": {
    hi: "* EMI की पात्रता मंज़ूरी के अधीन है। नियम एवं शर्तें लागू।",
    gu: "* EMI ની પાત્રતા મંજૂરીને આધીન છે. નિયમો અને શરતો લાગુ.",
  },
};
