/* =====================================================================
 * Location architecture — fully data-driven (cities + centres)
 * ---------------------------------------------------------------------
 * Mirrors the treatment + doctor architecture: data objects drive two
 * reusable templates (CityPage, CenterPage) rendered by two dynamic routes
 * (/locations/[city], /locations/[city]/[center]) via generateStaticParams.
 *
 * A new city or centre = one object here. No bespoke route, no bespoke page
 * component. Relationships City ↔ Centre ↔ Doctor ↔ Treatment are expressed
 * as slug references and resolved into real internal links + schema.
 *
 * `built` gates page generation so unfinished cities/centres don't ship thin
 * pages — flip to true once the data below is complete for that location.
 * ===================================================================== */

import { ORG_ID, WEBSITE_ID, abs, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { doctorBySlug, physicianSchema, doctorUrl } from "@/lib/doctors";
import { treatmentRef } from "@/lib/treatments";
import { getReviews, reviewNodes } from "@/lib/reviews";

export type FAQ = { q: string; a: string };

export type Centre = {
  slug: string;
  citySlug: string;
  name: string;            // short, e.g. "Paldi"
  fullName: string;        // "Bavishi Fertility Institute — Paldi, Ahmedabad"
  isHeadOffice?: boolean;
  area: string;
  address: string;
  pin: string;
  phone: string;           // tel digits
  phoneLabel: string;      // display
  hours: string;           // display
  opening: { opens: string; closes: string; days?: string[] };
  geo?: { lat: number; lng: number };
  mapQuery: string;
  image: string;
  /** Optional Google Maps "Embed a map" src (maps/embed?pb=...) for a 360°
   *  panorama. When set, the hero shows this 360° view instead of image. */
  hero360Url?: string;
  nearby: string[];        // areas served (local SEO)
  landmarks: string[];
  howToReach: string[];
  facilities: string[];
  doctors: string[];       // doctor slugs
  treatments: string[];    // treatment slugs
  faqs: FAQ[];
  reviewsKey?: string;     // review cache key (defaults to slug) → review feed
  sameAs?: string[];       // verified listing URL(s)
  intro: string;
  gallery: { src: string; alt: string }[];
  /** Keys into WOMENS_HEALTH_SERVICES (src/lib/womens-health.ts) — women's
   *  health & maternity services offered here. Drives <AvailableServicesSection>;
   *  omit/empty to hide the section. */
  womensHealth?: string[];
  built: boolean;
};

export type City = {
  slug: string;
  name: string;
  region: string;          // state
  country: string;
  helpline: string;
  helplineLabel: string;
  whatsapp: string;
  heroImage: string;
  /** Optional Google Maps "Embed a map" src (maps/embed?pb=...) for a 360°
   *  panorama. When set, the hero shows this 360° view instead of heroImage. */
  hero360Url?: string;
  intro: string[];
  faqs: FAQ[];
  /** Keys into WOMENS_HEALTH_SERVICES — women's health & maternity services
   *  available across this city's centres. Drives <AvailableServicesSection>. */
  womensHealth?: string[];
  built: boolean;
};

/* ---------- URLs ---------- */
export const cityUrl = (slug: string) => `/locations/${slug}`;
export const centreUrl = (citySlug: string, slug: string) => `/locations/${citySlug}/${slug}`;
export const centreMapUrl = (c: Centre) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`;

/** Women's health & maternity services offered at all Ahmedabad centres.
 *  Values are keys into WOMENS_HEALTH_SERVICES (src/lib/womens-health.ts).
 *  Kept as plain strings (not icon objects) so City/Centre data stays
 *  serialisable across the server→client boundary. */
const AHMEDABAD_WOMENS_HEALTH = [
  "3d-4d-sonography",
  "painless-delivery",
  "normal-delivery",
  "fetal-medicine",
  "high-risk-pregnancy-care",
  "twin-pregnancy-care",
];

const sharedGallery = (area: string): { src: string; alt: string }[] => [
  { src: "/assets/about-clinic.jpg", alt: `Bavishi Fertility Institute ${area} — treatment room` },
  { src: "/assets/hero-mother-baby.jpg", alt: `Bavishi Fertility Institute ${area} — parenthood journey` },
  { src: "/assets/suraksha-parenthood.png", alt: `Bavishi Fertility Institute ${area} — Suraksha Kavach care` },
];

/* =====================================================================
 * CENTRES
 * ===================================================================== */

export const CENTRES: Centre[] = [
  {
    slug: "paldi",
    citySlug: "ahmedabad",
    name: "Paldi",
    fullName: "Bavishi Fertility Institute — Paldi, Ahmedabad",
    isHeadOffice: true,
    area: "Paldi",
    address: "Opp. Manjulal Municipal Garden, next to Adani CNG & Orion Complex, Paldi Cross Roads, Paldi, Ahmedabad – 380007",
    pin: "380007",
    phone: "919712622288",
    phoneLabel: "+91 97126 22288",
    hours: "Mon–Sat · 9:00 am – 7:00 pm",
    opening: { opens: "09:00", closes: "19:00" },
    geo: { lat: 23.0130822, lng: 72.5639069 },
    mapQuery: "Bavishi Fertility Institute Paldi Ahmedabad",
    image: "/assets/centres/paldi-building.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725289034!6m8!1m7!1sCAoSHENJQUJJaEFEeWM1VXZ6ZGI4R2U4cTNVQUFmWWI.!2m2!1d23.01327543356341!2d72.56405585909516!3f43.197350683590116!4f-11.407427687968791!5f0.4000000000000002",
    nearby: ["Paldi", "Vasna", "Ambawadi", "Ellisbridge", "Vejalpur", "Maninagar", "Navrangpura", "Sarkhej", "Jivraj Park", "Anandnagar", "Shreyas", "Bhatta", "Law Garden", "C.G. Road", "Manekbaug", "Sabarmati"],
    landmarks: [
      "Opposite Manjulal Municipal Garden",
      "Next to Adani CNG pump & Orion Complex",
      "At Paldi Cross Roads (Paldi Char Rasta)",
      "Near Bhatta and Ellisbridge",
    ],
    howToReach: [
      "Located right at Paldi Cross Roads in west Ahmedabad, easily reached from Ellisbridge, Vasna and Ambawadi.",
      "About 8 km from Ahmedabad Junction (Kalupur) railway station and roughly 12 km from Sardar Vallabhbhai Patel International Airport.",
      "Well served by AMTS/BRTS bus routes along Paldi; on-street and complex parking available nearby.",
    ],
    facilities: [
      "Class 1000 embryology & IVF lab",
      "Andrology & semen-analysis lab",
      "In-house diagnostics & sonography",
      "Day-care operation theatre",
      "Counselling & nutrition suites",
      "Pharmacy & sample collection",
    ],
    doctors: ["himanshu-bavishi", "falguni-bavishi", "parth-bavishi", "janki-bavishi"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation", "pgt"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Paldi IVF centre?", a: "It is at Paldi Cross Roads — opposite Manjulal Municipal Garden, next to Adani CNG & Orion Complex, Paldi, Ahmedabad – 380007. This is Bavishi Fertility Institute's head office and flagship lab, established in 1984." },
      { q: "What are the timings at the Paldi centre?", a: "The Paldi centre is open Monday to Saturday, 9:00 am to 7:00 pm. Appointments are recommended; call +91 97126 22288 to book." },
      { q: "Which areas does the Paldi centre serve?", a: "Paldi conveniently serves patients from Paldi, Vasna, Ambawadi, Ellisbridge, Vejalpur and Maninagar, as well as families travelling from across Ahmedabad and Gujarat." },
      { q: "What facilities are available at Paldi?", a: "A Class 1000 embryology & IVF lab, andrology lab, in-house diagnostics and sonography, a day-care operation theatre, counselling and nutrition suites, and an on-site pharmacy — everything under one roof." },
      { q: "Why choose the Paldi centre for IVF?", a: "As the flagship head office, Paldi offers the institute's most advanced lab, senior promoter doctors and four decades of experience — combined with transparent pricing, EMI options and the Suraksha Kavach package." },
    ],
    sameAs: [],
    intro:
      "Paldi is where Bavishi Fertility Institute began in 1984 — and remains our flagship head office. This centre houses our most advanced Class 1000 embryology lab, senior promoter doctors and the full spectrum of fertility services under one roof, in the heart of west Ahmedabad.",
    gallery: [
      { src: "/assets/centres/paldi-ot.webp", alt: "Bavishi Fertility Institute Paldi — operation theatre & advanced equipment" },
      { src: "/assets/centres/paldi-reception.webp", alt: "Bavishi Fertility Institute Paldi — reception & front desk" },
      { src: "/assets/centres/paldi-nicu.webp", alt: "Bavishi Fertility Institute Paldi — neonatal / newborn care room" },
      { src: "/assets/centres/paldi-waiting.webp", alt: "Bavishi Fertility Institute Paldi — patient waiting lounge" },
      { src: "/assets/centres/paldi-building.png", alt: "Bavishi Fertility Institute Paldi — main building, Ahmedabad" },
    ],
    womensHealth: AHMEDABAD_WOMENS_HEALTH,
    built: true,
  },
  {
    slug: "sindhu-bhavan-road",
    citySlug: "ahmedabad",
    name: "Sindhu Bhavan Road",
    fullName: "Bavishi Fertility Institute — Sindhu Bhavan Road, Ahmedabad",
    area: "Sindhu Bhavan Road",
    address: "SF-213, Stellar, Sindhu Bhavan Marg, near Pakvan Cross Roads, Bodakdev, Ahmedabad – 380059",
    pin: "380059",
    phone: "919712622288",
    phoneLabel: "+91 97126 22288",
    hours: "Mon–Sat · 10:30 am – 7:00 pm",
    opening: { opens: "10:30", closes: "19:00" },
    geo: { lat: 23.039814, lng: 72.5085954 },
    mapQuery: "Bavishi Fertility Institute Sindhu Bhavan Road Bodakdev Ahmedabad",
    image: "/assets/Locations/sindhu-bhavan-road.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725567586!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ3gwOUxSdndF!2m2!1d23.0400269079204!2d72.50749736340882!3f5.556150793257643!4f-2.3088572008204125!5f0.4000000000000002",
    nearby: ["Bodakdev", "Thaltej", "Sindhu Bhavan Road", "S.G. Highway", "Science City", "Shilaj", "Satellite", "Vastrapur", "Bopal", "South Bopal", "Jodhpur", "Prahlad Nagar", "Sola", "Ghuma", "Shela", "Gota"],
    landmarks: [
      "On Sindhu Bhavan Marg (SF-213, Stellar)",
      "Near Pakvan Cross Roads, Bodakdev",
      "Close to S.G. Highway and the Science City corridor",
    ],
    howToReach: [
      "Set on the fast-growing Sindhu Bhavan Road corridor in west Ahmedabad, minutes from S.G. Highway and Thaltej.",
      "Roughly 12 km from Sardar Vallabhbhai Patel International Airport and well connected by BRTS along S.G. Highway.",
      "Ample parking at Stellar; easy access from Bodakdev, Thaltej and Shilaj.",
    ],
    facilities: [
      "Modern IVF & embryology lab",
      "Consultation & counselling rooms",
      "Sonography & diagnostics",
      "Minor procedure room",
      "Comfortable patient lounge",
      "On-site pharmacy",
    ],
    doctors: ["himanshu-bavishi", "falguni-bavishi", "parth-bavishi"],
    treatments: ["ivf", "icsi", "iui", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Sindhu Bhavan Road centre?", a: "At SF-213, Stellar, Sindhu Bhavan Marg, near Pakvan Cross Roads, Bodakdev, Ahmedabad – 380059 — minutes from S.G. Highway." },
      { q: "What are the timings at the Sindhu Bhavan Road centre?", a: "Monday to Saturday, 10:30 am to 7:00 pm. Appointments are recommended." },
      { q: "Which areas does this centre serve?", a: "Bodakdev, Thaltej, Sindhu Bhavan Road, the S.G. Highway corridor, Science City and Shilaj." },
    ],
    sameAs: [],
    intro:
      "Our Sindhu Bhavan Road centre brings Bavishi Fertility Institute's world-class fertility care to west Ahmedabad's fast-growing SG Highway corridor. Conveniently located in Bodakdev near Pakvan Cross Roads, it offers complete IVF, IUI and infertility services with the same senior-doctor expertise as our flagship.",
    gallery: sharedGallery("Sindhu Bhavan Road"),
    womensHealth: AHMEDABAD_WOMENS_HEALTH,
    built: true,
  },
  {
    slug: "nikol",
    citySlug: "ahmedabad",
    name: "Nikol",
    fullName: "Bavishi Fertility Institute — Nikol, Ahmedabad",
    area: "Nikol",
    address: "Hill Town Plaza, 501, near Amar Jawan Circle, Nikol, Ahmedabad – 380049",
    pin: "380049",
    phone: "919227114040",
    phoneLabel: "+91 92271 14040",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
    geo: { lat: 23.0589329, lng: 72.6718737 },
    mapQuery: "Bavishi Fertility Institute Nikol Ahmedabad",
    image: "/assets/Locations/Nikol.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725518611!6m8!1m7!1sCAoSHENJQUJJaEFEeWRFUjVDMW5mbWZ3cl9jQUN2LWQ.!2m2!1d23.03844289770396!2d72.67736438105196!3f314.70074497333246!4f-4.973502490379573!5f0.4000000000000002",
    nearby: ["Nikol", "Naroda", "Vastral", "Odhav", "New India Colony", "Kathwada", "Bapunagar", "Thakkarbapanagar", "CTM", "Ramol", "Hathijan", "Kubernagar", "Sardarnagar", "India Colony", "Viratnagar"],
    landmarks: [
      "At Hill Town Plaza, 501",
      "Near Amar Jawan Circle, Nikol",
      "Close to Nikol–Naroda Road",
    ],
    howToReach: [
      "Located at Hill Town Plaza near Amar Jawan Circle, serving east Ahmedabad — Nikol, Naroda, Vastral and Odhav.",
      "Easily reached via the Nikol–Naroda road and nearby BRTS connections.",
      "On-site parking available at Hill Town Plaza.",
    ],
    facilities: [
      "IVF & fertility consultation",
      "Diagnostics & sonography",
      "Counselling rooms",
      "Sample collection",
      "Comfortable waiting area",
      "Easy parking access",
    ],
    doctors: ["parth-bavishi", "janki-bavishi"],
    treatments: ["ivf", "iui", "male-infertility"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Nikol centre?", a: "At Hill Town Plaza, 501, near Amar Jawan Circle, Nikol, Ahmedabad – 380049, serving east Ahmedabad." },
      { q: "What are the timings at the Nikol centre?", a: "Monday to Saturday, 10:00 am to 7:00 pm. Call +91 92271 14040 to book." },
      { q: "Which areas does the Nikol centre serve?", a: "Nikol, Naroda, Vastral, Odhav, New India Colony and Kathwada in east Ahmedabad." },
    ],
    sameAs: [],
    intro:
      "The Nikol centre extends Bavishi Fertility Institute's trusted fertility care to east Ahmedabad. Located at Hill Town Plaza near Amar Jawan Circle, it makes expert IVF, IUI and infertility evaluation easily accessible for families across Nikol, Naroda and the surrounding neighbourhoods.",
    gallery: sharedGallery("Nikol"),
    womensHealth: AHMEDABAD_WOMENS_HEALTH,
    built: true,
  },

  /* ===================================================================
   * MUMBAI — 5 centres (Ghatkopar, Thane, Vile Parle, Borivali, Vashi)
   * =================================================================== */
  {
    slug: "ghatkopar",
    citySlug: "mumbai",
    name: "Ghatkopar",
    fullName: "Bavishi Fertility Institute — Ghatkopar, Mumbai",
    area: "Ghatkopar",
    address: "2nd Floor, Vallabh Vihar CHS, Mahatma Gandhi Rd, opp. Kotak Mahindra Bank, Ghatkopar East, Mumbai – 400077",
    pin: "400077",
    phone: "919328190146",
    phoneLabel: "+91 93281 90146",
    hours: "Mon–Sat · 9:00 am – 9:00 pm",
    opening: { opens: "09:00", closes: "21:00" },
    mapQuery: "Bavishi Fertility Institute Ghatkopar Mumbai",
    image: "/assets/Locations/Ghatkopar.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725760082!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHlrdE9iX2dF!2m2!1d19.07851750759122!2d72.90374191572629!3f331.0839116483176!4f-6.84920058783446!5f0.4000000000000002",
    nearby: ["Ghatkopar East", "Ghatkopar West", "Vikhroli", "Kurla", "Chembur", "Mulund", "Bhandup", "Powai", "Vidyavihar", "Sion", "Kanjurmarg", "Tilak Nagar", "Pant Nagar", "Asalpha"],
    landmarks: [
      "Opposite Kotak Mahindra Bank",
      "On Mahatma Gandhi Road, Ghatkopar East",
      "Near Ghatkopar railway & metro station",
    ],
    howToReach: [
      "Located on M.G. Road in Ghatkopar East, just minutes from Ghatkopar station — an interchange for the Central Line and Metro Line 1.",
      "Well connected via LBS Marg and the Eastern Express Highway, with easy access from Kurla, Vikhroli and Powai.",
      "Paid parking is available nearby in Ghatkopar East.",
    ],
    facilities: [
      "Class 1000 embryology & IVF lab",
      "Andrology & semen-analysis lab",
      "In-house diagnostics & sonography",
      "Day-care operation theatre",
      "Counselling & nutrition suites",
      "Pharmacy & sample collection",
    ],
    doctors: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation", "pgt"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Ghatkopar IVF centre?", a: "It is on the 2nd floor of Vallabh Vihar CHS, Mahatma Gandhi Road, opposite Kotak Mahindra Bank, Ghatkopar East, Mumbai – 400077 — minutes from Ghatkopar station." },
      { q: "What are the timings at the Ghatkopar centre?", a: "The Ghatkopar centre is open Monday to Saturday, 9:00 am to 9:00 pm. Appointments are recommended; call +91 93281 90146 to book." },
      { q: "Which areas does the Ghatkopar centre serve?", a: "Ghatkopar, Vikhroli, Kurla, Chembur, Mulund, Bhandup, Powai and the surrounding central and eastern Mumbai suburbs." },
      { q: "What facilities are available at Ghatkopar?", a: "A Class 1000 embryology & IVF lab, andrology lab, in-house diagnostics and sonography, a day-care operation theatre, counselling suites and an on-site pharmacy — complete fertility care under one roof." },
    ],
    sameAs: [],
    intro:
      "Our Ghatkopar centre is Bavishi Fertility Institute's flagship facility in Mumbai, bringing four decades of fertility expertise to the city's central and eastern suburbs. Conveniently located on M.G. Road opposite Kotak Mahindra Bank — minutes from Ghatkopar station — it offers the full spectrum of IVF, ICSI, IUI and infertility care under one roof.",
    gallery: sharedGallery("Ghatkopar"),
    built: true,
  },
  {
    slug: "thane",
    citySlug: "mumbai",
    name: "Thane",
    fullName: "Bavishi Fertility Institute — Thane, Mumbai",
    area: "Thane",
    address: "Bapat Urology Center, A.K. Vaidya Marg, near Paramarth Niketan Bus Stop & Prashant Corner, Panch Pakhdi, Thane West – 400602",
    pin: "400602",
    phone: "919167204018",
    phoneLabel: "+91 91672 04018",
    hours: "Mon–Sat · 10:00 am – 1:00 pm",
    opening: { opens: "10:00", closes: "13:00" },
    mapQuery: "Bavishi Fertility Institute Thane West",
    image: "/assets/Locations/Thane.png",
    nearby: ["Thane West", "Thane East", "Panch Pakhdi", "Naupada", "Ghodbunder Road", "Wagle Estate", "Kopri", "Majiwada", "Vartak Nagar", "Mulund", "Kalwa", "Mumbra"],
    landmarks: [
      "At Bapat Urology Center, A.K. Vaidya Marg",
      "Near Paramarth Niketan Bus Stop & Prashant Corner",
      "In Panch Pakhdi, Thane West",
    ],
    howToReach: [
      "Set in Panch Pakhdi, the heart of Thane West, easily reached from Thane station and the Ghodbunder Road corridor.",
      "Well connected to Mulund, Wagle Estate and Naupada via A.K. Vaidya Marg and Eastern Express Highway.",
      "Auto-rickshaws and buses stop nearby at Paramarth Niketan; parking available close by.",
    ],
    facilities: [
      "IVF & fertility consultation",
      "Diagnostics & sonography",
      "Andrology & semen analysis",
      "Counselling rooms",
      "Sample collection",
      "Comfortable patient lounge",
    ],
    doctors: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Thane centre?", a: "At Bapat Urology Center, A.K. Vaidya Marg, near Paramarth Niketan Bus Stop, Panch Pakhdi, Thane West – 400602 — close to Thane station." },
      { q: "What are the timings at the Thane centre?", a: "The Thane centre runs consultations Monday to Saturday, 10:00 am to 1:00 pm. Please call +91 91672 04018 to book your slot." },
      { q: "Which areas does the Thane centre serve?", a: "Thane West, Thane East, Panch Pakhdi, Naupada, the Ghodbunder Road corridor, Wagle Estate, Mulund and Kalwa." },
    ],
    sameAs: [],
    intro:
      "Our Thane centre makes Bavishi Fertility Institute's trusted fertility care accessible to families across Thane and the Ghodbunder Road corridor. Located at Bapat Urology Center in Panch Pakhdi, it offers expert IVF, IUI and infertility consultation backed by our Mumbai team and advanced laboratories.",
    gallery: sharedGallery("Thane"),
    built: true,
  },
  {
    slug: "vile-parle",
    citySlug: "mumbai",
    name: "Vile Parle",
    fullName: "Bavishi Fertility Institute — Vile Parle, Mumbai",
    area: "Vile Parle",
    address: "Swami Vivekananda Rd, Navpada, Irla, Vile Parle West, Mumbai – 400056",
    pin: "400056",
    phone: "919167204019",
    phoneLabel: "+91 91672 04019",
    hours: "Mon–Sat · 2:00 pm – 5:00 pm",
    opening: { opens: "14:00", closes: "17:00" },
    mapQuery: "Bavishi Fertility Institute Vile Parle West Mumbai",
    image: "/assets/about-clinic.jpg",
    nearby: ["Vile Parle West", "Vile Parle East", "Andheri", "Santacruz", "Juhu", "Khar", "Jogeshwari", "Goregaon", "Vidyanagari", "Bandra"],
    landmarks: [
      "On Swami Vivekananda (S.V.) Road, Irla",
      "In Navpada, Vile Parle West",
      "Near Vile Parle railway & metro station",
    ],
    howToReach: [
      "Located on S.V. Road in Irla, Vile Parle West — minutes from Vile Parle station on the Western Line and Metro Line 1.",
      "Easily reached from Andheri, Santacruz, Juhu and Khar along S.V. Road and the Western Express Highway.",
      "Close to Mumbai's domestic & international airports for out-station patients.",
    ],
    facilities: [
      "IVF & fertility consultation",
      "Diagnostics & sonography",
      "Andrology & semen analysis",
      "Counselling rooms",
      "Sample collection",
      "Comfortable patient lounge",
    ],
    doctors: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Vile Parle centre?", a: "On Swami Vivekananda Road, Navpada, Irla, Vile Parle West, Mumbai – 400056 — minutes from Vile Parle station and close to the airport." },
      { q: "What are the timings at the Vile Parle centre?", a: "The Vile Parle centre runs consultations Monday to Saturday, 2:00 pm to 5:00 pm. Call +91 91672 04019 to book." },
      { q: "Which areas does the Vile Parle centre serve?", a: "Vile Parle, Andheri, Santacruz, Juhu, Khar, Jogeshwari and the western Mumbai suburbs." },
    ],
    sameAs: [],
    intro:
      "Our Vile Parle centre brings Bavishi Fertility Institute's fertility expertise to Mumbai's western suburbs. Conveniently located on S.V. Road in Irla — close to Vile Parle station and the airport — it offers expert IVF, IUI and infertility consultation for families across Andheri, Santacruz and Juhu.",
    gallery: sharedGallery("Vile Parle"),
    built: true,
  },
  {
    slug: "borivali",
    citySlug: "mumbai",
    name: "Borivali",
    fullName: "Bavishi Fertility Institute — Borivali, Mumbai",
    area: "Borivali",
    address: "M.M. Medical Center Ankur, near Mary Immaculate School, L.M. Road, Shivaji Nagar, Borivali West, Mumbai – 400092",
    pin: "400092",
    phone: "919167204019",
    phoneLabel: "+91 91672 04019",
    hours: "Mon–Sat · 10:00 am – 1:00 pm",
    opening: { opens: "10:00", closes: "13:00" },
    mapQuery: "Bavishi Fertility Institute Borivali West Mumbai",
    image: "/assets/Locations/Borivali.png",
    nearby: ["Borivali West", "Borivali East", "Dahisar", "Kandivali", "Mandapeshwar", "Shimpoli", "IC Colony", "Gorai", "Charkop", "Malad"],
    landmarks: [
      "At M.M. Medical Center Ankur, L.M. Road",
      "Near Mary Immaculate School, Shivaji Nagar",
      "In Borivali West",
    ],
    howToReach: [
      "Located on L.M. Road in Shivaji Nagar, Borivali West — easily reached from Borivali station on the Western Line.",
      "Well connected to Dahisar, Kandivali and Malad via the Western Express Highway and Link Road.",
      "Auto-rickshaws available from Borivali station; parking nearby.",
    ],
    facilities: [
      "IVF & fertility consultation",
      "Diagnostics & sonography",
      "Andrology & semen analysis",
      "Counselling rooms",
      "Sample collection",
      "Comfortable patient lounge",
    ],
    doctors: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Borivali centre?", a: "At M.M. Medical Center Ankur, near Mary Immaculate School, L.M. Road, Shivaji Nagar, Borivali West, Mumbai – 400092 — close to Borivali station." },
      { q: "What are the timings at the Borivali centre?", a: "The Borivali centre runs consultations Monday to Saturday, 10:00 am to 1:00 pm. Call +91 91672 04019 to book." },
      { q: "Which areas does the Borivali centre serve?", a: "Borivali, Dahisar, Kandivali, Mandapeshwar, Gorai, Charkop and the north-western Mumbai suburbs." },
    ],
    sameAs: [],
    intro:
      "Our Borivali centre extends Bavishi Fertility Institute's trusted fertility care to Mumbai's north-western suburbs. Located at M.M. Medical Center Ankur on L.M. Road, Shivaji Nagar, it offers expert IVF, IUI and infertility consultation for families across Borivali, Dahisar and Kandivali.",
    gallery: sharedGallery("Borivali"),
    built: true,
  },
  {
    slug: "vashi",
    citySlug: "mumbai",
    name: "Vashi",
    fullName: "Bavishi Fertility Institute — Vashi, Navi Mumbai",
    area: "Vashi",
    address: "Precision Super Speciality Clinic & Diagnostics, 52/53, 3rd Floor, Mahavir Centre, above Hotel Golden Punjab, Sector 17, Vashi, Navi Mumbai – 400703",
    pin: "400703",
    phone: "919687004268",
    phoneLabel: "+91 96870 04268",
    hours: "Tue, Thu & Sat · 3:00 pm – 5:00 pm",
    opening: { opens: "15:00", closes: "17:00", days: ["Tuesday", "Thursday", "Saturday"] },
    mapQuery: "Bavishi Fertility Institute Vashi Navi Mumbai",
    image: "/assets/Locations/Vashi.png",
    nearby: ["Vashi", "Nerul", "Belapur", "Kharghar", "Sanpada", "Turbhe", "Koparkhairane", "Airoli", "Ghansoli", "Panvel", "Seawoods"],
    landmarks: [
      "At Precision Super Speciality Clinic, Mahavir Centre",
      "Above Hotel Golden Punjab, Sector 17",
      "In Vashi, Navi Mumbai",
    ],
    howToReach: [
      "Located at Mahavir Centre, Sector 17, Vashi — minutes from Vashi station on the Harbour Line.",
      "Easily reached from Nerul, Belapur, Kharghar and Sanpada via Palm Beach Road and the Sion–Panvel Highway.",
      "Ample parking available around Sector 17.",
    ],
    facilities: [
      "IVF & fertility consultation",
      "Diagnostics & sonography",
      "Andrology & semen analysis",
      "Counselling rooms",
      "Sample collection",
      "Comfortable patient lounge",
    ],
    doctors: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Vashi centre?", a: "At Precision Super Speciality Clinic, 3rd Floor, Mahavir Centre, above Hotel Golden Punjab, Sector 17, Vashi, Navi Mumbai – 400703." },
      { q: "What are the timings at the Vashi centre?", a: "The Vashi centre runs consultations on Tuesday, Thursday and Saturday, 3:00 pm to 5:00 pm. Call +91 96870 04268 to book." },
      { q: "Which areas does the Vashi centre serve?", a: "Vashi, Nerul, Belapur, Kharghar, Sanpada, Turbhe, Airoli and the wider Navi Mumbai region." },
    ],
    sameAs: [],
    intro:
      "Our Vashi centre brings Bavishi Fertility Institute's advanced fertility care to Navi Mumbai. Located at Mahavir Centre in Sector 17 — minutes from Vashi station — it offers expert IVF, IUI and infertility consultation for families across Vashi, Nerul, Belapur and Kharghar.",
    gallery: sharedGallery("Vashi"),
    built: true,
  },

  /* ===================================================================
   * SINGLE-CENTRE CITIES
   * =================================================================== */
  {
    slug: "jetalpur-road",
    citySlug: "vadodara",
    name: "Vadodara",
    fullName: "Bavishi Fertility Institute — Jetalpur Road, Vadodara",
    area: "Jetalpur Road",
    address: "4th Floor, Trisha Square, 2, Jetalpur Rd, Sampatrao Colony, Vadodara – 390007",
    pin: "390007",
    phone: "917575099898",
    phoneLabel: "+91 75750 99898",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
    mapQuery: "Bavishi Fertility Institute Jetalpur Road Vadodara",
    image: "/assets/Locations/Vadodra.png",
    nearby: ["Sampatrao Colony", "Alkapuri", "Sayajigunj", "Fatehgunj", "Akota", "Productivity Road", "Race Course", "Manjalpur", "Gotri", "Vasna", "Karelibaug", "Subhanpura", "Waghodia Road"],
    landmarks: [
      "On Jetalpur Road, Sampatrao Colony",
      "At 4th Floor, Trisha Square",
      "Near Alkapuri and the Race Course area",
    ],
    howToReach: [
      "Centrally located on Jetalpur Road in Sampatrao Colony, easily reached from Alkapuri, Sayajigunj and Akota.",
      "About 3 km from Vadodara railway station and roughly 6 km from Vadodara Airport (Harni).",
      "Well connected by city bus routes; on-site and street parking available at Trisha Square.",
    ],
    facilities: [
      "Class 1000 embryology & IVF lab",
      "Andrology & semen-analysis lab",
      "In-house diagnostics & sonography",
      "Day-care operation theatre",
      "Counselling & nutrition suites",
      "Pharmacy & sample collection",
    ],
    doctors: ["mita-shah"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation", "pgt"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Vadodara IVF centre?", a: "On the 4th floor of Trisha Square, 2, Jetalpur Road, Sampatrao Colony, Vadodara – 390007 — centrally located near Alkapuri." },
      { q: "What are the timings at the Vadodara centre?", a: "The Vadodara centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 75750 99898 to book an appointment." },
      { q: "Which areas does the Vadodara centre serve?", a: "Sampatrao Colony, Alkapuri, Sayajigunj, Fatehgunj, Akota, Manjalpur and families travelling from across central Gujarat." },
      { q: "What treatments are available in Vadodara?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, fertility preservation and PGT — with the same senior-doctor expertise as our flagship." },
    ],
    sameAs: [],
    intro:
      "Our Vadodara centre on Jetalpur Road is a trusted IVF destination in central Gujarat, offering advanced fertility treatment with cutting-edge technology and compassionate care. Conveniently located in Sampatrao Colony near Alkapuri, it provides IVF, IUI, donor programmes, fertility preservation and complete gynaecology services under one roof.",
    gallery: sharedGallery("Vadodara"),
    built: true,
  },
  {
    slug: "lal-darwaja",
    citySlug: "surat",
    name: "Surat",
    fullName: "Bavishi Fertility Institute — Lal Darwaja, Surat",
    area: "Lal Darwaja",
    address: "9th Floor, Param Doctor House, Lal Darwaja Station Rd, Lal Darwaja, Surat – 395003",
    pin: "395003",
    phone: "919879572247",
    phoneLabel: "+91 98795 72247",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
    mapQuery: "Bavishi Fertility Institute Lal Darwaja Surat",
    image: "/assets/Locations/Surat.png",
    nearby: ["Lal Darwaja", "Station Road", "Athwa", "Adajan", "Vesu", "Piplod", "Citylight", "Ghod Dod Road", "Varachha", "Katargam", "Udhna", "Rander", "Pal"],
    landmarks: [
      "At Param Doctor House, Lal Darwaja Station Road",
      "Near Surat railway station",
      "In the central Lal Darwaja area",
    ],
    howToReach: [
      "Centrally located at Param Doctor House on Lal Darwaja Station Road, right beside Surat railway station.",
      "Easily reached from Athwa, Adajan, Vesu and Ghod Dod Road via the city's main arterial roads.",
      "Excellent rail and bus connectivity; parking available near the station.",
    ],
    facilities: [
      "Class 1000 embryology & IVF lab",
      "Andrology & semen-analysis lab",
      "In-house diagnostics & sonography",
      "Day-care operation theatre",
      "Counselling & nutrition suites",
      "Pharmacy & sample collection",
    ],
    doctors: ["deep-gajiwala"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation", "pgt"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Surat IVF centre?", a: "On the 9th floor of Param Doctor House, Lal Darwaja Station Road, Lal Darwaja, Surat – 395003 — beside Surat railway station." },
      { q: "What are the timings at the Surat centre?", a: "The Surat centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 98795 72247 to book." },
      { q: "Which areas does the Surat centre serve?", a: "Lal Darwaja, Athwa, Adajan, Vesu, Piplod, Citylight, Ghod Dod Road, Varachha and families across South Gujarat." },
      { q: "What treatments are available in Surat?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, fertility preservation and PGT — backed by advanced laboratories and experienced specialists." },
    ],
    sameAs: [],
    intro:
      "Our Surat centre is a leading IVF destination in South Gujarat, offering trusted fertility treatments with a focus on patient-centric, compassionate care. Centrally located at Param Doctor House on Lal Darwaja Station Road, it provides advanced IVF, IUI and infertility solutions with state-of-the-art technology and high success rates.",
    gallery: sharedGallery("Surat"),
    built: true,
  },
  {
    slug: "mirjapar",
    citySlug: "bhuj",
    name: "Bhuj",
    fullName: "Bavishi Fertility Institute — Bhuj, Kutch",
    area: "Bhuj",
    address: "13–28 Shivam Nagar, near Uma Nagar, Highway, near Kutch Orthopaedic Hospital, Mirjapar, Bhuj – 370040",
    pin: "370040",
    phone: "919687188550",
    phoneLabel: "+91 96871 88550",
    hours: "Mon–Fri · 8:00 am – 7:00 pm · Sat till 1:00 pm",
    opening: { opens: "08:00", closes: "19:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    mapQuery: "Bavishi Fertility Institute Bhuj Kutch",
    image: "/assets/Locations/Bhuj.png",
    nearby: ["Bhuj", "Mirjapar", "Uma Nagar", "Mundra Road", "Bhujodi", "Madhapar", "Anjar", "Gandhidham", "Mandvi", "Nakhatrana", "Kutch"],
    landmarks: [
      "At Shivam Nagar, near Uma Nagar",
      "On the highway, near Kutch Orthopaedic Hospital",
      "In Mirjapar, Bhuj",
    ],
    howToReach: [
      "Located at Shivam Nagar near Uma Nagar, on the Bhuj highway beside Kutch Orthopaedic Hospital in Mirjapar.",
      "Easily reached from across Kutch — Anjar, Gandhidham, Mandvi and Madhapar — via the main highway.",
      "About 5 km from Bhuj railway station; on-site parking available.",
    ],
    facilities: [
      "IVF & embryology lab",
      "Andrology & semen analysis",
      "In-house diagnostics & sonography",
      "Minor procedure room",
      "Counselling rooms",
      "On-site pharmacy",
    ],
    doctors: ["surbhi-vegad"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Bhuj IVF centre?", a: "At 13–28 Shivam Nagar, near Uma Nagar, on the highway beside Kutch Orthopaedic Hospital, Mirjapar, Bhuj – 370040." },
      { q: "What are the timings at the Bhuj centre?", a: "Monday to Friday, 8:00 am to 7:00 pm, and Saturday until 1:00 pm. Call +91 96871 88550 to book." },
      { q: "Which areas does the Bhuj centre serve?", a: "Bhuj, Mirjapar, Mundra Road, Anjar, Gandhidham, Mandvi, Madhapar and families across the Kutch region." },
      { q: "What treatments are available in Bhuj?", a: "Advanced reproductive care — IVF, ICSI, IUI, male and female infertility solutions and fertility preservation — all under one roof in Kutch." },
    ],
    sameAs: [],
    intro:
      "Our Bhuj centre is the best fertility hospital in Kutch, combining state-of-the-art technology with compassionate support for a truly personalised experience. Located at Shivam Nagar near Kutch Orthopaedic Hospital in Mirjapar, it brings advanced IVF, infertility treatment and maternity care within reach of families across the region.",
    gallery: sharedGallery("Bhuj"),
    built: true,
  },
  {
    slug: "kalubha-road",
    citySlug: "bhavnagar",
    name: "Bhavnagar",
    fullName: "Bavishi Fertility Institute — Kalubha Road, Bhavnagar",
    area: "Kalubha Road",
    address: "203–205 Sai Ganga, beside Hema Women's Hospital, Kalubha Rd, Bhavnagar – 364001",
    pin: "364001",
    phone: "917069314040",
    phoneLabel: "+91 70693 14040",
    hours: "Mon–Sat · 10:00 am – 2:00 pm & 4:00 pm – 8:00 pm",
    opening: { opens: "10:00", closes: "20:00" },
    mapQuery: "Bavishi Fertility Institute Kalubha Road Bhavnagar",
    image: "/assets/Locations/Bhavnagar.png",
    nearby: ["Kalubha Road", "Waghawadi Road", "Subhash Nagar", "Ghogha Circle", "Vidyanagar", "Krishnanagar", "Rammantra Mandir", "Atabhai", "Sardarnagar", "Nilambag", "Bhavnagar"],
    landmarks: [
      "At 203–205 Sai Ganga, Kalubha Road",
      "Beside Hema Women's Hospital",
      "Near the central Bhavnagar area",
    ],
    howToReach: [
      "Centrally located on Kalubha Road beside Hema Women's Hospital, easily reached from across Bhavnagar.",
      "Close to Waghawadi Road and Ghogha Circle, with good city bus and auto connectivity.",
      "About 3 km from Bhavnagar railway station; parking available nearby.",
    ],
    facilities: [
      "IVF & embryology lab",
      "Andrology & semen analysis",
      "In-house diagnostics & sonography",
      "Minor procedure room",
      "Counselling rooms",
      "On-site pharmacy",
    ],
    doctors: ["deepali-pandya"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Bhavnagar IVF centre?", a: "At 203–205 Sai Ganga, beside Hema Women's Hospital, Kalubha Road, Bhavnagar – 364001." },
      { q: "What are the timings at the Bhavnagar centre?", a: "Monday to Saturday, 10:00 am to 2:00 pm and 4:00 pm to 8:00 pm. Call +91 70693 14040 to book." },
      { q: "Which areas does the Bhavnagar centre serve?", a: "Kalubha Road, Waghawadi Road, Subhash Nagar, Ghogha Circle, Vidyanagar and families across the Saurashtra region." },
      { q: "What treatments are available in Bhavnagar?", a: "Comprehensive fertility care — IVF, ICSI, IUI, male and female infertility management, fertility preservation and donor services." },
    ],
    sameAs: [],
    intro:
      "Our Bhavnagar centre is a leading IVF hospital in Saurashtra, combining cutting-edge technology with compassionate, personalised care. Centrally located on Kalubha Road beside Hema Women's Hospital, it offers advanced IVF, IUI and infertility treatment supported by experienced specialists and a state-of-the-art laboratory.",
    gallery: sharedGallery("Bhavnagar"),
    built: true,
  },
  {
    slug: "nanikhodiyar",
    citySlug: "anand",
    name: "Anand",
    fullName: "Bavishi Fertility Institute — Anand",
    area: "Anand",
    address: "Unit-2, IRIS Hospital, Nanikhodiyar, Anand – 388001",
    pin: "388001",
    phone: "917069034565",
    phoneLabel: "+91 70690 34565",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
    mapQuery: "Bavishi Fertility Institute Anand IRIS Hospital",
    image: "/assets/Locations/Anand.png",
    nearby: ["Anand", "Vidyanagar", "Vallabh Vidyanagar", "Karamsad", "Bakrol", "Mogri", "Gamdi", "Nadiad", "Petlad", "Borsad", "Khambhat"],
    landmarks: [
      "At Unit-2, IRIS Hospital",
      "In the Nanikhodiyar area",
      "Central Anand, near Vidyanagar",
    ],
    howToReach: [
      "Located at IRIS Hospital in Anand, easily reached from Vallabh Vidyanagar, Karamsad and Nadiad.",
      "Well connected by road from across the Charotar region via NH-48 and local routes.",
      "About 2 km from Anand railway station; parking available at the hospital.",
    ],
    facilities: [
      "IVF & embryology lab",
      "Andrology & semen analysis",
      "In-house diagnostics & sonography",
      "Minor procedure room",
      "Counselling rooms",
      "On-site pharmacy",
    ],
    doctors: ["chetna-vyas", "rakhee-patel"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Anand IVF centre?", a: "At Unit-2, IRIS Hospital, Nanikhodiyar, Anand – 388001 — centrally located near Vidyanagar." },
      { q: "What are the timings at the Anand centre?", a: "The Anand centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 70690 34565 to book." },
      { q: "Which areas does the Anand centre serve?", a: "Anand, Vidyanagar, Vallabh Vidyanagar, Karamsad, Nadiad, Petlad and families across the Charotar region." },
      { q: "What treatments are available in Anand?", a: "Comprehensive reproductive care — IVF, ICSI, IUI, male and female infertility management, fertility preservation and maternity services — under one roof." },
    ],
    sameAs: [],
    intro:
      "Our Anand centre is a trusted IVF destination in the Charotar region, offering advanced fertility treatments with modern technology and compassionate care. Located at IRIS Hospital near Vidyanagar, it provides personalised IVF, IUI and infertility solutions with transparent costs and complete support throughout your parenthood journey.",
    gallery: sharedGallery("Anand"),
    built: true,
  },
  {
    slug: "shivpur",
    citySlug: "varanasi",
    name: "Varanasi",
    fullName: "Bavishi Fertility Institute — Shivpur, Varanasi",
    area: "Shivpur",
    address: "S-15/47, Jamuna Sewa Sadan Hospital, Panchkoshi Road, Shivpur, Varanasi – 221003",
    pin: "221003",
    phone: "919506081979",
    phoneLabel: "+91 95060 81979",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
    mapQuery: "Bavishi Fertility Institute Shivpur Varanasi",
    image: "/assets/Locations/Varanasi.png",
    nearby: ["Shivpur", "Panchkoshi Road", "Cantonment", "Sigra", "Maldahiya", "Bhojubeer", "Pandeypur", "Lahartara", "Sarnath", "Chandua", "Varanasi"],
    landmarks: [
      "At Jamuna Sewa Sadan Hospital, Panchkoshi Road",
      "In the Shivpur area",
      "Near the Cantonment and Sarnath corridor",
    ],
    howToReach: [
      "Located at Jamuna Sewa Sadan Hospital on Panchkoshi Road, Shivpur, easily reached from the Cantonment and Sigra.",
      "Well connected from Varanasi Junction (about 6 km) and Lal Bahadur Shastri International Airport (about 18 km).",
      "Good road connectivity to Sarnath and the wider Purvanchal region; parking available.",
    ],
    facilities: [
      "IVF & embryology lab",
      "Andrology & semen analysis",
      "In-house diagnostics & sonography",
      "Minor procedure room",
      "Counselling rooms",
      "On-site pharmacy",
    ],
    doctors: ["parnnika-agarwal"],
    treatments: ["ivf", "icsi", "iui", "male-infertility", "female-infertility", "fertility-preservation"],
    faqs: [
      { q: "Where is the Bavishi Fertility Institute Varanasi IVF centre?", a: "At S-15/47, Jamuna Sewa Sadan Hospital, Panchkoshi Road, Shivpur, Varanasi – 221003." },
      { q: "What are the timings at the Varanasi centre?", a: "The Varanasi centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 95060 81979 to book." },
      { q: "Which areas does the Varanasi centre serve?", a: "Shivpur, the Cantonment, Sigra, Maldahiya, Pandeypur, Sarnath and families across the Purvanchal region of Uttar Pradesh." },
      { q: "What treatments are available in Varanasi?", a: "Advanced fertility care — IVF, ICSI, IUI, male and female infertility solutions and fertility preservation — with expert guidance and end-to-end support." },
    ],
    sameAs: [],
    intro:
      "Our Varanasi centre brings Bavishi Fertility Institute's trusted fertility expertise to eastern Uttar Pradesh. Located at Jamuna Sewa Sadan Hospital on Panchkoshi Road in Shivpur, it offers advanced IVF treatments, expert guidance, personalised plans and end-to-end support to help families across the Purvanchal region achieve parenthood.",
    gallery: sharedGallery("Varanasi"),
    built: true,
  },
];

/* =====================================================================
 * CITIES
 * ===================================================================== */

export const CITIES: City[] = [
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    region: "Gujarat",
    country: "IN",
    helpline: "919712622288",
    helplineLabel: "+91 97126 22288",
    whatsapp: "919712622288",
    heroImage: "/assets/centres/paldi-waiting.webp",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725289034!6m8!1m7!1sCAoSHENJQUJJaEFEeWM1VXZ6ZGI4R2U4cTNVQUFmWWI.!2m2!1d23.01327543356341!2d72.56405585909516!3f43.197350683590116!4f-11.407427687968791!5f0.4000000000000002",
    intro: [
      "For four decades, couples across Gujarat have turned to Bavishi Fertility Institute for honest counselling, advanced IVF technology and a genuinely caring team. From your first consultation to the moment you hold your baby, our Ahmedabad centres combine clinical excellence with the warmth of a family-led institute.",
      "Whether you are exploring IVF, ICSI, IUI, fertility preservation or treatment for male or female infertility, you will find every service — diagnostics, embryology lab, surgery and maternity care — under one roof, at a location convenient to you.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Ahmedabad?", a: "Bavishi Fertility Institute is widely regarded as one of Ahmedabad's most trusted IVF centres — operating in the city since 1984, with Class 1000 labs, senior promoter doctors and 30,000+ successful pregnancies nationwide." },
      { q: "How many Bavishi Fertility Institute IVF centres are there in Ahmedabad?", a: "Three — at Paldi (head office), Sindhu Bhavan Road and Nikol — so expert fertility care is always close to home." },
      { q: "Where is the Bavishi Fertility Institute Paldi IVF centre located?", a: "Opposite Manjulal Municipal Garden, next to Adani CNG & Orion Complex, Paldi Cross Roads, Paldi, Ahmedabad – 380007. It is the institute's head office and flagship lab." },
      { q: "What are the consultation timings in Ahmedabad?", a: "Paldi is open Mon–Sat, 9:00 am–7:00 pm; Sindhu Bhavan Road Mon–Sat, 10:30 am–7:00 pm; and Nikol Mon–Sat, 10:00 am–7:00 pm. Appointments are recommended." },
      { q: "What fertility treatments are available in Ahmedabad?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, donor programmes, fertility preservation, maternity services and gynaecology — all under one roof." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Ahmedabad?", a: "Yes. All Ahmedabad centres offer transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    womensHealth: AHMEDABAD_WOMENS_HEALTH,
    built: true,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    country: "IN",
    helpline: "919328190146",
    helplineLabel: "+91 93281 90146",
    whatsapp: "919328190146",
    heroImage: "/assets/Locations/Mumbai.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725760082!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHlrdE9iX2dF!2m2!1d19.07851750759122!2d72.90374191572629!3f331.0839116483176!4f-6.84920058783446!5f0.4000000000000002",
    intro: [
      "For couples across Mumbai and Navi Mumbai, Bavishi Fertility Institute brings four decades of pioneering IVF experience together with genuinely compassionate care. From your first consultation to the moment you hold your baby, our Mumbai centres combine clinical excellence with the warmth of a family-led institute.",
      "With centres in Ghatkopar, Thane, Vile Parle, Borivali and Vashi, expert fertility care is always close to home. Whether you are exploring IVF, ICSI, IUI, fertility preservation or treatment for male or female infertility, you will find advanced diagnostics, embryology and counselling at a location convenient to you.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Mumbai?", a: "Bavishi Fertility Institute is among Mumbai's most trusted IVF centres, with a family-led legacy since 1984, Class 1000 labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "How many Bavishi Fertility Institute centres are there in Mumbai?", a: "Five — at Ghatkopar, Thane, Vile Parle, Borivali and Vashi (Navi Mumbai) — so expert fertility care is always close to home." },
      { q: "Do you offer IVF treatment in Navi Mumbai?", a: "Yes. Our Vashi centre at Mahavir Centre, Sector 17, serves Navi Mumbai — including Nerul, Belapur, Kharghar and Sanpada." },
      { q: "What are the consultation timings in Mumbai?", a: "Ghatkopar is open Mon–Sat, 9:00 am–9:00 pm. Thane, Vile Parle, Borivali and Vashi run dedicated consultation slots — please call the centre to confirm your time and book." },
      { q: "What fertility treatments are available in Mumbai?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, donor programmes, fertility preservation and PGT — supported by advanced laboratories." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Mumbai?", a: "Yes. Our Mumbai centres offer transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "vadodara",
    name: "Vadodara",
    region: "Gujarat",
    country: "IN",
    helpline: "917575099898",
    helplineLabel: "+91 75750 99898",
    whatsapp: "917575099898",
    heroImage: "/assets/Locations/Vadodra.png",
    intro: [
      "Bavishi Fertility Institute is a trusted name for IVF in Vadodara, offering advanced fertility treatment with cutting-edge technology and the compassion of a family-led institute. Our centre on Jetalpur Road is a one-stop destination for every kind of reproductive care.",
      "Whether you are exploring IVF, ICSI, IUI, donor programmes, fertility preservation or gynaecology services, you will find advanced diagnostics, an embryology lab and experienced specialists under one roof — conveniently located in the heart of the city.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Vadodara?", a: "Bavishi Fertility Institute is widely regarded as one of Vadodara's most trusted IVF centres — part of a FOGSI-certified network with a Class 1000 lab, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Vadodara centre located?", a: "On the 4th floor of Trisha Square, 2, Jetalpur Road, Sampatrao Colony, Vadodara – 390007, near Alkapuri." },
      { q: "What are the consultation timings in Vadodara?", a: "The Vadodara centre is open Monday to Saturday, 10:00 am to 7:00 pm. Appointments are recommended; call +91 75750 99898 to book." },
      { q: "What fertility treatments are available in Vadodara?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, donor programmes, fertility preservation, PGT and gynaecology — all under one roof." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Vadodara?", a: "Yes. The Vadodara centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "surat",
    name: "Surat",
    region: "Gujarat",
    country: "IN",
    helpline: "919879572247",
    helplineLabel: "+91 98795 72247",
    whatsapp: "919879572247",
    heroImage: "/assets/Locations/Surat.png",
    intro: [
      "Bavishi Fertility Institute is a leading IVF centre in Surat, offering trusted fertility treatments with a focus on patient-centric, compassionate care. Centrally located at Lal Darwaja, our team guides you through every step of your parenthood journey.",
      "From understanding treatment costs to advanced solutions for a high success rate, you will find state-of-the-art technology, an embryology lab and experienced specialists under one roof — supporting families across South Gujarat.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Surat?", a: "Bavishi Fertility Institute is among Surat's most trusted IVF centres — part of a FOGSI-certified network with advanced labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Surat centre located?", a: "On the 9th floor of Param Doctor House, Lal Darwaja Station Road, Lal Darwaja, Surat – 395003, beside Surat railway station." },
      { q: "What are the consultation timings in Surat?", a: "The Surat centre is open Monday to Saturday, 10:00 am to 7:00 pm. Appointments are recommended; call +91 98795 72247 to book." },
      { q: "What fertility treatments are available in Surat?", a: "The full range — IVF, ICSI, IUI, male and female infertility care, donor programmes, fertility preservation and PGT — all under one roof." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Surat?", a: "Yes. The Surat centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "bhuj",
    name: "Bhuj",
    region: "Gujarat",
    country: "IN",
    helpline: "919687188550",
    helplineLabel: "+91 96871 88550",
    whatsapp: "919687188550",
    heroImage: "/assets/Locations/Bhuj.png",
    hero360Url: "https://www.google.com/maps/embed?pb=!4v1780725683755!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ3lqZVBYdXdF!2m2!1d23.23267684665612!2d69.639458833696!3f2.4330175692374496!4f-12.54755060589163!5f0.4000000000000002",
    intro: [
      "Bavishi Fertility Institute is the best fertility hospital in Bhuj, combining state-of-the-art technology with compassionate support to ensure a personalised experience and the best possible outcomes for couples across Kutch.",
      "Our centre in Mirjapar offers advanced reproductive treatments — IVF, male and female infertility solutions and maternity services — under one roof, bringing expert fertility care within easy reach of the region.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Bhuj?", a: "Bavishi Fertility Institute is regarded as the best fertility hospital in Bhuj — part of a FOGSI-certified network with advanced labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Bhuj centre located?", a: "At 13–28 Shivam Nagar, near Uma Nagar, on the highway beside Kutch Orthopaedic Hospital, Mirjapar, Bhuj – 370040." },
      { q: "What are the consultation timings in Bhuj?", a: "Monday to Friday, 8:00 am to 7:00 pm, and Saturday until 1:00 pm. Call +91 96871 88550 to book." },
      { q: "What fertility treatments are available in Bhuj?", a: "Advanced reproductive care — IVF, ICSI, IUI, male and female infertility solutions, fertility preservation and maternity services — all under one roof in Kutch." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Bhuj?", a: "Yes. The Bhuj centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "bhavnagar",
    name: "Bhavnagar",
    region: "Gujarat",
    country: "IN",
    helpline: "917069314040",
    helplineLabel: "+91 70693 14040",
    whatsapp: "917069314040",
    heroImage: "/assets/Locations/Bhavnagar.png",
    intro: [
      "Bavishi Fertility Institute is a leading IVF centre in Bhavnagar, recognised for advanced IVF treatment delivered with cutting-edge technology and compassionate care. Our centre on Kalubha Road is one of the Saurashtra region's premier fertility destinations.",
      "From IVF and infertility management to fertility preservation and donor services, you will find personalised solutions backed by experienced specialists and a state-of-the-art laboratory — all under one roof.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Bhavnagar?", a: "Bavishi Fertility Institute is recognised as one of the best IVF hospitals in Bhavnagar — part of a FOGSI-certified network with advanced labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Bhavnagar centre located?", a: "At 203–205 Sai Ganga, beside Hema Women's Hospital, Kalubha Road, Bhavnagar – 364001." },
      { q: "What are the consultation timings in Bhavnagar?", a: "Monday to Saturday, 10:00 am to 2:00 pm and 4:00 pm to 8:00 pm. Call +91 70693 14040 to book." },
      { q: "What fertility treatments are available in Bhavnagar?", a: "Comprehensive fertility care — IVF, ICSI, IUI, male and female infertility management, fertility preservation and donor services — all under one roof." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Bhavnagar?", a: "Yes. The Bhavnagar centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "anand",
    name: "Anand",
    region: "Gujarat",
    country: "IN",
    helpline: "917069034565",
    helplineLabel: "+91 70690 34565",
    whatsapp: "917069034565",
    heroImage: "/assets/Locations/Anand.png",
    intro: [
      "Bavishi Fertility Institute is a trusted IVF centre in Anand, offering advanced fertility treatments with modern technology and compassionate care. Our centre at IRIS Hospital serves couples across the Charotar region.",
      "From IVF and infertility management to fertility preservation and maternity services, you will find personalised solutions with transparent costs and complete support throughout your parenthood journey — all under one roof.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Anand?", a: "Bavishi Fertility Institute is among Anand's most trusted IVF centres — part of a FOGSI-certified network with advanced labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Anand centre located?", a: "At Unit-2, IRIS Hospital, Nanikhodiyar, Anand – 388001, near Vidyanagar." },
      { q: "What are the consultation timings in Anand?", a: "The Anand centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 70690 34565 to book." },
      { q: "What fertility treatments are available in Anand?", a: "Comprehensive reproductive care — IVF, ICSI, IUI, male and female infertility management, fertility preservation and maternity services — all under one roof." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Anand?", a: "Yes. The Anand centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    region: "Uttar Pradesh",
    country: "IN",
    helpline: "919506081979",
    helplineLabel: "+91 95060 81979",
    whatsapp: "919506081979",
    heroImage: "/assets/Locations/Varanasi.png",
    intro: [
      "Bavishi Fertility Institute is a trusted name in fertility care in Varanasi, offering advanced IVF treatments, expert guidance and personalised plans for couples across eastern Uttar Pradesh. Our centre at Shivpur brings end-to-end support to your parenthood journey.",
      "From IVF and IUI to male and female infertility solutions and fertility preservation, you will find state-of-the-art reproductive facilities and experienced specialists supporting families across the Purvanchal region.",
    ],
    faqs: [
      { q: "Which is the best IVF centre in Varanasi?", a: "Bavishi Fertility Institute is among Varanasi's most trusted fertility centres — part of a FOGSI-certified network with advanced labs, experienced specialists and 30,000+ successful pregnancies nationwide." },
      { q: "Where is the Bavishi Fertility Institute Varanasi centre located?", a: "At S-15/47, Jamuna Sewa Sadan Hospital, Panchkoshi Road, Shivpur, Varanasi – 221003." },
      { q: "What are the consultation timings in Varanasi?", a: "The Varanasi centre is open Monday to Saturday, 10:00 am to 7:00 pm. Call +91 95060 81979 to book." },
      { q: "What fertility treatments are available in Varanasi?", a: "Advanced fertility care — IVF, ICSI, IUI, male and female infertility solutions and fertility preservation — with expert guidance and end-to-end support." },
      { q: "Do you offer IVF cost EMI and Suraksha Kavach in Varanasi?", a: "Yes. The Varanasi centre offers transparent pricing with no hidden costs, easy / interest-free EMI options and the Suraksha Kavach protection package." },
    ],
    built: true,
  },
];

/* =====================================================================
 * Lookups & relationships
 * ===================================================================== */

export const cityBySlug = (slug: string) => CITIES.find((c) => c.slug === slug);
export const centreBySlug = (citySlug: string, slug: string) =>
  CENTRES.find((c) => c.citySlug === citySlug && c.slug === slug);
export const centresForCity = (citySlug: string) => CENTRES.filter((c) => c.citySlug === citySlug);

/* ---------------------------------------------------------------------
 * Single-centre cities collapse onto their one centre page.
 * A city only earns its own hub page when it has MORE THAN ONE built
 * centre (e.g. Ahmedabad, Mumbai). For single-centre cities (Bhuj, Surat,
 * Vadodara, Bhavnagar, Anand, Varanasi) the centre page IS the destination —
 * no separate city page is generated and the city name is never a link.
 * Every nav/listing/breadcrumb resolves a city through these two helpers, so
 * the rule stays in one place and adding a 2nd centre to a city automatically
 * re-enables its hub page.
 * ------------------------------------------------------------------- */
export const cityHasOwnPage = (citySlug: string): boolean =>
  Boolean(cityBySlug(citySlug)?.built) && centresForCity(citySlug).filter((c) => c.built).length > 1;

/** Canonical URL of a city in nav/listings/breadcrumbs. For BOTH multi-centre
 *  (hub) and single-centre (collapsed centre) cities this is `/locations/[city]`
 *  — the single centre is served at the city path, with no locality segment.
 *  Returns null only when the city isn't built (caller renders plain text). */
export const cityHref = (citySlug: string): string | null =>
  cityBySlug(citySlug)?.built ? cityUrl(citySlug) : null;

/** Canonical URL of a CENTRE. Multi-centre cities keep the locality segment
 *  (`/locations/[city]/[center]`); single-centre cities collapse to the bare
 *  city path (`/locations/[city]`). Use this everywhere a centre is linked. */
export const centreHref = (c: Centre): string =>
  cityHasOwnPage(c.citySlug) ? centreUrl(c.citySlug, c.slug) : cityUrl(c.citySlug);

/* =====================================================================
 * CITY ↔ DOCTOR mapping (single source of truth)
 * ---------------------------------------------------------------------
 * Doctors are assigned at the CITY level, never per branch. Every centre
 * within a city shows the same city doctor team. The founder & visiting
 * IVF specialist (Dr. Himanshu Bavishi) appears on every city — he is
 * guaranteed first by `doctorSlugsForCity`, so he need not be repeated here.
 * Add a city or a doctor slug here and every relevant page updates.
 * ===================================================================== */
export const FOUNDER_SLUG = "himanshu-bavishi";

export const CITY_DOCTORS: Record<string, string[]> = {
  ahmedabad: ["falguni-bavishi", "parth-bavishi", "janki-bavishi", "binal-shah", "jaydeep-patel"],
  mumbai: ["suman-singh", "nilesh-jain", "priyanka-sinha"],
  surat: ["deep-gajiwala"],
  vadodara: ["mita-shah", "jayna-unadkat"],
  bhuj: ["surbhi-vegad"],
  anand: ["chetna-vyas", "rakhee-patel"],
  bhavnagar: ["deepali-pandya"],
  varanasi: ["parnnika-agarwal"],
};

/** City doctor team (deduped). Founder is always present and listed first.
 *  City-based, not branch-based: every centre in a city resolves to this list.
 *  Falls back to centre-derived doctors for any city not in CITY_DOCTORS. */
export const doctorSlugsForCity = (citySlug: string) => {
  const mapped = CITY_DOCTORS[citySlug];
  const base = mapped ?? centresForCity(citySlug).flatMap((c) => c.doctors);
  if (!mapped && base.length === 0) return [];
  return Array.from(new Set([FOUNDER_SLUG, ...base]));
};

/** Treatment slugs across a city's centres (deduped). */
export const treatmentSlugsForCity = (citySlug: string) =>
  Array.from(new Set(centresForCity(citySlug).flatMap((c) => c.treatments)));

/** Static params for /locations/[city] — every built city. Multi-centre cities
 *  render the hub (CityPage); single-centre cities render their one centre
 *  (CenterPage) at this same path. */
export const builtCityParams = () => CITIES.filter((c) => c.built).map((c) => ({ city: c.slug }));

/** Static params for /locations/[city]/[center] — only centres in MULTI-centre
 *  cities. Single-centre cities have no locality segment (served at /[city]). */
export const builtCentreParams = () =>
  CENTRES.filter((c) => c.built && cityHasOwnPage(c.citySlug)).map((c) => ({ city: c.citySlug, center: c.slug }));

/* ---------- Back-compat linking helpers (used by treatment/doctor pages) ---------- */

export type LocationRef = { slug: string; name: string; city: string; href: string; type: "city" | "centre"; built: boolean };

export const locationRef = (slug: string): LocationRef => {
  const city = cityBySlug(slug);
  // Single-centre cities resolve to their centre page (cityHref), never a
  // non-existent city page.
  if (city) return { slug, name: city.name, city: city.name, href: cityHref(slug) ?? cityUrl(slug), type: "city", built: city.built };
  const centre = CENTRES.find((c) => c.slug === slug);
  if (centre) {
    const built = centre.built;
    return {
      slug,
      name: `${centre.name}, ${cityBySlug(centre.citySlug)?.name ?? ""}`.replace(/, $/, ""),
      city: cityBySlug(centre.citySlug)?.name ?? "",
      href: built ? centreHref(centre) : (cityHref(centre.citySlug) ?? cityUrl(centre.citySlug)),
      type: "centre",
      built,
    };
  }
  return { slug, name: slug, city: slug, href: "/#locations", type: "city", built: false };
};

export const cityLocations = (): LocationRef[] =>
  CITIES.filter((c) => c.built).map((c) => ({ slug: c.slug, name: c.name, city: c.name, href: cityHref(c.slug) ?? cityUrl(c.slug), type: "city", built: true }));

/** Resolve a doctor's location slugs to the built Centre objects behind them —
 *  a centre slug maps to that centre; a city slug maps to its head-office (or
 *  first built) centre. Deduped, order-preserving. Powers the contact cards on
 *  a doctor profile, which need full address / phone / hours, not just a name. */
export const centresForLocationSlugs = (slugs: string[]): Centre[] => {
  const out: Centre[] = [];
  const seen = new Set<string>();
  const push = (c?: Centre) => {
    if (c && c.built && !seen.has(c.slug)) { seen.add(c.slug); out.push(c); }
  };
  for (const slug of slugs) {
    const centre = CENTRES.find((c) => c.slug === slug);
    if (centre) { push(centre); continue; }
    const inCity = centresForCity(slug).filter((c) => c.built);
    push(inCity.find((c) => c.isHeadOffice) ?? inCity[0]);
  }
  return out;
};

/* =====================================================================
 * Schema builders
 * ===================================================================== */

/** Enriched MedicalClinic + LocalBusiness for one centre, bound to #organization.
 *  Includes geo, openingHoursSpecification, hasMap, image, telephone, areaServed,
 *  availableService, and verified review nodes (only when real data exists). */
export function centerClinicSchema(c: Centre): Record<string, unknown> {
  const pageUrl = c.built ? centreHref(c) : cityUrl(c.citySlug);
  const cityName = cityBySlug(c.citySlug)?.name ?? "";
  const region = cityBySlug(c.citySlug)?.region ?? "Gujarat";
  const reviews = getReviews(c.reviewsKey ?? c.slug);
  return {
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${abs(pageUrl)}#clinic-${c.slug}`,
    name: c.fullName,
    url: abs(pageUrl),
    image: abs(c.image),
    telephone: `+${c.phone}`,
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address.replace(new RegExp(`,?\\s*${cityName}.*$`, "i"), ""),
      addressLocality: cityName,
      addressRegion: region,
      postalCode: c.pin,
      addressCountry: cityBySlug(c.citySlug)?.country ?? "IN",
    },
    ...(c.geo ? { geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng } } : {}),
    hasMap: centreMapUrl(c),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: c.opening.days ?? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: c.opening.opens,
        closes: c.opening.closes,
      },
    ],
    areaServed: c.nearby.map((n) => ({ "@type": "Place", name: `${n}, ${cityName}` })),
    medicalSpecialty: ["Fertility", "ReproductiveMedicine", "Gynecology"],
    availableService: c.treatments.map((slug) => ({ "@type": "MedicalProcedure", name: treatmentRef(slug).name })),
    // sameAs = manually-set links + the real GBP listing URL from Places (when present)
    ...(() => {
      const sameAs = [...(c.sameAs ?? []), ...(reviews?.mapsUrl ? [reviews.mapsUrl] : [])];
      return sameAs.length ? { sameAs: Array.from(new Set(sameAs)) } : {};
    })(),
    ...reviewNodes(reviews), // aggregateRating + review[] only when verified
  };
}

