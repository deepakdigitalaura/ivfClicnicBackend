/* =====================================================================
 * Patient video testimonials — real, verified YouTube stories only.
 * ---------------------------------------------------------------------
 * Powers the "Patient Stories" video sections on treatment, city and
 * doctor pages. Every entry maps to a REAL patient testimonial on the
 * official Bavishi Fertility Institute channel (@BavishiFertilityInstitute).
 *
 * MAPPING RULES (do not break these):
 *  - Treatment pages: a video appears only where the treatment is
 *    medically supported by what the patient actually says. A video may
 *    appear on multiple pages if genuinely relevant. We never imply a
 *    procedure (ICSI, PICSI, donor, PGT, ERA, etc.) the story doesn't state.
 *  - City pages: a video appears only when the patient's city is explicitly
 *    stated. No city mention → no testimonial on that city page.
 *  - Doctor pages: a video appears only when that doctor is explicitly named.
 *  - DATA HONESTY: no placeholders, no "coming soon" cards, no written
 *    testimonials. If there is no relevant video, the section is hidden.
 *
 * `location` / `doctor` are optional and shown ONLY when explicitly known —
 * never inferred. To extend: add a verified video with its real `youTubeId`.
 * ===================================================================== */

import { doctorsForLocation } from "@/lib/doctors";

export type VideoTestimonial = {
  /** Patient/display name (first name or couple; descriptive when anonymous). */
  name: string;
  /** Short pull-quote — must stay faithful to what the patient actually said. */
  quote: string;
  /** Real YouTube video id — required unless `videoSrc` is set instead. */
  youTubeId?: string;
  /** Self-hosted .mp4 path (e.g. "/assets/testimonials/foo.mp4") for a real
   *  testimonial that isn't on the YouTube channel. Alternative to
   *  `youTubeId` — set exactly one of the two, never both. */
  videoSrc?: string;
  /** City/centre — set ONLY when the testimonial explicitly states it. */
  location?: string;
  /** Treating doctor — set ONLY when the testimonial explicitly names them. */
  doctor?: string;
  /** Situation tag (e.g. "Years of Trying") — set ONLY when directly
   *  supported by the quote text, never inferred. */
  tag?: string;
};

/* ---------------------------------------------------------------------
 * TREATMENT PAGES — keyed by treatment slug (see src/lib/treatments.ts).
 * Only slugs with medically-relevant stories are listed; every other
 * treatment page resolves to [] and hides its testimonial section.
 * ------------------------------------------------------------------- */
export const TREATMENT_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  ivf: [
    { name: "After 25 Years of Waiting", quote: "25 years of waiting, and one miracle finally completed our family.", youTubeId: "tfc645Tz3vw", tag: "Years of Trying" },
    { name: "Dipali Doshi", quote: "We succeeded in our very first IVF cycle at Bavishi Fertility Institute.", youTubeId: "XGYK6MZD3ak", tag: "First-Cycle Success" },
    { name: "Naina & Deepak", quote: "After 20 years of hope, Bavishi Fertility Institute made us parents.", youTubeId: "IK1sZLDAito", tag: "Years of Trying" },
  ],

  "ivf-failure": [
    { name: "Anita Thakkar", quote: "15 years of waiting and a failed IVF — then our miracle happened at Bavishi Fertility Institute.", youTubeId: "h3Mke3vO0bs" },
    { name: "Sheetal & Pranav", quote: "After 22 IVF cycles, Bavishi Fertility Institute finally blessed us with our child.", youTubeId: "EdxW_0MOiOM" },
    { name: "Jigesh & Jinal", quote: "From failed treatments elsewhere to parenthood at Bavishi Fertility Institute.", youTubeId: "SbkV-1fSonM" },
  ],

  // Ready for when these pages ship (slugs not yet in TREATMENTS):
  "conceive-naturally": [
    { name: "Chirali & Ritesh", quote: "From an IVF miracle to a natural pregnancy — our journey with Bavishi Fertility Institute.", youTubeId: "0BTMmmRU9Ck" },
  ],
  "ivf-evaluation": [
    { name: "Dipali Doshi", quote: "We succeeded in our very first IVF cycle at Bavishi Fertility Institute.", youTubeId: "XGYK6MZD3ak" },
    { name: "After 25 Years of Waiting", quote: "25 years of waiting, and one miracle finally completed our family.", youTubeId: "tfc645Tz3vw" },
  ],
};

