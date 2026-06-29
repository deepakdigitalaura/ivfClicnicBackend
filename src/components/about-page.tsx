"use client";
import {
  ArrowRight, Calendar, MessageCircle, CheckCircle2, Building2,
  Target, Eye, FlaskConical, Cpu, Heart, RadioTower, GraduationCap,
  Newspaper, Trophy, Globe, Star, Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic, Float } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Doctors, AwardsCarousel, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Editable, EditableImage } from "@/components/editor/Editable";
import { useEdit } from "@/components/editor/edit-context";
import { ABOUT_DEFAULTS, type AboutData } from "@/lib/about";
import { resolveIcon } from "@/lib/icon-map";

/* `<Editable>` is inert on the public site (byte-identical) and click-to-edit
 * inside /edit/about-bfi. `path` is the dot-path into the about-page global
 * SOURCE draft (see materializeAboutSource). */
const ed = (path: string, value: string, rich = true) => (
  <Editable path={path} rich={rich}>{value}</Editable>
);

/* The page's STRUCTURED editorial content is CMS-managed via the `about-page`
 * global (Wave 4.5, Phase E); the route server-resolves it and prop-drills the
 * plain `AboutData` here. Falls back to ABOUT_DEFAULTS so the page is byte-
 * identical when the global is empty (same pattern as <HomePage>). The inline-
 * <strong> "Our Story"/"Patient First" prose, the decorative <SectionHead> <em>
 * titles, hero/CTA button hrefs+icons, the JSON-LD graph and the reused
 * <Doctors>/<AwardsCarousel> sections stay code-owned. */
