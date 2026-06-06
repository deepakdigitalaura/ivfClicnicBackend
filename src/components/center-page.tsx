"use client";
import Image from "next/image";
import { Calendar, MessageCircle, Phone, MapPin, Clock, Rotate3d } from "lucide-react";
import { Reveal, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Doctors, SuccessStories, VideoHub, StatsStrip, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow, Faq } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import {
  GoogleReviews, CentreGallery, ContactInfo, CentreMap,
  LocalHighlights, HowToReach, Facilities, TreatmentsOffered, AvailableServicesSection,
} from "@/components/location-sections";
import type { Centre } from "@/lib/locations";
import { cityBySlug, doctorSlugsForCity, cityHasOwnPage } from "@/lib/locations";
import { womensHealthServices } from "@/lib/womens-health";
import { doctorBySlug, toDoctorCard } from "@/lib/doctors";
import { getReviews } from "@/lib/reviews";

/* CenterPage — data-driven template for /locations/[city]/[center].
 * One Centre object renders the entire page: NAP, map, geo, hours,
 * facilities, treatments, doctors, areas served, landmarks, how-to-reach,
 * FAQs and verified reviews. Reused by every centre, every city. */
export function CenterPage({ centre }: { centre: Centre }) {
  const city = cityBySlug(centre.citySlug);
  // City-based doctor team (not branch-based): every centre in a city shows
  // the same doctors, with Dr. Himanshu Bavishi always included.
  const docs = doctorSlugsForCity(centre.citySlug)
    .map((slug) => doctorBySlug(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map(toDoctorCard);
  const reviews = getReviews(centre.reviewsKey ?? centre.slug);
  // Single-centre cities can name the centre after the city itself (e.g. Bhuj,
  // Anand) — avoid rendering "Bhuj, Bhuj". Multi-centre cities never collide.
  const cityName = city?.name;
  const sameAsCity = !!cityName && cityName === centre.area;
  const areaCity = sameAsCity ? centre.area : `${centre.area}${cityName ? `, ${cityName}` : ""}`;

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
          {cityHasOwnPage(centre.citySlug) ? (
            <>
              <a href={`/locations/${centre.citySlug}`} className="hover:text-[color:var(--rose)]">{city?.name}</a>
              <span>/</span>
              <span className="font-medium text-[color:var(--plum)]">{areaCity}</span>
            </>
          ) : (
            // Single-centre city is served at /locations/[city] — the city name
            // is the page itself, so it's the final (plain) crumb.
            <span className="font-medium text-[color:var(--plum)]">{city?.name}</span>
          )}
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
            <Reveal><Eyebrow>{sameAsCity ? centre.area : `${city?.name} · ${centre.area}`}{centre.isHeadOffice ? " · Head Office" : ""}</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.5rem] text-balance">
                Best IVF Centre in <em className="font-display italic text-[color:var(--rose)]">{areaCity}</em>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">{centre.intro}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-6 space-y-2.5">
                <div className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[color:var(--plum)]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {centre.address}
                </div>
                <div className="flex items-center gap-2.5 text-[15px] text-[color:var(--plum)]">
                  <Clock className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {centre.hours}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic as="a" href="/#book" className="btn-luxury group inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
                <Magnetic as="a" href={`tel:+${centre.phone}`} className="btn-luxury inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white/70 px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] backdrop-blur transition-all hover:bg-white"><Phone className="h-4 w-4" /> {centre.phoneLabel}</Magnetic>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-black/5">
                {centre.hero360Url ? (
                  <>
                    <iframe
                      src={centre.hero360Url}
                      title={`360° view of ${centre.fullName}`}
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <span className="pointer-events-none absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[color:var(--plum)]/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-soft backdrop-blur">
                      <Rotate3d className="h-3.5 w-3.5" /> 360° View · Drag to explore
                    </span>
                  </>
                ) : (
                  <Image src={centre.image} alt={`${centre.fullName} — IVF centre`} fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* Overview */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead eyebrow={`About the ${centre.area} centre`} title={<>Fertility care in <em className="font-display italic text-[color:var(--rose)]">{centre.area}</em>{city?.name && !sameAsCity ? <>, {city.name}</> : null}</>} />
          <div className="mt-6 max-w-3xl space-y-5 text-[17px] leading-relaxed text-muted-foreground">
            <Reveal><p>{centre.intro}</p></Reveal>
          </div>
        </div>
      </section>

      <LocalHighlights centre={centre} />
      <HowToReach centre={centre} />
      <Facilities items={centre.facilities} area={centre.area} />
      <div className="bg-white"><TreatmentsOffered slugs={centre.treatments} area={centre.area} /></div>

      {/* Women's health & maternity services available at this centre (blush
          band: sits between the white Treatments section and ivory Doctors). */}
      {centre.womensHealth?.length ? (
        <AvailableServicesSection
          location={centre.area}
          services={womensHealthServices(centre.womensHealth)}
          tone="tint"
        />
      ) : null}

      {docs.length > 0 && (
        <Doctors
          docs={docs}
          eyebrow={`Doctors at ${centre.area}`}
          title={<>Meet the doctors at <em className="font-display italic text-[color:var(--rose)]">{centre.area} center</em></>}
          subtitle={`Our fertility specialists who consult at the ${centre.area} centre.`}
        />
      )}

      <SuccessStories tone="tint" eyebrow="Testimonials" title={<><em className="font-display italic text-[color:var(--rose)]">{centre.area}</em> success stories</>} subtitle="Watch real families share their parenthood journeys with Bavishi Fertility Institute." showCta={false} />

      {/* Verified reviews only — renders CTA / nothing until Places API supplies data */}
      <div className="bg-white">
        <GoogleReviews
          data={reviews}
          profileUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centre.mapQuery)}`}
          title={<>{centre.area} patients <em className="font-display italic text-[color:var(--rose)]">on Google</em></>}
          subtitle={`Read verified reviews from families treated at our ${centre.area} centre.`}
        />
      </div>

      <VideoHub />

      <CentreGallery images={centre.gallery} tone="white" title={<>Inside our <em className="font-display italic text-[color:var(--rose)]">{centre.area} centre</em></>} subtitle="A look at our facilities and lab." />

      {/* Map */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-[1400px]">
          <SectionHead center eyebrow="How to reach" title={<>Find the <em className="font-display italic text-[color:var(--rose)]">{centre.area} centre</em></>} subtitle={centre.address} />
          <div className="mt-10"><CentreMap query={centre.mapQuery} title={`${centre.fullName} — map`} /></div>
        </div>
      </section>

      <ContactInfo centres={[centre]} title={<>Contact the <em className="font-display italic text-[color:var(--rose)]">{centre.area} centre</em></>} subtitle="Call, WhatsApp or visit — we're here to help." />

      {/* FAQ */}
      <section className="container-px mx-auto max-w-3xl px-0 py-8 md:py-14">
        <div className="container-px">
          <SectionHead center eyebrow="FAQ" title={<>{centre.area} — <em className="font-display italic text-[color:var(--rose)]">your questions answered</em></>} />
          <div className="mt-9 space-y-3">
            {centre.faqs.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Start your journey at our <em className="font-display italic text-[color:var(--rose-soft)]">{centre.area}</em> centre.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
              <Magnetic as="a" href={`tel:+${centre.phone}`} className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><Phone className="h-4 w-4" /> {centre.phoneLabel}</Magnetic>
              <Magnetic as="a" href={`https://wa.me/${centre.phone}`} target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp Us</Magnetic>
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
