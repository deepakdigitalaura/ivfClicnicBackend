"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2, Award, Microscope,
  HeartPulse, ShieldCheck, Users, Building2, Sparkles,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Doctors, AwardsCarousel, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";

const aboutImg = "/assets/about-bavishi-family.png";

const milestones = [
  { y: "1984", t: "The journey begins", d: "Dr. Himanshu & Dr. Falguni Bavishi found Bavishi Fertility Institute in Ahmedabad with one promise — fertility care above international standards, with an Indian heart." },
  { y: "1998", t: "Pioneering IVF in India", d: "Bavishi Fertility Institute helps bring modern IVF and assisted reproduction to thousands of Indian families." },
  { y: "Firsts", t: "Two national firsts", d: "India's first live birth from a vitrified (frozen) egg, and India's first surrogacy for an international couple — milestones that shaped Indian reproductive medicine." },
  { y: "2021–25", t: "National Fertility Award", d: "Honoured for excellence in IVF & fertility care for five consecutive years — a record of consistency, not chance." },
  { y: "Today", t: "15 centres, one family", d: "30,000+ successful pregnancies, 3,000+ IVF cycles every year, and Class 1000 embryology labs across 8 Indian cities." },
];

const trustPillars = [
  { icon: Award, t: "Four Decades of Experience", d: "Since 1984, a family-led institute that pioneered IVF in India and has guided 30,000+ families to parenthood." },
  { icon: HeartPulse, t: "Outcomes That Matter", d: "3,000+ IVF cycles a year with a focus on safe stimulation, best-quality embryos and healthy single pregnancies." },
  { icon: Users, t: "A Family of Specialists", d: "Reproductive endocrinologists, embryologists, andrologists, fetal-medicine experts, counsellors and nutritionists under one roof." },
  { icon: Microscope, t: "World-Class Technology", d: "Class 1000 IVF labs — 10× cleaner than the international standard — with time-lapse imaging, vitrification and PGT." },
  { icon: ShieldCheck, t: "Transparency & Ethics", d: "Honest counselling, no hidden costs, double-witnessing of every sample, and the Suraksha Kavach assurance." },
  { icon: Sparkles, t: "Simple · Safe · Smart · Successful", d: "Our four values shape every plan — personalised, compassionate and judicious use of advanced reproductive technology." },
];

