"use client";
import Image from "next/image";
import { ArrowRight, Calendar, MessageCircle, Phone, MapPin, Clock, Navigation, Award, FlaskConical, HeartPulse, Building2, Rotate3d, BookOpen } from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Doctors, SuccessStories, VideoHub, StatsStrip, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow, Faq } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { GoogleReviews, CentreGallery, ContactInfo, CentreMap, TreatmentsOffered, AvailableServicesSection } from "@/components/location-sections";
import { Editable, EditableImage } from "@/components/editor/Editable";
import { useEdit } from "@/components/editor/edit-context";
import type { City } from "@/lib/locations";
import type { ResolvedCity } from "@/lib/location-content";
import { centresForCity, doctorSlugsForCity, treatmentSlugsForCity, centreUrl, centreMapUrl } from "@/lib/locations";
import { womensHealthServices } from "@/lib/womens-health";
import { doctorBySlug, toDoctorCard } from "@/lib/doctors";
import { getReviews } from "@/lib/reviews";
import { testimonialsForCity } from "@/lib/video-testimonials";
import { blogsForLocation, type BlogPost } from "@/lib/blogs";

const trust = [
  { icon: Award, t: "Trusted since 1998", d: "Bavishi Fertility Institute has been a pioneer of IVF in India for over two decades." },
  { icon: FlaskConical, t: "Class 1000 IVF labs", d: "Embryology labs 10× cleaner than the international standard, with vitrification." },
  { icon: HeartPulse, t: "Senior promoter doctors", d: "Consult experienced fertility specialists across convenient locations." },
  { icon: Building2, t: "One-stop fertility care", d: "Tests, sonography, andrology, surgery and IVF — everything under one roof." },
];

/* CityPage — data-driven template for /locations/[city].
 * One City object renders the hub: overview, all centres (linked), city-wide
 * treatments + doctors, reviews, FAQs. Reused by every city. */
/* `<Editable>` is inert on the public site (byte-identical) and click-to-edit
 * inside /edit/locations/<slug>. `path` is the dot-path into the cities-doc
 * SOURCE draft (see materializeCitySource). */
const ed = (path: string, value: string, rich = true) => (
  <Editable path={path} rich={rich}>{value}</Editable>
);
// HTML helpers for the italic rose accent word used in section headings.
const EM = 'class="font-display italic text-[color:var(--rose)]"';
const EMS = 'class="font-display italic text-[color:var(--rose-soft)]"';
const em = (t: string, soft = false) => `<em ${soft ? EMS : EM}>${t}</em>`;

