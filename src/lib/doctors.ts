/* =====================================================================
 * Doctor entity architecture
 * ---------------------------------------------------------------------
 * Single source of truth for every doctor, powering:
 *   - /doctors            (index)
 *   - /doctors/[slug]     (profile page + Physician schema)
 *   - Doctor cards reused on home / treatment / location pages
 *   - reviewedBy attribution on YMYL treatment pages
 *
 * WHY IT MATTERS (EEAT / YMYL / LLM)
 *  - Google's medical (YMYL) quality bar rewards named, credentialed
 *    authors/reviewers with verifiable expertise. A doctor that exists
 *    only as "name + degree" on a card is not an entity. Here each doctor
 *    is a first-class Person/Physician with alumniOf, memberOf, award,
 *    knowsAbout and sameAs — exactly the signals an LLM needs to identify
 *    and confidently cite the individual.
 *  - `treatments` and `locations` are slug references that build the
 *    Treatment ↔ Doctor ↔ Location entity graph through real internal links.
 *
 * DATA HONESTY: `verified: false` marks doctors whose credentials are still
 * pending confirmation — their profiles render a lighter claim set and are
 * NOT used as medical reviewers until verified. Never invent credentials.
 * ===================================================================== */

import { SITE, ORG_ID, abs } from "@/lib/seo";
import { mediaUrl, type UploadValue } from "@/fields/image";

export type Doctor = {
  slug: string;
  name: string;
  /** Post-nominal credential string, e.g. "M.D." */
  credentials: string;
  /** Human-readable specialty line shown on cards. */
  specialty: string;
  /** schema.org medicalSpecialty values. */
  medicalSpecialty: string[];
  role: string;
  image: string;
  experienceLabel: string;   // e.g. "35+ yrs"
  experienceYears?: number;   // numeric, for sorting/schema
  /** City labels the doctor consults in (display). */
  cities: string[];
  /** Location slugs (city or area) for internal links + areaServed. */
  locations: string[];
  /** Treatment slugs the doctor practises — drives Doctor↔Treatment links. */
  treatments: string[];
  shortBio: string;
  bio: string[];
  knowsAbout: string[];
  alumniOf: string[];
  memberOf: string[];
  awards: string[];
  /** Advanced training / fellowships at named institutes (e.g. Diamond Institute, USA). */
  training?: string[];
  /** Books / notable publications authored. */
  publications?: string[];
  languages: string[];
  sameAs: string[];
  /** True once degrees/experience are confirmed. Gates reviewer use. */
  verified: boolean;
  /** Visiting senior specialist who rotates across all centres (e.g. the
   *  founder). The profile shows a single "visits across cities" card listing
   *  `cities` instead of a per-centre contact card for each branch. */
  visitsAllCentres?: boolean;
  /** Editable overrides for the static section labels on this doctor's profile
   *  page (eyebrows/headings/subtitles). Empty/missing → component defaults. */
  profileLabels?: {
    aboutEyebrow?: string;
    treatmentsEyebrow?: string;
    consultsEyebrow?: string;
    consultsSubtitle?: string;
    visitsHeading?: string;
    visitsParagraph?: string;
    doctorSpeakEyebrow?: string;
    doctorSpeakSubtitle?: string;
    storiesEyebrow?: string;
    storiesSubtitle?: string;
    ctaHeading?: string;
    aboutTitle?: string;
    treatmentsTitle?: string;
    storiesTitle?: string;
    consultsTitle?: string;
    doctorSpeakTitle?: string;
  };
};

/* Master treatment list. Every doctor is shown as offering the full range
 * because each centre has a specific fertility specialist who performs almost
 * all of these. Trim an individual doctor later (pass a custom `treatments`)
 * once sir confirms any exceptions. Only slugs with a dedicated treatment page
 * are listed (so each card links somewhere real). */
export const ALL_TREATMENT_SLUGS: string[] = [
  // Core ART
  "ivf", "icsi", "iui", "ivf-evaluation", "ivf-failure",
  // Advanced lab / embryology
  "picsi", "imsi", "macs", "spindle-view-icsi", "blastocyst-transfer", "laser-hatching", "pgt", "era-test",
  // Male infertility
  "azoospermia", "oligospermia", "asthenospermia", "surgical-sperm-retrieval", "varicocele", "erectile-dysfunction",
  // Female infertility
  "pcos", "endometriosis", "fibroids", "ovarian-reserve", "ovarian-rejuvenation", "conceive-naturally", "prp-infertility",
  // Fertility preservation
  "cryopreservation",
  // Third-party reproduction
  "egg-donation", "sperm-donation", "embryo-donation", "surrogacy",
];

/* Factory for city fertility-team members whose full credentials are still
 * pending verification. We deliberately DO NOT invent degrees, experience,
 * awards, alumni or memberships — those stay empty until confirmed, and
 * `verified: false` keeps them out of YMYL reviewer use. Cards/profile render
 * gracefully around the empty fields. Promote to a full entity once verified. */
function cityDoctor(opts: {
  slug: string;
  name: string;
  image: string;
  city: string;
  citySlug: string;
  specialty?: string;
  role?: string;
  credentials?: string;
  experienceLabel?: string;
  experienceYears?: number;
  /** Centre slugs the doctor consults at (powers the contact cards). */
  locations?: string[];
  medicalSpecialty?: string[];
  shortBio?: string;
  bio?: string[];
  knowsAbout?: string[];
  alumniOf?: string[];
  memberOf?: string[];
  awards?: string[];
  training?: string[];
  publications?: string[];
  treatments?: string[];
  languages?: string[];
  verified?: boolean;
}): Doctor {
  return {
    slug: opts.slug,
    name: opts.name,
    credentials: opts.credentials ?? "",
    specialty: opts.specialty ?? "Fertility Specialist",
    medicalSpecialty: opts.medicalSpecialty ?? ["Fertility", "ReproductiveMedicine"],
    role: opts.role ?? "Fertility Specialist",
    image: opts.image,
    experienceLabel: opts.experienceLabel ?? "",
    experienceYears: opts.experienceYears,
    cities: [opts.city],
    locations: opts.locations ?? [opts.citySlug],
    treatments: opts.treatments ?? ALL_TREATMENT_SLUGS,
    shortBio:
      opts.shortBio ??
      `${opts.name} is part of the Bavishi Fertility Institute fertility team in ${opts.city}.`,
    bio: opts.bio ?? [
      `${opts.name} is a fertility specialist with Bavishi Fertility Institute in ${opts.city}, supporting couples through evaluation and assisted-reproduction care backed by the institute's 25-year expertise.`,
    ],
    knowsAbout: opts.knowsAbout ?? ["In Vitro Fertilization", "Fertility Treatment"],
    alumniOf: opts.alumniOf ?? [],
    memberOf: opts.memberOf ?? [],
    awards: opts.awards ?? [],
    training: opts.training,
    publications: opts.publications,
    languages: opts.languages ?? ["English", "Hindi"],
    sameAs: [],
    verified: opts.verified ?? false,
  };
}