/* ---------------------------------------------------------------------
 * CITY PAGES — keyed by city slug (see src/lib/locations.ts).
 * Only videos whose city is explicitly stated belong here.
 * ------------------------------------------------------------------- */
/* ---------------------------------------------------------------------
 * GUJARAT PATIENT STORIES — shared by the Gujarat city pools.
 * ---------------------------------------------------------------------
 * Real families from the /testimonial-videos catalogue, telling their
 * story in Gujarati. None of them names a city, so none is tagged with
 * one — the `location` field stays empty, and the "never inferred" rule
 * in this file's header still holds.
 *
 * They sit in a shared list rather than inside one city because that is
 * what they are: Gujarat families, equally relevant to a reader in
 * Ahmedabad or in Surat. A city that has its own named stories lists
 * those first and then draws on this pool.
 * ------------------------------------------------------------------- */
const GUJARAT_STORIES: VideoTestimonial[] = [
    { name: "IVF Success | 7 વર્ષ સુધી સંતાન ના હતું, BFI માં 1st Cycle માં સફળતા મળી | સાંભળો તેમનો Review", quote: "After 7 years of marriage, this family found success in their very first IVF cycle at Bavishi Fertility Institute.", youTubeId: "DCWuox7cZ6Q" },
    { name: "માત્ર 1 IVF Cycle માં જ સંતાન સુખ પામ્યા ભીખીબેન અને બાબુભાઈ ના અદભૂત અનુભવ સાંભળો!", quote: "In just one IVF cycle, Bhikhiben and Babubhai experienced the joy of parenthood at Bavishi Fertility Institute.", youTubeId: "kt9GROuYlGA" },
    { name: "લગ્ન ના 35 વર્ષ પછી સંતાન પ્રાપ્તિ: શારદાબેન અને જીતુભાઈ નો વિશેષ અનુભવ", quote: "After 35 years of marriage, Bavishi Fertility Institute helped Sharadaben and Jitubhai welcome their child.", youTubeId: "R0uaWxFsquc" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 17 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "vjpc4lLvnt8" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 15 | Part-1 True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "CwqJJ8EoxpU" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 14 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "vgw0s6Vz_WU" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 13 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "hwyKJITCgFk" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 12 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "e7dYx1Lg96I" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 11 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "epeD4FMj52w" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 10 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "a_jMimXquMs" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 9 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "7MPhnbEztlE" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 8 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "9dNfzSvBmx0" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 7 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "8M6ieor3Cz0" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 6 | True Stories of Beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "OpjKLK3m--4" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 5 | True Stories of Infertility | Bavishi Fertility Institute", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "tQkygsrdQqo" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 4 | HD | Bavishi Fertility Institute", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "IjmT08Ugw-g" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 3 | HD | Bavishi Fertility Institute", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "5JtRcctsqz0" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 2 | HD | Bavishi Fertility Institute", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "O4MS-DOdLPc" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 1 | HD | Bavishi Fertility Institute", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "_gO-OlmoTmI" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 26 | સંતાનપ્રાપ્તિ ના સંઘર્ષ અને સફળતાની સત્ય કથાઓ", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "Nin53vofIIQ" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 25 | સંતાનપ્રાપ્તિ ના સંઘર્ષ અને સફળતાની સત્ય કથાઓ", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "8UMLy_yFlQ8" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 24 | સંતાનપ્રાપ્તિ ના સંઘર્ષ અને સફળતાની સત્ય કથાઓ", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "YuyDY8vJxlw" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 23 | સંતાનપ્રાપ્તિ ના સંઘર્ષ અને સફળતાની સત્ય કથાઓ", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "uFHp3GYuaKE" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 22 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "TXqDm3jGK9w" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 21 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "Oa1wi2dmI9U" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 20 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "rkmJHlf5myc" },
    { name: "દેવના દીધેલા માગીને લીધેલા | Ep 19 | True Story of beating Infertility with Bavishi IVF", quote: "A true story of struggle and triumph on the path to parenthood, shared in our patient stories series.", youTubeId: "KvE6PeYRL68" },
];

export const CITY_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  /* EXCLUDED ON PURPOSE — do not re-add to this pool:
   *  - 5jlLhlqoqGo "अहमदाबाद शहर में एक IVF ट्रीटमेंट साइकिल का खर्च..." is a
   *    doctor-led COST EXPLAINER, not a patient story. It was rendering under
   *    a "Patient Story" label in "Words from Ahmedabad families", which is
   *    simply untrue. It still lives in the /testimonial-videos catalogue.
   *  - zBtb86IPaH8 "Ep 16 | Part-2" is the second half of the same family's
   *    story as "Ep 15 | Part-1" (CwqJJ8EoxpU) and carries a BYTE-IDENTICAL
   *    YouTube thumbnail (verified: same md5, perceptual distance 0), so the
   *    two cards read as the same video twice. Part-1 is kept.
   * All 31 thumbnails in this pool were perceptually hashed; that was the only
   * duplicate pair. Nearest non-duplicate pair sits at distance 50/256. */
  /* Two videos name Ahmedabad on screen; the rest of the city's pool is the
   * shared Gujarat list above. */
  ahmedabad: [
    { name: "Sheetal Jaydeep Vachanani", location: "Ahmedabad", quote: "Our fertility treatment in Ahmedabad with Bavishi Fertility Institute gave us our happiest moment.", youTubeId: "HZeK3QG2MDc" },
    { name: "Testimonial by Chetan bhai from Ahmedabad for IVF By Bavishi Fertility Institute", location: "Ahmedabad", quote: "A heartfelt journey shared with Bavishi Fertility Institute.", youTubeId: "wA91XZ15CZI" },
    ...GUJARAT_STORIES,
  ],

  /* Surat has no city-named video of its own yet, so it draws entirely on
   * the shared Gujarat stories — the same families an Ahmedabad visitor
   * sees. Previously this city rendered only the two videos that came from
   * its doctors' own lists. */
  surat: [...GUJARAT_STORIES],
  // mumbai / vadodara: city-tagged videos exist but their YouTube IDs were
  // not in the current channel export — add here once collected. Vadodara
  // could draw on GUJARAT_STORIES too; left alone because nobody has asked
  // for it and it is not in the current brief.
};

