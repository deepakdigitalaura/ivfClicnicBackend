"use client";
import Image from "next/image";
import {
  Calendar, Phone, MessageCircle, MapPin, GraduationCap, Award, Users,
  Languages, Sparkles, ArrowRight, Stethoscope, BadgeCheck, CheckCircle2,
  Clock, BookOpen, Navigation,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, SuccessStories, TreatmentCard, LiteYouTube } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead } from "@/components/ivf-page";
import { Editable, EditableImage } from "@/components/editor/Editable";
import { useEdit } from "@/components/editor/edit-context";
import type { Doctor } from "@/lib/doctors";
import { DOCTORS, doctorUrl } from "@/lib/doctors";
import { treatmentCardData, treatmentRef } from "@/lib/treatments";
import { centresForLocationSlugs, centreMapUrl, centreHref, cityBySlug } from "@/lib/locations";
import { testimonialsForDoctor, videosForDoctor } from "@/lib/video-testimonials";

/* Maps every free-text `knowsAbout` label to a treatment slug so the "Areas of
 * expertise" chips always deep-link to a dedicated treatment page. Labels that
 * have no page of their own (category terms / surgical skills) point to the
 * closest clinically-relevant dedicated page — no chip is ever left unlinked. */
const EXPERTISE_TREATMENT_SLUG: Record<string, string> = {
  // Labels with their own dedicated page
  "In Vitro Fertilization": "ivf",
  "Intracytoplasmic Sperm Injection": "icsi",
  "Endometriosis": "endometriosis",
  "Surgical Sperm Retrieval": "surgical-sperm-retrieval",
  "Azoospermia": "azoospermia",
  // No dedicated page → closest relevant treatment page
  "Fertility Treatment": "ivf",
  "Ovarian Stimulation Protocols": "ivf",
  "Male Infertility": "azoospermia",
  "Andrology": "oligospermia",
  "Female Infertility": "pcos",
  "Reproductive Gynaecology": "pcos",
  "Fertility Preservation": "egg-freezing",
  "Reproductive Surgery": "fibroids",
  "Hysteroscopy": "fibroids",
  "Laparoscopy": "endometriosis",
  "IUI": "iui",
  "PCOS": "pcos",
  "Poor Ovarian Reserve": "ovarian-reserve",
  "High-Risk Pregnancy": "ivf-evaluation",
  "Twin Pregnancy": "ivf-evaluation",
};

/** Treatment-page href for an expertise label. Falls back to the homepage
 *  treatments section only for unmapped future labels, so a chip is never a
 *  dead, unclickable capsule. */
function expertiseHref(label: string): string {
  const slug = EXPERTISE_TREATMENT_SLUG[label];
  return slug ? treatmentRef(slug).href : "/#treatments";
}

/** Renders a comma-joined list of strings; in edit mode each item becomes an
 *  individually-editable span so the public, non-editing DOM stays byte-identical
 *  to a plain `items.join(", ")`. */
