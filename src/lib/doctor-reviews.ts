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
      name: "Vidhi & Vikram Main",
      date: "20 January 2024",
      text:
        "Thank you Bavishi Team & Dr. Nilesh Jain for making our dream reality.\n\nSpecial thanks to Dr. Nilesh Jain for his excellent support & guidance.\n\nWe are looking forward to start our exciting journey of parenthood.\n\nLots of love to Bavishi Team\n\nFrom,\nVidhi & Vikram",
    },
    {
      name: "Madhuri & Dinesh Chawla",
      date: "4 March 2024",
      text:
        "आदरणीय,\n\nडॉ. साहब आपका बहुत-बहुत आभार। मेरे घर में किलकारी देकर आपने मेरे को नई जिंदगी दी। मैंने आपके हॉस्पिटल के कर्मचारी से लेकर आप तक जो अनुशासन है वो देखा है, तारीफ लायक है। आपके हॉस्पिटल कि टेक्नोलॉजी दिनोंदिन फले-फूले यही हमारी कामना है।\n\nThank you, धन्यवाद,\nMadhuri Chawla\nDinesh Chawla",
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

  // Bavishi Fertility Institute / Ansh Hospital — Surat. First two entries are
  // handwritten patient thank-you letters that explicitly name Dr. Deep (a
  // third letter from the same batch, addressed to "Dr. Sejal", does not name
  // him and is intentionally excluded) — best-effort transcription of cursive
  // Gujarati handwriting, please verify against the original scans before
  // treating as final; no star rating since these aren't Google reviews. The
  // rest are a curated selection of real Google reviews for Dr. Deep Gajiwala
  // (many more exist on his Google profile; these were picked for variety
  // across language, date and story). `date` is the label exactly as shown
  // by Google.
  "deep-gajiwala": [
    {
      name: "Vaishaben Ayagjkumar Patel",
      text:
        "હું વર્ષો પહેલ, મારે રહેવાનું નવસારી. મારા મેરેજના પાંચ વર્ષ થયા છે. મેં વળી હોસ્પિટલમાં ટ્રીટમેન્ટ લીધી પણ બધી જગ્યાએથી નિષ્ફળતા જ મળી. પછી અમે અહીં સુરત બાવીશી હોસ્પિટલના સંપર્કમાં આવ્યા. અહીં હોસ્પિટલની પુરી સ્ટાફ, ડૉ. દીપ સર, ડૉ. દિશા મેડમ બધાનો સ્વભાવ ખૂબ જ સારો હતો. પછી ધીમે ધીમે મારી ટ્રીટમેન્ટ ચાલુ થઈ હતી. પહેલી વાર મારુ IVF થયું, પણ તેમાં નિષ્ફળતા મળી. હું ખૂબ નિરાશ થઈ ગઈ હતી. પછી ડૉ. દીપ સરે અમને હિસ્ટ્રોસ્કોપી વિશે જણાવ્યું, અને પછી અમે હિસ્ટ્રોસ્કોપી કરાવ્યું અને પછી બીજી વાર મારુ IVF ટ્રીટમેન્ટ ચાલુ થયું. 10/07/2025 મારું IVF થયું અને 22/07/2025 મારી રિપોર્ટ આવવાનો હતો. હું ખૂબ ટેન્શનમાં હતી કે રિપોર્ટમાં શું આવશે, પછી સાંજે 6 વાગ્યે ડૉ. દિશા મેડમનો ફોન આવ્યો અને તેમને જણાવ્યું કે રિપોર્ટ પોઝિટિવ છે. હું એવું સાંભળીને ખૂબ જ ખુશ થઈ ગઈ. પછી અમને 11/08/2025 ના દિવસે સોનોગ્રાફી માટે બોલાવ્યા. પછી મારી સોનોગ્રાફી થઈ અને પહેલી વાર મારા બાળકના ધબકારા સંભળાવ્યા અને એ સાંભળીને મારી ખુશીનો પાર ના રહ્યો.\n\nમાટે, હું અને મારા પતિ અને મારો આખો પરિવાર બાવીશી હોસ્પિટલને અત્યંત લાગણીપૂર્વક આભાર માનીએ છીએ.\n\nThank you very much.",
    },
    {
      name: "Kanchan Dhanraj Patel",
      date: "29 January 2026",
      text:
        "હું કંચન ધનરાજભાઈ પટેલ. અમારા લગ્નને 5 વર્ષ પુર્ણ થયા હતા અને પછી પણ સંતાન ન હતું. ઘણા ડોક્ટરો બદલ્યા, એક ડોક્ટરે મેડિકલી પ્રેગનેન્સ ન રહી. પછી મને બાવીશી હોસ્પિટલ નું સજેશન આપ્યું. પછી અમે બાવીશી હોસ્પિટલ નું ઉપયોગ કરી ટ્રીટમેન્ટ ચાલુ કરી, ચાલુ કરવાની સાથે 2 મહિનામાં પ્રેગનેંટ છું.\n\nડૉ. દિપ ગજીવાલા સાહેબ શ્રી નું ખૂબ ખૂબ અભિનંદન અને બધા સ્ટાફમેમ્બરનો પણ અભિનંદન. ખૂબ સરસ હોસ્પિટલ અને નર્સિંગ સ્ટાફ, બધાનો ખૂબ વખાણ છે.\n\nબધા નો ખૂબ ખૂબ ધન્યવાદ અને આભાર.",
    },
    {
      name: "Kajal Savaliya",
      rating: 5,
      date: "3 months ago",
      text:
        "I had really good experince with Bavishi fertility institute staff was really polite and good I had sucess with my first cycle here\nThank you so much Bavishi staff and Dr Deep Gajiwala for making my dream come true.",
    },
    {
      name: "Harshil Naik",
      rating: 5,
      date: "8 months ago",
      text:
        "We started our treatment here by reference and no doubt the best decision we've ever made. The experience is great, the service is superb and I must say the way everyone taking from Doctor to staff is very polite, positive and welcoming. Everything is explained in detail and Dr. Deep sir and Assistant doctors answers all the queries that we had.\n\nThank You very much for all you do.",
    },
    {
      name: "Hiral Patel",
      rating: 5,
      date: "Edited 9 months ago",
      text:
        "We are beyond grateful to Dr. Deep Gajiwala and his entire team at Bavishi fertility Surat for making our dream of becoming parents come true. After going through the IVF journey, we are now blessed with a twins, a boy and a girl, and words cannot express the joy we feel.\n\nDr. Deep Gajiwala's expertise, guidance, and compassionate approach gave us immense confidence throughout the treatment. He explained every step with clarity and always encouraged us with positivity. A very special thanks to Pratik sir, Dr.Disha mam and kalpanaben whose constant support, care, and patience made the process so much smoother for us. Their reassuring words and dedication kept us strong in difficult times.\n\nThe entire team worked with so much effort, professionalism, and kindness, and for that, we will always remain thankful. Today, as we hold our little ones in our arms, we know it wouldn't have been possible without them.\n\nFrom the bottom of our hearts, thank you Dr Deep Gajiwala, for helping us start this new chapter of our lives.",
    },
    {
      name: "Ketan Vadodariya",
      rating: 5,
      date: "a year ago",
      text:
        "This is the best IVF treatment institute in surat with highly professional and experienced doctor Deep Gajiwala.\n\nThe First day of visit, Dr Deep explain process well and clear many unusual doubts. He didn't hide anything about treatment and prepared us very well.\n\nDr Disha explain about cost of treatment and medicine and other stuff of the IVF. By the way she was very good in explanation. I remember one incident with Disha is, After conceive, we called her on midnight 3 am because of my wife was getting pain and she answered call on first try and explain us what to do with situation and she was very clam even when I called her midnight.\n\nOther staff of hospital was very helpful. Never given annoying answers.\n\nI would suggest this institute for the IVF treatment.\n\nMy wife convinced on first try of IVF.",
    },
    {
      name: "Kapana Mistry",
      rating: 5,
      date: "10 weeks ago",
      text:
        "We were treated at bavishi fertility institute after multiple failed treatments in the USA. Dr. Deep Gajiwala was a delight when it came to treatment options. We finally got the results the way we wanted. Dr. Deep Gajiwala is very knowledgeable and thorough. He takes time with his patients and answers every question you may have. Staff was very supportive and encouraging. Thank you bavishi fertility institute for helping us finally become parents. We had tried for a very long time and given up hope until bavishi hospital helped us succeed. Now we are parents to a baby boy!",
    },
    {
      name: "Piku Vasava",
      rating: 5,
      date: "14 weeks ago",
      text:
        "\"तीन IVF failures के बाद हम लगभग हार मान चुके थे। बहुत मुश्किल समय था।\nफिर हम बावीशी फर्टिलिटी इंस्टीट्यूट में डॉ. दीप गजीवाला से मिले। उन्होंने बहुत patience से हमारा case evaluate किया।\nइस बार treatment बिल्कुल बढिया तरीके से हुआ।\nऔर finally हमें success मिला।\nIVF में सही doctor और Hospital कितना important होता है यह हमें यहाँ आकर समझ आया।\"\n\n\"हमारी IVF ka Experience यहां बहुत अच्छा रहा है। हमने पहले दो बार IVF कराया था लेकिन दोनों बार fail हो गया।\nहर बार उम्मीद टूट जाती थी।\nफिर हमें किसी ने डॉ. दीप गजीवाला के बारे में बताया और हम बावीशी फर्टिलिटी इंस्टीट्यूट, सूरत आए।\nपहली consultation में ही doctor sir ने हमारी पूरी history ध्यान से सुनी। उन्होंने बहुत honestly बताया कि आगे कैसे proceed करना चाहिए।\nइस बार treatment के दौरान हमें बहुत confidence मिला।\nभगवान की कृपा से IVF successful हुआ।\nहम सच में दिल से thankful हैं।\"",
    },
    {
      name: "Khushi Patel",
      rating: 5,
      date: "14 weeks ago",
      text:
        "આજે હું મારી IVF ની સફર શેર કરવા માંગુ છું, જેથી જે કપલ્સ ડાળમાં ઝુંઝવામાં છે, તેમને યોગ્ય માર્ગદર્શન મળી શકે.\n\nઆ પહેલા અમે એક બીજા સેન્ટર પર IVF કરાવ્યું હતું. આખા સાયકલમાં માત્ર 1 જ એમ્બ્રિયો બન્યો હતો, અને દુર્ભાગ્યે તે પ્રથમ સફળ ન થયો. તે સમય અમારા માટે ખૂબ જ મુશ્કેલ હતો. અમને લાગતું હતું કે કદાચ અમારી પાસે ખૂબ ઓછા ચાન્સિસ છે.\n\nપછી અમને બાવીશી ફર્ટિલિટી ઇન્સ્ટિટ્યુટ, સુરત વિષે જાણ થઈ. અમે અહીં ડૉ દીપ ગજીવાલા અને ડૉ. દિશાબેન બાવીશી સર સાથે કન્સલ્ટ કરવા આવ્યા. પહેલી જ મુલાકાતમાં ડૉક્ટર સાહેબે અમારી સંપૂર્ણ હિસ્ટ્રી ધ્યાનથી સાંભળી અને જૂની રિપોર્ટ્સ પણ ઝીણવટપૂર્વક તપાસી. તેમણે સમજાવ્યું કે દરેક IVF સેન્ટરના લેબ ક્વોલિટી, પ્રોટોકોલ અને એમ્બ્રિયો કલ્ચર સિસ્ટમ અલગ હોય છે – અને એનો પરિણામ પર મોટો અસર પડે છે.\n\nઅમે અહીં ફરી IVF કરાવવાનો નિર્ણય લીધો. આ વખતે પ્રક્રિયા ખૂબ જ વ્યવસ્થિત અને પારદર્શક હતી. સૌથી મોટો આનંદ ત્યારે થયો જયારે આ સાયકલમાં 4 સારા એમ્બ્રિયો બન્યા. અમને વિશ્વાસ જ ન આવ્યો, કારણ કે પહેલા સેન્ટર માત્ર 1 જ બન્યો હતો.\n\nસૌથી ખુશીની વાત એ છે કે પહેલા ટ્રાયમાં જ રિઝલ્ટ પોઝિટિવ આવ્યો, અને અમારા પાસે હજુ પણ 2 એમ્બ્રિયો ફ્રીઝ કરીને સુરક્ષિત રાખેલા છે, જે ભવિષ્ય માટે આશા અને સુરક્ષા છે.\n\nહું દિલથી કહેવા માંગુ છું –\nIVF માં યોગ્ય સેન્ટર અને યોગ્ય ડૉક્ટર પસંદ કરવું ખૂબ જ મહત્વનું છે.\nમાત્ર સારવાર નહીં, પણ લેબની ગુણવત્તા, પારદર્શિતા અને ડૉક્ટરના અનુભવ પરિણામમાં મોટો ફરક પાડે છે.\n\nઆજે અમે ખૂબ ખુશ છીએ કે અમે યોગ્ય જગ્યાએ વિશ્વાસ મુક્યો.\nજો તમે IVF વિષે વિચારતા હો, તો ઉતાવળમાં નિર્ણય ના લેશો. યોગ્ય માહિતી મેળવો અને સાચું સેન્ટર પસંદ કરો…\nકારણ કે યોગ્ય પસંદગી તમારા જીવનમાં ખુશીઓ લઈ આવી શકે છે.\n\nડૉક્ટર સાહેબ અને તેમની ટીમનો દિલથી આભાર.",
    },
    {
      name: "Dhara Sarkheliy",
      rating: 5,
      date: "21 weeks ago",
      text:
        "We had a very good experience at Bavishi Hospital. Dr. Deep Sir was extremely kind, patient, and professional throughout the treatment. He explained everything clearly and made us feel comfortable and confident. The hospital staff was also very polite, supportive, and attentive. Overall, we are very satisfied with the care and highly recommend this hospital.",
    },
    {
      name: "Tanisha Tejani",
      rating: 5,
      date: "31 weeks ago",
      text:
        "We are extremely grateful to Ansh Hospital and especially Dr. Deep Gajiwala for such a beautiful and safe delivery experience. From the first consultation till the birth of our baby, the care, guidance, and positivity we received were exceptional. Dr. Deep Gajiwala's calm nature and expert treatment gave us immense confidence and peace of mind. Because of him and the supportive hospital staff, our baby was born healthy, and I was taken care of with so much love and attention. This journey will always remain special for us. Thank you for everything. We are blessed with a healthy baby girl and a very positive childbirth experience. Forever thankful to Dr. Deep Gajiwala and the entire team.",
    },
    {
      name: "H!tesh Shah",
      rating: 5,
      date: "32 weeks ago",
      text:
        "I had the privilege of being under the care of Dr. Deep Gajiwala, a truly exceptional physician in the department. What impressed me most was not only their deep expertise in treating my condition, but also their commitment to clear, empathetic communication. Dr. Deep patiently explained all the treatment options, answered every question I had, ensuring I felt fully informed and comfortable with the plan. Their professionalism and genuine concern for my well-being are commendable. Highly recommended.",
    },
    {
      name: "Laxmikant Sarkar",
      rating: 5,
      date: "13 May 2025",
      text:
        "Ansh hospital, Doctor Mr. Deep Gajiwala\nBahut achha doctor hai,, bahut acha se tritment karta hai, aacha se samjha ta hai,humlog pichle 11 month se is doctor se tritment kara raha tha, or mujhe bina koi tension ka bahut achha response mila hai or mera baby hua hai, or baby bahut achha hai, very very very thx Doctor Mr. Deep Gajiwala sir, hum log husband wife dono khush hai, is doctoro ka tritment se, bahut achha se sajest karta hai or fully responsibility k sat time mentent karta ake cheakup kar jata hai\n\nVery very thx Doctor",
    },
    {
      name: "Riya Patel",
      rating: 5,
      date: "16 Nov 2024",
      text:
        "We are glad to got tretment of this hospital bavishi fertility institute.\nAll staff members and doctors are very kind and humble in nature .\nSpecial thanks to dr.Deep sir & dr.Disha mem.\nOnce again thank you so much to evey bavishi members.",
    },
    {
      name: "Pandya Pritish",
      rating: 5,
      date: "Edited 2 months ago",
      text:
        "They say you can't see the GOD..may be they are right..but I can say for sure we've seen their shadow in Dr. Nita Gajiwala and Dr. Deep Gajiwala\nMy wife was pregnant with naturally conceived twins.\nBut she started leaking amniotic fluid from one sac @ 29 weeks.\nNita mam and Deep sir deployed their extensive experience to do everything possible.\nWe stayed at Ansh Hospital for 3 weeks and during this period, we felt we were in the safest places possible.\nTheir staff, including Sangeeta Ben, Triveni Ben and others took extreme care of my wife and both babies. Finally on 21st May, my wife delivered 2 boys, overall healthy, except a bit of low weight due to early delivery @ 31 weeks and 3 days.\nI don't know what would have happened to my wife and both my kids if Nita mam and her entire team wouldnt be there, supporting us at every moment of these crucial 3 weeks.\nToday, both boys are coming home, healthy and fine.\nThere are no words with which I can show my gratitude to Nita mam, Deep sir and the entire team of Ansh Hospital.",
    },
    {
      name: "Raj Nakrani",
      rating: 5,
      date: "7 months ago",
      text:
        "My experience with Dr. Deep Gajiwala Saheb at Bavishi/Ansh Hospital has been the most trusting and memorable experience of my life.\n\nBefore this, I had tried IVF 4–5 times from outside, but each time I got disappointed. I was very tired mentally more than physically and my hope was almost gone. Then I came to Dr. Deep Gajiwala Saheb. In the very first meeting, his calm nature, patience and clear explanation gave me a lot of confidence.\n\nDr. Saheb started my treatment in a very cooperative and positive manner. He explained every step calmly and never showed any hurry or negativity. With his experienced treatment and the cooperation of the entire team, I finally got success and got pregnant.\n\nMy delivery was done by Caesarean section at Ansh Hospital and the entire process was very smooth. From before to after the operation, Dr. Deep Saheb was constantly present, guided and took great care. Today, both I and my baby are completely healthy.\n\nDr. Deep Gajiwala is not only an excellent doctor, but also a very calm, cooperative and humane doctor who understands the feelings of the patient. For those who have seen many IVF failures, he is a true ray of hope.\n\nI sincerely thank Dr. Deep Gajiwala Sahib and his entire team and recommend him to all couples without hesitation.\n\n(Translated by Google)",
    },
    {
      name: "Alpesh Rathod",
      rating: 5,
      date: "a year ago",
      text:
        "Dr deep Gajjiwala sir nd dr neeta madem are exceptional Gynecologist whose expertise, compassion and dedication are truly commendable. During my wife consultation, Dr deep sir took the time to listen attentively to my wife concerns and explain my wife antenatal periods problem ,doubt and treatment options in a way that was easy to understand. Their depth of knowledge instilled confidence in me knowing that my wife was in capable hands. A big thanks to Dr deep sir nd Neeta madem ,their guidance and expertise i have experienced significant improvement in my wife health after cesarean operation and quality of life. All staff also very experienced nd humble. I am truly grateful for their outstanding care and would highly recommend Dr deep Gajiwala sir and Ansh hospital to anyone in need of a skilled and compassionate Gynaecologist.",
    },
    {
      name: "Sonu Parmar",
      rating: 5,
      date: "29 Jun 2024",
      text:
        "Dr deep sir ખુબ સારા છે. બાવીશી માં આવ્યા ને ઘણો સારો અનુભવ થયો છે, સ્ટાફ ના બધા બો સારા છે. ફસ્ટ ટાઈમ માં મને માતૃત્વ ધારણ કર્યુ છે અને બેબી ના હૃદય ના ધબકારા પણ આવી ગયા છે ને એ પણ ખુબ સારુ છે.",
    },
  ],

  // Bavishi Neo Fertility — Varanasi. WhatsApp thank-you message sent to the
  // doctor (no star rating, and the message carried no date). The sender's name
  // is not shown in the screenshot we were given, so this is published without
  // attribution rather than guessing one. The patient typed the doctor's name as
  // "prannika"; corrected to "Parnnika" so her own name is not misspelled on her
  // profile page. Every other word is exactly as sent.
  "parnnika-agarwal": [
    {
      name: "A patient of Dr. Parnnika Agarwal",
      text:
        "Hello Parnnika ma'am\n\nMy baby turned 8 months old Yesterday and i just wanted to thank you from bottom of my heart. It is such a beautiful blessing which has been possible because of your guidance, expertise and unwavering support. To us ,you are truely god sent. Your role in my parenthood will never be forgotten.\n\nThank you so very much ma'am.\n\nAnd may god bless your little one with best of everything in life. 😊😊🥰",
    },
  ],
};

/** Real written reviews for a doctor profile. Empty → hide the section. */
export function reviewsForDoctor(doctorSlug: string, max = 20): DoctorReview[] {
  return (DOCTOR_TEXT_REVIEWS[doctorSlug] ?? []).slice(0, max);
}
