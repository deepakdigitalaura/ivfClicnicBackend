"use client";
import {
  FlaskConical, Microscope, Activity, Filter, Eye, Magnet, ScanLine,
  Layers, Zap, ShieldCheck, Egg, Droplets, Baby, Snowflake,
  Award, MapPin, Stethoscope, Users, Clock, Dna,
} from "lucide-react";
import { CategoryHubPage, type HubCard, type HubStat, type HubFaq, type HubWhyPoint } from "@/components/category-hub-page";

const cards: HubCard[] = [
  {
    title: "IVF (In Vitro Fertilisation)",
    desc: "Advanced in-vitro fertilisation with ICSI for the best chance of success.",
    href: "/what-is-ivf",
    icon: FlaskConical,
  },
  {
    title: "ICSI (Intracytoplasmic Sperm Injection)",
    desc: "A single healthy sperm injected directly into each mature egg for precise fertilisation.",
    href: "/icsi-treatment-intracytoplasmic-sperm-injection",
    icon: Microscope,
  },
  {
    title: "IUI (Intrauterine Insemination)",
    desc: "A less invasive fertility treatment placing prepared sperm directly in the uterus.",
    href: "/intra-uterine-insemination-iui",
    icon: Activity,
  },
  {
    title: "PICSI",
    desc: "Physiological sperm selection mimicking natural binding for healthier fertilisation.",
    href: "/physiological-intracytoplasmic-sperm-injection-picsi",
    icon: Filter,
  },
  {
    title: "IMSI",
    desc: "High-magnification (6000×) sperm selection for better embryo quality.",
    href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi",
    icon: Eye,
  },
  {
    title: "MACS (Magnetic Activated Cell Sorting)",
    desc: "Magnetic sorting technology to select the healthiest, most viable sperm.",
    href: "/magnetic-activated-cell-sorting-macs",
    icon: Magnet,
  },
  {
    title: "Spindle View ICSI",
    desc: "Real-time spindle imaging for safer, more precise ICSI injection.",
    href: "/spindle-view-icsi",
    icon: ScanLine,
  },
  {
    title: "Blastocyst Transfer",
    desc: "Day-5 blastocyst culture and transfer for stronger implantation rates.",
    href: "/blastocyst-culture-blastocyst-transfer",
    icon: Layers,
  },
  {
    title: "Laser Assisted Hatching",
    desc: "Laser-assisted embryo hatching to improve implantation success.",
    href: "/laser-assisted-hatching",
    icon: Zap,
  },
  {
    title: "IVF Failure — What's Next?",
    desc: "Specialised work-up and a fresh, evidence-based plan after a failed IVF cycle.",
    href: "/ivf-failure",
    icon: ShieldCheck,
  },
  {
    title: "Egg Donation",
    desc: "Carefully matched, fully-screened egg-donor programme with high success rates.",
    href: "/egg-donation",
    icon: Egg,
  },
  {
    title: "Sperm Donation",
    desc: "Screened, ethical donor-sperm programme following ICMR guidelines.",
    href: "/sperm-donation",
    icon: Droplets,
  },
  {
    title: "Embryo Donation",
    desc: "A compassionate donor-embryo path to parenthood for couples who need it.",
    href: "/embryo-donation",
    icon: Baby,
  },
  {
    title: "Cryopreservation (Egg / Sperm / Embryo Freezing)",
    desc: "Safe, long-term freezing of eggs, sperm, and embryos to preserve your fertility.",
    href: "/cryopreservation",
    icon: Snowflake,
  },
];

const stats: HubStat[] = [
  { value: "30,000+", label: "Successful pregnancies" },
  { value: "30+", label: "Years of IVF excellence" },
  { value: "14", label: "Centres with Class 1000 labs" },
  { value: "~100%", label: "Vitrification survival rate" },
];

const whyPoints: HubWhyPoint[] = [
  {
    icon: Microscope,
    title: "Class 1000 IVF Laboratories",
    desc: "Our labs meet international clean-room standards with HEPA-filtered air, positive pressure, and next-generation embryo incubators that replicate the body's environment for optimal embryo development.",
  },
  {
    icon: Dna,
    title: "Full Range of Sperm Selection",
    desc: "Not just standard ICSI — we offer PICSI, IMSI, MACS, and Spindle View ICSI to select the best sperm for fertilisation based on your specific diagnosis.",
  },
  {
    icon: FlaskConical,
    title: "Blastocyst Culture Expertise",
    desc: "Day-5 blastocyst culture with extended observation gives the strongest embryos the best chance. Our lab consistently achieves high blastocyst formation rates.",
  },
  {
    icon: Snowflake,
    title: "Near-Perfect Vitrification",
    desc: "Our rapid-freezing (vitrification) technique achieves close to 100% embryo survival, giving you flexibility to plan frozen embryo transfers at the ideal time.",
  },
  {
    icon: Stethoscope,
    title: "Senior Specialists at Every Step",
    desc: "From your first consultation through egg retrieval and embryo transfer, senior IVF consultants — not trainees — are personally involved at every critical stage.",
  },
  {
    icon: Award,
    title: "Award-Winning Outcomes",
    desc: "Nationally recognised for high IVF success rates. Our protocols are continuously refined based on data from over 30,000 treatment cycles.",
  },
];