function EditableList({ items, path, editing }: { items: string[]; path: string; editing: boolean }) {
  if (!editing) return <>{items.join(", ")}</>;
  return (
    <>
      {items.map((item, i) => (
        <span key={i}>
          <Editable path={`${path}.${i}.value`}>{item}</Editable>
          {i < items.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

/* Inline-editable section label with a built-in fallback — `d.profileLabels.<key>`
 *  overrides the default when set, otherwise the default renders. Rich so the
 *  full B/I/U/colour toolbar applies AND persists (labels are body text — the
 *  SEO gate ignores body spans). */
const lab = (path: string, value: string | undefined, fallback: string, rich = true) => (
  <Editable path={path} rich={rich}>{value || fallback}</Editable>
);

// HTML helper for the italic rose accent word used in section headings.
const EM = 'class="font-display italic text-[color:var(--rose)]"';
const em = (t: string) => `<em ${EM}>${t}</em>`;

/* ---------- /doctors/[slug] — single profile ---------- */
export function DoctorProfile({ doctor: d }: { doctor: Doctor }) {
  const editing = !!useEdit()?.editMode;
  const stories = testimonialsForDoctor(d.slug); // only when a video explicitly names this doctor
  const videos = videosForDoctor(d.slug); // doctor's own explainer videos (real ids only)
  const centres = centresForLocationSlugs(d.locations); // full contact details for "Where to meet"
  const pl = d.profileLabels ?? {};
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/doctors" className="hover:text-[color:var(--rose)]">Doctors</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{d.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="container-px mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                {editing ? (
                  <EditableImage path="image" src={d.image} alt={`${d.name} — ${d.specialty}, Bavishi Fertility Institute`} className="absolute inset-0 h-full w-full object-cover object-top" />
                ) : (
                  <Image src={d.image} alt={`${d.name} — ${d.specialty}, Bavishi Fertility Institute`} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" />
                )}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--rose)]">
                <span className="h-px w-6 bg-[color:var(--rose)]/60" /> <Editable path="role" rich={false}>{d.role}</Editable>
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 flex flex-wrap items-center gap-2 text-4xl font-medium leading-tight text-[color:var(--plum)] md:text-5xl">
                <Editable path="name" rich={false}>{d.name}</Editable>
                {d.verified && <BadgeCheck className="h-7 w-7 text-[color:var(--rose)]" />}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-2 text-lg font-medium text-[color:var(--rose)]">
                <Editable path="credentials" rich={false}>{d.credentials}</Editable>
                {d.credentials && d.specialty && " · "}
                <Editable path="specialty" rich={false}>{d.specialty}</Editable>
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Editable path="shortBio" as="p" className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground text-pretty">{d.shortBio}</Editable>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[color:var(--plum)]">
                {d.experienceLabel && <span className="inline-flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-[color:var(--rose)]" /> <Editable path="experienceLabel" rich={false}>{d.experienceLabel}</Editable> experience</span>}
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[color:var(--rose)]" /> <EditableList items={d.cities} path="cities" editing={editing} /></span>
                <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-[color:var(--rose)]" /> <EditableList items={d.languages} path="languages" editing={editing} /></span>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"><Calendar className="h-4 w-4" /> Book Consultation</Magnetic>
                <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white"><Phone className="h-4 w-4" /> +91 97126 22288</Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bio + credentials */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <SectionHead eyebrow={lab("profileLabels.aboutEyebrow", pl.aboutEyebrow, "About")} title={lab("profileLabels.aboutTitle", pl.aboutTitle, `About ${em(d.name)}`)} />
            <div className="mt-6 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
              {d.bio.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <Editable path={`bio.${i}.value`} as="p">{p}</Editable>
                </Reveal>
              ))}
            </div>
            {d.knowsAbout.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">Areas of expertise</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.knowsAbout.map((k, i) => (
                    <a
                      key={k}
                      href={expertiseHref(k)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-[13px] font-medium text-[color:var(--plum)] shadow-soft transition-colors hover:border-[color:var(--rose)]/50 hover:text-[color:var(--rose)]"
                    >
                      <Sparkles className="h-3 w-3 text-[color:var(--rose)]" /> <Editable path={`knowsAbout.${i}.value`}>{k}</Editable>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Reveal delay={0.1}>
            <aside className="space-y-5 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6">
              {/* At a glance — always present so every profile has a populated sidebar */}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><Stethoscope className="h-4 w-4" /> At a glance</div>
                <dl className="mt-2 space-y-1.5 text-[14px] text-[color:var(--plum)]/80">
                  <div className="flex gap-2"><dt className="font-medium text-[color:var(--plum)]">Specialty:</dt><dd><Editable path="specialty" rich={false}>{d.specialty}</Editable></dd></div>
                  {d.experienceLabel && <div className="flex gap-2"><dt className="font-medium text-[color:var(--plum)]">Experience:</dt><dd><Editable path="experienceLabel" rich={false}>{d.experienceLabel}</Editable></dd></div>}
                  <div className="flex gap-2"><dt className="font-medium text-[color:var(--plum)]">Consults in:</dt><dd><EditableList items={d.cities} path="cities" editing={editing} /></dd></div>
                  <div className="flex gap-2"><dt className="font-medium text-[color:var(--plum)]">Languages:</dt><dd><EditableList items={d.languages} path="languages" editing={editing} /></dd></div>
                </dl>
              </div>
              {(d.credentials || d.alumniOf.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><GraduationCap className="h-4 w-4" /> Qualifications</div>
                  {d.credentials && <p className="mt-2 text-[15px] font-medium text-[color:var(--plum)]">{d.credentials}</p>}
                  {d.alumniOf.length > 0 && (
                    <ul className="mt-2 space-y-1 text-[14px] text-[color:var(--plum)]/80">
                      {d.alumniOf.map((a, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" /> <Editable path={`alumniOf.${i}.value`}>{a}</Editable></li>)}
                    </ul>
                  )}
                </div>
              )}
              {d.training && d.training.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><GraduationCap className="h-4 w-4" /> Advanced training</div>
                  <ul className="mt-2 space-y-1 text-[14px] text-[color:var(--plum)]/80">
                    {d.training.map((t, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" /> <Editable path={`training.${i}.value`}>{t}</Editable></li>)}
                  </ul>
                </div>
              )}
              {d.memberOf.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><Users className="h-4 w-4" /> Memberships</div>
                  <ul className="mt-2 space-y-1 text-[14px] text-[color:var(--plum)]/80">
                    {d.memberOf.map((m, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" /> <Editable path={`memberOf.${i}.value`}>{m}</Editable></li>)}
                  </ul>
                </div>
              )}
              {d.awards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><Award className="h-4 w-4" /> Recognition</div>
                  <ul className="mt-2 space-y-1 text-[14px] text-[color:var(--plum)]/80">
                    {d.awards.map((a, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" /> <Editable path={`awards.${i}.value`}>{a}</Editable></li>)}
                  </ul>
                </div>
              )}
              {d.publications && d.publications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]"><BookOpen className="h-4 w-4" /> Publications</div>
                  <ul className="mt-2 space-y-1 text-[14px] text-[color:var(--plum)]/80">
                    {d.publications.map((p, i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--rose)]" /> <Editable path={`publications.${i}.value`}>{p}</Editable></li>)}
                  </ul>
                </div>
              )}
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Treatments performed — entity links as cards */}
      {d.treatments.length > 0 && (
        <section className="bg-white py-8 md:py-14">
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow={lab("profileLabels.treatmentsEyebrow", pl.treatmentsEyebrow, "Treatments")} title={lab("profileLabels.treatmentsTitle", pl.treatmentsTitle, `Treatments ${em(d.name + " performs")}`)} />
            <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
              {d.treatments.map((slug) => {
                const card = treatmentCardData(slug);
                return (
                  <StaggerItem key={slug}>
                    <TreatmentCard icon={card.icon} title={card.name} desc={card.desc} href={card.href} />
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* Patient stories — only videos that explicitly name this doctor */}
      {stories.length > 0 && (
        <SuccessStories
          tone="tint"
          eyebrow={lab("profileLabels.storiesEyebrow", pl.storiesEyebrow, "Patient Stories")}
          title={lab("profileLabels.storiesTitle", pl.storiesTitle, `Stories from ${em(d.name.split(" ").slice(-1) + "'s patients")}`)}
          subtitle={lab("profileLabels.storiesSubtitle", pl.storiesSubtitle, `Watch families share their journey under the care of ${d.name}.`)}
          showCta={false}
          stories={stories.map((v) => ({ id: v.youTubeId, n: v.name, q: v.quote, r: 5 }))}
        />
      )}

      {/* Where to meet — full contact cards, OR a single "visits across cities"
          card for visiting senior specialists (e.g. the founder). */}
      {(d.visitsAllCentres || centres.length > 0) && (
        <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
          <SectionHead
            center
            eyebrow={lab("profileLabels.consultsEyebrow", pl.consultsEyebrow, "Consults at")}
            title={lab("profileLabels.consultsTitle", pl.consultsTitle, `Where to meet ${em(d.name)}`)}
            subtitle={lab(
              "profileLabels.consultsSubtitle",
              pl.consultsSubtitle,
              d.visitsAllCentres
                ? `${d.name} is a visiting senior specialist who consults across our centres. Call to confirm his current schedule at your nearest centre.`
                : `Book an in-person consultation with ${d.name} at the ${centres.length > 1 ? "centres" : "centre"} below.`,
            )}
          />
          {d.visitsAllCentres ? (
            <Reveal>
              <div className="mx-auto mt-10 w-full max-w-2xl rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--rose-soft)] text-[color:var(--rose)]">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">Bavishi Fertility Institute</p>
                <h3 className="mt-1 text-xl font-semibold text-[color:var(--plum)]">{lab("profileLabels.visitsHeading", pl.visitsHeading, `Visits across ${d.cities.length} cities`)}</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {lab(
                    "profileLabels.visitsParagraph",
                    pl.visitsParagraph,
                    `As the founder and senior IVF specialist, ${d.name} consults at Bavishi Fertility Institute centres across India on a rotating schedule. Call to confirm when he is visiting your nearest centre.`,
                  )}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {d.cities.map((city) => (
                    <span key={city} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-[color:var(--rose-soft)]/40 px-3.5 py-1.5 text-[13px] font-medium text-[color:var(--plum)]">
                      <MapPin className="h-3 w-3 text-[color:var(--rose)]" /> {city}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                  {centres[0] && (
                    <a href={`tel:+${centres[0].phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"><Phone className="h-4 w-4" /> Call {centres[0].phoneLabel}</a>
                  )}
                  <a href="/#locations" className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-5 py-2.5 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:border-[color:var(--rose)]/50 hover:text-[color:var(--rose)]">View all centres <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></a>
                </div>
              </div>
            </Reveal>
          ) : (
          <Stagger className="mt-10 flex flex-wrap justify-center gap-6">
            {centres.map((c) => (
              <StaggerItem key={c.slug} className="w-full max-w-md">
                <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 text-left shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-start gap-3.5">
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--rose-soft)] text-[color:var(--rose)]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">Bavishi Fertility Institute</p>
                      <h3 className="text-lg font-semibold leading-snug text-[color:var(--plum)]">
                        {c.name}{cityBySlug(c.citySlug)?.name && c.name !== cityBySlug(c.citySlug)?.name ? `, ${cityBySlug(c.citySlug)?.name}` : ""}
                        {c.isHeadOffice && <span className="ml-2 align-middle text-[11px] font-medium text-[color:var(--rose)]">· Head Office</span>}
                      </h3>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.address}</li>
                    <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> <a href={`tel:+${c.phone}`} className="font-medium text-[color:var(--plum)] hover:text-[color:var(--rose)]">{c.phoneLabel}</a></li>
                    <li className="flex items-start gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.hours}</li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
                    <a href={`tel:+${c.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"><Phone className="h-4 w-4" /> Call</a>
                    <a href={centreMapUrl(c)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:border-[color:var(--rose)]/50 hover:text-[color:var(--rose)]"><Navigation className="h-4 w-4" /> Directions</a>
                    <a href={centreHref(c)} className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--rose)]">View centre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></a>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          )}
        </section>
      )}

      {/* Doctor Speak — the doctor's own explainer videos (real ids only) */}
      {videos.length > 0 && (
        <section className="bg-[color:var(--rose-soft)]/40 py-10 md:py-16">
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow={lab("profileLabels.doctorSpeakEyebrow", pl.doctorSpeakEyebrow, "Doctor Speak")} title={lab("profileLabels.doctorSpeakTitle", pl.doctorSpeakTitle, `Watch ${em(d.name)}`)} subtitle={lab("profileLabels.doctorSpeakSubtitle", pl.doctorSpeakSubtitle, `Fertility insights and advice, explained by ${d.name}.`)} />
            <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {videos.map((v) => (
                <StaggerItem key={v.youTubeId}>
                  <article className="group h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift">
                    <LiteYouTube id={v.youTubeId} title={`${v.title} — ${d.name}`} className="aspect-video" />
                    <div className="p-5">
                      <h3 className="text-base font-semibold leading-snug text-[color:var(--plum)]">{v.title}</h3>
                      <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[color:var(--rose)]">{d.name}</p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-14 text-center text-white noise md:px-16">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl text-balance">
              {lab("profileLabels.ctaHeading", pl.ctaHeading, "Book a consultation with")} <em className="font-display italic text-[color:var(--rose-soft)]">{d.name}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> Book Consultation</Magnetic>
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

/* ---------- /doctors — index ---------- */
/* `doctors` is supplied by the server route (CMS-resolved, in code order); the
 * DOCTORS default keeps the component reusable/standalone. */
export function DoctorsIndex({ doctors = DOCTORS }: { doctors?: Doctor[] }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Doctors</span>
        </nav>
      </div>

      <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
        <SectionHead
          center
          eyebrow="Our Fertility Specialists"
          title={<>Meet our <em className="font-display italic text-[color:var(--rose)]">promoter doctors & specialists</em></>}
          subtitle="A family of fertility experts trusted by generations — credentialed, experienced and committed to honest, compassionate care."
        />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((d) => (
            <StaggerItem key={d.slug}>
              <a href={doctorUrl(d.slug)} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--rose-soft)]/40">
                  <Image src={d.image} alt={`${d.name} — ${d.specialty}`} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
                  {d.experienceLabel && <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--rose)] backdrop-blur">{d.experienceLabel}</span>}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--plum)] backdrop-blur"><MapPin className="h-3 w-3" /> {d.cities[0]}</span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-[color:var(--plum)] group-hover:text-[color:var(--rose)]">{d.name}</h2>
                  <p className="text-sm text-muted-foreground">{[d.credentials, d.specialty].filter(Boolean).join(" · ")}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--rose)]">View profile <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
