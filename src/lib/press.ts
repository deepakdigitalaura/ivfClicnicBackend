/* =====================================================================
 * Press clippings — real newspaper coverage of Bavishi Fertility Institute.
 * ---------------------------------------------------------------------
 * Powers the /press hub and each individual /press/<slug> article page.
 * These are scans of printed articles supplied by the clinic.
 *
 * RULES (do not break these):
 *  - Every entry must correspond to a real scan in /public/assets/media/press.
 *  - `headline` is transcribed from the clipping, never invented.
 *  - Gujarati headlines keep the original in `headlineOriginal`; `headline`
 *    carries a plain-English rendering so the card is scannable and the page
 *    stays indexable.
 *  - `bodyText` is the FULL article text, transcribed faithfully from the
 *    scan, paragraph by paragraph, in the language it was printed in
 *    (Gujarati articles are kept in Gujarati — never translated). Never
 *    invent or paraphrase a sentence that isn't legibly on the clipping.
 *  - `summary` is a short factual description used only for meta/OG
 *    descriptions — not shown as the main body copy on the page.
 *  - `date` is set ONLY where the clipping (or its filing stamp) states it.
 *    Never guess a date to fill the field — omit it instead.
 * ===================================================================== */

export type PressClipping = {
  /** Stable slug — matches the image filenames in /assets/media/press and
   *  the /press/<slug> route. */
  slug: string;
  /** Headline as printed (English), or an English rendering for Gujarati. */
  headline: string;
  /** Original-language headline, for non-English papers. */
  headlineOriginal?: string;
  /** Standfirst / sub-headline as printed, when the clipping carries one. */
  standfirst?: string;
  /** Newspaper name. */
  publication: string;
  /** City edition, where printed on the clipping. */
  edition?: string;
  /** Human date label. Omitted when the clipping carries no legible date. */
  date?: string;
  /** Byline, as printed, when the clipping carries one. */
  byline?: string;
  /** Language the article is printed in. */
  language: "English" | "Gujarati";
  /** Short factual description — meta/OG description only, not page copy. */
  summary: string;
  /** Full transcribed article text, one paragraph per array entry, in the
   *  original printed language. */
  bodyText: string[];
  /** BFI doctors quoted in the article, as named in print. */
  doctorsQuoted: string[];
  /** Full-resolution scan. */
  image: string;
  /** Grid thumbnail. */
  thumb: string;
  /** Intrinsic size of `image`, to reserve layout space. */
  width: number;
  height: number;
};

const DIR = "/assets/media/press";

