/* =====================================================================
 * Written patient reviews (text) — real Google reviews only.
 * ---------------------------------------------------------------------
 * Powers the "What patients say" text-review carousel on doctor profile
 * pages. These are REAL Google reviews for the named doctor, transcribed
 * faithfully. This is deliberately SEPARATE from the video-testimonial
 * system (src/lib/video-testimonials.ts), which is video-only and forbids
 * written testimonials — text reviews live here instead.
 *
 * RULES (do not break these):
 *  - Keyed by doctor slug (see src/lib/doctors.ts).
 *  - Patient text only — never the owner/clinic reply.
 *  - Transcribe faithfully; never invent or embellish.
 *  - `date` is the relative label shown by Google ("7 months ago").
 *  - No entry for a doctor → the section is hidden on that profile.
 * ===================================================================== */

export type DoctorReview = {
  /** Reviewer's display name, as shown on the review. */
  name: string;
  /** Star rating (1–5). Omit for feedback-card reviews with no rating —
   *  the card then renders without stars rather than inventing one. */
  rating?: number;
  /** Date label as shown on the review, e.g. "7 months ago" or
   *  "2 March 2026". Omit when the review carries no date. */
  date?: string;
  /** Full review text (patient portion only — no owner reply). Kept in the
   *  patient's original language; never translated or paraphrased. */
  text: string;
};