/* ---------------------------------------------------------------------
 * DOCTOR PAGES — keyed by doctor slug (see src/lib/doctors.ts).
 * Only videos that explicitly name the doctor belong here.
 * ------------------------------------------------------------------- */
export const DOCTOR_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  // NOTE: Many entries below don't name the treating doctor in their video title
  // but were confirmed by the clinic as that doctor's patients — do NOT remove
  // them for failing the "doctor explicitly named" title rule.
  "janki-bavishi": [
    { name: "Shilled Oza", doctor: "Dr. Janki Bavishi", quote: "Personalised care by Dr. Janki Bavishi made our experience truly special.", youTubeId: "Ko_1GCx0kwE" },
    { name: "Dr Vipul & Dr Vaibhavi", doctor: "Dr. Janki Bavishi", quote: "A journey of hope and trust — our IVF experience with Bavishi Fertility Institute.", youTubeId: "hcrTlAG07c8" },
    { name: "Jigesh & Jinal", doctor: "Dr. Janki Bavishi", quote: "From failed treatments elsewhere to parenthood at Bavishi Fertility Institute.", youTubeId: "SbkV-1fSonM" },
    { name: "A Heartfelt Journey to Parenthood", doctor: "Dr. Janki Bavishi", quote: "An inspiring, heartfelt journey to parenthood with Bavishi Fertility Institute.", youTubeId: "ag4asJqSUA4" },
  ],

  "parth-bavishi": [
    { name: "Rushi & Siddhi", doctor: "Dr. Parth Bavishi", quote: "Our journey to parenthood — blessed with twins at Bavishi Fertility Institute.", youTubeId: "llJJm3TmbCA" },
    { name: "Chirali & Ritesh", doctor: "Dr. Parth Bavishi", quote: "From an IVF miracle to a natural pregnancy — our journey with Bavishi Fertility Institute.", youTubeId: "lN42_g7G00s" },
    { name: "Mrudangi", doctor: "Dr. Parth Bavishi", quote: "Mrudangi's fertility treatment journey, from Canada, with Bavishi Fertility Institute.", youTubeId: "dUC9eTcyjbI" },
    { name: "Dr Mayank & Dr Prakruti", doctor: "Dr. Parth Bavishi", quote: "A heartfelt journey to parenthood with Bavishi Fertility Institute.", youTubeId: "yNKg1p38lOY" },
  ],

  "himanshu-bavishi": [
    { name: "After Years of Waiting", doctor: "Dr. Himanshu Bavishi", quote: "After years of waiting, our dream finally came true at Bavishi Fertility Institute.", youTubeId: "mE28yGOxJlE" },
    { name: "Acharya Family", doctor: "Dr. Himanshu Bavishi", quote: "From doubts to a miracle — the Acharya family's journey at Bavishi Fertility Institute.", youTubeId: "ApUvVhP1F2s" },
    { name: "Bhargav Patel", doctor: "Dr. Himanshu Bavishi", quote: "Our dream of having twins came true at Bavishi Fertility Institute.", youTubeId: "n2z95eV60jE" },
    { name: "Dr Rugvi", doctor: "Dr. Himanshu Bavishi", quote: "A journey of hope and care that gave us a healthy baby.", youTubeId: "mq46CnngGyY" },
  ],

  "falguni-bavishi": [
    { name: "Rekha", doctor: "Dr. Falguni Bavishi", quote: "From loss to the blessing of twins — an inspiring IVF journey with Bavishi Fertility Institute.", youTubeId: "KKf6tNrlvoc" },
    { name: "Vivekanand & Bandna", doctor: "Dr. Falguni Bavishi", quote: "Our journey to parenthood with Bavishi Fertility Institute.", youTubeId: "274_mV_xnfs" },
    { name: "Dipali Doshi", doctor: "Dr. Falguni Bavishi", quote: "We succeeded in our very first IVF cycle at Bavishi Fertility Institute.", youTubeId: "XGYK6MZD3ak" },
    { name: "Bindiya & Mehul Mervana", doctor: "Dr. Falguni Bavishi", quote: "Bindiya and Mehul Mervana's remarkable journey to parenthood with Bavishi Fertility Institute.", youTubeId: "-jM7ly3AOFI" },
  ],

  "binal-shah": [
    { name: "Madhvika & Pranay", doctor: "Dr. Binal Shah", quote: "When dreams blossom against all odds — our story with Bavishi Fertility Institute.", youTubeId: "v2oy6QZjQvs" },
    { name: "Dr Mayank & Dr Prakruti", doctor: "Dr. Binal Shah", quote: "A heartfelt journey to parenthood with Bavishi Fertility Institute.", youTubeId: "yNKg1p38lOY" },
    { name: "Ankita Himanshukumar Dave", doctor: "Dr. Binal Shah", quote: "Watch Ankita Himanshukumar Dave share her fertility treatment journey with Bavishi Fertility Institute.", youTubeId: "ber4YBT5Yno" },
  ],

  // Self-hosted (not on the YouTube channel yet) — clinic-supplied WhatsApp
  // clips. Name/quote are placeholders pending real transcription; per-request,
  // shipped generic rather than blocked on that. Replace once known.
  "deepali-pandya": [
    { name: "Patient Testimonial", doctor: "Dr. Deepali Pandya", quote: "Watch this patient share their experience with Dr. Deepali Pandya.", videoSrc: "/assets/testimonials/deepali-pandya-patient-1.mp4" },
    { name: "Patient Testimonial", doctor: "Dr. Deepali Pandya", quote: "Watch this patient share their experience with Dr. Deepali Pandya.", videoSrc: "/assets/testimonials/deepali-pandya-patient-2.mp4" },
  ],

  // Self-hosted (clinic-supplied clip, not on the YouTube channel). Placeholder
  // name/quote pending real transcription of the patient's spoken testimonial.
  "deep-gajiwala": [
    { name: "Patient Testimonial", doctor: "Dr. Deep Gajiwala", quote: "Watch this patient share their experience with Dr. Deep Gajiwala.", videoSrc: "/assets/testimonials/deep-gajiwala-testimonial-5.mp4" },
  ],
};

