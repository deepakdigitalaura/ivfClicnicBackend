"use client";
import { useState } from "react";
import {
  ArrowRight, Phone, MessageCircle, Calendar, CheckCircle2, ChevronDown,
  ClipboardCheck, Syringe, Microscope, Dna, HeartPulse, ShieldCheck,
  FlaskConical, Sparkles, Clock, Award, Star,
  Layers, Snowflake, Leaf, Baby, Users, PlayCircle,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

const heroImg = "/assets/ivf-icsi.png";

/* ---------- small shared bits ---------- */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
      <span className="h-px w-6 bg-[color:var(--rose)]/60" /> {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, subtitle, center }: { eyebrow: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-4xl lg:text-[2.75rem] text-balance">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- data ---------- */
const indications = [
  "Blocked, damaged or absent fallopian tubes (including hydrosalpinx)",
  "Advanced endometriosis or chocolate cysts",
  "Low ovarian reserve, low egg count or advanced maternal age",
  "Low sperm count, low motility or a high percentage of abnormally-shaped sperm",
  "Severe male factor including azoospermia (needing TESA / PESA / Micro-TESE)",
  "Failed IUI or ovulation-induction cycles",
  "Unexplained infertility",
  "Need for donor eggs, donor sperm or surrogacy",
  "Prevention of inherited genetic disorders (e.g. thalassemia) via PGT",
];

const steps = [
  {
    icon: ClipboardCheck, n: "01", t: "Pre-treatment Evaluation",
    d: "Before starting, both partners are thoroughly evaluated to optimise the outcome — semen analysis and blood tests for the male partner, and consultation, 3D sonography, hormone tests and (if indicated) hysteroscopy for the female partner.",
  },
  {
    icon: Syringe, n: "02", t: "Ovarian Stimulation",
    d: "After your period, a customised dose of gonadotropin hormones (FSH/HMG) is given as a small daily injection for about 7–12 days to grow multiple mature eggs, with regular ultrasound monitoring. A precise 'trigger' injection then matures the eggs for retrieval.",
  },
  {
    icon: Microscope, n: "03", t: "Egg Retrieval & Fertilization",
    d: "34–36 hours after the trigger, eggs are retrieved through the vagina under short sedation — no cut, no stitch, and you go home in about 2 hours. The same day, the best sperm are selected and each mature egg is fertilised by ICSI in our Class 1000 IVF lab.",
  },
  {
    icon: Dna, n: "04", t: "Embryo Culture & Transfer",
    d: "Embryos are grown in next-generation incubators that mimic the body. Two to six days later, the best-quality embryo(s) are gently transferred into the uterus. Surplus embryos can be frozen by vitrification — with close to 100% survival at Bavishi Fertility Institute.",
  },
  {
    icon: HeartPulse, n: "05", t: "Pregnancy Test",
    d: "About 13–15 days after embryo transfer, a Beta-HCG blood test confirms pregnancy. From egg formation to transfer, the active treatment usually takes just 12–17 days.",
  },
];

const whyBfi = [
  { icon: FlaskConical, t: "Class 1000 IVF Labs", d: "Air purity 10× cleaner than the international Class 10,000 standard — protecting your embryos at every moment." },
  { icon: Microscope, t: "ICSI for All", d: "Microinjection for every couple gives the maximum chance of fertilisation and minimises the risk of total fertilisation failure." },
  { icon: Sparkles, t: "Customised Protocols", d: "Tailor-made stimulation and our 'trigger it right' strategy retrieve the best number of best-quality eggs, safely." },
  { icon: ShieldCheck, t: "Suraksha Kavach", d: "India's trusted IVF protection programme — financial assurance and peace of mind on your journey to parenthood." },
  { icon: Award, t: "Proven & Awarded", d: "25,000+ pregnancies since 1998 and the National Fertility Award for five consecutive years (2021–2025)." },
  { icon: HeartPulse, t: "One-Stop Care", d: "Tests, surgery, embryology and treatment under one roof — with safe-stimulation protocols designed to avoid severe OHSS." },
];

const faqs = [
  { q: "What is IVF (In Vitro Fertilization)?", a: "IVF is an assisted-reproduction technique in which eggs are retrieved from the ovaries, fertilised by sperm in a laboratory, and the resulting embryo is transferred into the uterus to achieve pregnancy." },
  { q: "How long should a couple try before considering IVF?", a: "Generally about one year of trying if the woman is under 35, or six months if she is 35 or older. With known fertility issues — or if the woman is over 40 — it is wise to consult a specialist sooner." },
  { q: "What is the difference between IVF and ICSI?", a: "In conventional IVF, eggs and sperm are mixed in a dish. In ICSI, a single healthy sperm is injected directly into each egg. ICSI is preferred for male-factor infertility or previous fertilisation failure — at Bavishi Fertility Institute we use ICSI for all couples." },
  { q: "How does age affect IVF success?", a: "Age is the single biggest factor — younger women generally have higher success rates. For older patients, options such as donor eggs, previously-frozen embryos or advanced IVF techniques can improve the chances." },
  { q: "How long does one IVF cycle take?", a: "From the start of stimulation to embryo transfer, the active treatment usually takes about 12–17 days, plus the pre-treatment evaluation beforehand." },
  { q: "Is egg retrieval painful?", a: "No. Egg retrieval is a short, painless procedure done through the vagina under light sedation — with no cut and no stitch. Most patients go home within about two hours." },
  { q: "How much does IVF cost at Bavishi Fertility Institute?", a: "Cost depends on your diagnosis, the protocol and any add-ons such as ICSI, PGT or donor programmes. Bavishi Fertility Institute offers transparent pricing with no hidden costs, easy / interest-free EMI and the Suraksha Kavach package. Book a consultation for a personalised estimate." },
  { q: "Does Bavishi Fertility Institute offer a money-back guarantee for IVF?", a: "Yes — through the Suraksha Kavach programme, which provides financial protection and assurance on your fertility journey. Speak to our team to see if you qualify." },
  { q: "Which is the best IVF centre in India?", a: "Bavishi Fertility Institute is one of India's most trusted IVF chains — operating since 1998 across 14 centres in 8 cities, with 25,000+ successful pregnancies and the National Fertility Award for five consecutive years." },
  { q: "What lifestyle changes should I make before starting IVF?", a: "Focus on a healthy lifestyle — a balanced diet, regular exercise, maintaining a healthy weight, and avoiding smoking and excessive alcohol. Your specialist will give you any additional, personalised advice during your consultation." },
  { q: "Are there any dietary recommendations during IVF?", a: "There are no strict restrictions, but a balanced diet rich in fruits, vegetables, whole grains and lean proteins is recommended, along with good hydration. Follow any specific guidance your clinic provides for your treatment." },
  { q: "What is embryo grading?", a: "Embryo grading assesses the quality of embryos based on their appearance and development. Higher-grade embryos are more likely to implant successfully, which is why our embryologists select the best-quality embryo(s) for transfer." },
  { q: "Can single individuals have a baby through IVF?", a: "Yes. IVF can be used by single individuals — with sperm collection for men, or donor sperm for women — and, where needed, a gestational carrier. Our team will explain the options available to you." },
];

/* ---------- additional content (migrated from the original IVF page) ---------- */
const advantages = [
  "Know the number and quality of your embryos before transfer.",
  "Select and transfer only the best-quality embryo(s).",
  "Freeze surplus embryos for the future by vitrification (~100% survival).",
  "Apply advanced fertilisation techniques such as ICSI when needed.",
  "Carry out genetic testing (PGT) on embryos where indicated.",
];

const ivfTypes = [
  { icon: FlaskConical, t: "Conventional IVF", d: "Eggs and sperm are combined in the lab and fertilisation happens on its own." },
  { icon: Microscope, t: "ICSI", d: "A single healthy sperm is injected directly into each mature egg — used for all couples at Bavishi Fertility Institute." },
  { icon: Layers, t: "Blastocyst Transfer", d: "Embryos are grown to day 5–6 (blastocyst) before transfer, for stronger selection." },
  { icon: Snowflake, t: "Frozen Embryo Transfer", d: "Surplus embryos are vitrified and transferred in a later cycle, with close to 100% thaw survival." },
  { icon: Leaf, t: "Natural IVF Cycle", d: "Uses your body's natural cycle with minimal medication to retrieve a single egg." },
];

const otherApplications = [
  { icon: Baby, t: "Egg (oocyte) donation", d: "For menopause or a very low egg count, donor eggs make pregnancy possible." },
  { icon: Users, t: "Surrogacy", d: "When carrying a pregnancy isn't possible; IVF embryo quality drives the result." },
  { icon: Dna, t: "Preventing genetic disorders", d: "PGT screens embryos to help avoid passing on conditions such as thalassemia." },
];

const timeline = [
  { day: "Day 1–12", t: "Ovarian stimulation", d: "Daily hormone injections grow multiple eggs, with regular ultrasound monitoring." },
  { day: "Trigger", t: "Final maturation", d: "A precise trigger injection matures the eggs ahead of retrieval." },
  { day: "34–36 hrs later", t: "Egg retrieval", d: "Eggs are collected through the vagina under short sedation — no cut, no stitch." },
  { day: "Same day", t: "Fertilisation (ICSI)", d: "The best sperm are selected and injected into each mature egg." },
  { day: "Day 2–6", t: "Embryo culture & transfer", d: "The best embryo(s) are transferred; surplus embryos are frozen." },
  { day: "Day 13–15", t: "Pregnancy test", d: "A Beta-HCG blood test confirms pregnancy." },
];

const protocols = [
  "Antagonist (Short) protocol",
  "Down-regulation (Long) protocol",
  "Flare protocol",
  "Dual stimulation protocol",
  "Minimum stimulation protocol",
];

const technology = [
  { icon: FlaskConical, t: "Class 1000 IVF Lab", d: "Air purity 10× cleaner than the international Class 10,000 standard — protecting embryos at every moment." },
  { icon: Microscope, t: "Body-like Incubators", d: "Next-generation incubators recreate the body's exact environment to grow healthy embryos." },
  { icon: Snowflake, t: "Vitrification", d: "Ultra-fast freezing of surplus embryos with close to 100% survival on thawing." },
  { icon: Dna, t: "ICSI & PGT", d: "Microinjection for every couple, plus pre-implantation genetic testing where indicated." },
];

const risks = [
  { t: "Multiple pregnancy", d: "Transferring more than one embryo can lead to twins or triplets.", help: "We favour elective single-embryo transfer wherever it's appropriate." },
  { t: "Ovarian Hyperstimulation (OHSS)", d: "Fertility medicines can occasionally over-stimulate the ovaries.", help: "Safe-stimulation protocols — with zero severe OHSS in over 10 years." },
  { t: "Ectopic pregnancy", d: "Rarely, an embryo implants outside the uterus.", help: "Early monitoring and Beta-HCG follow-up to detect it promptly." },
  { t: "Egg-retrieval risks", d: "As with any procedure, minor risks exist.", help: "A short, sedated, no-cut/no-stitch procedure by experienced specialists." },
  { t: "Emotional well-being", d: "Treatment can be an emotional journey.", help: "Counselling and compassionate support at every step." },
  { t: "Cost considerations", d: "IVF is an investment in your family.", help: "Transparent pricing, interest-free EMI and the Suraksha Kavach package." },
];

const preparation = [
  "Eat a balanced diet rich in fruits, vegetables, whole grains and lean protein.",
  "Stay well hydrated throughout the day.",
  "Exercise regularly and maintain a healthy weight.",
  "Avoid smoking and excessive alcohol.",
  "Take supplements only as advised by your doctor.",
  "Complete your pre-treatment evaluations and follow your clinic's guidance.",
];

const relatedTreatments = [
  "ICSI", "Male Infertility", "Female Infertility", "Fertility Preservation",
  "PGT (Genetic Testing)", "Endometriosis", "Azoospermia", "Surrogacy",
  "Egg Donation", "IVF Failure", "Cryopreservation", "Recurrent Miscarriage",
];

const IVF_VIDEO_ID = "owOgXgCQTX0"; // "Why IVF? — Dr. Himanshu Bavishi" (from the original IVF page)

const successFactors = [
  "Woman's age",
  "Embryo quality",
  "Number of embryos transferred",
  "Previous fertility history",
  "Egg & sperm health",
  "Overall reproductive health",
];

const costIncludes = [
  "Detailed treatment plan",
  "Clear pricing breakdown",
  "No hidden charges",
  "Easy / interest-free EMI options",
  "Personalised consultation",
  "Suraksha Kavach eligibility guidance",
];

/* ---------- FAQ accordion ---------- */
export function Faq({ q, a }: { q: React.ReactNode; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[color:var(--plum)]">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[color:var(--rose)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- lazy YouTube facade (loads iframe only on click) ---------- */
function LiteVideo({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-[color:var(--plum)]/5">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-[color:var(--plum)]/25 transition-colors duration-300 group-hover:bg-[color:var(--plum)]/15" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover:scale-110">
            <PlayCircle className="h-9 w-9" />
          </span>
        </button>
      )}
    </div>
  );
}

/* ---------- page ---------- */
export function IvfPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#treatments" className="hover:text-[color:var(--rose)]">Treatments</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">IVF Treatment</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal><Eyebrow>Advanced IVF Treatment</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                IVF Treatment <em className="font-display italic text-[color:var(--rose)]">In Vitro Fertilization</em> at Bavishi Fertility Institute
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                India's trusted IVF specialists since 1998 — 25,000+ successful pregnancies,
                Class 1000 IVF labs, and the Suraksha Kavach promise. Personalised, transparent
                and compassionate fertility care, every step of the way.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Consultation
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[color:var(--plum)]">
                {["25,000+ Pregnancies", "Since 1998", "Class 1000 Labs", "National Fertility Award 5×"].map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[color:var(--rose)]" /> {c}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                <img src={heroImg} alt="IVF / ICSI — sperm microinjection into an egg under the microscope at Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What is IVF */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead
              eyebrow="What is IVF"
              title={<>What is <em className="font-display italic text-[color:var(--rose)]">In Vitro Fertilization?</em></>}
            />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              <Reveal>
                <p>
                  <strong className="text-[color:var(--plum)]">In Vitro Fertilization (IVF)</strong> is an assisted-reproduction
                  technique in which an egg is fertilised by sperm in a laboratory, and the resulting embryo is placed into the
                  woman's uterus. "In vitro" means "outside the body" — so eggs are retrieved, fertilised and grown in the lab,
                  and the best embryos are then transferred to achieve pregnancy.
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p>
                  Popularly known as the "test-tube baby" technique, IVF is today one of the most successful fertility treatments
                  in the world — more than <strong className="text-[color:var(--plum)]">5 million healthy babies</strong> have been
                  born through IVF, and that number is rising every year. It is the right choice when simpler treatments have not
                  worked, or when specific medical conditions make natural conception difficult.
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.1}>
            <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">About Bavishi Fertility Institute</div>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--plum)]/90">
                Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1998 with
                14 centres across 8 cities. Bavishi Fertility Institute has achieved 25,000+ successful IVF pregnancies, holds the National Fertility
                Award for five consecutive years (2021–2025), and is FOGSI-certified — pioneering IVF in India and running
                Class 1000 embryology labs.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Advantages of IVF */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Advantages"
            title={<>The advantages of <em className="font-display italic text-[color:var(--rose)]">IVF</em></>}
            subtitle="Beyond helping you conceive, IVF gives your specialist powerful tools to maximise your chances safely."
          />
          <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((t) => (
              <StaggerItem key={t}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{t}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Types of IVF */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow="Types of IVF"
          title={<>IVF and its <em className="font-display italic text-[color:var(--rose)]">related techniques</em></>}
          subtitle="Your treatment is tailored to your diagnosis — using the technique most likely to succeed for you."
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ivfTypes.map((x) => (
            <StaggerItem key={x.t}>
              <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><x.icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{x.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{x.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Other applications */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Other applications"
            title={<>Other ways IVF <em className="font-display italic text-[color:var(--rose)]">helps families</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {otherApplications.map((x) => (
              <StaggerItem key={x.t}>
                <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><x.icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{x.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{x.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Who needs IVF */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            eyebrow="Indications"
            title={<>Who needs <em className="font-display italic text-[color:var(--rose)]">IVF treatment?</em></>}
            subtitle="Your specialist may recommend IVF in any of the following situations. A thorough evaluation always comes first, so your plan is tailored to you."
          />
          <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indications.map((t) => (
              <StaggerItem key={t}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{t}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* IVF Process */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow="Step by Step"
          title={<>The IVF process at <em className="font-display italic text-[color:var(--rose)]">Bavishi Fertility Institute</em></>}
          subtitle="From your first consultation to your pregnancy test, every stage is handled with precision, safety and care."
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--rose)] font-display text-lg font-semibold text-white shadow-sm shadow-[color:var(--rose)]/30 ring-4 ring-[color:var(--rose)]/10">{s.n}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[color:var(--plum)]">{s.t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-[color:var(--rose)]" /> Active treatment — egg formation to embryo transfer — typically takes just 12–17 days.
          </div>
        </Reveal>
      </section>

      {/* Treatment timeline (day-by-day) + protocols */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Treatment Timeline"
            title={<>Your IVF cycle, <em className="font-display italic text-[color:var(--rose)]">day by day</em></>}
            subtitle="From egg formation to embryo transfer, the active treatment usually takes just 12–17 days."
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {timeline.map((s, i) => (
              <StaggerItem key={s.t}>
                <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">{s.day}</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--rose)] text-[11px] font-bold text-white">{i + 1}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[color:var(--plum)]">{s.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-3xl text-center">
              <p className="text-sm text-muted-foreground">Your stimulation is fully personalised — your specialist selects the protocol best suited to your body and history:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {protocols.map((p) => (
                  <span key={p} className="rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-medium text-[color:var(--plum)] shadow-soft">{p}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Educational video */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHead
              eyebrow="Watch & Learn"
              title={<>Why IVF? <em className="font-display italic text-[color:var(--rose)]">Explained by our experts</em></>}
            />
            <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground text-pretty">
              Dr. Himanshu Bavishi explains who IVF is for, how it works and what to expect — so you can take your
              next step with clarity and confidence.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                <Calendar className="h-4 w-4" /> Book Consultation
              </Magnetic>
              <Magnetic as="a" href="https://www.youtube.com/@BavishiFertilityInstitute/videos" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                <PlayCircle className="h-4 w-4" /> More Videos
              </Magnetic>
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-lift ring-1 ring-black/5">
              <LiteVideo id={IVF_VIDEO_ID} title="Why IVF? — Dr. Himanshu Bavishi" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Technology & Laboratory */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Technology & Laboratory"
            title={<>The science behind <em className="font-display italic text-[color:var(--rose)]">your success</em></>}
            subtitle="World-class infrastructure and embryology that protect your embryos at every step."
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technology.map((w) => (
              <StaggerItem key={w.t}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><w.icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{w.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why Bavishi Fertility Institute */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Why Bavishi Fertility Institute"
            title={<>Why choose Bavishi Fertility Institute for <em className="font-display italic text-[color:var(--rose)]">your IVF?</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyBfi.map((w) => (
              <StaggerItem key={w.t}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                    <w.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{w.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Success & cost */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">
                <Star className="h-4 w-4 fill-[color:var(--gold)] text-[color:var(--gold)]" /> Success & Safety
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--plum)]">Real chances, honestly explained</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Every fertility journey is unique. <strong className="text-[color:var(--plum)]">IVF success rates</strong> depend
                on several medical and lifestyle factors.
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">Factors affecting IVF success</p>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {successFactors.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[14px] text-[color:var(--plum)]/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[color:var(--rose-soft)]/40 p-4 text-[14px] leading-relaxed text-[color:var(--plum)]/90">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                <span>At Bavishi Fertility Institute, we focus on <strong className="text-[color:var(--plum)]">personalised treatment plans</strong> rather than one-size-fits-all success claims.</span>
              </div>
              <p className="mt-auto pt-4 text-xs leading-relaxed text-muted-foreground/80">
                Success rates vary by age, diagnosis and individual medical factors.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">
                <ShieldCheck className="h-4 w-4" /> Cost & Assurance
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--plum)]">Transparent, with no hidden costs</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Know exactly what your <strong className="text-[color:var(--plum)]">IVF treatment cost</strong> includes before you begin.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {costIncludes.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[14px] text-[color:var(--plum)]/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-3 text-sm font-semibold text-white shadow-soft">
                  Get a personalised estimate <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <p className="mt-4 text-[13px] italic leading-relaxed text-muted-foreground">
                  "We believe informed patients make confident decisions."
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Risks & considerations */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Risks & Considerations"
            title={<>Honest about the risks — and <em className="font-display italic text-[color:var(--rose)]">how we manage them</em></>}
            subtitle="IVF is very safe in expert hands. Here's what to be aware of — and how Bavishi Fertility Institute keeps you protected at every step."
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {risks.map((r) => (
              <StaggerItem key={r.t}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                  <h3 className="text-lg font-semibold text-[color:var(--plum)]">{r.t}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{r.d}</p>
                  <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[color:var(--rose-soft)]/40 p-3.5 text-[13px] leading-relaxed text-[color:var(--plum)]/90">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                    <span><strong className="font-semibold text-[color:var(--plum)]">How We Help:</strong> {r.help}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Preparing for IVF */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow="Preparing for IVF"
          title={<>Simple ways to <em className="font-display italic text-[color:var(--rose)]">prepare for your cycle</em></>}
          subtitle="Small, healthy steps can support your treatment. Your specialist will personalise this guidance for you."
        />
        <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preparation.map((t) => (
            <StaggerItem key={t}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{t}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* FAQ */}
      <section className="bg-white py-8 md:py-14">
        <div className="container-px mx-auto max-w-3xl">
          <SectionHead
            center
            eyebrow="FAQ"
            title={<>IVF — <em className="font-display italic text-[color:var(--rose)]">your questions answered</em></>}
          />
          <div className="mt-9 space-y-3">
            {faqs.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground/80">
            This page is for educational purposes and is medically reviewed by the fertility specialists at Bavishi Fertility
            Institute. It is not a substitute for personal medical advice — please consult our doctors for guidance specific to you.
          </p>
        </div>
      </section>

      {/* Our network — locations (reused) */}
      <Locations />

      {/* Related treatments & conditions (links coming as pages are built) */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Explore More"
            title={<>Related fertility <em className="font-display italic text-[color:var(--rose)]">treatments & conditions</em></>}
            subtitle="Dedicated pages for each of these are on the way."
          />
          <Stagger className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {relatedTreatments.map((t) => (
              <StaggerItem key={t}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2.5 text-sm font-medium text-[color:var(--plum)] shadow-soft">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {t}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Ready to begin your <em className="font-display italic text-[color:var(--rose-soft)]">IVF journey?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Speak with our fertility experts today — confidential, compassionate and complimentary.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
                <Calendar className="h-4 w-4" /> Book Consultation
              </Magnetic>
              <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                <Phone className="h-4 w-4" /> +91 97126 22288
              </Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