export const DOCTORS: Doctor[] = [
  {
    slug: "himanshu-bavishi",
    name: "Dr. Himanshu Bavishi",
    credentials: "MBBS, MD (Obstetrics & Gynaecology)",
    specialty: "Reproductive Medicine & IVF",
    medicalSpecialty: ["ReproductiveMedicine", "Fertility"],
    role: "Founder & Chief IVF Specialist",
    image: "/assets/doctors/himanshu.webp",
    experienceLabel: "35+ yrs",
    experienceYears: 35,
    // Founder & visiting senior IVF specialist — consults across every BFI city.
    cities: ["Ahmedabad", "Mumbai", "Vadodara", "Surat", "Bhuj", "Bhavnagar", "Anand", "Varanasi"],
    locations: ["paldi", "nikol", "mumbai", "vadodara", "surat", "bhuj", "bhavnagar", "anand", "varanasi"],
    treatments: ALL_TREATMENT_SLUGS,
    shortBio:
      "Founder of Bavishi Fertility Institute and a pioneer of IVF in India, with more than three decades guiding couples to parenthood.",
    bio: [
      "Dr. Himanshu Bavishi founded Bavishi Fertility Institute in 1998 and has since helped pioneer assisted reproduction in India. He has led the institute's growth into a national network credited with 30,000+ pregnancies.",
      "A pioneer and leader in infertility and IVF, he is widely respected for the reputation of a doctor with a 'golden hand' — bringing positive results in the most difficult cases — and treats couples from across India and overseas with excellent outcomes.",
      "His clinical focus spans customised ovarian-stimulation protocols, ICSI, and safe-stimulation strategies designed to avoid severe OHSS. He is a frequent speaker, invited faculty at national and regional conferences, and an educator on responsible, transparent fertility care.",
    ],
    knowsAbout: [
      "In Vitro Fertilization",
      "Intracytoplasmic Sperm Injection",
      "Ovarian Stimulation Protocols",
      "Male Infertility",
      "Fertility Preservation",
    ],
    alumniOf: [
      "MBBS — B.J. Medical College, Ahmedabad (1983)",
      "MD, Obstetrics & Gynaecology — B.J. Medical College, Ahmedabad (1986)",
    ],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Society for Assisted Reproduction (ISAR)",
      "Indian Fertility Society (IFS)",
      "Indian Society of Third Party Assisted Reproduction (INSTAR) — Founder President",
    ],
    awards: [
      "Excellence in the Field of Medicine — Indian Medical Association, Gujarat (2004); the only infertility specialist in Gujarat to receive it",
      "'Shresth' Award in Infertility & IVF — Chief Minister of Gujarat",
    ],
    publications: [
      "Author — 'Devna Didhela, Mangine Lidhela...' (Gujarati, 2011)",
      "Author — 'Viknadog' (Gujarati, 2012)",
    ],
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    sameAs: [],
    verified: true,
    visitsAllCentres: true,
  },
  {
    slug: "falguni-bavishi",
    name: "Dr. Falguni Bavishi",
    credentials: "MBBS, MD (Obstetrics & Gynaecology)",
    specialty: "Infertility & Gynaecology",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine"],
    role: "Co-founder & Senior Fertility Specialist",
    image: "/assets/doctors/falguni.webp",
    experienceLabel: "34+ yrs",
    experienceYears: 34,
    cities: ["Ahmedabad"],
    locations: ["paldi", "sindhu-bhavan-road"],
    treatments: ALL_TREATMENT_SLUGS,
    shortBio:
      "Co-founder of Bavishi Fertility Institute, specialising in female infertility, reproductive gynaecology and compassionate patient counselling.",
    bio: [
      "Dr. Falguni Bavishi co-founded Bavishi Fertility Institute and has over three decades of experience in reproductive gynaecology and female infertility.",
      "She is known for thorough diagnostic evaluation, individualised treatment planning and the warm, honest counselling that defines the institute's approach.",
    ],
    knowsAbout: [
      "Female Infertility",
      "In Vitro Fertilization",
      "Endometriosis",
      "Reproductive Gynaecology",
      "Fertility Preservation",
    ],
    alumniOf: ["MBBS, MD — Obstetrics & Gynaecology"],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Society for Assisted Reproduction (ISAR)",
    ],
    awards: [
      "'Shresth' Award in Infertility & IVF — Chief Minister of Gujarat",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    sameAs: [],
    verified: true,
  },
  {
    slug: "parth-bavishi",
    name: "Dr. Parth Bavishi",
    credentials: "MBBS, MD (Obstetrics & Gynaecology)",
    specialty: "IVF & Andrology",
    medicalSpecialty: ["ReproductiveMedicine", "Andrology"],
    role: "Co-director & IVF Specialist",
    image: "/assets/doctors/parth.webp",
    experienceLabel: "13+ yrs",
    experienceYears: 13,
    cities: ["Ahmedabad"],
    locations: ["paldi", "sindhu-bhavan-road"],
    treatments: ALL_TREATMENT_SLUGS,
    shortBio:
      "Co-director of Bavishi Fertility Institute and IVF specialist focused on male-factor infertility, advanced sperm retrieval and repeated-IVF-failure cases.",
    bio: [
      "Dr. Parth Bavishi is a co-director of the Bavishi Fertility Institute chain and an IVF specialist who has performed 10,000+ infertility procedures. He has a particular focus on male-factor infertility, surgical sperm retrieval (TESA/PESA/Micro-TESE), poor ovarian reserve (low AMH) and repeated IVF failure.",
      "He completed his MBBS (2009) and MD in Obstetrics & Gynaecology (2012) at Pramukhswami Medical College, Karamsad, and trained further at the Diamond Institute (New Jersey, USA) and the HART Institute (Japan). He co-authored the patient guide 'Your Miracle in Making'.",
    ],
    knowsAbout: [
      "Male Infertility",
      "Andrology",
      "Intracytoplasmic Sperm Injection",
      "Surgical Sperm Retrieval",
      "Azoospermia",
    ],
    alumniOf: [
      "MBBS — Pramukhswami Medical College, Karamsad (2009)",
      "MD, Obstetrics & Gynaecology — Pramukhswami Medical College, Karamsad (2012)",
    ],
    memberOf: [
      "Indian Fertility Society (IFS)",
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Society for Assisted Reproduction (ISAR)",
      "Indian Society of Third Party Assisted Reproduction (INSTAR)",
    ],
    awards: [
      "Rose of Paracelsus Award — European Medical Association",
      "Most Prominent IVF Specialist — presented by the Chief Minister of Gujarat",
    ],
    training: [
      "Advanced ART training — Diamond Institute, New Jersey, USA",
      "Advanced reproductive techniques — HART Institute, Japan",
    ],
    publications: [
      "Author — 'Aapnu Adbhut Sarjan' (Gujarati, 2017)",
      "Author — 'Your Miracle in Making: A Couple's Guide to Pregnancy' (English, 2017)",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    sameAs: [],
    verified: true,
  },
  {
    slug: "janki-bavishi",
    name: "Dr. Janki Bavishi",
    credentials: "MBBS, MS (Obstetrics & Gynaecology)",
    specialty: "Reproductive Surgery & IVF",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine"],
    role: "Co-director & Reproductive Surgeon",
    image: "/assets/doctors/janki.webp",
    experienceLabel: "12+ yrs",
    experienceYears: 12,
    cities: ["Ahmedabad"],
    locations: ["paldi"],
    treatments: ALL_TREATMENT_SLUGS,
    shortBio:
      "Co-director of Bavishi Fertility Institute and reproductive surgeon specialising in hysteroscopy, laparoscopy and fertility-enhancing surgery.",
    bio: [
      "Dr. Janki Bavishi is a co-director of the Bavishi Fertility Institute chain and a reproductive surgeon experienced in minimally invasive hysteroscopic and laparoscopic procedures that improve fertility outcomes. She has been part of 10,000+ infertility procedures and is known for thorough counselling and accurate results.",
      "She trained further at the Diamond Institute (New Jersey, USA) and the HART Institute (Japan), and co-authored the patient guide 'Your Miracle in Making'. Her work supports the IVF programme by optimising the uterine and pelvic environment before treatment.",
    ],
    knowsAbout: [
      "Reproductive Surgery",
      "Hysteroscopy",
      "Laparoscopy",
      "Endometriosis",
      "Female Infertility",
    ],
    alumniOf: ["MBBS, MS — Obstetrics & Gynaecology"],
    memberOf: ["Federation of Obstetric and Gynaecological Societies of India (FOGSI)"],
    awards: [
      "Gujarat Gaurav Icon — Midday Group",
      "'Nari Tu Narayani' Award for leading gynaecologist — Bulletin India Group",
    ],
    training: [
      "Advanced ART training — Diamond Institute, New Jersey, USA",
      "Advanced reproductive techniques — HART Institute, Japan",
    ],
    publications: [
      "Co-author — 'Aapnu Adbhut Sarjan' (Gujarati, 2017)",
      "Co-author — 'Your Miracle in Making: A Couple's Guide to Pregnancy' (English, 2017)",
    ],
    languages: ["English", "Hindi", "Gujarati"],
    sameAs: [],
    verified: true,
  },

  /* ---- City fertility-team members ----
   * Data researched from the institute's official profiles (ivfclinic.com) and
   * public medical directories. Degrees are included only where a credible
   * source confirms them; where a degree could not be verified the field is left
   * empty rather than invented (these doctors stay `verified: false` and carry
   * no reviewer badge, but their full profile still renders). */
  // Ahmedabad
  cityDoctor({
    slug: "binal-shah", name: "Dr. Binal Shah", image: "/assets/doctors/binal-shah.webp",
    city: "Ahmedabad", citySlug: "ahmedabad", locations: ["paldi"],
    credentials: "MBBS, DGO", experienceLabel: "30+ yrs", experienceYears: 30,
    specialty: "Obstetrics, Gynaecology & IVF",
    role: "IVF Specialist · Chief Quality Control & NABH Nodal Officer",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Experienced obstetrician and IVF specialist managing normal and IVF pregnancies, and Chief Quality Control & NABH Nodal Officer at Bavishi Fertility Institute.",
    bio: [
      "Dr. Binal Shah is an experienced obstetrician and IVF specialist with over three decades of practice in managing normal and IVF pregnancies, including complex cases such as twin pregnancies and high-risk deliveries.",
      "She serves as the Chief Quality Control Officer and NABH Nodal Officer at Bavishi Fertility Institute, helping uphold the institute's clinical quality and accreditation standards.",
    ],
    knowsAbout: ["In Vitro Fertilization", "High-Risk Pregnancy", "Twin Pregnancy", "Female Infertility"],
  }),
  cityDoctor({
    slug: "jaydeep-patel", name: "Dr. Jaydeep Patel", image: "/assets/doctors/jaydeep-patel.webp",
    city: "Ahmedabad", citySlug: "ahmedabad", locations: ["nikol"],
    credentials: "MBBS, DGO",
    experienceLabel: "10+ yrs", experienceYears: 10,
    specialty: "Obstetrics & IVF", role: "IVF Specialist",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "IVF specialist at Bavishi Fertility Institute Nikol, Ahmedabad, with 10+ years of experience in PCOS infertility, male factor, poor endometrium and high-risk pregnancy management.",
    bio: [
      "Dr. Jaydeep Patel is an IVF specialist at the Bavishi Fertility Institute Nikol centre in Ahmedabad, with over ten years of experience in infertility management and high-risk pregnancy care.",
      "He focuses on couples with PCOS, male factor infertility, poor endometrium, and bad obstetric history — including those with multiple prior IVF failures. His treatment philosophy: \"Self Egg, Self Sperm, Own Baby.\"",
    ],
    knowsAbout: [
      "In Vitro Fertilization", "PCOS", "Male Factor Infertility",
      "High-Risk Pregnancy", "Poor Endometrium", "Bad Obstetric History",
    ],
    alumniOf: [
      "MBBS — B.J. Medical College, Ahmedabad (2013)",
      "DGO — The College of Physicians & Surgeons of Mumbai (2018)",
    ],
    languages: ["Hindi", "English", "Gujarati"],
    training: [
      "Invited Faculty — SOGOG Conference (2022)",
      "Invited Faculty — JIC Conference (2023)",
      "Speaker — Ahmedabad Women Doctor's Federation CME (2025)",
      "Speaker — New Vastral General Practitioners CME (2025)",
    ],
    verified: true,
  }),
  // Mumbai
  cityDoctor({
    slug: "suman-singh", name: "Dr. Suman Singh", image: "/assets/doctors/Dr.-Suman-Singh.webp",
    city: "Mumbai", citySlug: "mumbai", locations: ["thane", "ghatkopar"],
    credentials: "MBBS, DGO", experienceLabel: "20+ yrs", experienceYears: 20,
    specialty: "Fertility & IVF", role: "IVF Specialist",
    shortBio: "Fertility specialist with over 20 years of experience in Mumbai and abroad, helping couples conceive naturally, through planned relationships and through IVF.",
    bio: [
      "Dr. Suman Singh is a fertility specialist with over 20 years of experience as a gynaecologist and IVF specialist in Mumbai and abroad.",
      "She has helped thousands of couples achieve parenthood through natural conception, planned relationship and IVF, customising each treatment plan to the couple's needs and aspirations. She consults at the Thane and Ghatkopar centres.",
    ],
    knowsAbout: ["In Vitro Fertilization", "IUI", "Female Infertility", "Fertility Treatment"],
  }),
  cityDoctor({
    slug: "nilesh-jain", name: "Dr. Nilesh Jain", image: "/assets/doctors/Dr.-Nilesh-Jain-221x300.webp",
    city: "Mumbai", citySlug: "mumbai", locations: ["ghatkopar", "vashi"],
    credentials: "MBBS, DGO, DNB (Obstetrics & Gynaecology)", experienceLabel: "20+ yrs", experienceYears: 20,
    specialty: "Infertility & IVF", role: "Fertility Consultant",
    shortBio: "Fertility consultant with more than 20 years of experience in infertility treatment, consulting at the Ghatkopar and Vashi centres in Mumbai.",
    bio: [
      "Dr. Nilesh Jain is an experienced fertility consultant with more than 20 years of experience in the field of infertility.",
      "He has effectively managed many infertility cases and is known for combining clinical efficiency with empathy in patient care. He consults at the Ghatkopar and Vashi centres.",
    ],
    knowsAbout: ["In Vitro Fertilization", "IUI", "Male Infertility", "Female Infertility"],
  }),
  cityDoctor({
    slug: "priyanka-sinha", name: "Dr. Priyanka Sinha", image: "/assets/doctors/priyanka-sinha.webp",
    city: "Mumbai", citySlug: "mumbai", locations: ["borivali", "vile-parle"],
    credentials: "MBBS, MD, Fellowship in Reproductive Medicine (USA)", experienceLabel: "15+ yrs", experienceYears: 15,
    specialty: "Reproductive Medicine & IVF", role: "IVF Specialist",
    medicalSpecialty: ["ReproductiveMedicine", "Gynecology", "Fertility"],
    shortBio: "Reproductive medicine physician with over 15 years of experience, offering IVF, ICSI, PGT and fertility preservation at the Borivali and Vile Parle centres.",
    bio: [
      "Dr. Priyanka Sinha is a reproductive medicine physician with over 15 years of clinical practice, holding an MD and a Fellowship in Reproductive Medicine from the USA.",
      "She provides comprehensive infertility care including IVF, ICSI, PGT, egg and embryo freezing, and the management of both male and female infertility at the institute's Borivali and Vile Parle centres.",
    ],
    knowsAbout: ["In Vitro Fertilization", "Intracytoplasmic Sperm Injection", "Fertility Preservation", "Male Infertility", "Female Infertility"],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Society for Assisted Reproduction (ISAR)",
    ],
  }),
  // Surat
  cityDoctor({
    slug: "deep-gajiwala", name: "Dr. Deep Gajiwala", image: "/assets/doctors/Dr.-Deep-Gajiwala-221x300.webp",
    city: "Surat", citySlug: "surat", locations: ["lal-darwaja"],
    credentials: "MBBS, DGO, DNB (Obstetrics & Gynaecology)", experienceLabel: "12+ yrs", experienceYears: 12,
    specialty: "IVF & Laparoscopic Surgery", role: "IVF Specialist & Laparoscopic Surgeon",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "IVF specialist and laparoscopic surgeon in Surat with 5,000+ operations related to fertility care and childbirth.",
    bio: [
      "Dr. Deep Gajiwala is an IVF specialist and laparoscopic surgeon with over 12 years of experience and more than 5,000 operations related to IVF and childbirth.",
      "He has wide experience in normal and IVF pregnancy care and delivery, and provides compassionate, efficient patient care at the Bavishi Fertility Institute Surat centre.",
    ],
    knowsAbout: ["In Vitro Fertilization", "Laparoscopy", "High-Risk Pregnancy", "Female Infertility"],
    alumniOf: [
      "MBBS — Dr. D.Y. Patil Medical College, Kolhapur (2009)",
      "DGO — Krishna Institute of Medical Sciences (KIMSDU) (2013)",
      "DNB, Obstetrics & Gynaecology — National Board of Examinations (2016)",
    ],
  }),
  // Vadodara
  cityDoctor({
    slug: "mita-shah", name: "Dr. Mita Shah", image: "/assets/doctors/mita-shah.webp",
    city: "Vadodara", citySlug: "vadodara", locations: ["jetalpur-road"],
    credentials: "MBBS, DGO",
    experienceLabel: "22+ yrs", experienceYears: 22,
    specialty: "Obstetrics, Gynaecology & Fertility", role: "Consultant Fertility Specialist",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Consultant Fertility Specialist at Bavishi Fertility Institute Vadodara with 22 years of experience, known for individualised, evidence-based care for complex fertility challenges including PGT-M, recurrent IVF failure and uterine anomalies.",
    bio: [
      "Dr. Mita A. Shah is a Consultant Fertility Specialist at the Bavishi Fertility Institute Vadodara centre with 22 years of experience in obstetrics, gynaecology and fertility medicine.",
      "She specialises in individualised ovarian stimulation protocols, PGT-A and PGT-M, fertility preservation, third-party reproduction (gamete donation and gestational surrogacy), and the management of diminished ovarian reserve, recurrent IVF failure and recurrent pregnancy loss. Her approach combines evidence-based medicine with empathy, patience and honest communication — ensuring patients understand every step of their treatment.",
    ],
    knowsAbout: [
      "In Vitro Fertilization", "Intracytoplasmic Sperm Injection",
      "Preimplantation Genetic Testing", "Fertility Preservation",
      "Diminished Ovarian Reserve", "Recurrent Pregnancy Loss",
      "Male Factor Infertility", "Gestational Surrogacy", "Gamete Donation",
    ],
    alumniOf: [
      "MBBS — Govt. Medical College, Surat (2001)",
      "DGO — Govt. Medical College, Surat (2003)",
    ],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Medical Association (IMA)",
    ],
    awards: [
      "Times Power Brand Award for Excellence in Genetics & IVF Treatment — Times Group, powered by Baroda Times (March 2026)",
    ],
    languages: ["English", "Gujarati", "Hindi"],
    verified: true,
  }),
  // Bhuj
  cityDoctor({
    slug: "surbhi-vegad", name: "Dr. Surbhi Vegad", image: "/assets/doctors/surbhi-vegad.webp",
    city: "Bhuj", citySlug: "bhuj", locations: ["mirjapar"],
    experienceLabel: "20+ yrs", experienceYears: 20,
    specialty: "Gynaecology, IVF & 3D Laparoscopy", role: "IVF Specialist & 3D Laparoscopic Surgeon",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Leading gynaecologist, IVF expert and 3D laparoscopic surgeon in Bhuj & Kutch, with special expertise in high-risk pregnancy care.",
    bio: [
      "Dr. Surbhi Vegad is a leading obstetrician and gynaecologist in Bhuj and Kutch with more than 20 years of experience in state-of-the-art gynaecological treatment and specialised high-risk pregnancy care.",
      "She combines advanced 3D laparoscopic surgical skills with comprehensive fertility expertise to deliver personalised treatment plans at the Bavishi Fertility Institute Bhuj centre.",
    ],
    knowsAbout: ["In Vitro Fertilization", "Laparoscopy", "High-Risk Pregnancy", "Female Infertility"],
  }),
  // Anand (IRIS Hospital)
  cityDoctor({
    slug: "chetna-vyas", name: "Dr. Chetna Vyas", image: "/assets/doctors/Dr.-Chetna-Vyas-221x300.webp",
    city: "Anand", citySlug: "anand", locations: ["nanikhodiyar"],
    experienceLabel: "22+ yrs", experienceYears: 22,
    specialty: "Obstetrics, Gynaecology & IVF", role: "Co-founder, Bavishi Fertility Institute — IRIS Hospital",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Obstetrician and gynaecologist with over 22 years of experience and a special interest in infertility, IVF, laparoscopy and high-risk obstetrics.",
    bio: [
      "Dr. Chetna Vyas is a highly experienced obstetrician and gynaecologist with a special interest in infertility, IVF, laparoscopy and high-risk obstetrics, and is one of the founders of Bavishi Fertility Institute at IRIS Hospital, Anand.",
      "She has successfully treated thousands of patients over more than 22 years, managing complex infertility cases and high-risk pregnancies, and contributes to academic programmes as chairperson and moderator.",
    ],
    knowsAbout: ["In Vitro Fertilization", "Laparoscopy", "High-Risk Pregnancy", "Female Infertility"],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Anand Obstetrics & Gynaecological Society (AOGS)",
      "Indian Medical Association (Anand branch)",
    ],
    publications: [
      "Case report — 'Torsion of Gravid Uterus', Asian Journal of Obstetrics & Gynaecology (2010)",
    ],
  }),
  cityDoctor({
    slug: "rakhee-patel", name: "Dr. Rakhee Patel", image: "/assets/doctors/rakhee-patel.webp",
    city: "Anand", citySlug: "anand", locations: ["nanikhodiyar"],
    credentials: "MBBS, MD", experienceLabel: "20+ yrs", experienceYears: 20,
    specialty: "Obstetrics, Gynaecology & IVF", role: "Co-founder, Bavishi Fertility Institute — IRIS Hospital · Minimal Access Surgeon",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Obstetrician and gynaecologist with over 20 years of experience in infertility management and advanced minimal-access gynaecological surgery.",
    bio: [
      "Dr. Rakhee Patel is a highly experienced obstetrician and gynaecologist and one of the founders of Bavishi Fertility Institute at IRIS Hospital, Anand, with specialised expertise in infertility management, laparoscopy, hysteroscopy and emergency obstetric care.",
      "She has successfully managed numerous infertility cases and complex obstetric emergencies, and actively contributes to academic programmes as a chairperson and moderator.",
    ],
    knowsAbout: ["In Vitro Fertilization", "Laparoscopy", "Hysteroscopy", "Female Infertility"],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Anand Obstetrics & Gynaecological Society (AOGS)",
      "Association of Minimal Access Surgeons of India (AMASI)",
      "Indian Medical Association (Anand branch)",
    ],
    awards: [
      "First Prize, poster presentation 'Lapro-Hysteroscopic Evaluation of Sub-Fertile Women' — World Congress on Practical Infertility Management & Human Reproduction, Mumbai (2004)",
    ],
    publications: [
      "Case report — 'Torsion of Gravid Uterus', Asian Journal of Obstetrics & Gynaecology (2010)",
    ],
  }),
  // Bhavnagar
  cityDoctor({
    slug: "deepali-pandya", name: "Dr. Deepali Pandya", image: "/assets/doctors/Dr.-Deepali-Pandya-1-1.webp",
    city: "Bhavnagar", citySlug: "bhavnagar", locations: ["kalubha-road"],
    credentials: "MS (Obstetrics & Gynaecology), FMAS, FRM — Gold Medalist",
    experienceLabel: "12+ yrs", experienceYears: 12,
    specialty: "Reproductive Medicine & Laparoscopic Surgery", role: "Chief IVF Specialist, Bavishi Fertility Institute Bhavnagar",
    medicalSpecialty: ["Gynecology", "ReproductiveMedicine", "Fertility"],
    shortBio: "Gold Medalist MS (OBG) and Chief IVF Specialist at Bavishi Fertility Institute Bhavnagar, with 12 years of experience in recurrent implantation failure, PGT-A, endometriosis-related infertility and high-risk obstetrics.",
    bio: [
      "Dr. Deepali D. Pandya is a Gold Medalist MS (Obstetrics & Gynaecology) and Chief IVF Specialist at the Bavishi Fertility Institute Bhavnagar centre, with 12 years of experience in fertility medicine and laparoscopic surgery.",
      "She is also the Founder of Hema Women's Health, Bhavnagar, and Visiting Consultant at Ram Mantra Seva Trust and Nirma Colony Hospital. Her clinical focus is on recurrent implantation failure, PGT-A, infertility in endometriosis and complex laparoscopy. Her philosophy: \"Give your 100% to your patient, never give up on them.\"",
    ],
    knowsAbout: [
      "In Vitro Fertilization", "Recurrent Implantation Failure",
      "Preimplantation Genetic Testing", "Endometriosis",
      "Laparoscopy", "High-Risk Pregnancy",
    ],
    alumniOf: [
      "MS, Obstetrics & Gynaecology — V.S. General Hospital, Ahmedabad",
      "FMAS — Jogal Women's Hospital, Bhuj",
      "FRM (Fellowship in Reproductive Medicine) — Nimayaa Training Academy",
    ],
    memberOf: [
      "Indian Association of Gynaecological Endoscopists (IAGE)",
      "Indian Society for Assisted Reproduction (ISAR)",
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
    ],
    awards: [
      "Pride of Bhavnagar Award — Divya Bhaskar Group (2026)",
      "Gold Medal — Gujarat University (2022)",
    ],
    publications: [
      "'Role of USG in First Trimester Bleeding PV' — International Journal of Gynaecology (2020)",
      "'Fetomaternal Outcomes in Pregnant Women in COVID Positive Patients' — International Journal of Gynaecology (2022)",
      "'Role of Colour Doppler in High Risk Pregnancy' (2022)",
      "'Role of PGT-A in Recurrent IVF Failure Patients' — Indian Fertility Society (IFS) (2023)",
    ],
    training: [
      "IVF training — Bavishi Fertility Institute, Paldi, Ahmedabad",
    ],
    languages: ["Gujarati", "Hindi", "English"],
    verified: true,
  }),
  // Varanasi
  cityDoctor({
    slug: "parnnika-agarwal", name: "Dr. Parnnika Agarwal", image: "/assets/doctors/Dr.-Parnnika-Agarwal-221x300.webp",
    city: "Varanasi", citySlug: "varanasi", locations: ["shivpur"],
    credentials: "MBBS, MS, FMAS, FRM",
    experienceLabel: "6+ yrs", experienceYears: 6,
    specialty: "Fertility, IVF & Gynaecological Laparoscopy", role: "Chief Consultant, Bavishi Neo Fertility Varanasi",
    medicalSpecialty: ["ReproductiveMedicine", "Gynecology", "Fertility"],
    shortBio: "Gold Medalist MBBS & MS and Chief Consultant at Bavishi Neo Fertility Varanasi, specialising in fertility-enhancing laparoscopy, hysteroscopy and tailored IVF protocols with empathy at the core.",
    bio: [
      "Dr. Parnnika Agarwal is the Chief Consultant at Bavishi Neo Fertility Varanasi, holding MBBS and MS degrees from Rohilkhand Medical College & Hospital, Bareilly (Gold Medalist in both), along with fellowships in ART and minimally invasive gynaecological surgery (FMAS, FRM).",
      "A former Assistant Professor at Rohilkhand Medical College and continuing Consultant Gynaecologist at Jamuna Sewa Sadan Hospital, Varanasi, she believes that a scientific approach and genuine empathy must go hand in hand — understanding a couple's emotional journey is as essential as the clinical plan.",
    ],
    knowsAbout: [
      "In Vitro Fertilization", "Fertility-Enhancing Laparoscopy",
      "Hysteroscopy", "Tailored IVF Protocols",
      "PCOS", "Endometriosis", "Fertility Preservation",
    ],
    alumniOf: [
      "MBBS — Rohilkhand Medical College & Hospital, Bareilly, UP (2015) — Gold Medalist",
      "MS (Obstetrics & Gynaecology) — Rohilkhand Medical College & Hospital, Bareilly, UP (2019) — Gold Medalist",
      "FMAS, FRM — Fellowship in ART and Minimally Invasive Gynaecological Surgery",
    ],
    memberOf: [
      "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
      "Indian Society for Assisted Reproduction (ISAR)",
      "Indian Fertility Society (IFS)",
      "European Society of Human Reproduction and Embryology (ESHRE)",
    ],
    awards: [
      "Gold Medalist — MBBS, Rohilkhand Medical College & Hospital (2015)",
      "Gold Medalist — MS (Obstetrics & Gynaecology), Rohilkhand Medical College & Hospital (2019)",
      "Prizes in paper and poster presentations at national and international conferences",
    ],
    languages: ["Hindi", "English"],
    verified: true,
  }),
];