export const PRESS_CLIPPINGS: PressClipping[] = [
  {
    slug: "yug-prabhav-100-ivf-babies-meet",
    headline:
      "Vadodara's first-ever gathering of more than 100 IVF test-tube babies",
    headlineOriginal:
      "વડોદરામાં સૌપ્રથમ વખત એક સાથે ૧૦૦થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકોનો મેળાવડો યોજવાનો પ્રયાસ",
    publication: "Yug Prabhav",
    edition: "Vadodara",
    date: "14 October 2024",
    language: "Gujarati",
    summary:
      "Report on the reunion of over 100 IVF babies hosted at Bavishi Fertility Institute, Vadodara, to build public awareness of test-tube baby treatment. Dr Himanshu Bavishi speaks on how correct treatment at the right time makes conception possible in almost all cases, and Dr Falguni Bavishi explains how IVF can prevent hereditary disease being passed to the child.",
    bodyText: [
      "વડોદરા, તા.૧૪",
      "આજના સમાજમાં નિઃસંતાનપણાને એક શ્રાપ ગણવામાં આવે છે. ત્યારે આધુનિક ટેકનોલોજી મારફતે લોકોમાં IVF ટેસ્ટ ટ્યુબ બેબી વિશે જાગૃતિ આવે તે માટે ટેસ્ટ ટ્યુબ બેબીનો મેળાવડો વડોદરાના બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ ખાતે યોજાયો હતો.",
      "આધુનિક યુગમાં લોકો વધુમાં વધુ ટેકનોલોજીનો ઉપયોગ કરે તેવા અનેક કિસ્સાઓ સામે આવ્યા છે જોકે નિઃસંતાનપણાને સમાજમાં લાંછનરૂપ અથવા તો નીચાપણું તરીકે જોવામાં આવે છે ત્યારે તો ક્યારેક બાળકો ન થવાના કારણે છૂટાછેડાના કિસ્સાઓ બને છે… તો લોકો અંધશ્રદ્ધાના માર્ગે પણ ચડતા હોય છે. અધ્યતન ટેકનોલોજી ના માધ્યમથી પુરુષ અથવા મહિલામાં જે ખામીઓ હોય તે ખામીઓ દૂર કરીને નિઃસંતાનપણું દૂર કરી શકાય છે.",
      "સંતાન ન થવાના કારણે દંપતિઓ આપઘાત પણ કરી લેતા હોય છે… અત્યારે ટેસ્ટ ટ્યુબ બેબી એક આશીર્વાદરૂપ ટેકનીક બની છે.",
      "આ પ્રસંગે બોલતા ડોકટર હિમાંશુ બાવીશી એ જણાવ્યું કે યોગ્ય સારવાર યોગ્ય સમયે યોગ્ય માત્રામાં યોગ્ય જગ્યાએ કરવામાં આવે તો લગભગ સો ટકા સંતાન પ્રાપ્તિ શક્ય બને છે. બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ૨૮ વર્ષના ઈતિહાસમાં અમે વિજ્ઞાન અને વિશ્વાસ એટલે કે ટેકનોલોજી અને ટ્રસ્ટની મદદથી હજારો નિઃસંતાન યુગલોના જીવનમાં આ ખુશી આપવામાં નિમિત્ત બની શક્યા છીએ એનો અમને ખૂબ આનંદ છે.",
      "હાલ જે પ્રકારે મહિલાઓને ગર્ભાશયની તકલીફ, ગાદીની તકલીફ, બીજ ના બનવા તેમજ પુરુષોમાં જ્યારે કાઉન્ટ ઓછા હોવા, બીજની ખામી હોવાના કિસ્સાઓ ખૂબ ઝડપથી વધી રહ્યા છે ત્યારે IVF સારવાર પદ્ધતિથી જટીલમાં જટિલ સમસ્યાઓનું સમાધાન કરીને પણ વિજય મેળવી શકાય છે.",
      "કેમ્પ, સેમીનાર વિગેરે જેવી જગ્યાઓમાં લોકોને માત્ર એક તરફી સાંભળવાનો જ મોકો મળે છે પરંતુ પોતાના જ જેવી સમસ્યાઓને સામનો કરીને સફળતા મેળવી ચૂકેલા યુગલોનો ખરો અનુભવ ખૂબ જ પારદર્શક અને પ્રેરણાદાય સાબિત થઈ શકે છે. માટે જ બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ઉપક્રમે વડોદરા તેમજ આસપાસના લોકોના લાભાર્થે ૧૦૦ થી વધારે IVF બેબી નો મેળાવડો યોજવામાં આવેલ છે.",
      "IVF ટેસ્ટ ટ્યુબ બાળકોના માતા-પિતા પોતે સંતાન સાથે અહીં પોતાના જાત અનુભવ જણાવેલ. સારવાર દરમિયાનના માનસિક ઉતાર ચઢાવ સફળતા અને નિષ્ફળતા વચ્ચેનો ડર અને છેલ્લે સફળતા એક એક યુગલની સંઘર્ષ અને સફળતાની ગાથા ખરેખર આંખમાં આંસુ લાવી દે તેવી પણ એટલી જ પ્રેરણાદાયક હતી.",
      "આ પ્રસંગે બોલતા ડોક્ટર ફાલ્ગુની બાવીશીએ જણાવ્યું હતું કે IVF સારવાર પદ્ધતિ જન્મનાર બાળકોમાં વારસાગત રોગો આવવાની શક્યતાઓને પણ અટકાવી શકે છે અને રોગમુક્ત તંદુરસ્ત બાળકનો જન્મ થાય તેમ કરી શકે છે. ટેકનોલોજીના વિકાસની સાથે સાથે વધુને વધુ સફળતા અપાવતું IVF આઇવીએફ હવે ઘણું એફોર્ડેબલ પણ થઈ ગયું છે. લોકોમાં પણ આઇવીએફની જાગૃતિ અને સ્વીકૃતિમાં નોંધપાત્ર સુધારો થયો છે.",
    ],
    doctorsQuoted: ["Dr Himanshu Bavishi", "Dr Falguni Bavishi"],
    image: `${DIR}/yug-prabhav-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/yug-prabhav-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "vadodara-samachar-100-ivf-babies-meet",
    headline:
      "For the first time in Vadodara's history, a gathering of more than 100 IVF test-tube babies",
    headlineOriginal:
      "વડોદરાના ઇતિહાસમાં સૌપ્રથમ વખત એક સાથે ૧૦૦ થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકો નો મેળાવડો યોજાયો",
    publication: "Vadodara Samachar",
    edition: "Vadodara",
    date: "13 October 2024",
    language: "Gujarati",
    summary:
      "Coverage of the test-tube baby reunion held at Bavishi Fertility Institute, Vadodara. Dr Himanshu Bavishi describes the institute's 28-year record of helping thousands of childless couples through a combination of technology and trust.",
    bodyText: [
      "વડોદરા, તા.૧૨",
      "આજના સમાજમાં નિઃસંતાનપણાને એક શ્રાપ ગણવામાં આવે છે. ત્યારે આધુનિક ટેકનોલોજી મારફતે લોકોમાં IVF ટેસ્ટ ટ્યુબ બેબી વિશે જાગૃતિ આવે તે માટે ટેસ્ટ ટ્યુબ બેબીનો મેળાવડો વડોદરાના બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ ખાતે યોજાયો હતો.",
      "આધુનિક યુગમાં લોકો વધુમાં વધુ ટેકનોલોજીનો ઉપયોગ કરે તેવા અનેક કિસ્સાઓ સામે આવ્યા છે જોકે નિઃસંતાનપણાને સમાજમાં લાંછનરૂપ અથવા તો નીચાપણું તરીકે જોવામાં આવે છે ત્યારે તો ક્યારેક બાળકો ન થવાના કારણે છૂટાછેડાના કિસ્સાઓ બને છે… તો લોકો અંધશ્રદ્ધાના માર્ગે પણ ચડતા હોય છે.",
      "અધ્યતન ટેકનોલોજી ના માધ્યમથી પુરુષ અથવા મહિલામાં જે ખામીઓ હોય તે ખામીઓ દૂર કરીને નિઃસંતાનપણું દૂર કરી શકાય છે. સંતાન ન થવાના કારણે દંપતિઓ આપઘાત પણ કરી લેતા હોય છે… અત્યારે ટેસ્ટ ટ્યુબ બેબી એક આશીર્વાદરૂપ ટેકનીક બની છે.",
      "આ પ્રસંગે બોલતા ડોક્ટર હિમાંશુ બાવીશી એ જણાવ્યું કે યોગ્ય સારવાર યોગ્ય સમયે યોગ્ય માત્રામાં યોગ્ય જગ્યાએ કરવામાં આવે તો લગભગ સો ટકા સંતાન પ્રાપ્તિ શક્ય બને છે. બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ૨૮ વર્ષના ઈતિહાસમાં અમે વિજ્ઞાન અને વિશ્વાસ એટલે કે ટેકનોલોજી અને ટ્રસ્ટની મદદથી હજારો નિઃસંતાન યુગલોના જીવનમાં આ ખુશી આપવામાં નિમિત્ત બની શક્યા છીએ એનો અમને ખૂબ આનંદ છે.",
      "હાલ જે પ્રકારે મહિલાઓને ગર્ભાશયની તકલીફ, ગાદીની તકલીફ, બીજ ના બનવા તેમજ પુરુષોમાં જ્યારે કાઉન્ટ ઓછા હોવા, બીજની ખામી હોવાના કિસ્સાઓ ખૂબ ઝડપથી વધી રહ્યા છે ત્યારે IVF સારવાર પદ્ધતિથી જટીલમાં જટિલ સમસ્યાઓનું સમાધાન કરીને પણ વિજય મેળવી શકાય છે.",
      "કેમ્પ, સેમીનાર વિગેરે જેવી જગ્યાઓમાં લોકોને માત્ર એક તરફી સાંભળવાનો જ મોકો મળે છે પરંતુ પોતાના જ જેવી સમસ્યાઓને સામનો કરીને સફળતા મેળવી ચૂકેલા યુગલોનો ખરો અનુભવ ખૂબ જ પારદર્શક અને પ્રેરણાદાય સાબિત થઈ શકે છે. માટે જ બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ઉપક્રમે વડોદરા તેમજ આસપાસના લોકોના લાભાર્થે ૧૦૦ થી વધારે IVF બેબી નો મેળાવડો યોજવામાં આવેલ છે.",
    ],
    doctorsQuoted: ["Dr Himanshu Bavishi"],
    image: `${DIR}/vadodara-samachar-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/vadodara-samachar-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "yatharth-100-ivf-babies-meet",
    headline:
      "A gathering of more than 100 IVF test-tube babies is held — a first in Vadodara's history",
    headlineOriginal:
      "એક સાથે ૧૦૦થી વધુ IVF ટેસ્ટ ટ્યુબ બાળકોનો મેળાવડો યોજાયો",
    publication: "Yatharth",
    edition: "Vadodara",
    date: "13 October 2024",
    language: "Gujarati",
    summary:
      "Report on the IVF babies' reunion at Bavishi Fertility Institute, Vadodara. Dr Himanshu Bavishi and Dr Falguni Bavishi speak on treatment success, on IVF's role in avoiding hereditary conditions, and on how far affordability and public acceptance of IVF have improved.",
    bodyText: [
      "આજના સમાજમાં નિઃસંતાનપણાને એક શ્રાપ ગણવામાં આવે છે. ત્યારે આધુનિક ટેકનોલોજી મારફતે લોકોમાં IVF ટેસ્ટ ટ્યુબ બેબી વિશે જાગૃતિ આવે તે માટે ટેસ્ટ ટ્યુબ બેબીનો મેળાવડો વડોદરાના બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટ ખાતે યોજાયો હતો.",
      "આધુનિક યુગમાં લોકો વધુમાં વધુ ટેકનોલોજીનો ઉપયોગ કરે તેવા અનેક કિસ્સાઓ સામે આવ્યા છે જોકે નિઃસંતાનપણાને સમાજમાં લાંછનરૂપ અથવા તો નીચાપણું તરીકે જોવામાં આવે છે ત્યારે તો ક્યારેક બાળકો ન થવાના કારણે છૂટાછેડાના કિસ્સાઓ બને છે… તો લોકો અંધશ્રદ્ધાના માર્ગે પણ ચડતા હોય છે.",
      "અધ્યતન ટેકનોલોજી ના માધ્યમથી પુરુષ અથવા મહિલામાં જે ખામીઓ હોય તે ખામીઓ દૂર કરીને નિઃસંતાનપણું દૂર કરી શકાય છે. સંતાન ન થવાના કારણે દંપતિઓ આપઘાત પણ કરી લેતા હોય છે… અત્યારે ટેસ્ટ ટ્યુબ બેબી એક આશીર્વાદરૂપ ટેકનીક બની છે.",
      "આ પ્રસંગે બોલતા ડોક્ટર હિમાંશુ બાવીશી એ જણાવ્યું કે યોગ્ય સારવાર યોગ્ય સમયે યોગ્ય માત્રામાં યોગ્ય જગ્યાએ કરવામાં આવે તો લગભગ સો ટકા સંતાન પ્રાપ્તિ શક્ય બને છે. બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ૨૮ વર્ષના ઈતિહાસમાં અમે વિજ્ઞાન અને વિશ્વાસ એટલે કે ટેકનોલોજી અને ટ્રસ્ટની મદદથી હજારો નિઃસંતાન યુગલોના જીવનમાં આ ખુશી આપવામાં નિમિત્ત બની શક્યા છીએ એનો અમને ખૂબ આનંદ છે.",
      "હાલ જે પ્રકારે મહિલાઓને ગર્ભાશયની તકલીફ, ગાદીની તકલીફ, બીજ ના બનવા તેમજ પુરુષોમાં જ્યારે કાઉન્ટ ઓછા હોવા, બીજની ખામી હોવાના કિસ્સાઓ ખૂબ ઝડપથી વધી રહ્યા છે ત્યારે IVF સારવાર પદ્ધતિથી જટીલમાં જટિલ સમસ્યાઓનું સમાધાન કરીને પણ વિજય મેળવી શકાય છે. કેમ્પ, સેમીનાર વિગેરે જેવી જગ્યાઓમાં લોકોને માત્ર એક તરફી સાંભળવાનો જ મોકો મળે છે પરંતુ પોતાના જ જેવી સમસ્યાઓને સામનો કરીને સફળતા મેળવી ચૂકેલા યુગલોનો ખરો અનુભવ ખૂબ જ પારદર્શક અને પ્રેરણાદાય સાબિત થઈ શકે છે. માટે જ બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યૂટના ઉપક્રમે વડોદરા તેમજ આસપાસના લોકોના લાભાર્થે ૧૦૦ થી વધારે IVF બેબી નો મેળાવડો યોજવામાં આવેલ છે.",
      "IVF ટેસ્ટ ટ્યુબ બાળકોના માતા-પિતા પોતે સંતાન સાથે અહીં પોતાના જાત અનુભવ જણાવેલ. સારવાર દરમિયાનના માનસિક ઉતાર ચઢાવ સફળતા અને નિષ્ફળતા વચ્ચેનો ડર અને છેલ્લે સફળતા એક એક યુગલની સંઘર્ષ અને સફળતાની ગાથા ખરેખર આંખમાં આંસુ લાવી દે તેવી પણ એટલી જ પ્રેરણાદાયક હતી.",
      "આ પ્રસંગે બોલતા ડોક્ટર ફાલ્ગુની બાવીશીએ જણાવ્યું હતું કે IVF સારવાર પદ્ધતિ જન્મનાર બાળકોમાં વારસાગત રોગો આવવાની શક્યતાઓને પણ અટકાવી શકે છે અને રોગમુક્ત તંદુરસ્ત બાળકનો જન્મ થાય તેમ કરી શકે છે. ટેકનોલોજીના વિકાસની સાથે સાથે વધુને વધુ સફળતા અપાવતું IVF આઇવીએફ હવે ઘણું એફોર્ડેબલ પણ થઈ ગયું છે. લોકોમાં પણ આઇવીએફની જાગૃતિ અને સ્વીકૃતિમાં નોંધપાત્ર સુધારો થયો છે.",
      "કેટલાક યુગલોમાં પતિ અને પત્નીએ એકબીજાનો ખૂબ જ સહકાર મળતો તો ક્યારેક એક પાત્ર બિલકુલ સહકારના એક પાત્ર એ જ ઝૂમવું પડતું. કેટલાક પરિવારો ખૂબ સપોર્ટ કરતા જ્યારે કેટલાક પરિવારો તરફથી સંપૂર્ણપણે સપોર્ટ નતો મળતો. કોઈની આર્થિક મુશ્કેલી, કોઈની શારીરિક તકલીફો, કોઈની માનસિક મુસીબતો, કોઈના સામાજિક પ્રશ્નો — આ બધી વાતો ખરેખર હૃદય સ્પર્શી હતી.",
    ],
    doctorsQuoted: ["Dr Himanshu Bavishi", "Dr Falguni Bavishi"],
    image: `${DIR}/yatharth-100-ivf-babies-meet.jpg`,
    thumb: `${DIR}/yatharth-100-ivf-babies-meet-thumb.jpg`,
    width: 1654,
    height: 2338,
  },
  {
    slug: "toi-single-dad-via-surrogacy",
    headline: "He is among last to be single dad via surrogacy",
    standfirst:
      "Pritesh Dave, 37, Becomes Dad To Twins Before New Surrogacy Law Kicks In",
    publication: "The Times of India",
    edition: "Ahmedabad",
    byline: "Radha Sharma",
    language: "English",
    summary:
      "A Father's Day feature on Pritesh Dave, among the last single men to become a parent through surrogacy before the new surrogacy law came into force. Infertility specialist Dr Parth Bavishi explains that the new rules do not allow surrogacy for single men, women, live-in and same-sex couples, and Dr Janki Bavishi notes the interest among single men who can no longer take this route.",
    bodyText: [
      "Ahmedabad: Pritesh Dave, 37, always had Lady Luck giving him the slip as most girls he met rejected his matrimonial proposal since he did not have a government job.",
      "Once he turned 35, he realized that having missed the life milestone of getting married, he may not fulfil his dream of becoming a father. Not ready to give up on that, Dave started fertility treatment to become a single father.",
      "This time, Lady Luck smiled at him, and this self-employed, Class 12 pass bachelor became father to twins — a boy and a girl — early last year.",
      "Infertility specialist Dr Parth Bavishi said that Dave is one of the last few men to have achieved this feat months before the new surrogacy law came into force. \"According to the new rules, surrogacy is not allowed for single men, women, live-in and same-sex couples,\" said Dr Parth.",
      "\"I know I got lucky as now a singleton like me cannot even qualify for surrogacy,\" says Dave who spends his time between Surat where his parents live and Bhavnagar where he runs a Grahak Seva Kendra for a nationalized bank.",
      "Dave says there are many men in his community who are not able to find a bride as parents prefer to marry off their daughters to youths with government jobs. \"We have got land and properties but that apparently does not count,\" rued Dave.",
      "Dave says that his children Dhairya and Divya have become the life of his family. \"My parents were dejected when, despite sincere attempts, I could not win a girl's hand in marriage. However, the arrival of the twins has filled our house with joy,\" says Dave who spends hours playing with his children in the morning and evening. He says his mother is his pillar of support in raising his babies.",
      "\"I may not have a life-partner, but I have got my family for life. This is the biggest blessing,\" says Dave.",
      "Infertility specialist Dr Janki Bavishi said that after Bollywood celebrities Karan Johar and Tusshar Kapoor became single fathers through surrogacy, there are many single men who want to explore this option, but now the new surrogacy laws do not allow it.",
    ],
    doctorsQuoted: ["Dr Parth Bavishi", "Dr Janki Bavishi"],
    image: `${DIR}/toi-single-dad-via-surrogacy.jpg`,
    thumb: `${DIR}/toi-single-dad-via-surrogacy-thumb.jpg`,
    width: 2338,
    height: 1654,
  },
  {
    slug: "toi-dads-made-single-by-covid",
    headline: "Dads made single by Covid tend to babies and grief",
    publication: "The Times of India",
    edition: "Ahmedabad",
    byline: "Radha Sharma",
    language: "English",
    summary:
      "A Father's Day report on men widowed during the second Covid wave who are raising newborns alone. Fertility specialist Dr Falguni Bavishi describes a couple from Nadiad who were expecting a child after 23 years of married life.",
    bodyText: [
      "Ahmedabad: On the eve of Father's Day, Bharat Sharma was busy making arrangements to travel to Haridwar to immerse the ashes of his deceased wife into river Ganga. In between, he would take breaks to feed his newborn son a bottle of formula milk, burp him and put him to sleep.",
      "Bharat and his wife Manju were over the moon when she conceived after 11 years of married life through IVF treatment. The couple often dreamt of sharing the task of bringing up their precious baby. Not even once did Sharma think he will have to double up as both a mother and father for his baby, Ramansh, who was born on Ram Navami on April 21. His wife succumbed to Covid-19 on April 29 during the second wave.",
      "\"Manju just saw the baby's picture and flashed me a victory sign. Then her condition worsened, was put on ventilator but she did not survive. Being the best father to my son is the only mission of my life. I will ensure I also shower Manju's share of love on him,\" says Bharat, his voice breaking down. He says he is blessed to belong to a joint family.",
      "\"It will be a sombre father's day for many families like the Sharma's where pregnant women succumbed to Covid-19 leaving fathers with the sole responsibility of bringing up newborns,\" says Dr Manish Banker, who treated Sharma couples with IVF.",
      "Devdutt Taviyad, serving in the ITI in Santrampur, Mahisagar is another father struggling to come to terms with the grief of losing his wife Daksha who died of Covid-19 complications days after giving birth to a son. Fertility specialist Dr Falguni Bavishi said the couple was expecting a child after 23 years of married life.",
      "Daksha delivered a baby boy on May 19 and succumbed to Covid complications of pancreatitis on May 30. \"I navigate through grief daily but pull myself together to raise my son. I am learning how to know when he is hungry, feed him well and change his nappies. Currently I am staying with my brother and bhabhi to pick up the basics of child rearing,\" says Devdutt.",
      "In Nadiad, Nitin Sodha, 49, spends his day in the hospital where his newborn daughter is admitted after being prematurely delivered at 1.7 kgs. \"The couple had got pregnant after 35 years of marriage and were all hopes and dreams of bringing a bundle of joy in their lives,\" says fertility specialist Dr Nayana Patel.",
      "But Nitin says it would be his biggest regret that his daughter would never see or meet her mother Jassi. \"I can cry rivers but I have resolved to be strong for my daughter. It is my life's mission as a father to see that my girl survives and lives to fulfil her mother's dreams,\" says Nitin. \"God will give me strength to live and work some more for our girl,\" added Nitin who works as a mason on contract.",
    ],
    doctorsQuoted: ["Dr Falguni Bavishi"],
    image: `${DIR}/toi-dads-made-single-by-covid.jpg`,
    thumb: `${DIR}/toi-dads-made-single-by-covid-thumb.jpg`,
    width: 2338,
    height: 1654,
  },
  {
    slug: "toi-12-year-wait-for-baby",
    headline: "12-yr wait for baby, Covid kills mom after delivery",
    standfirst: "Sister-In-Law In Oz To Adopt Child",
    publication: "The Times of India",
    edition: "Ahmedabad",
    date: "7 June 2021",
    byline: "Radha Sharma",
    language: "English",
    summary:
      "A report on a family from Anand who lost a mother to Covid a day after she delivered a son conceived following 12 years of yearning and multiple IVF cycles. Dr Falguni Bavishi, the IVF specialist handling the family's surrogacy treatment, calls it a rare situation created by the pandemic for hopeful mothers.",
    bodyText: [
      "Ahmedabad: In a tragic incident, a woman in Piplaj of Anand died a day after giving birth to a son. She had tested positive for Covid and the child was delivered after she developed serious complications.",
      "Jalpa Patel gave birth to a baby boy on April 25 and succumbed to coronavirus on April 26. The son was a precious child born after 12 years of yearning wherein Jalpa had even undergone multiple cycles of IVF treatment.",
      "\"When the pandemic struck last year, we stopped all treatment. Luckily, we conceived naturally. But the joy was short lived as Jalpa died a day after the delivery. My only consolation is that she was conscious enough to know she had given birth to a healthy child,\" her husband Chetan said.",
      "The couple is already parents to a 13-year old girl who suffers from mild mental retardation. Family said that Jalpa was keen to have a second child so that when she grows up, there is a sibling guardian to look after her even in their absence.",
      "Ironically, Patel family is faced with a rare situation where the child of elder brother Chetan is left motherless while a surrogate is pregnant with the biological child of younger brother Urvish and his wife Darshana who are based in Australia.",
      "\"Jalpa bhabhi had said that even if I cannot travel to India for the birth of our child due to suspended air travel between India and Australia, she would take care of both babies till I come to India,\" said Darshna from Australia.",
      "Dr Falguni Bavishi, IVF specialist who is looking after Darshana's surrogacy treatment, said it is a rare situation created by the pandemic for hopeful mothers.",
      "When the pandemic struck, Urvish's wife Darshana had come to Ahmedabad in March 2020 for her IVF treatment. She suffered from adenomyosis, a condition in which endometrial tissue exists within and grows into the uterine wall.",
      "\"I was told that due to this condition, my uterus cannot sustain a pregnancy. I was advised for surrogacy. We started the treatment and just when the embryos were formed, we had to rush back to Australia as air-travel between the two countries was shut down,\" says Darshana.",
      "Darshana is eagerly awaiting for the second wave to ebb out in India. \"We wish to adopt Param as Jalpa bhabhi always said the baby is as much ours as hers,\" said Darshna.",
      "\"I will be happy to give the baby to my younger brother's family for adoption so that my younger brother and my son both have a happy life,\" said Chetan.",
    ],
    doctorsQuoted: ["Dr Falguni Bavishi"],
    image: `${DIR}/toi-12-year-wait-for-baby.jpg`,
    thumb: `${DIR}/toi-12-year-wait-for-baby-thumb.jpg`,
    width: 2338,
    height: 1095,
  },
  {
    slug: "toi-low-sperm-motility-genes-study",
    headline:
      "When going gets tough: Low sperm motility could run in genes, finds study",
    standfirst: "Experts Probe Genetic Reasons For Male Infertility",
    publication: "The Times of India",
    edition: "Ahmedabad",
    byline: "Parth Shastri",
    language: "English",
    summary:
      "Coverage of an international study that identified six new genes responsible for severe sperm motility disorder. Fertility specialist Dr Himanshu Bavishi explains that low motility is an important factor in male infertility — a factor in 40% of cases of childlessness — and that specific tests can identify live sperm that cannot move.",
    bodyText: [
      "Ahmedabad: An international study – consisting of researchers from the Netherlands, Australia, Latvia, UK, Argentina and India – on severe sperm motility disorder (ability of organisms to move independently) found six new genes responsible for the phenomenon. The broader implications of the study indicate the issue passing from generation to generation.",
      "Dr Harsh Sheth from city-based FRIGE's Institute of Human Genetics and one of the authors of the study said that they found six new genes – DNAH12, DRC1, MDC1, PACRG, SSPL2C and TPTE2 – in addition to the already known genes responsible for the very low sperm motility – generally caused by underdeveloped tail of the sperm. It's the tail that helps a sperm move towards the egg.",
      "\"We focused on men with a specific sperm defect identified as asthenozoospermia, meaning sperms with low to no movement. Samples from Argentina and Australia were analyzed for the study. The findings explain the cause in more than 60% of the cases,\" said Dr Sheth. \"The study is significant as it used exome analysis where every single letter of the DNA that codes for proteins is analyzed. We don't have any such study at present in India.\"",
      "Fertility specialist Dr Himanshu Bavishi said that low motility is an important factor in male infertility. Male infertility is a factor in 40% cases of childlessness. Of these, 20% males would have low sperm motility, said Dr Bavishi. In many patients, the sperm motility is zero. In such cases, the sperms can be considered dead. \"We conduct specific tests to find out if these are live sperms that cannot move,\" Dr Bavishi added.",
      "Anand-based surrogacy specialist Dr Nayana Patel said that, according to WHO, a healthy male should have a minimum 15 lakh sperm count and 38% of them should be motile. In many cases, diet and medicine can work in improving motility but it does not help if motility is zero. In such cases, patients cannot have natural pregnancy. \"The good thing is that advanced IVF techniques like ICSI can easily bypass this factor,\" said Dr Patel.",
      "He said that in a majority of such cases, the couples go for IVF. \"It circumvents the issue – but it may run down the generation. Currently, there is no treatment available for it. But it can help the experts to decide on procedures for the fertility treatment,\" he said.",
      "IHG is currently running a project funded by ICMR where the experts will analyze samples from 200 patients with sperm-related infertility and would try to assess its genetic causes. The present study would help compare the results with global findings and develop treatments.",
      "Internationally, about one in 60 males face issue of infertility, said experts. Due to socio-psychological reasons, several of these issues don't come to light, they added.",
    ],
    doctorsQuoted: ["Dr Himanshu Bavishi"],
    image: `${DIR}/toi-low-sperm-motility-genes-study.jpg`,
    thumb: `${DIR}/toi-low-sperm-motility-genes-study-thumb.jpg`,
    width: 2223,
    height: 1601,
  },
];

/** Distinct publications, in first-appearance order — used for the filter row. */
export function pressPublications(): string[] {
  return [...new Set(PRESS_CLIPPINGS.map((c) => c.publication))];
}

export function pressHref(slug: string): string {
  return `/press/${slug}`;
}

export function pressClippingBySlug(slug: string): PressClipping | undefined {
  return PRESS_CLIPPINGS.find((c) => c.slug === slug);
}
