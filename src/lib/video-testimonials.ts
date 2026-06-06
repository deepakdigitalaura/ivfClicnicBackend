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

export type VideoTestimonial = {
  /** Patient/display name (first name or couple; descriptive when anonymous). */
  name: string;
  /** Short pull-quote — must stay faithful to what the patient actually said. */
  quote: string;
  /** Real YouTube video id (required — we never render placeholders). */
  youTubeId: string;
  /** City/centre — set ONLY when the testimonial explicitly states it. */
  location?: string;
  /** Treating doctor — set ONLY when the testimonial explicitly names them. */
  doctor?: string;
};

/* ---------------------------------------------------------------------
 * TREATMENT PAGES — keyed by treatment slug (see src/lib/treatments.ts).
 * Only slugs with medically-relevant stories are listed; every other
 * treatment page resolves to [] and hides its testimonial section.
 * ------------------------------------------------------------------- */
export const TREATMENT_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  ivf: [
    { name: "After 25 Years of Waiting", quote: "25 years of waiting, and one miracle finally completed our family.", youTubeId: "tfc645Tz3vw" },
    { name: "Dipali Doshi", quote: "We succeeded in our very first IVF cycle at Bavishi Fertility Institute.", youTubeId: "XGYK6MZD3ak" },
    { name: "Naina & Deepak", quote: "After 20 years of hope, Bavishi Fertility Institute made us parents.", youTubeId: "IK1sZLDAito" },
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
export const CITY_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  ahmedabad: [
    { name: "Sheetal Jaydeep Vachanani", location: "Ahmedabad", quote: "Our fertility treatment in Ahmedabad with Bavishi Fertility Institute gave us our happiest moment.", youTubeId: "HZeK3QG2MDc" },
  ],
  // mumbai / surat / vadodara: city-tagged videos exist but their YouTube IDs
  // were not in the current channel export — add here once collected.
};

/* ---------------------------------------------------------------------
 * DOCTOR PAGES — keyed by doctor slug (see src/lib/doctors.ts).
 * Only videos that explicitly name the doctor belong here.
 * ------------------------------------------------------------------- */
export const DOCTOR_TESTIMONIALS: Record<string, VideoTestimonial[]> = {
  "janki-bavishi": [
    { name: "Shilled Oza", doctor: "Dr. Janki Bavishi", quote: "The personalised care from Dr. Janki Bavishi made all the difference.", youTubeId: "SP4xuGIFpF4" },
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
export function testimonialsForCity(citySlug: string, max = 3): VideoTestimonial[] {
  return (CITY_TESTIMONIALS[citySlug] ?? []).slice(0, max);
}

/** Real testimonials for a doctor page (max 3). Empty → hide the section. */
export function testimonialsForDoctor(doctorSlug: string, max = 3): VideoTestimonial[] {
  return (DOCTOR_TESTIMONIALS[doctorSlug] ?? []).slice(0, max);
}