/** Full @graph for a centre page. */
export function centerGraph(c: Centre): Record<string, unknown>[] {
  const cityName = cityBySlug(c.citySlug)?.name ?? "";
  const url = abs(centreHref(c));
  return [
    {
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: `${c.fullName}`,
      isPartOf: { "@id": WEBSITE_ID },
    },
    centerClinicSchema(c),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Locations", url: "/#locations" },
      // Single-centre cities have no hub page — omit that breadcrumb level.
      ...(cityHasOwnPage(c.citySlug) ? [{ name: cityName, url: cityUrl(c.citySlug) }] : []),
      { name: `${c.name}, ${cityName}`, url: centreHref(c) },
    ]),
    faqSchema(c.faqs),
    // Doctors are city-based, not branch-based — schema mirrors the display team.
    ...doctorSlugsForCity(c.citySlug)
      .map((slug) => doctorBySlug(slug))
      .filter((d): d is NonNullable<typeof d> => Boolean(d))
      .map((d) => physicianSchema(d)),
  ];
}

/** Full @graph for a city hub page. */
export function cityGraph(city: City): Record<string, unknown>[] {
  const url = abs(cityUrl(city.slug));
  return [
    {
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: `Best IVF Centre in ${city.name} — Bavishi Fertility Institute`,
      isPartOf: { "@id": WEBSITE_ID },
    },
    ...centresForCity(city.slug).map((c) => centerClinicSchema(c)),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Locations", url: "/#locations" },
      { name: city.name, url: cityUrl(city.slug) },
    ]),
    faqSchema(city.faqs),
  ];
}
