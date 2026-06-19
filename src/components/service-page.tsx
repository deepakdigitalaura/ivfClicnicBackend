"use client";
import Image from "next/image";
import {
  ArrowRight, Phone, MessageCircle, Calendar, CheckCircle2, MapPin, Stethoscope,
  Clock, Navigation,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Calculators, TreatmentCard } from "@/components/home-page";
import { centresForLocationSlugs, centreMapUrl, centreHref } from "@/lib/locations";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead, Faq } from "@/components/ivf-page";
import { MedicalReviewer } from "@/components/medical-reviewer";
import { Linkify } from "@/components/linkify";
import { Editable, EditableImage } from "@/components/editor/Editable";
import { useEdit } from "@/components/editor/edit-context";
import { doctorBySlug, doctorUrl } from "@/lib/doctors";
import { type ServiceHeading } from "@/lib/womens-health";
import { resolveServiceFromCode, type ResolvedService } from "@/lib/services";
import { resolveIcon } from "@/lib/icon-map";

/* ---------- inline-edit helper ----------
 * `<Editable>` is inert on the public site (renders bare children, byte-identical)
 * and becomes click-to-edit only inside /edit/services/<slug>. `path` is the
 * dot-path into the services-doc SOURCE draft (see materializeServiceSource).
 * Fields feeding JSON-LD/meta (FAQ q/a) pass rich={false} → stored value stays
 * plain text so the structured data is unchanged. */
const ed = (path: string, value: string, rich = true) => (
  <Editable path={path} rich={rich}>{value}</Editable>
);

// HTML helpers for the italic rose accent word used in section headings.
const EM = 'class="font-display italic text-[color:var(--rose)]"';
const EMS = 'class="font-display italic text-[color:var(--rose-soft)]"';
const em = (t: string, soft = false) => `<em ${soft ? EMS : EM}>${t}</em>`;

/* ---------- heading renderer (data → SectionHead title) ----------
 * `base` is the heading's source path (e.g. "benefits.heading"). When supplied,
 * the lead + accent become inline-editable; otherwise it renders plain. */
function H({ h, base }: { h: ServiceHeading; base?: string }) {
  return (
    <>
      {base ? ed(`${base}.lead`, h.lead) : h.lead}
      {h.em ? <> <em className="font-display italic text-[color:var(--rose)]">{base ? ed(`${base}.em`, h.em) : h.em}</em></> : null}
    </>
  );
}

/* ---------- reusable maternity service page ----------
 * Receives the CMS-resolved `content` as a fully-serializable prop (icons are
 * NAMES, mapped back to Lucide components here via resolveIcon) — so the lucide
 * *components* never cross the Server→Client boundary. When no prop is supplied
 * it falls back to the typed code defaults for `slug` (coexistence), so the page
 * still renders if a doc is missing. The route builds JSON-LD server-side from
 * the same resolved data via serviceGraph(). */