const faqs: HubFaq[] = [
  {
    q: "What is the difference between IVF and IUI?",
    a: "IUI (Intrauterine Insemination) is a simpler procedure where prepared sperm is placed directly inside the uterus during ovulation. IVF (In Vitro Fertilisation) involves stimulating the ovaries, retrieving eggs, fertilising them in the lab, and transferring the resulting embryo(s) to the uterus. IUI is less invasive and less expensive but has a lower success rate per cycle. Your doctor will recommend the right option based on your diagnosis.",
  },
  {
    q: "What is ICSI and when is it needed?",
    a: "ICSI (Intracytoplasmic Sperm Injection) involves injecting a single selected sperm directly into the egg under a microscope. It's recommended when sperm count or motility is low, after previous IVF fertilisation failure, when using surgically retrieved sperm, or when using frozen eggs. At Bavishi, ICSI is standard in most IVF cycles to maximise fertilisation rates.",
  },
  {
    q: "What are PICSI, IMSI, and MACS?",
    a: "These are advanced sperm selection techniques used alongside ICSI. PICSI selects sperm based on their ability to bind to hyaluronan (mimicking natural selection). IMSI uses 6000× magnification to identify morphologically superior sperm. MACS uses magnetic sorting to separate healthy sperm from those with DNA damage. Your embryologist recommends the best technique based on your semen analysis.",
  },
  {
    q: "How long does one IVF cycle take?",
    a: "A typical IVF cycle takes about 2–3 weeks from the start of ovarian stimulation to embryo transfer. This includes 8–14 days of daily hormone injections, 3–4 monitoring visits, egg retrieval (a 15-minute procedure under sedation), and embryo transfer 3–5 days later. Results from the pregnancy test come about 14 days after transfer.",
  },
  {
    q: "What is the success rate of IVF?",
    a: "Success rates depend on several factors including age, diagnosis, egg quality, and the clinic's protocols. At Bavishi Fertility Institute, our cumulative success rates (across multiple cycles) are among the highest in India. Women under 35 with good ovarian reserve generally have the best outcomes. Your doctor will give you a realistic, personalised success estimate based on your specific situation.",
  },
  {
    q: "What happens to unused embryos?",
    a: "Surplus good-quality embryos are frozen by vitrification (rapid freezing) and stored safely for future use. Our vitrification technique achieves near-100% survival rates. Frozen embryo transfers (FET) are often as successful as fresh transfers and give you the option to try again without repeating the stimulation and retrieval steps.",
  },
  {
    q: "Is egg/embryo freezing safe?",
    a: "Yes. Vitrification is a well-established technique used worldwide. Eggs and embryos can be stored safely for years without degradation. Studies show no increased risk of birth defects or developmental problems in children born from frozen eggs or embryos compared to fresh cycles.",
  },
];

export function AdvancedFertilityHub() {
  return (
    <CategoryHubPage
      eyebrow="Advanced Fertility Techniques"
      title="World-Class"
      titleAccent="Assisted Reproduction"
      subtitle="From IVF and ICSI to cutting-edge sperm selection and donor programmes — Bavishi Fertility Institute combines 30+ years of expertise with the latest reproductive technology across 14 centres in India. Over 30,000 families created and counting."
      breadcrumbLabel="Advanced Fertility Techniques"
      cards={cards}
      cardsSectionTitle="Our Advanced Treatments & Techniques"
      cardsSectionSubtitle="Each technique has a dedicated page with detailed information — how it works, who it's for, what to expect, and why Bavishi is the right choice."
      stats={stats}
      overviewTitle="What is"
      overviewTitleAccent="Assisted Reproduction?"
      overviewParagraphs={[
        "Assisted Reproductive Technology (ART) refers to a range of medical procedures designed to help couples and individuals achieve pregnancy when natural conception has not been successful. The most well-known is IVF — but modern reproductive medicine offers a much wider toolkit.",
        "At Bavishi Fertility Institute, we offer the full spectrum of ART: from simpler interventions like IUI (intrauterine insemination) to advanced IVF with ICSI, sophisticated sperm selection techniques (PICSI, IMSI, MACS), blastocyst culture, laser-assisted hatching, and comprehensive donor programmes. Each technique addresses a different clinical need.",
        "Our philosophy is simple — we use the least invasive effective treatment first. Not every patient needs IVF. But when IVF is the right path, our Class 1000 labs, experienced embryologists, and cutting-edge technology give you the best possible chance of success.",
      ]}
      overviewBullets={[
        "IUI is the first-line ART for mild male factor or unexplained infertility",
        "IVF with ICSI is the gold standard for most moderate-to-severe causes",
        "Advanced sperm selection improves outcomes in male factor cases",
        "Blastocyst culture + vitrification maximise cumulative success",
        "Donor programmes offer a path when own gametes aren't viable",
        "Cryopreservation preserves future fertility for medical or personal reasons",
      ]}
      signsTitle="When is Advanced"
      signsTitleAccent="Fertility Treatment Recommended?"
      signsSubtitle="Your fertility specialist may recommend advanced techniques if any of the following apply to your situation."
      signs={[
        "Failed to conceive after timed intercourse and/or ovulation induction",
        "Blocked, damaged, or absent fallopian tubes",
        "Moderate-to-severe male factor infertility",
        "Advanced maternal age (over 35–38)",
        "Low ovarian reserve or poor AMH levels",
        "Unexplained infertility after basic investigations",
        "Previous failed IUI cycles (typically 3–6 attempts)",
        "Need for genetic testing of embryos (PGT)",
        "Fertility preservation before cancer treatment or for personal reasons",
      ]}
      whyTitle="Why Choose Bavishi for"
      whyTitleAccent="Advanced Fertility?"
      whyPoints={whyPoints}
      faqs={faqs}
      heroImage="/assets/ivf-icsi.png"
      heroImageAlt="IVF and ICSI advanced fertility treatment"
      ctaHeading="Start Your Journey Today"
      ctaSubtitle="Our fertility specialists will recommend the technique best suited to your unique situation."
    />
  );
}