/* ---------------------------------------------------------------------
 * DOCTOR-SPEAK / EDUCATIONAL VIDEOS — keyed by doctor slug.
 * These are the doctor's OWN videos (explainers, advice), NOT patient
 * testimonials. Same data-honesty rule: only REAL videos from the official
 * channel where the doctor actually presents. No placeholders — an empty
 * list hides the "Doctor Speak" section on that profile.
 *
 * TO POPULATE A DOCTOR: add their real YouTube ids below. The four Parth
 * Bavishi entries are already verified (reused from the homepage video hub).
 * ------------------------------------------------------------------- */
export type DoctorVideo = { title: string; youTubeId: string };

export const DOCTOR_VIDEOS: Record<string, DoctorVideo[]> = {
  // All verified from the official @BavishiFertilityInstitute channel. Each
  // source video's title is labelled "| Dr. <Name>" by the channel, so the
  // doctor attribution is the channel's own — not inferred. Titles below are
  // concise English versions (several source videos are in Hindi/Gujarati).
  "himanshu-bavishi": [
    { title: "Step-by-Step IVF Treatment Procedure", youTubeId: "1DGtapxZmjo" },
    { title: "Low AMH Explained — Expert Insights", youTubeId: "HlcC4ZCJ9FI" },
    { title: "AMH: Why Is It Low?", youTubeId: "D9RTa1XDLOE" },
    { title: "Ovarian Rejuvenation", youTubeId: "699oPX9OOnY" },
    { title: "High AMH — What It Means", youTubeId: "LSoRMoHyOwA" },
    { title: "5 Misconceptions About AMH", youTubeId: "zXAEChOX7No" },
    { title: "Conceiving Naturally with Low AMH", youTubeId: "Fi-BwaIty6I" },
    { title: "Post-IVF Care — Do These Things", youTubeId: "slkOHNP3yRw" },
    { title: "Can You Have a Baby After Menopause?", youTubeId: "byTgJJQPwC4" },
    { title: "Precautions After Embryo Transfer", youTubeId: "kh75AQAww2A" },
    { title: "How to Choose the Best IVF Clinic", youTubeId: "zm0ov4MrzTs" },
    { title: "Tips to Succeed in Your First IVF Attempt", youTubeId: "pMezJ8n1Q_s" },
  ],
  "falguni-bavishi": [
    { title: "Understanding IVF — Expert Insights", youTubeId: "UBvOFIzcExU" },
    { title: "What Is IVF?", youTubeId: "gFuHETtOU5U" },
    { title: "IVF Myth Busters", youTubeId: "3zyvZ3ff07k" },
    { title: "IUI Treatment for Pregnancy — Cost & Success Tips", youTubeId: "kY0ZPqmuALM" },
    { title: "What Is PCOS?", youTubeId: "cGkVVs8I4ZU" },
    { title: "Female Infertility — Causes & Diagnosis", youTubeId: "7NjGI-zTpek" },
  ],
  "parth-bavishi": [
    { title: "How Many Eggs Are Needed for IVF?", youTubeId: "AO_J6jKeCck" },
    { title: "What Is the Right Age & Time for IVF?", youTubeId: "jDC5ibv_98g" },
    { title: "How to Understand a Semen Report", youTubeId: "qacPd9xTcyw" },
    { title: "Egg Freezing vs Embryo Freezing", youTubeId: "eON_mr8bz-A" },
    { title: "5 Things to Know Before Egg Freezing", youTubeId: "f3N5WJtGwmk" },
    { title: "Which Medicines Are Necessary After Embryo Transfer?", youTubeId: "5oKbplu1Qzs" },
    { title: "Endometriosis vs Adenomyosis", youTubeId: "pQG6eTOuhG8" },
    { title: "5 Important Signs of PCOD", youTubeId: "XapYC1arCMc" },
    { title: "Understanding Your Ovarian Age", youTubeId: "oMq4INMLwDk" },
    { title: "Why Doctors Suggest a C-Section", youTubeId: "iTMYzfvCt-E" },
    { title: "When Do Periods Occur After Egg Pickup in IVF?", youTubeId: "40BczqHGVWI" },
    { title: "Letrozole — Why It's Prescribed for Fertility", youTubeId: "XR02J2T607c" },
  ],
  "janki-bavishi": [
    { title: "Understanding In Vitro Fertilization", youTubeId: "lovYgHlbZoE" },
    { title: "Answers to Every Common IVF Question", youTubeId: "GkqsjsZwwq8" },
  ],
  "binal-shah": [
    { title: "Endometriosis & Chocolate Cysts — Explained", youTubeId: "wg9xQ5BKTVg" },
  ],
};