export function AboutPage({ data = ABOUT_DEFAULTS }: { data?: AboutData } = {}) {
  const editing = !!useEdit()?.editMode;
  // Reconstruct the hero <h1> as lead + accent <em> + tail from the headline +
  // italic phrase, so the markup stays byte-identical while the words are CMS-
  // editable (the italic phrase appears mid-headline).
  const [heroLead, heroTail] = data.hero.headline.split(data.hero.headlineItalic);
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
            <Reveal><Eyebrow>{ed("hero.eyebrow", data.hero.eyebrow)}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {editing ? (
                  ed("hero.headline", data.hero.headline)
                ) : (
                  <>{heroLead}<em className="font-display italic text-[color:var(--rose)]">{data.hero.headlineItalic}</em>{heroTail}</>
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {ed("hero.paragraph", data.hero.paragraph)}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/contact#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Consultation
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
                  {editing ? (
                    <EditableImage path="hero.image" src={data.hero.image} alt="The Bavishi family — founders and second-generation doctors of Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <img src={data.hero.image} alt="The Bavishi family — founders and second-generation doctors of Bavishi Fertility Institute" className="aspect-[4/5] w-full object-cover" />
                  )}
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
            <SectionHead
              eyebrow={ed("story.eyebrow", data.story.eyebrow)}
              title={<>{ed("story.heading.lead", data.story.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("story.heading.em", data.story.heading.em)}</em></>}
            />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {data.story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><Editable path={`story.paragraphs.${i}.value`} as="p">{p}</Editable></Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">At a glance</div>
              <dl className="mt-4 space-y-4">
                {data.atAGlance.map(({ n, l }, i) => (
                  <div key={i} className="flex items-baseline gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <dt className="font-display text-2xl font-medium text-[color:var(--plum)]">{ed(`atAGlance.${i}.value`, n)}</dt>
                    <dd className="text-sm text-muted-foreground">{ed(`atAGlance.${i}.label`, l)}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-[color:var(--ivory)] py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Mission · Vision · Values"
            title={<>What drives everything <em className="font-display italic text-[color:var(--rose)]">we do</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)] mb-5"><Target className="h-6 w-6" /></div>
                <h3 className="text-xl font-semibold text-[color:var(--plum)] mb-3">Mission</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">Achieve excellence through knowledge, education, training, brainstorming, innovation, experimentation, analysis, and research. Provide customised, personalised, simple, effective and safe treatment to every couple. Create the best qualified, experienced and expert team of medical professionals, reproductive biologists, counsellors and support staff. Impart all the best <a href="/what-is-ivf" className="text-[color:var(--plum)] underline">IVF treatments</a> in India under one roof — without any discrimination — and spread the benefits of the latest technology. An ideal blend of professional treatment and personalised care.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/40 p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--plum)]/10 text-[color:var(--plum)] mb-5"><Eye className="h-6 w-6" /></div>
                <h3 className="text-xl font-semibold text-[color:var(--plum)] mb-3">Vision</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">Be a pioneer and leader as the most preferred fertility institute, and provide <a href="/what-is-ivf" className="text-[color:var(--plum)] underline">IVF</a> &amp; ART treatment above international standards — with Indian heart and at India-friendly cost. The best IVF institute in India.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)] mb-5"><Star className="h-6 w-6" /></div>
                <h3 className="text-xl font-semibold text-[color:var(--plum)] mb-3">Values</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground"><strong className="text-[color:var(--plum)]"><a href="/simple-treatment" className="text-[color:var(--plum)]">Simple</a>, <a href="/safe-treatment" className="text-[color:var(--plum)]">Safe</a>, <a href="/smart-treatment" className="text-[color:var(--plum)]">Smart</a> and <a href="/success-benchmarks" className="text-[color:var(--plum)]">Successful</a>!</strong> The qualified, experienced, skilled and dedicated team delivers the best outcomes. Every decision is guided by evidence, every interaction by empathy — making your fertility journey as smooth as possible.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Infrastructure & Technology */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow="Infrastructure & Technology"
          title={<>World-class labs and <em className="font-display italic text-[color:var(--rose)]">intelligent care</em></>}
        />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><FlaskConical className="h-6 w-6" /></div>
                <h3 className="text-xl font-semibold text-[color:var(--plum)]">Infrastructure</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">We have a highly automated and optimised environment. For the past 35+ years, we continue to research and innovate to ensure that treatments are done in the best possible environment.</p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">Our <strong className="text-[color:var(--plum)]">Class 1000 <a href="/what-is-ivf" style={{color: "var(--plum)"}}>IVF</a> labs</strong> — 10× cleaner than the international standard — provide the best IVF lab embryo culture environment. Every lab is equipped with time-lapse imaging, <a href="/cryopreservation" className="text-[color:var(--plum)] underline">vitrification</a>, and advanced preimplantation genetic testing (PGT).</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Cpu className="h-6 w-6" /></div>
                <h3 className="text-xl font-semibold text-[color:var(--plum)]">Technology</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">Bavishi Fertility Institute has changed the traditional medical system by deploying cutting-edge informational technologies such as <strong className="text-[color:var(--plum)]">big data, cloud computing, and artificial intelligence.</strong></p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">Through these technologies, we carefully suggest the treatment options and injections that are worth the extra cost for your individual case — making personalised care both data-driven and deeply human.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* All Treatments Under One Roof */}
      <section className="bg-[color:var(--rose-soft)]/20 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Comprehensive Fertility Care"
            title={<>All treatments offered <em className="font-display italic text-[color:var(--rose)]">under one roof</em></>}
            subtitle="Any problem — the best solution — under one roof = Bavishi Fertility Institute!"
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { t: "Male & Female Infertility", href: "/treatments/male-infertility" },
              { t: "IVF – ICSI – ART", href: "/what-is-ivf" },
              { t: "Advanced Reproductive Techniques", href: "/treatments/advanced-fertility-techniques" },
              { t: "Egg Donation", href: "/egg-donation" },
              { t: "Surrogacy", href: null },
              { t: "Fertility Preservation – Egg / Embryo Freezing", href: "/cryopreservation" },
              { t: "Preimplantation Genetic Testing (PGT / PGD)", href: null },
              { t: "IUI (Intrauterine Insemination)", href: "/intra-uterine-insemination-iui" },
              { t: "Laparoscopy / Hysteroscopy", href: null },
              { t: "Ovary Rejuvenation – PRP / Stem Cell", href: "/ovarian-rejuvenation" },
              { t: "Fibroids & Endometriosis", href: "/fibroids" },
              { t: "Semen Analysis & Banking", href: null },
            ] as { t: string; href: string | null }[]).map(({ t, href }, i) => (
              <StaggerItem key={i}>
                {href ? (
                  <a href={href} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[color:var(--rose)]" />
                    <span className="text-[15px] font-medium text-[color:var(--plum)]">{t}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[color:var(--rose)]" />
                    <span className="text-[15px] font-medium text-[color:var(--plum)]">{t}</span>
                  </div>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why families trust */}
      <section className="bg-[color:var(--ivory)] py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow={ed("trust.eyebrow", data.trust.eyebrow)}
            title={<>{ed("trust.heading.lead", data.trust.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("trust.heading.em", data.trust.heading.em)}</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.trustPillars.map((p, i) => {
              const Icon = resolveIcon(p.icon);
              return (
              <StaggerItem key={i}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{ed(`trustPillars.${i}.t`, p.t)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{ed(`trustPillars.${i}.d`, p.d)}</p>
                </div>
              </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Meet experts (reused) — wrapped in a blush band so it alternates with
          its ivory (Why-trust) and white (Awards) neighbours */}
      <div className="bg-[color:var(--rose-soft)]/40">
        <Doctors
          eyebrow={ed("meetSpecialists.eyebrow", data.meetSpecialists.eyebrow)}
          title={<>{ed("meetSpecialists.heading.lead", data.meetSpecialists.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("meetSpecialists.heading.em", data.meetSpecialists.heading.em)}</em></>}
          subtitle={ed("meetSpecialists.subtitle", data.meetSpecialists.subtitle)}
        />
      </div>

      {/* Awards (reused) */}
      <AwardsCarousel />

      {/* Unique Achievements */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow="Unique Achievements"
          title={<>Firsts that shaped <em className="font-display italic text-[color:var(--rose)]">Indian fertility care</em></>}
          subtitle="Bavishi Fertility Institute has achieved landmark firsts in Indian reproductive medicine — honours that reflect the trust of thousands of families."
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {([
            { Icon: Trophy, year: "2009", t: "India's First — Vitrified Frozen Oocyte Baby", d: "Bavishi Fertility Institute achieved the first live birth in India with a vitrified frozen egg — a landmark milestone that reshaped Indian reproductive medicine and opened a new era of <a href='/cryopreservation' style='color:var(--plum);text-decoration:underline'>fertility preservation</a>." },
            { Icon: Globe, year: "2009", t: "First European Surrogacy in India", d: "First surrogacy for a European couple — a testament to the institute's world-class capabilities, ethical standards, and international trust built over decades." },
            { Icon: Star, year: "2016–2020", t: "No. 1 in Western India — 5 Consecutive Years", d: "Ranked No. 1 fertility clinic in Western India for five consecutive years by the Times of India national survey (2016, 2017, 2018, 2019, 2020)." },
            { Icon: Trophy, year: "2020", t: "Ranked All India No. 1", d: "Ranked All India No. 1 in 2020 by the Times of India National Survey of fertility clinics — the highest national recognition for clinical excellence." },
            { Icon: Award, year: "2014", t: "Founded INSTAR", d: "Founded INSTAR (Indian Society of Third Party Assisted Reproduction) — advancing ethical standards in <a href='/egg-donation' style='color:var(--plum);text-decoration:underline'>egg donation</a>, <a href='/sperm-donation' style='color:var(--plum);text-decoration:underline'>sperm donation</a> and surrogacy programmes across India." },
            { Icon: Award, year: "6 Times", t: "National Award — 6 Consecutive Years", d: "Received the 'Best IVF Chain in India – West' award by The Economic Times for six consecutive years — reinforcing BFI's position as the nation's most trusted fertility network." },
          ] as { Icon: LucideIcon, year: string, t: string, d: string }[]).map(({ Icon, year, t, d }, i) => (
            <StaggerItem key={i}>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Icon className="h-5 w-5" /></div>
                  <span className="text-xs font-semibold text-[color:var(--rose)] bg-[color:var(--rose)]/10 px-3 py-1 rounded-full">{year}</span>
                </div>
                <h3 className="text-base font-semibold text-[color:var(--plum)] mb-2">{t}</h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: d }} />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Patient success focus */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px] grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow={ed("patientFirst.eyebrow", data.patientFirst.eyebrow)}
              title={<>{ed("patientFirst.heading.lead", data.patientFirst.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("patientFirst.heading.em", data.patientFirst.heading.em)}</em></>}
            />
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
              {data.patientFirst.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><Editable path={`patientFirst.paragraphs.${i}.value`} as="p">{p}</Editable></Reveal>
              ))}
            </div>
          </div>
          <Stagger className="grid grid-cols-2 gap-4">
            {data.patientStats.map(({ n, l }, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft">
                  <div className="font-display text-3xl font-medium text-[color:var(--plum)]">{ed(`patientStats.${i}.value`, n)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{ed(`patientStats.${i}.label`, l)}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Social Activities, Public Awareness & Training */}
      <section className="bg-[color:var(--ivory)] py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead
            center
            eyebrow="Community & Knowledge"
            title={<>Beyond treatment — giving <em className="font-display italic text-[color:var(--rose)]">back to society</em></>}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)] mb-5"><Heart className="h-6 w-6" /></div>
                <h3 className="text-lg font-semibold text-[color:var(--plum)] mb-3">Social Activities — Divya Santan Parivar</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">One of its kind patient support group — <strong className="text-[color:var(--plum)]">Divya Santan Parivar</strong> — inspired and formed with the guidance from Bavishi Fertility Institute. This unique support group, formed by successful IVF-conceived patients, provides information, guidance, inspiration and solace to those on their fertility journey.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/40 p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)] mb-5"><RadioTower className="h-6 w-6" /></div>
                <h3 className="text-lg font-semibold text-[color:var(--plum)] mb-3">Public Awareness Activities</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">Knowledge is the key. We organised massive <strong className="text-[color:var(--plum)]">Jan Jagruti Abhiyan – Parivar Milan</strong> programmes to provide correct scientific guidance at the patient&apos;s own doorstep. We empower couples through books, TV talk shows, FB live, YouTube education sessions and <a href="/blogs" className="text-[color:var(--plum)] underline">blogs</a>.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)] mb-5"><GraduationCap className="h-6 w-6" /></div>
                <h3 className="text-lg font-semibold text-[color:var(--plum)] mb-3">Training Programmes</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">We believe in sharing and spreading knowledge. Hundreds of clinicians and technicians are trained by Bavishi Fertility Institute. We actively collaborate with the <strong className="text-[color:var(--plum)]">Diamond Institute of the USA</strong> to train future professionals in advanced reproductive medicine.</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* Bavishi in the News */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          eyebrow="Bavishi Fertility Institute in News"
          title={<>Stories that <em className="font-display italic text-[color:var(--rose)]">inspire hope</em></>}
        />
        <Reveal delay={0.1}>
          <div className="mt-8 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/20 p-8 md:p-10">
            <div className="flex items-start gap-5">
              <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Newspaper className="h-6 w-6" /></div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)] mb-3">Surrogacy Stays Within The Great Gujarati Family</div>
                <p className="text-[16px] leading-relaxed text-muted-foreground">GK Mawani and his wife Rama celebrated their son Jay&apos;s first birthday in <a href="/locations/surat" className="text-[color:var(--plum)] underline">Surat</a> (2009). Also present at the party was Chetna (26), who gave birth to Jay. Chetna is the wife of Mawani&apos;s nephew. Rama hadn&apos;t been able to conceive in her 16-year marriage, so Chetna agreed to carry her uncle&apos;s child as a surrogate mother — made possible by Bavishi Fertility Institute&apos;s expertise in surrogacy and compassionate care.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Centres across India */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow={ed("network.eyebrow", data.network.eyebrow)} title={<>{ed("network.heading.lead", data.network.heading.lead)} <em className="font-display italic text-[color:var(--rose)]">{ed("network.heading.em", data.network.heading.em)}</em></>} subtitle={ed("network.subtitle", data.network.subtitle)} />
        <Stagger className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.network.cities.map((c, i) => (
            <StaggerItem key={i}>
              <a href={`/locations/${c.c.toLowerCase()}`} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[color:var(--plum)]"><Building2 className="h-4 w-4 text-[color:var(--rose)]" /> {ed(`network.cities.${i}.c`, c.c)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{ed(`network.cities.${i}.n`, c.n)}</div>
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
              {ed("finalCta.heading.lead", data.finalCta.heading.lead)} <em className="font-display italic text-[color:var(--rose-soft)]">{ed("finalCta.heading.em", data.finalCta.heading.em)}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/contact#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> {data.finalCta.ctas[0]}</Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> {data.finalCta.ctas[1]}</Magnetic>
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