const cities = [
  { c: "Ahmedabad", n: "3 centres" }, { c: "Mumbai", n: "6 centres" },
  { c: "Vadodara", n: "1 centre" }, { c: "Surat", n: "1 centre" },
  { c: "Bhuj", n: "1 centre" }, { c: "Bhavnagar", n: "1 centre" },
  { c: "Anand", n: "1 centre" }, { c: "Varanasi", n: "1 centre" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">About Bavishi Fertility Institute</span>
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
            <Reveal><Eyebrow>About Bavishi Fertility Institute</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                Four decades of <em className="font-display italic text-[color:var(--rose)]">fertility excellence</em> — built on hope
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                Since 1984, Bavishi Fertility Institute has helped over 30,000 families experience the joy of parenthood —
                pioneering IVF in India and growing into one of the country's most trusted fertility networks, with 15 centres
                across 8 cities.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="/what-is-ivf" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  Explore IVF <ArrowRight className="h-4 w-4" />
                </Magnetic>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <Float amplitude={8}>
                <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                  <img src={aboutImg} alt="The Bavishi family — founders and second-generation doctors of Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
                </div>
              </Float>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead eyebrow="Our Story" title={<>A family's vision, an <em className="font-display italic text-[color:var(--rose)]">institution's legacy</em></>} />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              <Reveal><p>Bavishi Fertility Institute was founded in 1984 by <strong className="text-[color:var(--plum)]">Dr. Himanshu Bavishi</strong> and <strong className="text-[color:var(--plum)]">Dr. Falguni Bavishi</strong> with a simple but powerful belief: that world-class fertility care should be within every family's reach — delivered with science, sincerity and a deeply human touch.</p></Reveal>
              <Reveal delay={0.05}><p>What began as a single clinic in Ahmedabad has grown into a multi-centre institute that pioneered IVF in India, achieved national firsts, and today welcomes the second generation of Bavishi doctors. Through every year, the mission has stayed the same — to achieve excellence through knowledge, innovation and research, and to offer customised, safe and effective treatment.</p></Reveal>
              <Reveal delay={0.1}><p>Our values guide everything we do: <strong className="text-[color:var(--plum)]">Simple, Safe, Smart and Successful</strong>. We believe in being a pioneer and leader — the most preferred fertility institute, offering IVF & ART above international standards, with an Indian heart and at India-friendly cost.</p></Reveal>
            </div>
          </div>
          <Reveal delay={0.1}>
            <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">At a glance</div>
              <dl className="mt-4 space-y-4">
                {[["1984", "Founded in Ahmedabad"], ["30,000+", "Successful pregnancies"], ["3,000+", "IVF cycles every year"], ["15", "Centres across 8 cities"], ["5×", "National Fertility Award (2021–25)"]].map(([n, l]) => (
                  <div key={l} className="flex items-baseline gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <dt className="font-display text-2xl font-medium text-[color:var(--plum)]">{n}</dt>
                    <dd className="text-sm text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Legacy timeline */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="40+ Years of Legacy" title={<>Milestones that shaped <em className="font-display italic text-[color:var(--rose)]">Indian fertility care</em></>} />
          <div className="mx-auto mt-10 max-w-3xl">
            <Stagger className="relative space-y-8 border-l-2 border-[color:var(--rose)]/20 pl-8">
              {milestones.map((m) => (
                <StaggerItem key={m.t}>
                  <div className="relative">
                    <span className="absolute -left-[2.6rem] top-1 grid h-6 w-6 place-items-center rounded-full bg-[color:var(--rose)] text-[10px] font-bold text-white ring-4 ring-white">●</span>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">{m.y}</div>
                    <h3 className="mt-1 text-xl font-semibold text-[color:var(--plum)]">{m.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Why families trust */}
      <section className="bg-[color:var(--ivory)] py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Why Bavishi Fertility Center" title={<>Why families across India <em className="font-display italic text-[color:var(--rose)]">trust Bavishi Fertility Institute</em></>} />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trustPillars.map((p) => (
              <StaggerItem key={p.t}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><p.icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{p.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Meet experts (reused) — wrapped in a blush band so it alternates with
          its ivory (Why-trust) and white (Awards) neighbours */}
      <div className="bg-[color:var(--rose-soft)]/40"><Doctors /></div>

      {/* Awards (reused) */}
      <AwardsCarousel />

      {/* Patient success focus */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px] grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Patient First" title={<>More than treatment — <em className="font-display italic text-[color:var(--rose)]">a community of hope</em></>} />
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
              <Reveal><p>Fertility is a deeply personal journey, and no two stories are the same. Beyond advanced laboratories and protocols, what truly sets Bavishi Fertility Institute apart is how we walk beside you — with patience, transparency and genuine care at every step.</p></Reveal>
              <Reveal delay={0.05}><p>Through emotional counselling, nutrition guidance and our patient support community, families never feel alone. And with the <strong className="text-[color:var(--plum)]">Suraksha Kavach</strong> assurance, you can focus on what matters most — your journey to your baby.</p></Reveal>
            </div>
          </div>
          <Stagger className="grid grid-cols-2 gap-4">
            {[["30,000+", "Happy families"], ["40+", "Years of fertility expertise"], ["300+", "International patients a year"], ["8", "Cities, one standard of care"]].map(([n, l]) => (
              <StaggerItem key={l}>
                <div className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft">
                  <div className="font-display text-3xl font-medium text-[color:var(--plum)]">{n}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{l}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Centres across India */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow="Our Network" title={<>15 centres across <em className="font-display italic text-[color:var(--rose)]">8 Indian cities</em></>} subtitle="World-class fertility care, close to home — wherever you are." />
        <Stagger className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((c) => (
            <StaggerItem key={c.c}>
              <a href={c.c === "Ahmedabad" ? "/locations/ahmedabad" : "/#locations"} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[color:var(--plum)]"><Building2 className="h-4 w-4 text-[color:var(--rose)]" /> {c.c}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.n}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[color:var(--rose)] transition-transform group-hover:translate-x-1" />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] pb-8 md:pb-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Begin your journey with <em className="font-display italic text-[color:var(--rose-soft)]">people who care.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp Us</Magnetic>
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

