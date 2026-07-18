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
  /** Reviewer's display name, as shown on Google. */
  name: string;
  /** Star rating (1–5). All current reviews are 5★. */
  rating: number;
  /** Relative date label as shown on Google, e.g. "7 months ago". */
  date: string;
  /** Full review text (patient portion only — no owner reply). */
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
};

/** Real written reviews for a doctor profile. Empty → hide the section. */
export function reviewsForDoctor(doctorSlug: string, max = 20): DoctorReview[] {
  return (DOCTOR_TEXT_REVIEWS[doctorSlug] ?? []).slice(0, max);
}
