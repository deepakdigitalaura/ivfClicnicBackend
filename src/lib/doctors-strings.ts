/** hi/gu strings for /doctors (index) — keyed by the exact English text.
 *  Doctor names and degree abbreviations stay Latin; specialty, city and
 *  descriptive credential text are translated. Merged into UI_STRINGS. */
type S = Record<string, { hi: string; gu: string }>;

export const DOCTORS_STRINGS: S = {
  // ---- page chrome / SEO ----
  "Our Fertility Specialists — Doctors at Bavishi Fertility Institute": { hi: "हमारे फर्टिलिटी विशेषज्ञ — बवीशी फर्टिलिटी इंस्टीट्यूट के डॉक्टर", gu: "અમારા ફર્ટિલિટી નિષ્ણાતો — બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ડૉક્ટરો" },
  "Meet the credentialed fertility specialists at Bavishi Fertility Institute — IVF, ICSI, andrology and reproductive surgery experts caring for families across India since 1998.": { hi: "बवीशी फर्टिलिटी इंस्टीट्यूट के अनुभवी फर्टिलिटी विशेषज्ञों से मिलिए — IVF, ICSI, एंड्रोलॉजी और प्रजनन सर्जरी के विशेषज्ञ, जो 1998 से पूरे भारत के परिवारों की देखभाल कर रहे हैं।", gu: "બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના અનુભવી ફર્ટિલિટી નિષ્ણાતોને મળો — IVF, ICSI, એન્ડ્રોલોજી અને પ્રજનન સર્જરીના નિષ્ણાતો, જે 1998થી સમગ્ર ભારતના પરિવારોની સંભાળ રાખે છે." },
  "Our Fertility Specialists — Bavishi Fertility Institute": { hi: "हमारे फर्टिलिटी विशेषज्ञ — बवीशी फर्टिलिटी इंस्टीट्यूट", gu: "અમારા ફર્ટિલિટી નિષ્ણાતો — બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ" },
  "Credentialed IVF and fertility doctors across India. Meet our promoter doctors and specialists.": { hi: "पूरे भारत में अनुभवी IVF और फर्टिलिटी डॉक्टर। हमारे प्रमोटर डॉक्टरों और विशेषज्ञों से मिलिए।", gu: "સમગ્ર ભારતમાં અનુભવી IVF અને ફર્ટિલિટી ડૉક્ટરો. અમારા પ્રમોટર ડૉક્ટરો અને નિષ્ણાતોને મળો." },
  "Our Fertility Specialists": { hi: "हमारे फर्टिलिटी विशेषज्ञ", gu: "અમારા ફર્ટિલિટી નિષ્ણાતો" },
  "Meet our": { hi: "मिलिए हमारे", gu: "મળો અમારા" },
  "promoter doctors & specialists": { hi: "प्रमोटर डॉक्टरों और विशेषज्ञों से", gu: "પ્રમોટર ડૉક્ટરો અને નિષ્ણાતો સાથે" },
  "A family of fertility experts trusted by generations — credentialed, experienced and committed to honest, compassionate care.": { hi: "फर्टिलिटी विशेषज्ञों का एक परिवार, जिस पर पीढ़ियों से भरोसा किया जाता है — योग्य, अनुभवी और ईमानदार, संवेदनशील देखभाल के लिए समर्पित।", gu: "ફર્ટિલિટી નિષ્ણાતોનો એક પરિવાર, જેના પર પેઢીઓથી ભરોસો કરવામાં આવે છે — લાયકાત ધરાવતા, અનુભવી અને પ્રામાણિક, સંવેદનશીલ સંભાળ માટે સમર્પિત." },
  "Home": { hi: "होम", gu: "હોમ" },
  "Doctors": { hi: "डॉक्टर", gu: "ડૉક્ટરો" },
  "View profile": { hi: "प्रोफ़ाइल देखें", gu: "પ્રોફાઇલ જુઓ" },
  // ---- specialties ----
  "Fertility, IVF & Gynaecological Laparoscopy": { hi: "फर्टिलिटी, IVF और स्त्री रोग लैप्रोस्कोपी", gu: "ફર્ટિલિટી, IVF અને સ્ત્રીરોગ લેપ્રોસ્કોપી" },
  "Gynaecologist & IVF Specialist": { hi: "स्त्री रोग विशेषज्ञ और IVF विशेषज्ञ", gu: "સ્ત્રીરોગ નિષ્ણાત અને IVF નિષ્ણાત" },
  "Gynaecology, IVF & 3D Laparoscopy": { hi: "स्त्री रोग, IVF और 3D लैप्रोस्कोपी", gu: "સ્ત્રીરોગ, IVF અને 3D લેપ્રોસ્કોપી" },
  "IVF & Andrology": { hi: "IVF और एंड्रोलॉजी", gu: "IVF અને એન્ડ્રોલોજી" },
  "IVF & Laparoscopic Surgery": { hi: "IVF और लैप्रोस्कोपिक सर्जरी", gu: "IVF અને લેપ્રોસ્કોપિક સર્જરી" },
  "Infertility & IVF": { hi: "इनफर्टिलिटी और IVF", gu: "ઇનફર્ટિલિટી અને IVF" },
  "Infertility, IVF & Genetics": { hi: "इनफर्टिलिटी, IVF और जेनेटिक्स", gu: "ઇનફર્ટિલિટી, IVF અને જેનેટિક્સ" },
  "Obstetrics & Gynaecology": { hi: "प्रसूति और स्त्री रोग", gu: "પ્રસૂતિ અને સ્ત્રીરોગ" },
  "Obstetrics & IVF": { hi: "प्रसूति और IVF", gu: "પ્રસૂતિ અને IVF" },
  "Obstetrics, Gynaecology & Fertility": { hi: "प्रसूति, स्त्री रोग और फर्टिलिटी", gu: "પ્રસૂતિ, સ્ત્રીરોગ અને ફર્ટિલિટી" },
  "Obstetrics, Gynaecology & IVF": { hi: "प्रसूति, स्त्री रोग और IVF", gu: "પ્રસૂતિ, સ્ત્રીરોગ અને IVF" },
  "Reproductive Medicine & IVF": { hi: "प्रजनन चिकित्सा और IVF", gu: "પ્રજનન ચિકિત્સા અને IVF" },
  "Reproductive Medicine & Laparoscopic Surgery": { hi: "प्रजनन चिकित्सा और लैप्रोस्कोपिक सर्जरी", gu: "પ્રજનન ચિકિત્સા અને લેપ્રોસ્કોપિક સર્જરી" },
  "Fertility & IVF": { hi: "फर्टिलिटी और IVF", gu: "ફર્ટિલિટી અને IVF" },
  "Fertility Specialist": { hi: "फर्टिलिटी विशेषज्ञ", gu: "ફર્ટિલિટી નિષ્ણાત" },
  // ---- credentials (degree abbreviations stay Latin) ----
  "MBBS, DGO, DNB (Obstetrics & Gynaecology)": { hi: "MBBS, DGO, DNB (प्रसूति और स्त्री रोग)", gu: "MBBS, DGO, DNB (પ્રસૂતિ અને સ્ત્રીરોગ)" },
  "MBBS, MD (Obstetrics & Gynaecology)": { hi: "MBBS, MD (प्रसूति और स्त्री रोग)", gu: "MBBS, MD (પ્રસૂતિ અને સ્ત્રીરોગ)" },
  "MBBS, MD, Fellowship in Reproductive Medicine (USA)": { hi: "MBBS, MD, प्रजनन चिकित्सा में फ़ेलोशिप (USA)", gu: "MBBS, MD, પ્રજનન ચિકિત્સામાં ફેલોશિપ (USA)" },
  "MBBS, MS (Obstetrics & Gynaecology)": { hi: "MBBS, MS (प्रसूति और स्त्री रोग)", gu: "MBBS, MS (પ્રસૂતિ અને સ્ત્રીરોગ)" },
  "MS (Obstetrics & Gynaecology), FMAS, FRM — Gold Medalist": { hi: "MS (प्रसूति और स्त्री रोग), FMAS, FRM — गोल्ड मेडलिस्ट", gu: "MS (પ્રસૂતિ અને સ્ત્રીરોગ), FMAS, FRM — ગોલ્ડ મેડલિસ્ટ" },
  // ---- cities ----
  "Ahmedabad": { hi: "अहमदाबाद", gu: "અમદાવાદ" },
  "Anand": { hi: "आणंद", gu: "આણંદ" },
  "Bhavnagar": { hi: "भावनगर", gu: "ભાવનગર" },
  "Bhuj": { hi: "भुज", gu: "ભુજ" },
  "Mumbai": { hi: "मुंबई", gu: "મુંબઈ" },
  "Surat": { hi: "सूरत", gu: "સુરત" },
  "Vadodara": { hi: "वडोदरा", gu: "વડોદરા" },
  "Varanasi": { hi: "वाराणसी", gu: "વારાણસી" },
};