export function ServicePage({ slug, content }: { slug: string; content?: ResolvedService }) {
  const editing = !!useEdit()?.editMode;
  const s = content ?? resolveServiceFromCode(slug);
  if (!s) return null;
  const sl = s.sectionLabels ?? {};
  const reviewer = doctorBySlug(s.reviewerSlug);
  const related = s.related;
  // These maternity services are offered only in Ahmedabad — show the head-office
  // contact card instead of the all-India network section.
  const ahmedabadCentre = centresForLocationSlugs(["paldi"])[0];

  /* render-order zebra — see treatment-page for rationale. */
  let _band = 0;
  const band = () => (_band++ % 2 === 0 ? "bg-[color:var(--ivory)]" : "bg-[color:var(--rose-soft)]/40");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Maternity vertical uses the "Bavishi Fertility & Birthing" sub-brand logo.
          (Legal entity in the footer stays "Bavishi Fertility Institute Pvt. Ltd.") */}
      <SiteHeader logoSrc="/assets/bavishi-fertility-birthing.png" logoAlt="Bavishi Fertility & Birthing" />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#treatments" className="hover:text-[color:var(--rose)]">Maternity Services</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{s.breadcrumbName}</span>
        </nav>
      </div>

      {/* 1. Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                <span className="h-px w-6 bg-[color:var(--rose)]/60" /> {ed("hero.eyebrow", s.hero.eyebrow)}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {ed("hero.h1", s.hero.h1)} <em className="font-display italic text-[color:var(--rose)]">{ed("hero.h1Em", s.hero.h1Em)}</em> in Ahmedabad
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {editing ? ed("hero.tagline", s.hero.tagline) : <Linkify text={s.hero.tagline} />}
              </p>
            </Reveal>
            {reviewer && (
              <Reveal delay={0.16}>
                <a
                  href={doctorUrl(reviewer.slug)}
                  className="group mt-6 inline-flex items-center gap-3 rounded-full border border-[color:var(--plum)]/10 bg-white/70 py-1.5 pl-1.5 pr-5 shadow-soft backdrop-blur transition-all hover:bg-white"
                >
                  <img
                    src={reviewer.image}
                    alt={reviewer.name}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-[color:var(--rose)]/20"
                  />
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                      {reviewer.name}, {reviewer.credentials}
                    </span>
                    <span className="block text-xs text-muted-foreground">{reviewer.role}</span>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--rose)]">
                      <MapPin className="h-3 w-3" /> {reviewer.cities[0] ?? "India"} | Bavishi Fertility & Birthing
                    </span>
                  </span>
                </a>
              </Reveal>
            )}
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[color:var(--plum)]">
                {s.hero.badges.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[color:var(--rose)]" /> {ed(`hero.badges.${i}.badge`, c)}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                {editing ? (
                  <EditableImage path="hero.image" src={s.hero.image} alt={s.hero.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image
                    src={s.hero.image}
                    alt={s.hero.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Overview */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead eyebrow={`About ${s.shortName}`} title={<H h={s.overview.heading} base="overview.heading" />} />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {s.overview.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><p>{ed(`overview.paragraphs.${i}.text`, p)}</p></Reveal>
              ))}
            </div>
            {reviewer && (
              <div className="mt-8">
                <MedicalReviewer reviewer={reviewer} reviewedOn={s.lastReviewed} />
              </div>
            )}
          </div>
          {s.overview.aside && (
            <Reveal delay={0.1}>
              <aside className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">{ed("overview.aside.title", s.overview.aside.title)}</div>
                <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--plum)]/90">{ed("overview.aside.body", s.overview.aside.body)}</p>
              </aside>
            </Reveal>
          )}
        </div>
      </section>

      {/* 3. Benefits */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow={ed("sectionLabels.benefitsEyebrow", sl.benefitsEyebrow || "Advantages")} title={<H h={s.benefits.heading} base="benefits.heading" />} subtitle={s.benefits.subtitle ? ed("benefits.subtitle", s.benefits.subtitle) : undefined} />
          <Stagger
            className={`mt-9 grid grid-cols-1 gap-4 ${
              s.benefits.items.length === 1
                ? "max-w-sm mx-auto"
                : s.benefits.items.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {s.benefits.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{ed(`benefits.items.${i}.item`, item)}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 4. Who it's for */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead eyebrow={ed("sectionLabels.whoForEyebrow", sl.whoForEyebrow || "Is it for you")} title={<H h={s.whoFor.heading} base="whoFor.heading" />} subtitle={s.whoFor.subtitle ? ed("whoFor.subtitle", s.whoFor.subtitle) : undefined} />
          <Stagger
            className={`mt-9 grid grid-cols-1 gap-4 ${
              s.whoFor.items.length === 1
                ? "max-w-sm mx-auto"
                : s.whoFor.items.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {s.whoFor.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                  <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{ed(`whoFor.items.${i}.item`, item)}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5. Process */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow={ed("sectionLabels.processEyebrow", sl.processEyebrow || "What to Expect")} title={<H h={s.process.heading} base="process.heading" />} subtitle={s.process.subtitle ? ed("process.subtitle", s.process.subtitle) : undefined} />
          <Stagger
            className={`mt-10 grid grid-cols-1 gap-6 ${
              s.process.steps.length === 1
                ? "max-w-sm mx-auto"
                : s.process.steps.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {s.process.steps.map((step, i) => {
              const StepIcon = resolveIcon(step.icon);
              return (
              <StaggerItem key={i}>
                <div className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><StepIcon className="h-6 w-6" /></div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--rose)] font-display text-lg font-semibold text-white shadow-sm shadow-[color:var(--rose)]/30 ring-4 ring-[color:var(--rose)]/10">{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[color:var(--plum)]">{ed(`process.steps.${i}.t`, step.t)}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{ed(`process.steps.${i}.d`, step.d)}</p>
                </div>
              </StaggerItem>
              );
            })}
          </Stagger>
          {s.process.note && (
            <Reveal delay={0.1}>
              <div className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {ed("process.note", s.process.note)}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* 6. Why us */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow={ed("sectionLabels.whyUsEyebrow", sl.whyUsEyebrow || "Why Bavishi Fertility & Birthing")} title={<><H h={s.whyUs.heading} base="whyUs.heading" /> in Ahmedabad</>} />
          <Stagger
            className={`mt-10 grid grid-cols-1 gap-6 ${
              s.whyUs.items.length === 1
                ? "max-w-sm mx-auto"
                : s.whyUs.items.length === 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {s.whyUs.items.map((w, i) => {
              const WhyIcon = resolveIcon(w.icon);
              return (
              <StaggerItem key={i}>
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><WhyIcon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{ed(`whyUs.items.${i}.t`, w.t)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{ed(`whyUs.items.${i}.d`, w.d)}</p>
                </div>
              </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* 6b. Info / myth-busting note (optional) */}
      {s.infoNote && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-3xl">
            <SectionHead center eyebrow={ed("sectionLabels.infoNoteEyebrow", sl.infoNoteEyebrow || "Good to know")} title={<H h={s.infoNote.heading} base="infoNote.heading" />} />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {s.infoNote.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}><p>{ed(`infoNote.paragraphs.${i}.text`, p)}</p></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQ */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-3xl">
          <SectionHead center eyebrow={ed("sectionLabels.faqEyebrow", sl.faqEyebrow || "FAQ")} title={ed("sectionLabels.faqTitle", sl.faqTitle || `${s.breadcrumbName} — ${em("your questions answered")}`)} />
          <div className="mt-9 space-y-3">
            {s.faqs.map((f, i) => <Faq key={i} q={ed(`faqs.${i}.q`, f.q, false)} a={ed(`faqs.${i}.a`, f.a, false)} />)}
          </div>
          {reviewer && (
            <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground/80">
              This page is for educational purposes and is medically reviewed by {reviewer.name}, {reviewer.credentials}. It is not a substitute for personal medical advice — please consult our doctors for guidance specific to you.
            </p>
          )}
        </div>
      </section>

      {/* Maternity specialists */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="Meet the Specialists" title={<>Your maternity <em className="font-display italic text-[color:var(--rose)]">care team</em></>} />
          <div className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {(["binal-shah", "parth-bavishi"] as const).map((slug) => {
              const doc = doctorBySlug(slug);
              if (!doc) return null;
              return (
                <a key={slug} href={doctorUrl(doc.slug)} className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--rose-soft)]/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={doc.image} alt={`${doc.name} — ${doc.specialty}`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    {doc.experienceLabel && <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rose)] backdrop-blur">{doc.experienceLabel}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-[color:var(--plum)] group-hover:text-[color:var(--rose)]">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{[doc.credentials, doc.specialty].filter(Boolean).join(" · ")}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--rose)]">View profile <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related maternity services — REAL internal links */}
      {related.length > 0 && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow={ed("sectionLabels.relatedEyebrow", sl.relatedEyebrow || "Explore More")} title={ed("sectionLabels.relatedTitle", sl.relatedTitle || `Related maternity ${em("services")}`)} />
            <Stagger
              className={`mt-10 grid grid-cols-1 gap-5 ${
                related.length === 1
                  ? "max-w-sm mx-auto"
                  : related.length === 2
                    ? "sm:grid-cols-2 max-w-3xl mx-auto"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
              stagger={0.05}
            >
              {related.map((r) => (
                <StaggerItem key={r.key}>
                  <TreatmentCard icon={resolveIcon(r.icon)} title={r.name} desc={r.desc} href={r.href} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Visit us — Ahmedabad only (these services are offered at our Ahmedabad centre) */}
      {ahmedabadCentre && (
        <section className={`${band()} py-8 md:py-14`}>
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead
              center
              eyebrow={ed("sectionLabels.visitEyebrow", sl.visitEyebrow || "Visit us")}
              title={ed("sectionLabels.visitTitle", sl.visitTitle || `Available at our ${em("Ahmedabad centre")}`)}
              subtitle={`${s.shortName.charAt(0).toUpperCase()}${s.shortName.slice(1)} is offered at Bavishi Fertility & Birthing in Ahmedabad. Call to book your appointment.`}
            />
            <Reveal>
              <div className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-border/70 bg-card p-6 text-left shadow-soft">
                <div className="flex items-start gap-3.5">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--rose-soft)] text-[color:var(--rose)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">Bavishi Fertility &amp; Birthing</p>
                    <h3 className="text-lg font-semibold leading-snug text-[color:var(--plum)]">{ahmedabadCentre.name}, Ahmedabad <span className="text-[11px] font-medium text-[color:var(--rose)]">· Head Office</span></h3>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {ahmedabadCentre.address}</li>
                  <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> <a href={`tel:+${ahmedabadCentre.phone}`} className="font-medium text-[color:var(--plum)] hover:text-[color:var(--rose)]">{ahmedabadCentre.phoneLabel}</a></li>
                  <li className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {ahmedabadCentre.hours}</li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
                  <a href={`tel:+${ahmedabadCentre.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"><Phone className="h-4 w-4" /> Call</a>
                  <a href={centreMapUrl(ahmedabadCentre)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:border-[color:var(--rose)]/50 hover:text-[color:var(--rose)]"><Navigation className="h-4 w-4" /> Directions</a>
                  <a href={centreHref(ahmedabadCentre)} className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--rose)]">View centre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Free calculators (reused) */}
      <div className={band()}><Calculators /></div>

      {/* CTA */}
      <section className={`${band()} py-8 md:py-14`}>
        <div className="container-px mx-auto max-w-[1400px]">
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
            <Reveal>
              <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
                {ed("sectionLabels.ctaTitle", sl.ctaTitle || `Caring for you and your baby, ${em("every step of the way", true)}`)}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
                Book a consultation with our maternity team to discuss {s.shortName} and the care that's right for you.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Free Consultation
                </Magnetic>
                <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" /> +91 97126 22288
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <a href="/doctors" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                <Stethoscope className="h-4 w-4" /> Meet our specialists <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