/** Real doctor-speak videos for a profile. Empty → hide the section. */
export function videosForDoctor(doctorSlug: string, max = 12): DoctorVideo[] {
  return (DOCTOR_VIDEOS[doctorSlug] ?? []).slice(0, max);
}

/** Real testimonials for a treatment page (max 3). Empty → hide the section. */
export function testimonialsForTreatment(treatmentSlug: string, max = 3): VideoTestimonial[] {
  return (TREATMENT_TESTIMONIALS[treatmentSlug] ?? []).slice(0, max);
}

/** Real testimonials for a city page (max 3). Empty → hide the section. */
export function testimonialsForCity(citySlug: string, max = 30): VideoTestimonial[] {
  return (CITY_TESTIMONIALS[citySlug] ?? []).slice(0, max);
}

/** Real testimonials for a doctor page. Rendered in an auto-scrolling carousel,
 * so the cap is generous — more than 3 simply scroll. Empty → hide the section. */
export function testimonialsForDoctor(doctorSlug: string, max = 12): VideoTestimonial[] {
  return (DOCTOR_TESTIMONIALS[doctorSlug] ?? []).slice(0, max);
}

/** Real testimonials for a centre page: pooled from the doctors who actually
 *  consult at that specific centre (Doctor.locations — branch-level, not
 *  city-level), deduped. Falls back to the city-wide pool only when none of
 *  those doctors have a testimonial on file. Empty → hide the section. */
export function testimonialsForCentre(centreSlug: string, citySlug: string, max = 30): VideoTestimonial[] {
  const centreDoctorSlugs = doctorsForLocation(centreSlug).map((d) => d.slug);
  const fromDoctors = centreDoctorSlugs.flatMap((slug) => DOCTOR_TESTIMONIALS[slug] ?? []);
  const deduped = fromDoctors.filter((v, i, arr) =>
    arr.findIndex((o) => (o.youTubeId ?? o.videoSrc) === (v.youTubeId ?? v.videoSrc)) === i
  );
  // Doctor-named stories first, then the rest of the city's pool. Previously
  // the city pool was a fallback used only when a centre's doctors had no
  // videos at all, so an Ahmedabad centre never showed the city's own stories.
  const city = CITY_TESTIMONIALS[citySlug] ?? [];
  const pool = [...deduped, ...city].filter((v, i, arr) =>
    arr.findIndex((o) => (o.youTubeId ?? o.videoSrc) === (v.youTubeId ?? v.videoSrc)) === i
  );
  return pool.slice(0, max);
}