/* ---------- Lookups ---------- */

export const doctorBySlug = (slug: string) => DOCTORS.find((d) => d.slug === slug);

export const doctorsForLocation = (locationSlug: string) =>
  DOCTORS.filter((d) => d.locations.includes(locationSlug));

/** The four Bavishi promoter doctors — always shown first (visible on load). */
const CORE_DOCTOR_SLUGS = ["himanshu-bavishi", "falguni-bavishi", "parth-bavishi", "janki-bavishi"];

/** Every Bavishi doctor is a fertility specialist, so the treatment carousel
 *  showcases the whole team and lets users slide through them. Ordering:
 *  the four promoter doctors lead, then doctors who explicitly list this
 *  treatment, then the remaining specialists. Stable sort keeps DOCTORS order
 *  within each tier. (Display only — not used for JSON-LD claims.) */
export const doctorsForTreatment = (treatmentSlug: string) => {
  const rank = (d: Doctor) => {
    const core = CORE_DOCTOR_SLUGS.indexOf(d.slug);
    if (core !== -1) return core;                          // 0–3: main four, fixed order
    if (d.treatments.includes(treatmentSlug)) return 100;  // treatment-relevant
    return 200;                                            // remaining specialists
  };
  return [...DOCTORS].sort((a, b) => rank(a) - rank(b));
};