export function CityPage({ city, cmsBlogs }: { city: City | ResolvedCity; cmsBlogs?: BlogPost[] }) {
  const sl = (city as ResolvedCity).sectionLabels ?? {};
  const blogs = blogsForLocation(city.slug, city.name, 3, cmsBlogs);
  const editing = !!useEdit()?.editMode;
  const centres = centresForCity(city.slug);
  const docs = doctorSlugsForCity(city.slug)
    .map((slug) => doctorBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map(toDoctorCard);
  const treatments = treatmentSlugsForCity(city.slug);
  const reviews = getReviews(city.slug); // optional city-level review source (null → CTA)
  const cityStories = testimonialsForCity(city.slug); // only cities with an explicitly-stated testimonial

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#locations" className="hover:text-[color:var(--rose)]">Locations</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">{city.name}</span>
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
            <Reveal><Eyebrow>{city.name} · {centres.length} {centres.length === 1 ? "Centre" : "Centres"}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                {ed("sectionLabels.heroTitle", sl.heroTitle || `Best IVF Centre in ${em(city.name)}`)}
              </h1>
            </Reveal>
            {city.intro[0] && (
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">{ed("intro.0.value", city.intro[0])}</p>
              </Reveal>
            )}
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
                <Magnetic as="a" href={`tel:+${city.helpline}`} className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white"><Phone className="h-4 w-4" /> {city.helplineLabel}</Magnetic>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                {city.hero360Url ? (
                  <>
                    <iframe
                      src={city.hero360Url}
                      title={`360° view of Bavishi Fertility Institute ${city.name}`}
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <span className="pointer-events-none absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[color:var(--plum)]/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-soft backdrop-blur">
                      <Rotate3d className="h-3.5 w-3.5" /> 360° View · Drag to explore
                    </span>
                  </>
                ) : editing ? (
                  <EditableImage path="heroImage" src={city.heroImage} alt={`Best IVF centre in ${city.name} — Bavishi Fertility Institute`} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <Image src={city.heroImage} alt={`Best IVF centre in ${city.name} — Bavishi Fertility Institute`} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* Overview */}
      {city.intro.length > 0 && (
        <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
          <SectionHead eyebrow={ed("sectionLabels.overviewEyebrow", sl.overviewEyebrow || `Fertility care in ${city.name}`)} title={ed("sectionLabels.overviewTitle", sl.overviewTitle || `Your trusted fertility partner in ${em(city.name)}`)} />
          <div className="mt-6 max-w-3xl space-y-5 text-[17px] leading-relaxed text-muted-foreground">
            {city.intro.map((p, i) => <Reveal key={i} delay={i * 0.05}><p>{ed(`intro.${i}.value`, p)}</p></Reveal>)}
          </div>
        </section>
      )}

      {/* Centres */}
      {centres.length > 0 && (
        <section className="bg-white py-8 md:py-14">
          <div className="container-px mx-auto max-w-[1400px]">
            <SectionHead center eyebrow={ed("sectionLabels.centresEyebrow", sl.centresEyebrow || "Our Centres")} title={ed("sectionLabels.centresTitle", sl.centresTitle || `Our centres across ${em(city.name)}`)} />
            <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {centres.map((c) => (
                <StaggerItem key={c.slug}>
                  <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-[color:var(--plum)]">{c.name}</h3>
                      {c.isHeadOffice && <span className="inline-flex items-center rounded-full bg-[color:var(--rose)]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">Head Office</span>}
                    </div>
                    <div className="mt-4 flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.address}</div>
                    <div className="mt-3 flex items-center gap-2.5 text-[15px] text-muted-foreground"><Clock className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.hours}</div>
                    <div className="mt-3 flex items-center gap-2.5 text-[15px] text-muted-foreground"><Phone className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> <a href={`tel:+${c.phone}`} className="hover:text-[color:var(--rose)]">{c.phoneLabel}</a></div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-6">
                      {c.built && (
                        <a href={centreUrl(c.citySlug, c.slug)} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">View Centre <ArrowRight className="h-3.5 w-3.5" /></a>
                      )}
                      <a href={centreMapUrl(c)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--plum)]/15 px-4 py-2 text-xs font-semibold text-[color:var(--plum)] transition hover:bg-[color:var(--plum)]/5"><Navigation className="h-3.5 w-3.5" /> Directions</a>
                      {!c.built && <a href="/#book" className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"><Calendar className="h-3.5 w-3.5" /> Book</a>}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            {city.slug !== "ahmedabad" && (
              <div className="mt-10">
                <CentreMap query={`Bavishi Fertility Institute ${city.name}`} title={`Bavishi Fertility Institute ${city.name} — centres on Google Maps`} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* City-wide treatments — real internal links (blush band so it separates
          the white Centres section above from the ivory Doctors section below) */}
      {treatments.length > 0 && (
        <div className="bg-[color:var(--rose-soft)]/40"><TreatmentsOffered slugs={treatments} area={city.name} labels={sl} /></div>
      )}

      {/* Women's health & maternity services across the city's centres (white
          band: separates the blush Treatments section from the ivory Doctors). */}
      {city.womensHealth?.length ? (
        <AvailableServicesSection
          location={city.name}
          services={womensHealthServices(city.womensHealth)}
          tone="white"
          serviceLabel={city.slug === "ahmedabad" ? "Maternity services" : undefined}
          labels={sl}
        />
      ) : null}

      {/* City-wide doctors */}
      {docs.length > 0 && (
        <Doctors
          docs={docs}
          eyebrow={ed("sectionLabels.doctorsEyebrow", sl.doctorsEyebrow || `${city.name} Doctors`)}
          title={ed("sectionLabels.doctorsTitle", sl.doctorsTitle || `Meet our ${em(city.name + " specialists")}`)}
          subtitle={ed("sectionLabels.doctorsSubtitle", sl.doctorsSubtitle || `Fertility specialists across our ${city.name} centres.`)}
        />
      )}

      {cityStories.length > 0 && (
        <SuccessStories
          tone="tint"
          eyebrow={ed("sectionLabels.testimonialsEyebrow", sl.testimonialsEyebrow || "Testimonials")}
          title={ed("sectionLabels.testimonialsTitle", sl.testimonialsTitle || `Words from ${em(city.name + " families")}`)}
          subtitle={ed("sectionLabels.testimonialsSubtitle", sl.testimonialsSubtitle || "Watch real families share their parenthood journeys with Bavishi Fertility Institute.")}
          showCta={false}
          stories={cityStories.map((v) => ({ id: v.youTubeId, n: v.name, q: v.quote, r: 5 }))}
        />
      )}

      <div className="bg-white">
        <GoogleReviews
          data={reviews}
          profileUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Bavishi Fertility Institute " + city.name)}`}
          title={ed("sectionLabels.reviewsTitle", sl.reviewsTitle || `${city.name} families ${em("on Google")}`)}
          subtitle={`Read verified reviews from patients across our ${city.name} centres.`}
        />
      </div>

      <VideoHub />

      {centres.length > 0 && (
        <CentreGallery images={centres.flatMap((c) => c.gallery).slice(0, 6)} title={ed("sectionLabels.galleryTitle", sl.galleryTitle || `Inside our ${em(city.name + " centres")}`)} subtitle={ed("sectionLabels.gallerySubtitle", sl.gallerySubtitle || "A glimpse of our facilities.")} />
      )}

      {/* Why choose */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow={ed("sectionLabels.whyEyebrow", sl.whyEyebrow || `Why Bavishi Fertility Institute ${city.name}`)} title={ed("sectionLabels.whyTitle", sl.whyTitle || `Why choose Bavishi Fertility Institute in ${em(city.name)}`)} />
        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <StaggerItem key={t.t}>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><t.icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-lg font-semibold text-[color:var(--plum)]">{t.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {centres.length > 0 && (
        <ContactInfo centres={centres} title={ed("sectionLabels.contactTitle", sl.contactTitle || `Contact our ${em(city.name + " centres")}`)} subtitle={ed("sectionLabels.contactSubtitle", sl.contactSubtitle || "Call, WhatsApp or visit — whichever is easiest for you.")} />
      )}

      {/* FAQ */}
      {city.faqs.length > 0 && (
        <section className="container-px mx-auto max-w-3xl px-0 py-8 md:py-14">
          <div className="container-px">
            <SectionHead center eyebrow={ed("sectionLabels.faqEyebrow", sl.faqEyebrow || "FAQ")} title={ed("sectionLabels.faqTitle", sl.faqTitle || `${city.name} — ${em("your questions answered")}`)} />
            <div className="mt-9 space-y-3">
              {city.faqs.map((f, i) => <Faq key={i} q={ed(`faqs.${i}.q`, f.q, false)} a={ed(`faqs.${i}.a`, f.a, false)} />)}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles — location-specific, data-driven (placeholders until published) */}
      {blogs.length > 0 && (
        <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
          <SectionHead
            center
            eyebrow="Blog"
            title={<>{city.name} <em className="font-display italic text-[color:var(--rose)]">Articles &amp; Guides</em></>}
            subtitle={`Fertility guidance written for patients in ${city.name}.`}
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => (
              <StaggerItem key={b.slug}>
                <a
                  href={b.href}
                  className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">
                      <BookOpen className="h-3 w-3" /> {b.category}
                    </span>
                    {!b.published && (
                      <span className="rounded-full bg-[color:var(--plum)]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--plum)]/50">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">
                    {b.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{b.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--rose)]">
                    Read article
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] pb-8 md:pb-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              {ed("sectionLabels.ctaTitle", sl.ctaTitle || `Book your consultation in ${em(city.name, true)} today.`)}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
              <Magnetic as="a" href={`tel:+${city.helpline}`} className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><Phone className="h-4 w-4" /> {city.helplineLabel}</Magnetic>
              <Magnetic as="a" href={`https://wa.me/${city.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp Us</Magnetic>
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
