/* ---------------------------------------------------------------------
 * Full Awards & Achievements catalog for the /awards page.
 *
 * The homepage carousel (HOMEPAGE_DEFAULTS.awards.items in src/lib/homepage.ts)
 * shows a small curated subset backed by real ceremony photos. This module is
 * the complete history — every award/recognition, grouped by category — plus
 * a supporting photo gallery of ceremony moments. It is code-owned (not
 * CMS-backed): unlike the homepage sections, this content doesn't change
 * often enough to warrant a Studio schema.
 * ------------------------------------------------------------------- */

export type AwardEntry = { img?: string; title: string; desc: string };
export type GalleryPhoto = { src: string; alt: string };

export const PRESS_AWARDS: AwardEntry[] = [
  { img: "/assets/awards/ivf-chain-of-the-year.png", title: "IVF Chain of the Year – West", desc: "ET Healthworld National Fertility Awards · 6× winner (2019–2026)" },
  { img: "/assets/awards/patient-centric-award.png", title: "Patient Centric Hospital in Reproductive Health", desc: "IHW Patient First Awards 2024 (Bronze)" },
  { img: "/assets/awards/bharat-excellence-award.png", title: "Bharat Medical Excellence Award", desc: "DNS Talks · Gujarat's Top Doctors, Dr. Parth Bavishi (2025)" },
  { img: "/assets/awards/times-healthcare-award.png", title: "Times Healthcare Leaders", desc: "Certificate of Recognition, 2025" },
  { img: "/assets/awards/news18-gujarati-shreshtha-award-2018.jpg", title: "Shreshtha Award", desc: "News18 Gujarati · presented by the Gujarat Chief Minister (2018)" },
  { img: "/assets/awards/gaurav-icons-2018.jpg", title: "Best IVF Clinic Chain in India", desc: "Gaurav Icons Awards, 2018" },
  { img: "/assets/awards/myfm-excellence-ivf-technology-2017.jpg", title: "Excellence in IVF Technology", desc: "MY FM Ahmedabad Entrepreneur & Excellence Awards, 2017" },
  { img: "/assets/awards/dynergic-golden-aim-2025.jpg", title: "Most Trusted IVF Chain of the Year – West India", desc: "Dynergic Golden Aim Awards, 2025" },
  { img: "/assets/awards/news18-pride-of-gujarat-2026.jpg", title: "Pride of Gujarat", desc: "News18 Gujarat · Most Trusted Fertility Chain Hospital, 2026" },
  { img: "/assets/awards/myfm-building-gujarat-2024.jpg", title: "Excellence in Fertility Treatment", desc: "MY FM Building Gujarat Awards, 2024" },
  { img: "/assets/awards/growth-awards-ahmedabad.jpg", title: "Best IVF Clinic of Gujarat", desc: "Growth Awards Ahmedabad · also recognised for Best Innovative Fertility Treatments, Excellence in Safe Motherhood & Advanced Genetics in IVF (2024–2025)" },
  { img: "/assets/awards/india-brand-icon-2020.jpg", title: "Healthcare Brand (IVF) of the Year in Gujarat", desc: "India Brand Icon Awards, 2019–20" },
  { img: "/assets/awards/time-cybermedia-healthcare-2022.jpg", title: "Most Trusted IVF Clinic in Mumbai", desc: "TIME CyberMedia International Healthcare Awards, 2022" },
  { img: "/assets/awards/time-cybermedia-education-2022.jpg", title: "International Education Awards — Winner", desc: "TIME CyberMedia, 2022" },
  { img: "/assets/awards/shivani-scientific-ivf-success-champion.jpg", title: "IVF Success Champion", desc: "Certificate of Appreciation · Shivani Scientific" },
  { title: "Times Power Brands Vadodara", desc: "Excellence in Genetics and IVF Treatment, 2026" },
];

export const ACADEMIC_AWARDS: AwardEntry[] = [
  { img: "/assets/awards/ima-medical-excellence-recognition.jpg", title: "Medical Excellence Recognition", desc: "Indian Medical Association, early years of practice" },
  { img: "/assets/awards/ama-2004-excellence-medicine.jpg", title: "Excellence in the Field of Medicine", desc: "Ahmedabad Medical Association · 102nd Annual Day, Dr. Himanshu Bavishi (2004)" },
  { img: "/assets/awards/endo-vision-2004.jpg", title: "Faculty Recognition", desc: "Endo-Vision Conference, Dr. Himanshu Bavishi (2004)" },
  { img: "/assets/awards/aogs-conference-2016-17.jpg", title: "AOGS Annual Conference", desc: "Faculty · Dr. Himanshu Bavishi (2016–17)" },
  { img: "/assets/awards/mannnagar-medical-circle-2017-18.jpg", title: "Recognition", desc: "Mannnagar Medical Circle, 2017–18" },
  { img: "/assets/awards/yuva-fogsi-rajkot-2016.jpg", title: "YUVA FOGSI — West Zone", desc: "Faculty · Rajkot, 2016" },
  { img: "/assets/awards/yuva-isar-ahmedabad-2017.jpg", title: "YUVA ISAR Conference", desc: "Ahmedabad, 2017" },
  { img: "/assets/awards/fertivision-2017.jpg", title: "Faculty, FERTIVISION 2017", desc: "13th Annual Conference, Indian Fertility Society · Dr. Parth Bavishi, New Delhi" },
  { img: "/assets/awards/sogog-vadodara-2019.jpg", title: "SOGOG Annual Conference (43rd)", desc: "Faculty · Vadodara, 2019" },
  { img: "/assets/awards/eve-endoscopy-daman-2023.jpg", title: "Eve Endoscopy Conference", desc: "Faculty (IAGE) · Daman, 2023" },
  { img: "/assets/awards/isar-gujarat-vadodara-2023.jpg", title: "ISAR Gujarat Annual Conference & BOGS", desc: "Faculty · Vadodara, 2023" },
  { img: "/assets/awards/isar-embryology-2023.jpg", title: "National ISAR Embryology Conference", desc: "Ahmedabad, 2023" },
  { img: "/assets/awards/isar-2026-faculty-excellence.jpg", title: "Faculty Excellence Honour", desc: "ISAR 30th Annual Conference, 2026" },
  { img: "/assets/awards/fogsi-www-conference-2024.jpg", title: "Exhibitor", desc: "FOGSI National / WWW Conference, Baroda OBGYN Society, 2024" },
];

export const CEREMONY_GALLERY: GalleryPhoto[] = [
  { src: "/assets/awards/et-healthworld-2025-stage.jpg", alt: "Bavishi Fertility Institute accepting the ET Healthworld IVF Chain of the Year (West) award, 2025" },
  { src: "/assets/awards/gaurav-icons-2018-gallery.jpg", alt: "Gaurav Icons Awards ceremony, 2018" },
  { src: "/assets/awards/dns-talks-bharat-medical-excellence-2025.jpg", alt: "Dr. Parth Bavishi receiving the Bharat Medical Excellence Award, 2025" },
  { src: "/assets/awards/ihw-patient-first-2024-alt.jpg", alt: "IHW Patient First Awards 2024 ceremony" },
  { src: "/assets/awards/et-healthworld-2025-cert-photo.jpg", alt: "ET Healthworld National Fertility Awards certificate presentation, 2025" },
  { src: "/assets/awards/myfm-excellence-ivf-technology-2017-plate.jpg", alt: "MY FM Excellence in IVF Technology award plate, 2017" },
  { src: "/assets/awards/et-healthworld-2025-certificate.jpg", alt: "ET Healthworld National Fertility Awards certificate, 2025" },
];