/** First verified doctor — the default medical reviewer for YMYL pages. */
export const defaultReviewer = () => DOCTORS.find((d) => d.verified) ?? DOCTORS[0];

/** Card shape consumed by the shared <Doctors> grid. */
export type DoctorCard = {
  slug: string;
  img: string;
  n: string;
  deg: string;
  spec: string;
  loc: string;
  exp: string;
};

export const toDoctorCard = (d: Doctor): DoctorCard => ({
  slug: d.slug,
  img: d.image,
  n: d.name,
  deg: d.credentials,
  spec: d.specialty,
  loc: d.cities[0] ?? "",
  exp: d.experienceLabel,
});

export const doctorUrl = (slug: string) => `/doctors/${slug}`;

/* ---------- Header navigation data ----------
 * Powers the compact, doctor-first "Doctors" mega menu. The four promoters are
 * featured first; every other specialist is listed doctor-first with their city
 * as a muted secondary label. Stays in sync as the DOCTORS array grows. */
export type DoctorMenuEntry = { name: string; href: string; city: string; meta?: string };

export function doctorMenuData(): { senior: DoctorMenuEntry[]; specialists: DoctorMenuEntry[] } {
  const senior = CORE_DOCTOR_SLUGS.map((slug) => {
    const d = doctorBySlug(slug)!;
    return { name: d.name, href: doctorUrl(d.slug), city: d.cities[0] ?? "", meta: d.experienceLabel };
  });
  const specialists = DOCTORS
    .filter((d) => !CORE_DOCTOR_SLUGS.includes(d.slug))
    .map((d) => ({ name: d.name, href: doctorUrl(d.slug), city: d.cities[0] ?? "" }));
  return { senior, specialists };
}