export const DOCTOR_TEXT_REVIEWS: Record<string, DoctorReview[]> = {
  "priyanka-sinha": [
    {
      name: "Samira Shaikh",
      rating: 5,
      date: "7 months ago",
      text:
        "My journey at Bavishi Fertility Institute has been truly life-changing, and I cannot express enough gratitude for the exceptional care I received from Dr. Priyanka Sinha. She is one of the most caring, humble, and patient-focused doctors I have ever met. She explains everything with such clarity and kindness that even the simplest or silliest question is answered with full respect and patience. Her motivation, positivity, and reassuring nature gave me the strength to continue this journey and trust the process wholeheartedly.\n\nWhat makes Dr. Priyanka Sinha truly exceptional is her dedication to understanding and respecting patient preferences without any judgement. From my very first visit in June, I told her I was not comfortable with any male nurse or male technician being present during my procedures. Not only did she respect that immediately, but she maintained that commitment for months—through two IUIs and my entire IVF cycle.",
    },
    {
      name: "Shraddha Raghani",
      rating: 5,
      date: "a year ago",
      text:
        "We are very thankful to Bavishi Fertility Institute and especially Dr. Priyanka Sinha who has been the torch bearer through my entire journey. Dr. Priyanka is very calm and composed doctor and very humble to respond to all my silly queries and my hyper anxiety as well. She reinstated hopes and positivity within me. I believe she is the best IVF doctor to be approached. Thank you very much. Dr. Himanshu is truly a proficient and trust worthy doctor. To all ladies out there, should approach Dr. Priyanka before giving up",
    },
    {
      name: "Namrata Thanekar",
      rating: 5,
      date: "a year ago",
      text:
        "We are incredibly grateful to have found Dr. Priyanka Sinha for our IUI journey. She is truly a happy and positive person, creating an environment filled with hope and reassurance. Despite her busy schedule, she makes us feel like we are her only patients, always answering our queries with patience and kindness—never once getting irritated, no matter how small or silly the question. She deeply understands our emotions and treats us like family, providing constant support and prompt responses to messages and calls. We feel so lucky to have her by our side and highly recommend her to anyone looking for a compassionate and dedicated doctor! We would like to extend our thanks to entire staff who are very helpful and Dr Suman and Dr Nilesh for their support.",
    },
    {
      name: "Kavita Singh",
      rating: 5,
      date: "a year ago",
      text:
        "I would like to thank the entire team of Bavishi clinic especially Dr. Himanshu for their kind support and empathetic service provided in our journey.\n\nMy heartfelt gratitude to Dr. Priyanka Sinha who has been more positive than I have ever been and was confident since the start that I will get positive results right away since day 1.\n\nShe has made my journey comfortable in the most ways she could and has always been there to attend to my queries without any delay even at odd hours. Her unwavering commitment, positive attitude and experience in dealing with cases differently has given me the happiness of motherhood.\n\nBefore starting our treatment at Bavishi, we have been to other reputed hospitals as well to receive treatment, however it all seemed to be like a monotonous and money making business lacking empathy towards their patients.",
    },
    {
      name: "Anurag Shirodkar",
      rating: 5,
      date: "a year ago",
      text:
        "We want to thank Bavishi fertility to help us achieve a long awaited wish to be parents. We were connected with Dr Priyanka Sinha through one of our Gynaecologist Doctor from Borivali. Dr Priyanka understood our situation and helped us in the journey to achieve pregnancy. With her caring and positive attitude she made us feel confident about achieving pregnancy. Also would like to thank Dr. Himanshu Bavishi & his entire Team for their supportive efforts & caring approach. Hoping for the best to get the further delivery process to be smoothly.\n\nThanks & Regards,\nAarvi & Anurag",
    },
  ],

  // Bavishi Fertility Institute — Nikol, Ahmedabad. Handwritten patient
  // feedback cards (no star rating, so `rating` is omitted). Gujarati reviews
  // are kept in the patient's original language, never translated. Internal
  // patient IDs on the cards are intentionally NOT displayed.
  "jaydeep-patel": [
    {
      name: "Pratika Chetan Suthar",
      text:
        "Very good experience at Bavishi, Nikol. All staff members are very co-operative. And all detailed explanation given by Dr. Jaydeep regarding ultra-sound and every questions. Bavishi team fulfilled our dreams with their great works and always encourage us.\n\nThank you, team.",
    },
    {
      name: "Aakruti Hemang Mistry",
      date: "2 March 2026",
      text:
        "First of all I would like to thanks Bavishi Fertility Institute (BFI) & entire staff members (including doctors & nurse), on today under sonography review I had heard the sound of heartbeat of baby. Due to good effort by Dr. Jaydeep sir & staff of Nikol BFI.\n\nIn addition of that there are lots of ups & downs happen during 12 yrs of marriage journey life and now the dream seems to true.\n\nBy, Aakruti Hemang Mistry",
    },
    {
      name: "Hinaben Nikul Panchal",
      text:
        "Hare Krishna\n\nI Hina Nikul Panchal wants to thank whole staff of Bavishi Fertility Center Nikol Branch. Specially thanks to Dr. Mr. Jaydeep Patel for good consult.\n\nWe had started our journey here in December 2025, and today in a day of February I got the chance to be blessed with my little miracle's heartbeat. I am so blessed with god and the whole supportive staff and their worship.\n\nIt is very remarkable experience with the whole staff of Bavishi and Dr. Mr. Jaydeep Patel. They all are available at any time u needed. As a time like on even midnight Dr. is available to consult on any kind of situation.\n\nWe have great experience with Bavishi.\n\nThank you. :)",
    },
    {
      name: "Vinalben Jigarkumar Patel",
      date: "23 March 2026",
      text:
        "હું હૃદયપૂર્વક સમગ્ર ફેસિલિટી ટીમ નો આભાર માનું છું, જેમણે મને સતત પાંચ નિષ્ફળતા પછી ગર્ભધારણ કરવામાં મદદ કરી. આ સફર શારિરીક તથા માનસિક રીતે ઘણું પડકારજનક હતી. પરંતુ, Specially જયદીપ સર ના સતત માર્ગદર્શન, Positive Thoughts થી મને હિંમત મળી. તથા નિખિલ ના સંપૂર્ણ સ્ટાફ, Personally દરેક વ્યક્તિ એ મને ક્યારેય એકલતા અનુભવવા નથી દીધી.\n\nજ્યારે અમે હિંમત હારી ગયા હતા, જયદીપ સર નો અતુલ વિશ્વાસ કે તમને બાળક મળશે જ, તેમની વાત ને માની ને અમે જે પ્રયાસ કર્યો આજે તારીખ: 23/03/2026 Monday ના રોજ અમે અમારા બાળક ના Heartbeat સાંભળ્યા. અમારી ખુશી નો ખરેખર પાર ના રહ્યો કારણકે અમે એક નહીં પરંતુ બે બાળક ની Heartbeat સાંભળવાનો મોકો મળ્યો.\n\nફરી આભાર આ પ્રથમ મારા લાડુ (કાન્હાજી) નો, આભાર માનીશ. મન્દી બેન, હિમાંશુ સર અને Specially જયદીપ સર .. Thank you. તમે માત્ર નિષ્ણાત ડોક્ટર નહીં - પણ સાચા અર્થમાં, ચમત્કાર સર્જનાર છો. Thank you so much.\n\nJigar Patel\nVinal Patel\nA & B patel 🙂",
    },
    {
      name: "Shilpa Dipak Patel",
      date: "20 June 2026",
      text:
        "અમે આજે બાવિશી ફર્ટીલીટી માં સારવાર માટે આવ્યા અને અહીંયા દવા કરાવતા અમને હોસ્પિટલ તરફ થી સારો એવો પ્રોત્સાહ મળ્યો છે.\n\nશ્રી ડૉ. જયદીપ પટેલ અને બાવિશી ફર્ટીલીટી ની પુરી ટીમ ના માર્ગદર્શન હેઠળ અમને સારી અને વિશ્વાસ ભરોસા પાત્ર ટ્રીટમેન્ટ મળી છે. સ્ટાફનો ખુબખુબ આભાર માનીએ છીએ.\n\nઅમે મહિના ઓગસ્ટ - ૨૦૨૫ ના રોજ થી સારવાર ચાલુ કરી હતી અને ત્યાર થી અમને યોગ્ય સારવાર આપવામાં આવી છે.\n\nઆજ રોજ ૨૦/૦૬/૨૦૨૬ ના રોજ અમને સોનોગ્રાફી માટે આવ્યા હતા. સોનોગ્રાફી કરતા અમને બાળક ના હૃદય ના ધબકાર સંભળ્યા અને અમે બન્ને ખુશી થયા અને આ હોસ્પિટલ દ્વારા જે પણ સારવાર મળી છે તેનો અમે ખુબખુબ આભાર માનીએ છીએ.\n\nD. N. Patel\nS. D. Patel",
    },
  ],

  // Bavishi Fertility Institute — Ghatkopar, Mumbai. Handwritten patient
  // thank-you notes (no star rating). Transcribed as written; internal
  // patient IDs (MCP23-15, MV23-20, etc.) are intentionally NOT displayed.
  "nilesh-jain": [
    {
      name: "Vigneshwari & Ravi C",
      date: "5 April 2025",
      text:
        "Dear Doctor,\n\nWe are greatful that we have girl baby and was possible with Bavishi Team, Dr. Swathi, & Dr. Nilesh.\n\nThank you so much for all the support!\n\nRavi C",
    },
    {
      name: "Sujata Sachin Valunje",
      date: "20 January 2024",
      text:
        "Dear Bavishi Fertility Inst.\n\nIt was a very excellent experience with you for our successful IVF Journey. Special Thanks to Dr. Nilesh Jain & swati Maam they are wonderful people. Team who are working at reception as well as all sisters are very helpful.\n\nI am really thankful to all team members from ghatkopar location, who help us to continue successful IVF Journey.\n\nLast but not least very very special thanks to Bavishi sir, who always have positive approach which helps to make this journey successful\n\nThank you so much Bavishi Team\n\nRegards,\nSujata Sachin Valunje",
    },
    {
      name: "Sadhavi Bhushan Patade",
      text:
        "It is really amazing and thrilling journey towards motherhood. every day brings new day and experience for mother. We heartly thank to Dr. Bavishi and his entire team, for enlightened lamp of joy, happiness and parenthood in our life.\n\nFrom :- Salvi Patade",
    },
    {
      name: "Sudhakar & Ramadevi Komati",
      date: "14 August 2024",
      text:
        "For the past 14 years, we've dreamt of having a child. Thankfully, thanks to the incredible team of Bavishi Fertility Institute, especially Dr. Nilesh, that dream became reality on the very first attempt! Dr. Nilesh instilled such confidence in us, simply saying to \"trust us and you will see the result,\" we did just that, and now we're holding our beautiful baby boy in our arms.\n\nDr. Nilesh's expertise and reassurance throughout the process were invaluable. We are incredibly grateful for his care, which helped us achieve our dream of parenthood. We wouldn't hesitate to recommend Dr. Nilesh to anyone facing similar challenges. His expertise and compassionate approach made a world of difference for us.\n\nSudhakar / Komati",
    },
  ],

  // Bavishi Fertility Institute — Vadodara (Baroda). Handwritten patient
  // thank-you notes (no star rating). Gujarati reviews kept in the patient's
  // original language. Internal patient IDs not displayed.
  "mita-shah": [
    {
      name: "Shirin & Aniket Palkar",
      date: "8 January 2022",
      text:
        "To the entire Bavishi Family & Team, 'Thank You' is a very small word for the huge amount of happiness you have given to us. Our experience at Bavishi Clinic, Baroda has been phenomenal. We started this journey few months back without any knowledge and with general apprehensions that come with IVF treatment. However I am very glad to share that we were thoroughly guided by Dr. Mita and Team throughout the entire process. Finally by the grace of God & untiring efforts by Dr. Bavishi and team, we are expecting our bundle of joy this June 2022. This has been a life changing decision for us and would highly recommend 'Bavishi Fertility Institute' to other couples. Once again we would like to take this opportunity to convey our heartiest 'THANK YOU'.\n\nShirin & Aniket Palkar",
    },
    {
      name: "Aastha Kuntal Shukla",
      date: "13 March 2023",
      text:
        "IVF ની ટ્રીટમેન્ટ ખૂબ સરળતાથી અને સંપૂર્ણ માર્ગદર્શન સાથે સફળતાપૂર્વક પોઝિટિવ પ્રેગ્નેન્સી સાથે થઈ. ડૉ. હિમાંશુ સર અને ટીમ મિતા શાહ તથા સમગ્ર નર્સ ના સંજોગપૂર્વક સાથ થકી સફળતા મળી જે માટે અમે ખૂબ આભારી છીએ. છેલ્લા 7 વર્ષના પ્રયત્નોને અંતે બાવિશી સાહેબના માર્ગદર્શન હેઠળ પ્રથમ પ્રયત્ને IVF માં સફળતા મળી જેનો અમને ખૂબ આનંદ છે. હોસ્પિટલના સ્ટાફ દ્વારા સચોટ ફોલોઅપ અને સહકાર ખૂબ સારો મળ્યો. બાવિશી ફર્ટિલીટી ઇન્સ્ટિટ્યુટ ના દરેક સભ્યનો ખૂબ ખૂબ આભાર.",
    },
    {
      name: "Dr. Khushbu & Dr. Kuldeepsinh Chavda",
      date: "17 June 2026",
      text:
        "Excellent experience. We had been struggling with infertility for a long time & were feeling very stressed. The doctor Mita Madam explained every step of the IVF Procedure clearly & answered all our questions Patiently. The entire staff was Caring, Supportive & Professional throughout the treatment. The procedure was smooth & we always felt comfortable & well informed. We are very grateful for the doctor expertise & Compassionate approach. I highly recommend this clinic to anyone seeking Fertility treatment. Thank you Specially Dr. Mita Madam & all staff.",
    },
    {
      name: "Amita Keyur Patel",
      date: "19 November 2022",
      text:
        "We are very glad that after a long period under the treatment Dr. Himanshu Bavishi, Dr. Mita & Dr. Falguni, i got conceive. I can appreciate the quality of service by the Bavishi Fertility institute. Quite impressed with the hygienic environment and friendly nature of all staff members.\n\nAmita J",
    },
    {
      name: "Vinaben Shailesh Baraiya",
      date: "25 April 2023",
      text:
        "સપ્રેમ નમસ્કાર, હું વિના શૈલેષ બારૈયા. અમને અમારા જીવનની અનમોલ સુખની ક્ષણો ભેટ તરીકે આપી જવા બદલ ખૂબ ખૂબ આભાર. બાવિશી પરીવારના અમે આજીવન ઋણી છીએ. છેલ્લા 4 વર્ષ અને સંતાન પ્રાપ્તિની ઝંખના સાથે ઘણી બધી હોસ્પિટલોના આંટાફેરા કર્યા પરંતુ સફળતા તો શૂન્ય હતી અને જીવનના દ્વારે આવ્યા અને અમારા જીવનમાં ખુશીઓ છવાઈ ગઈ. અમે તમારી લાગણી વ્યક્ત કરવા પૂરા શબ્દો નથી, પણ ખૂબ ખૂબ છીએ. આભાર બાવિશી પરીવાર તથા વડદરા સેન્ટરના તમામ સ્ટાફ ગણ, પૂજ્ય મિના, તેમજ શ્યામના લાગણીશીલ વર્તનને મિશ્રતની નીચે ખૂબ ખૂબ આભાર આપે છે. અને સવિશેષ આભાર હિમાંશુ સાહેબના આપે સાથે કે જેથી માનવ સુખની આશાએ કાર્ય સફળ થયું છે.\n\nઆપના આભાર, વિનાય V.S. બારૈયા",
    },
  ],

  // Bavishi Fertility Institute — Mumbai. Handwritten patient thank-you notes
  // (no star rating). Words kept as written; the first note was in block
  // capitals and is shown in sentence case for readability. Internal patient
  // IDs not displayed.
  "suman-singh": [
    {
      name: "Sanket Phadange & Family",
      date: "16 November 2026",
      text:
        "We thank Dr. Suman Singh for always being there and guiding us through this journey.\n\nThe staff is very caring and courteous.\n\nThe clinic set up is professional designed with customer centricity.\n\nWe wish Bavishi team good luck! And carry on with their services.\n\nWe wish them success in their future endeavours...\n\nThank you...\n\nRegards, Sanket Phadange & Family...",
    },
    {
      name: "Neeta Dhongade",
      date: "11 April 2024",
      text:
        "We would like to thanks Dr. Suman Singh and the entire team of Bavishi Clinik to fulfil our dream come true to becoming Parents on the First attempt after 5 years of married life.\n\nWe are very grateful to Bavishi clinik.\n\nIt is best IVF clinik in my life.\n\nDr. Suman Singh and all staffs are very kind and gives special attention to their petient.\n\nAll Dr. and staffs are experts in their field and they gives 100% efforts in their work only we have to put Trust on them & result is positive.\n\nWe definetly recommend Bavishi clinik to all Those who wants to become Parents.\n\n\"Yes! Dreams Become True, with the help of BAVISHI\"",
    },
  ],
  // Bavishi Fertility Institute (with Spandan Hospital) — Bhuj/Kutch.
  // Handwritten patient thank-you notes (no star rating). Gujarati and Hindi
  // reviews kept in the patient's original language, never translated.
  "surbhi-vegad": [
    {
      name: "તાજિયા પરિવાર",
      text:
        "નમસ્કાર, અમે બાળક માટે પ્લાનિંગ કરતી વખતે બાવીશી ફર્ટિલિટી ઈન્સ્ટિટ્યુટ તેમજ સ્પંદન હોસ્પિટલમાં એક આશા સાથે આવ્યા હતા. આજે તા. 15/5/26 ના અમારી આ આશા એક પરી-કુમારી ઢીંગલીના રૂપમાં પરિપૂર્ણ થયેલી છે. અહીંના બંને સ્ટાફ મિત્રો, નર્સ, ચોથા વર્ગના કર્મચારીઓથી માંડી મેનેજમેન્ટના વ્યક્તિઓ સુધી અને કન્સલ્ટન્ટ સ્ટાફથી માંડી મંથાયેલા ડોક્ટર્સ સુધીનું વર્તન તેમજ તેમની ફેસિલિટી અને સેવા પૂરી પાડવા સુધીની દરેક પ્રકારની મદદ અને જવાબદારી ખૂબ જ સુંદર અને નિભાવેલ છે. અમને બાવીશી ફર્ટિલિટી અને સ્પંદન હોસ્પિટલના સ્ટાફ માટે ખૂબ જ લાગણી અને માન છે. અમે દરેક નિઃસંતાન દંપતિને બાવીશી ફર્ટિલિટી અને આ બંને સંસ્થાઓનો સંપર્ક કરવા અનુરોધ કરીએ છીએ. તમારી માતૃત્વની સફર દરમિયાન એક વખત પણ આ સંસ્થાની મુલાકાત લો. અહીના ડોક્ટર્સના સાથ, સુરભિ મેમ તેમજ બંને ટીમના સમગ્ર મેમ્બર્સને મળી દરેક દંપતિ પોતાના જીવનમાં બાળક રૂપી ફૂલ ખીલવી શકે છે. આ બંને સંસ્થાઓના તમામ સ્ટાફ અને પરિવાર તેમજ અમારા દંપતિ વતીથી અમે ખૂબ જ દિલથી આભાર માનીએ છીએ.\n\nHeartly Thank you So much.\nતાજિયા પરિવાર",
    },
    {
      name: "A grateful patient family",
      text:
        "મારા જીવનની પ્રત્યેક અને દરેક ક્ષણના વિચાર તેમજ મારું જીવન નિરાશાથી ભરેલું હતું. દરરોજ ઉઠેલી સવારના વિચારોમાં અંધકાર છવાયેલો હતો. અત્યંત પ્રયત્નો બાદ પણ આશાનું એક કિરણ દેખાતું ન હતું, ક્ષણે ક્ષણે હદ આશા રચી અંધકારથી અંધકાર લાગતો હતો.\n\nત્યારબાદ અમારા આ નિરાશામય જીવનમાં એક આશાનું કિરણ ઉગ્યું, તેમજ અમારી મુલાકાત બાવીશી તેમજ સ્પંદન હોસ્પિટલ સાથે થઈ, જેમાં પહેલી મુલાકાત માં જ સુર્ભિમેમ તેમજ સ્ટાફના વર્તન તેમજ તેમના સંપર્કમાં આવતા જ અમારો અડધો નિરાશા દૂર થઈ ગઈ હતી. અમારા નિરાશામય વિચારોની દુનિયામાં ફરી એક આશા રૂપી સુંદર સ્વપ્ન ખીલી ઉઠ્યું.\n\nનવા અમારા આ સુંદર સ્વપ્નને સાકાર કરવા માટે ભગવાન જેટલો જ વિશ્વાસ અમે કર્યો હતો એ બાવીશી હોસ્પિટલ, સ્પંદન હોસ્પિટલ તેમજ તેની Miracle Team પર કર્યો.\n\nઅને અમારો આ વિશ્વાસ જીવનમાં જ અમારા સ્વપ્નને સાકાર બનાવવા આટલી એ અથાણ મહેનત કરી.\n\nજેના પરિણામ રૂપે અમારું દુનિયાનું સૌથી સુંદર સ્વપ્ન આજે સાકાર બન્યું. જેના માટે સુરભિમેમ, દિમાંશુસર તેમજ \"Whole team of BAVISHI\" ઇન્સ્ટિટ્યુટના અમે હૃદયથી આભાર વ્યક્ત કરીએ છીએ.\n\n\"Thank you So much all for Come true our best, buetiful and Wonder ful Dream.\"",
    },
    {
      name: "Isha, Sneh & Prabhat Ranjan",
      text:
        "प्रिय डॉ. सुरभि वेगड़ जी,\n\nदिल की गहराइयों से आपका धन्यवाद कहना भी हमारे भावों को पूरी तरह व्यक्त नहीं कर सकता। इन 9 महीनों की अनमोल यात्रा में आपने जिस तरह से हमारा हाथ थाम रखा, वह हमारे लिए किसी आशीर्वाद से कम नहीं है। आपने केवल एक डॉक्टर की भूमिका नहीं निभाई, बल्कि हर पल एक मार्गदर्शक, एक सहारा और अपनों जैसा स्नेह दिया। आपकी मुस्कान, आपका धैर्य और आपकी कोमल देखभाल ने इस पूरे सफर को इतना खूबसूरत और यादगार बना दिया।\n\nमाँ बनने और माता-पिता बनने की इस सबसे खास अहसास को आपने जितना सहज और सुरक्षित बनाया, उसके हम हमेशा आपके आभारी रहेंगे। आपने हमारे जीवन के सबसे अनमोल पल को अपनी मेहनत से और समर्पण से और भी खास बना दिया।\n\nआप हमारे लिए हमेशा सिर्फ एक डॉक्टर नहीं बल्कि एक प्रेरणा और स्नेह की मिसाल रहेंगी। आशा करता हूँ कि ईश्वर आपको और सफल, और यश प्रदान करें।\n\nदिल से बहुत बहुत धन्यवाद।\n\nसप्रेम,\nइशा, स्नेह एवं प्रभात रंजन",
    },
    {
      name: "અંજનાબેન યોગેશ ભગત",
      text:
        "ગામ:- દુર્ગાપુર, તા. માંડવી-કચ્છ\n\nગર્ભધારણ થી લઈને પ્રસૂતિ સમય સુધી ની સફર દરમિયાન બાવીશી ના સ્ટાફ થી લઈ ડોક્ટર ની સેવા ખૂબ જ સુંદર રહી.\n\nઅનેક ઘરો માં ખુશીઓની કિરણ ફેલાવે છે બાવીશી.\n\nસુરભિ બેન નો સાથ સહકાર અમને ક્યારેય ભુલાશે નહિ.\n\nઘણી નિરાશાઓ વચ્ચે આશા જગાવે છે બાવીશી,\nદરેક મુશ્કેલીનું હલ બતાવે છે બાવીશી,\nઅંધકારમાં પણ પ્રકાશ પાથરે છે બાવીશી,\nનવા કુમળા ફૂલ ને પંપાળે છે બાવીશી,\nસુરભિબેન જેવા ડોક્ટર થઈ ખ્યાતિ પામે છે બાવીશી,\n\nઆભાર",
    },
  ],
};

/** Real written reviews for a doctor profile. Empty → hide the section. */
export function reviewsForDoctor(doctorSlug: string, max = 20): DoctorReview[] {
  return (DOCTOR_TEXT_REVIEWS[doctorSlug] ?? []).slice(0, max);
}
