/* =====================================================================
 * One-time update: Dr. Deep Gajiwala + Dr. Suman Singh → Sanity
 * Uses doctor-provided data from their intake forms (June 2026).
 * Idempotent — uses createOrReplace with the same deterministic _id.
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> npx tsx --tsconfig tsconfig.json scripts/update-doctors-deep-suman.mts
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const ALL_TREATMENT_SLUGS = [
  "ivf","icsi","iui","embryo-freezing","sperm-freezing","egg-freezing",
  "blastocyst-transfer","laser-hatching","era-test","pgt","imsi","picsi",
  "macs","spindle-view-icsi","surgical-sperm-retrieval","azoospermia",
  "oligospermia","asthenospermia","varicocele","erectile-dysfunction",
  "pcos","endometriosis","fibroids","ovarian-reserve","ovarian-rejuvenation",
  "conceive-naturally","prp-infertility","cryopreservation","egg-donation",
  "sperm-donation","embryo-donation","surrogacy",
];

const DEEP: Record<string, unknown> = {
  _id: "doctor-deep-gajiwala",
  _type: "doctor",
  slug: "deep-gajiwala",
  name: "Dr. Deep Gajiwala",
  credentials: "MBBS, DGO, DNB, FMAS, MNAMS",
  specialty: "IVF & Laparoscopic Surgery",
  role: "Centre Head, Bavishi Fertility Institute, Surat",
  imageUrl: "/assets/doctors/dr-deep-gajiwala.png",
  experienceLabel: "12+ yrs",
  experienceYears: 12,
  cities: ["Surat"],
  locations: ["lal-darwaja"],
  treatments: ALL_TREATMENT_SLUGS,
  languages: ["Hindi", "English", "Gujarati", "Marathi", "Telugu"],
  shortBio:
    "Centre Head at Bavishi Fertility Institute Surat with 12+ years of experience in IVF and laparoscopic surgery, 4,000+ C-sections, and 1,000+ IVF procedures.",
  bio: [
    "Dr. Deep Gajiwala is the Centre Head at Bavishi Fertility Institute, Surat, and a specialist in IVF and advanced laparoscopic surgery with over 12 years of experience in Obstetrics & Gynaecology.",
    "He has performed 4,000+ Caesarean Sections, 3,000+ Hysterectomies, 2,000+ Minimal Access Surgeries, and over 1,000 IVF-related procedures including Ovum Pick-Up and Embryo Transfers. He also successfully managed the surgical removal of a 15 kg ovarian tumour.",
    "Dr. Gajiwala holds an FMAS from the Association of Minimal Access Surgeons of India (AMASI), an MNAMS from the National Academy of Medical Sciences, and a Fellowship in Reproductive Endocrinology (FRM). He consults Monday to Saturday, 10 AM to 7 PM at the Surat centre.",
    "His philosophy: \"Listen first. Treat ethically. Never stop learning.\" He is committed to evidence-based, individualised fertility care with full transparency and compassion at every step.",
  ],
  knowsAbout: [
    "Individualised IVF Protocols",
    "Fertility-Enhancing Minimal Access Surgery",
    "Male Factor Infertility",
    "Recurrent Implantation Failure",
    "Fertility Preservation",
    "Advanced Laparoscopic Surgery",
    "Customised Ovarian Stimulation Protocols",
    "Ovum Pick-Up and Embryo Transfer",
    "Hysteroscopy",
  ],
  alumniOf: [
    "MBBS — DYP Medical College and Hospital, Kolhapur (2010)",
    "DGO — Krishna Institute of Medical Sciences (2013)",
    "DNB, Obstetrics & Gynaecology — Rural Development Trust Hospital, Anantapur, AP / National Board of Examinations, Delhi (2015)",
    "FMAS — Association of Minimal Access Surgeons of India, AMASI (2017)",
    "Fellowship in Reproductive Endocrinology (FRM) — (2018)",
    "MNAMS — National Academy of Medical Sciences (2019)",
  ],
  memberOf: [
    "Indian Medical Association (IMA)",
    "Surat Obstetrics and Gynaecological Society (SOGS) — Executive Committee Member",
    "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
    "Indian Society for Assisted Reproduction (ISAR)",
    "Indian Fertility Society (IFS)",
  ],
  awards: [
    "4,000+ Caesarean Sections performed",
    "3,000+ Hysterectomies performed",
    "2,000+ Minimal Access Surgeries",
    "1,000+ IVF-related procedures (OPU, Embryo Transfers, Fertility Preservation)",
    "Surgical removal of 15 kg ovarian tumour",
    "Executive Committee Member, Surat Obstetric & Gynaecological Society (SOGS)",
    "Director, ANSH Hospital, Surat",
    "Speaker at SOGS, ISAR, FOGSI and regional CMEs on reproductive medicine",
  ],
  training: [
    "FMAS — Fellowship in Minimal Access Surgery, Association of Minimal Access Surgeons of India (AMASI) (2017)",
    "Fellowship in Reproductive Endocrinology / Reproductive Medicine (FRM) (2018)",
    "MNAMS — Member, National Academy of Medical Sciences (2019)",
  ],
  publications: [],
  sameAs: [
    "https://www.instagram.com/dr.deepgajiwala/",
    "https://www.facebook.com/drdeepgajiwala/",
    "https://in.linkedin.com/in/ronitdeep",
    "https://www.youtube.com/@drdeepgajiwala",
    "https://drdeepg.com",
  ],
  verified: true,
  navRole: "specialist",
  navOrder: 10,
};

const SUMAN: Record<string, unknown> = {
  _id: "doctor-suman-singh",
  _type: "doctor",
  slug: "suman-singh",
  name: "Dr. Suman Singh",
  credentials: "MBBS, DGO, FRM",
  specialty: "Gynaecologist & IVF Specialist",
  role: "Senior Fertility Consultant",
  imageUrl: "/assets/doctors/Dr.-Suman-Singh.webp",
  experienceLabel: "20+ yrs",
  experienceYears: 20,
  cities: ["Mumbai"],
  locations: ["thane", "ghatkopar"],
  treatments: ALL_TREATMENT_SLUGS,
  languages: ["Hindi", "English", "Marathi"],
  shortBio:
    "Senior Fertility Consultant with 20+ years of experience at the Thane and Ghatkopar centres, specialising in poor ovarian reserve, thin endometrium, PCOS, and recurrent implantation failure.",
  bio: [
    "Dr. Suman Singh is a Senior Fertility Consultant and Gynaecologist with over 20 years of experience in IVF and reproductive medicine, consulting at the Thane and Ghatkopar centres of Bavishi Fertility Institute.",
    "She holds a Fellowship in Reproductive Medicine from D Y Patil University, Navi Mumbai, a Certification in Clinical Embryology (EART-UK), and completed advanced training (FRM) at Kiel, Germany. She is a member of TOGS and ISAR.",
    "Dr. Singh specialises in COSP for poor ovarian reserve, thin endometrium management including Asherman Syndrome, Adenomyosis & Endometriosis, PCOS, Severe Oligozoospermia, and Recurrent Implantation Failure. She has presented at ISAR, INSTAR and CME TOGS.",
    "\"Reproductive medicine has always been an area of my interest and passion. It brings me immense professional and personal satisfaction to help build families and bring happiness to couples.\" — Dr. Suman Singh",
  ],
  knowsAbout: [
    "Poor Ovarian Reserve & COSP",
    "Thin Endometrium & Asherman Syndrome",
    "Adenomyosis & Endometriosis",
    "PCOS",
    "Severe Oligozoospermia",
    "Recurrent Implantation Failure",
    "Customised IVF Protocols",
    "Fresh vs Frozen Embryo Transfer",
  ],
  alumniOf: [
    "MBBS — Rajendra Institute of Medical Sciences (RIMS), Ranchi (1998)",
    "DGO — Rajendra Institute of Medical Sciences (RIMS), Ranchi (2004)",
    "Fellowship in Reproductive Medicine — D Y Patil University, Navi Mumbai (2016)",
    "Certification in Clinical Embryology — EART-UK",
    "Advanced Observership in Reproductive Medicine (FRM) — Kiel, Germany",
  ],
  memberOf: [
    "Thane Obstetrics and Gynaecological Society (TOGS)",
    "Indian Society for Assisted Reproduction (ISAR)",
  ],
  awards: [],
  training: [
    "Fellowship in Reproductive Medicine — D Y Patil University, Navi Mumbai (2016)",
    "Certification in Clinical Embryology — EART-UK",
    "Advanced Observership in Reproductive Medicine (FRM) — Kiel, Germany",
  ],
  publications: [
    "Speaker — ISAR & INSTAR: \"Fresh vs Frozen ET: A Comparative Study\"",
    "CME Speaker — TOGS: Male Infertility",
  ],
  sameAs: [],
  verified: true,
  navRole: "specialist",
  navOrder: 11,
};

async function main() {
  console.log("Updating Dr. Deep Gajiwala…");
  await sanity.createOrReplace(DEEP);
  console.log("  ✓ doctor.deep-gajiwala written");

  await new Promise((r) => setTimeout(r, 300));

  console.log("Updating Dr. Suman Singh…");
  await sanity.createOrReplace(SUMAN);
  console.log("  ✓ doctor.suman-singh written");

  console.log("\nDone. Revalidating doctor cache…");
  const revalidateUrl = "https://ivfclinic.com/api/revalidate?secret=bfi-revalidate-9x7k2&tags=sanity-doctors";
  try {
    const res = await fetch(revalidateUrl, { method: "POST" });
    console.log(`  revalidate → ${res.status}`);
  } catch (e) {
    console.log(`  revalidate failed (can retry manually): ${e}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