/* ---------- Physician / Person schema ----------
 * Emits a Person + Physician node bound to #organization via worksFor.
 * Used both on the profile page and (as a referenced node) for reviewedBy. */
export function physicianSchema(d: Doctor): Record<string, unknown> {
  return {
    "@type": ["Physician", "Person"],
    "@id": `${abs(doctorUrl(d.slug))}#physician`,
    name: d.name,
    url: abs(doctorUrl(d.slug)),
    image: abs(d.image),
    description: d.shortBio,
    jobTitle: d.role,
    medicalSpecialty: d.medicalSpecialty,
    worksFor: { "@id": ORG_ID },
    knowsAbout: d.knowsAbout,
    knowsLanguage: d.languages,
    ...(d.alumniOf.length || d.training?.length
      ? { alumniOf: [...d.alumniOf, ...(d.training ?? [])].map((n) => ({ "@type": "EducationalOrganization", name: n })) }
      : {}),
    ...(d.memberOf.length ? { memberOf: d.memberOf.map((n) => ({ "@type": "Organization", name: n })) } : {}),
    ...(d.awards.length ? { award: d.awards } : {}),
    ...(d.sameAs.length ? { sameAs: d.sameAs } : {}),
    ...(d.credentials ? { hasCredential: d.credentials } : {}),
    workLocation: { "@type": "Place", name: `${SITE.name}, ${d.cities[0] ?? "India"}` },
  };
}

/** Lightweight reviewer reference node for reviewedBy on YMYL pages. */
export function reviewerNode(d: Doctor): Record<string, unknown> {
  return {
    "@type": ["Physician", "Person"],
    "@id": `${abs(doctorUrl(d.slug))}#physician`,
    name: d.name,
    url: abs(doctorUrl(d.slug)),
    jobTitle: d.role,
    ...(d.credentials ? { hasCredential: d.credentials } : {}),
  };
}

/* =====================================================================
 * CMS resolver (Wave 4.3) — map a `doctors` collection doc onto the typed
 * Doctor model the profile page + physicianSchema already consume, falling
 * back PER FIELD to the code default (doctorBySlug) so a missing/partial CMS
 * doc renders byte-identically (same convention as src/lib/services.ts and
 * src/lib/homepage.ts). Kept here because this module is already client-safe
 * (no payload / server-only import) and owns the Doctor type + DOCTORS
 * defaults. ONLY the two /doctors* routes use this; the header menu, location/
 * treatment/service consumers stay code-driven from DOCTORS.
 *
 * String-array fields are stored in the collection as arrays of `{ value }`
 * rows (uniform subfield name), so the source carries them wrapped.
 * ===================================================================== */
type ValueRow = { value?: string | null };

/** Loose source shape (decoupled from generated payload-types, like ServiceSource). */
export type DoctorSource =
  | {
      name?: string | null;
      credentials?: string | null;
      specialty?: string | null;
      medicalSpecialty?: ValueRow[] | null;
      role?: string | null;
      image?: string | null;
      photo?: UploadValue;
      experienceLabel?: string | null;
      experienceYears?: number | null;
      cities?: ValueRow[] | null;
      locations?: ValueRow[] | null;
      treatments?: ValueRow[] | null;
      shortBio?: string | null;
      bio?: ValueRow[] | null;
      knowsAbout?: ValueRow[] | null;
      alumniOf?: ValueRow[] | null;
      memberOf?: ValueRow[] | null;
      awards?: ValueRow[] | null;
      training?: ValueRow[] | null;
      publications?: ValueRow[] | null;
      languages?: ValueRow[] | null;
      sameAs?: ValueRow[] | null;
      verified?: boolean | null;
      visitsAllCentres?: boolean | null;
      navRole?: "senior-specialist" | "specialist" | null;
      navOrder?: number | null;
      profileLabels?: {
        aboutEyebrow?: string | null;
        treatmentsEyebrow?: string | null;
        consultsEyebrow?: string | null;
        consultsSubtitle?: string | null;
        visitsHeading?: string | null;
        visitsParagraph?: string | null;
        doctorSpeakEyebrow?: string | null;
        doctorSpeakSubtitle?: string | null;
        storiesEyebrow?: string | null;
        storiesSubtitle?: string | null;
        ctaHeading?: string | null;
        aboutTitle?: string | null;
        treatmentsTitle?: string | null;
        storiesTitle?: string | null;
        consultsTitle?: string | null;
        doctorSpeakTitle?: string | null;
      } | null;
    }
  | null
  | undefined;

/** Unwrap a `{ value }[]` CMS array to a string[]; `undefined` when empty. */
const rows = (a: ValueRow[] | null | undefined): string[] | undefined =>
  a && a.length ? a.map((x) => x.value ?? "") : undefined;

/**
 * Resolve a doctor: overlay the CMS `src` onto the typed code default for `slug`,
 * field-by-field. Returns `undefined` only when both slug is unknown AND src is
 * absent. Handles three cases:
 *  1. Code + DB doc   → per-field overlay (original behaviour)
 *  2. Code only       → return code default (DB not yet seeded)
 *  3. DB only         → build from src (admin-created doctor, no code entry)
 */
export function resolveDoctor(slug: string, src: DoctorSource): Doctor | undefined {
  const def = doctorBySlug(slug);
  if (!def && !src) return undefined;
  if (!src) return def!;
  if (!def) {
    // Admin-created doctor: no code entry, build entirely from the DB doc.
    return {
      slug,
      name: src.name ?? "",
      credentials: src.credentials ?? "",
      specialty: src.specialty ?? "",
      medicalSpecialty: rows(src.medicalSpecialty) ?? [],
      role: src.role ?? "",
      image: mediaUrl(src.photo) ?? src.image ?? "/assets/doctors/default.jpg",
      experienceLabel: src.experienceLabel ?? "",
      experienceYears: src.experienceYears ?? undefined,
      cities: rows(src.cities) ?? [],
      locations: rows(src.locations) ?? [],
      treatments: rows(src.treatments) ?? [],
      shortBio: src.shortBio ?? "",
      bio: rows(src.bio) ?? [],
      knowsAbout: rows(src.knowsAbout) ?? [],
      alumniOf: rows(src.alumniOf) ?? [],
      memberOf: rows(src.memberOf) ?? [],
      awards: rows(src.awards) ?? [],
      training: rows(src.training) ?? undefined,
      publications: rows(src.publications) ?? undefined,
      languages: rows(src.languages) ?? [],
      sameAs: rows(src.sameAs) ?? [],
      verified: src.verified ?? false,
      ...(src.visitsAllCentres ? { visitsAllCentres: true } : {}),
      profileLabels: profileLabels(src.profileLabels),
    };
  }
  return {
    slug: def.slug,
    name: src.name || def.name,
    credentials: src.credentials ?? def.credentials,
    specialty: src.specialty || def.specialty,
    medicalSpecialty: rows(src.medicalSpecialty) ?? def.medicalSpecialty,
    role: src.role || def.role,
    // An uploaded photo (Media picker) overrides the default path; else the
    // text path; else the code default. Lets staff swap the photo from admin.
    image: mediaUrl(src.photo) ?? (src.image || def.image),
    experienceLabel: src.experienceLabel ?? def.experienceLabel,
    experienceYears: src.experienceYears ?? def.experienceYears,
    cities: rows(src.cities) ?? def.cities,
    locations: rows(src.locations) ?? def.locations,
    treatments: rows(src.treatments) ?? def.treatments,
    shortBio: src.shortBio || def.shortBio,
    bio: rows(src.bio) ?? def.bio,
    knowsAbout: rows(src.knowsAbout) ?? def.knowsAbout,
    alumniOf: rows(src.alumniOf) ?? def.alumniOf,
    memberOf: rows(src.memberOf) ?? def.memberOf,
    awards: rows(src.awards) ?? def.awards,
    training: rows(src.training) ?? def.training,
    publications: rows(src.publications) ?? def.publications,
    languages: rows(src.languages) ?? def.languages,
    sameAs: rows(src.sameAs) ?? def.sameAs,
    verified: src.verified ?? def.verified,
    ...(((src.visitsAllCentres ?? def.visitsAllCentres) ? { visitsAllCentres: true } : {})),
    profileLabels: profileLabels(src.profileLabels),
  };
}

type ProfileLabelsSource = {
  aboutEyebrow?: string | null;
  treatmentsEyebrow?: string | null;
  consultsEyebrow?: string | null;
  consultsSubtitle?: string | null;
  visitsHeading?: string | null;
  visitsParagraph?: string | null;
  doctorSpeakEyebrow?: string | null;
  doctorSpeakSubtitle?: string | null;
  storiesEyebrow?: string | null;
  storiesSubtitle?: string | null;
  ctaHeading?: string | null;
  aboutTitle?: string | null;
  treatmentsTitle?: string | null;
  storiesTitle?: string | null;
  consultsTitle?: string | null;
  doctorSpeakTitle?: string | null;
} | null | undefined;

/** Build the `profileLabels` overrides object from CMS source — empty strings
 *  fall back to the component's built-in defaults. */
const profileLabels = (src: ProfileLabelsSource) => ({
  aboutEyebrow: src?.aboutEyebrow ?? "",
  treatmentsEyebrow: src?.treatmentsEyebrow ?? "",
  consultsEyebrow: src?.consultsEyebrow ?? "",
  consultsSubtitle: src?.consultsSubtitle ?? "",
  visitsHeading: src?.visitsHeading ?? "",
  visitsParagraph: src?.visitsParagraph ?? "",
  doctorSpeakEyebrow: src?.doctorSpeakEyebrow ?? "",
  doctorSpeakSubtitle: src?.doctorSpeakSubtitle ?? "",
  storiesEyebrow: src?.storiesEyebrow ?? "",
  storiesSubtitle: src?.storiesSubtitle ?? "",
  ctaHeading: src?.ctaHeading ?? "",
  aboutTitle: src?.aboutTitle ?? "",
  treatmentsTitle: src?.treatmentsTitle ?? "",
  storiesTitle: src?.storiesTitle ?? "",
  consultsTitle: src?.consultsTitle ?? "",
  doctorSpeakTitle: src?.doctorSpeakTitle ?? "",
});

/**
 * Produce a fully-populated DoctorSource by merging `src` with the code default
 * for `slug`. Used by the inline editor to seed the draft so every field is
 * present before any edit — prevents sparse PATCH bodies that fail Payload
 * required-field validation.
 */
export function materializeDoctorSource(slug: string, src: DoctorSource): NonNullable<DoctorSource> {
  const def = doctorBySlug(slug);
  const wrap = (arr: string[] | undefined): { value: string }[] =>
    arr ? arr.map((v) => ({ value: v })) : [];
  return {
    name: src?.name ?? def?.name ?? "",
    credentials: src?.credentials ?? def?.credentials ?? "",
    specialty: src?.specialty ?? def?.specialty ?? "",
    role: src?.role ?? def?.role ?? "",
    image: src?.image ?? def?.image ?? "",
    photo: src?.photo,
    experienceLabel: src?.experienceLabel ?? def?.experienceLabel ?? "",
    experienceYears: src?.experienceYears ?? def?.experienceYears ?? null,
    medicalSpecialty: src?.medicalSpecialty ?? wrap(def?.medicalSpecialty),
    cities: src?.cities ?? wrap(def?.cities),
    locations: src?.locations ?? wrap(def?.locations),
    treatments: src?.treatments ?? wrap(def?.treatments),
    shortBio: src?.shortBio ?? def?.shortBio ?? "",
    bio: src?.bio ?? wrap(def?.bio),
    knowsAbout: src?.knowsAbout ?? wrap(def?.knowsAbout),
    alumniOf: src?.alumniOf ?? wrap(def?.alumniOf),
    memberOf: src?.memberOf ?? wrap(def?.memberOf),
    awards: src?.awards ?? wrap(def?.awards),
    training: src?.training ?? wrap(def?.training),
    publications: src?.publications ?? wrap(def?.publications),
    languages: src?.languages ?? wrap(def?.languages),
    sameAs: src?.sameAs ?? wrap(def?.sameAs),
    verified: src?.verified ?? def?.verified ?? false,
    visitsAllCentres: src?.visitsAllCentres ?? def?.visitsAllCentres ?? false,
    navRole: src?.navRole ?? null,
    navOrder: src?.navOrder ?? null,
    profileLabels: {
      aboutEyebrow: src?.profileLabels?.aboutEyebrow ?? "",
      treatmentsEyebrow: src?.profileLabels?.treatmentsEyebrow ?? "",
      consultsEyebrow: src?.profileLabels?.consultsEyebrow ?? "",
      consultsSubtitle: src?.profileLabels?.consultsSubtitle ?? "",
      visitsHeading: src?.profileLabels?.visitsHeading ?? "",
      visitsParagraph: src?.profileLabels?.visitsParagraph ?? "",
      doctorSpeakEyebrow: src?.profileLabels?.doctorSpeakEyebrow ?? "",
      doctorSpeakSubtitle: src?.profileLabels?.doctorSpeakSubtitle ?? "",
      storiesEyebrow: src?.profileLabels?.storiesEyebrow ?? "",
      storiesSubtitle: src?.profileLabels?.storiesSubtitle ?? "",
      ctaHeading: src?.profileLabels?.ctaHeading ?? "",
      aboutTitle: src?.profileLabels?.aboutTitle ?? "",
      treatmentsTitle: src?.profileLabels?.treatmentsTitle ?? "",
      storiesTitle: src?.profileLabels?.storiesTitle ?? "",
      consultsTitle: src?.profileLabels?.consultsTitle ?? "",
      doctorSpeakTitle: src?.profileLabels?.doctorSpeakTitle ?? "",
    },
  };
}
