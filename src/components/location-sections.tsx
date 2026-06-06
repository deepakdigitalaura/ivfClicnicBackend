"use client";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, animate, wrap } from "framer-motion";
import { Star, MapPin, Phone, Clock, Calendar, MessageCircle, Navigation, CheckCircle2, Quote, ChevronLeft, ChevronRight, Landmark, Route } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHead } from "@/components/ivf-page";
import { TreatmentCard } from "@/components/home-page";
import type { Centre } from "@/lib/locations";
import { cityBySlug } from "@/lib/locations";
import type { Review, ReviewData } from "@/lib/reviews";
import { treatmentCardData } from "@/lib/treatments";
import { type WomensHealthService, serviceHref } from "@/lib/womens-health";

/* ---------- Google "G" logo (official 4-colour) ---------- */
export function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/* ---------- Single review card (Google badge only for verified data) ---------- */
function ReviewCard({ rv, verified }: { rv: Review; verified: boolean }) {
  return (
    <blockquote className="flex h-full min-h-[300px] flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift md:p-8">
      <div className="flex items-center justify-between">
        <Quote className="h-7 w-7 text-[color:var(--rose)]/50" />
        <div className="flex text-[color:var(--gold)]">
          {Array.from({ length: Math.round(rv.rating) }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
        </div>
      </div>
      <p className="mt-4 line-clamp-6 flex-1 text-[15px] leading-relaxed text-[color:var(--plum)]/90 text-pretty">
        "{rv.text}"
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-sm font-semibold text-[color:var(--rose)]">
          {rv.author.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[color:var(--plum)]">{rv.author}</div>
          {rv.relativeTime && <div className="text-xs text-muted-foreground">{rv.relativeTime}</div>}
        </div>
        {/* Provenance badge — Google only for verified data; else neutral. */}
        {verified ? (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-muted-foreground shadow-soft ring-1 ring-black/5">
            <GoogleG className="h-3.5 w-3.5" /> Google
          </span>
        ) : (
          <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-[color:var(--rose)]/8 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Patient review
          </span>
        )}
      </div>
    </blockquote>
  );
}

/* ---------- Google Reviews (rotating groups of 3, opacity crossfade) ---------- */
const REVIEW_GROUP = 3;
const ROTATE_MS = 5000; // time each group is shown
const FADE_MS = 500;    // fade-out / fade-in duration

export function GoogleReviews({
  data,
  profileUrl,
  eyebrow = "Google Reviews",
  title,
  subtitle,
}: {
  /** Verified review data from the review service. null → empty state. */
  data: ReviewData | null;
  /** Fallback "read on Google" link when there is no review feed yet. */
  profileUrl?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
}) {
  const reviews: Review[] = data?.reviews ?? [];
  const verified = !!data?.verified;
  // Rating badge + Google branding only for verified data; fallback stays neutral.
  const aggregate = verified ? data?.aggregate : undefined;
  const listingUrl = data?.mapsUrl ?? profileUrl;
  const displayEyebrow = verified ? eyebrow : "Patient Reviews";
  const displayTitle = verified
    ? (title ?? <>Loved by families on <em className="font-display italic text-[color:var(--rose)]">Google</em></>)
    : <>What our <em className="font-display italic text-[color:var(--rose)]">patients say</em></>;

  // Static groups of 3 (the last group is padded with wrap-around so it's always full).
  const groups: Review[][] = [];
  for (let i = 0; i < reviews.length; i += REVIEW_GROUP) {
    const g = reviews.slice(i, i + REVIEW_GROUP);
    while (g.length < REVIEW_GROUP && reviews.length >= REVIEW_GROUP) g.push(reviews[g.length]);
    groups.push(g);
  }
  const multi = groups.length > 1;

  const [group, setGroup] = useState(0);
  const [visible, setVisible] = useState(true);
  const pausedRef = useRef(false);

  // Auto-rotate: fade out → swap group (while invisible) → fade in. Opacity/transform
  // only; the grid stays mounted so there is no layout shift.
  useEffect(() => {
    if (!multi) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setVisible(false);
      window.setTimeout(() => {
        setGroup((g) => (g + 1) % groups.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [multi, groups.length]);

  const goTo = (i: number) => {
    if (i === group) return;
    setVisible(false);
    window.setTimeout(() => { setGroup(i); setVisible(true); }, FADE_MS);
  };

  const current = groups[group] ?? [];

  // Empty state — NO fabricated reviews or ratings. If there is no verified
  // feed AND no public listing link, render nothing at all (no placeholder).
  if (reviews.length === 0) {
    if (!listingUrl) return null;
    return (
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead
          center
          eyebrow={eyebrow}
          title={title ?? <>Read our reviews on <em className="font-display italic text-[color:var(--rose)]">Google</em></>}
          subtitle={subtitle ?? "Hear directly from our patients on our verified Google Business Profile."}
        />
        <div className="mt-8 flex justify-center">
          <a
            href={listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[color:var(--plum)] shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <GoogleG className="h-5 w-5" /> Read our reviews on Google
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-end md:text-left">
        <SectionHead
          eyebrow={displayEyebrow}
          title={displayTitle}
          subtitle={subtitle}
        />
        {aggregate && (
          <Reveal delay={0.1}>
            <a
              href={listingUrl ?? "#"}
              {...(listingUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3 shadow-soft"
            >
              <GoogleG className="h-5 w-5" />
              <span className="text-sm font-semibold text-[color:var(--plum)]">{aggregate.ratingValue.toFixed(1)}</span>
              <span className="flex text-[color:var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </span>
              <span className="text-sm text-muted-foreground">· {aggregate.reviewCount.toLocaleString()} reviews</span>
            </a>
          </Reveal>
        )}
      </div>

      <div
        className="mt-9"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div
          className="grid grid-cols-1 gap-6 ease-out will-change-[opacity,transform] sm:grid-cols-2 lg:grid-cols-3"
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: `${FADE_MS}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {current.map((rv, i) => (
            <ReviewCard key={`${group}-${i}`} rv={rv} verified={verified} />
          ))}
        </div>

        {multi && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {groups.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show review group ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === group ? "w-6 bg-[color:var(--rose)]" : "w-2 bg-[color:var(--plum)]/20 hover:bg-[color:var(--plum)]/40"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Centre gallery ---------- */
export function CentreGallery({
  images,
  eyebrow = "Centre Gallery",
  title,
  subtitle,
  tone = "tint",
}: {
  images: { src: string; alt: string }[];
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  tone?: "tint" | "white";
}) {
  const GAP = 16; // gap-4 in px — must match the track's gap class
  const SPEED = 40; // px/sec — constant conveyor speed

  // The set is rendered as two identical groups. The marquee translates left by
  // exactly one "period" (= first group width + one gap) and wraps, so the card
  // that scrolls in is pixel-identical to the one that scrolled out → no seam.
  const groupRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef(0);
  const x = useMotionValue(0);
  const pausedRef = useRef(false);
  const resumeRef = useRef<number | undefined>(undefined);

  // Measure the exact wrap period (re-measure on resize for responsiveness).
  useEffect(() => {
    const measure = () => {
      const el = groupRef.current;
      if (el) periodRef.current = el.offsetWidth + GAP;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
    };
  }, [images.length]);

  // Transform-driven loop. Updating a motion value does NOT re-render React.
  useAnimationFrame((_, delta) => {
    const period = periodRef.current;
    if (!period || pausedRef.current) return;
    x.set(wrap(-period, 0, x.get() - (SPEED * delta) / 1000));
  });

  const hold = () => {
    pausedRef.current = true;
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
  };
  const resumeAfter = (ms: number) => {
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => { pausedRef.current = false; }, ms);
  };

  // Manual nudge by one card; pre-wraps so the tween stays within the duplicated set.
  const nudge = (dir: 1 | -1) => {
    const period = periodRef.current;
    if (!period) return;
    hold();
    const stride = period / images.length; // exact per-card distance (incl. gap)
    let from = x.get();
    if (dir === 1 && from - stride < -period) { from += period; x.set(from); }
    if (dir === -1 && from + stride > 0) { from -= period; x.set(from); }
    animate(x, from - dir * stride, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    resumeAfter(4000);
  };

  const renderCards = (tag: string, hidden: boolean) =>
    images.map((img, i) => (
      <div
        key={`${img.src}-${i}-${tag}`}
        aria-hidden={hidden}
        className="group w-[220px] shrink-0 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-[260px]"
      >
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    ));

  return (
    <section className={tone === "white" ? "bg-white py-8 md:py-14" : "bg-[color:var(--rose-soft)]/40 py-8 md:py-14"}>
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow={eyebrow}
          title={title ?? <>Inside our <em className="font-display italic text-[color:var(--rose)]">centres</em></>}
          subtitle={subtitle}
        />
        <div
          className="relative mt-9"
          onMouseEnter={hold}
          onMouseLeave={() => resumeAfter(600)}
          onTouchStart={hold}
          onTouchEnd={() => resumeAfter(2500)}
        >
          <button
            type="button"
            aria-label="Previous photos"
            onClick={() => nudge(-1)}
            className="absolute -left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[color:var(--plum)] shadow-lift ring-1 ring-black/5 transition hover:bg-[color:var(--rose)] hover:text-white md:-left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="overflow-hidden">
            <motion.div style={{ x }} className="flex w-max gap-4 will-change-transform">
              <div ref={groupRef} className="flex shrink-0 gap-4">{renderCards("a", false)}</div>
              <div className="flex shrink-0 gap-4">{renderCards("b", true)}</div>
              <div className="flex shrink-0 gap-4">{renderCards("c", true)}</div>
            </motion.div>
          </div>

          <button
            type="button"
            aria-label="Next photos"
            onClick={() => nudge(1)}
            className="absolute -right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-[color:var(--plum)] shadow-lift ring-1 ring-black/5 transition hover:bg-[color:var(--rose)] hover:text-white md:-right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Google Maps embed (single or city-wide) ---------- */
export function CentreMap({ query, title }: { query: string; title: string }) {
  return (
    <Reveal delay={0.1}>
      <div className="overflow-hidden rounded-3xl border border-border/70 shadow-soft">
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="h-[360px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Reveal>
  );
}

/* ---------- Multi-marker map (Leaflet + OpenStreetMap, no API key) ---------- */
export function MultiCentreMap({ centres, title }: { centres: Centre[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const points = centres.filter((c) => c.geo).map((c) => ({ c, lat: c.geo!.lat, lng: c.geo!.lng }));
    if (!ref.current || points.length === 0) return;

    let map: any;
    let cancelled = false;

    if (!document.querySelector("link[data-leaflet]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.setAttribute("data-leaflet", "");
      document.head.appendChild(link);
    }

    const loadJs = () =>
      new Promise<any>((resolve) => {
        const w = window as any;
        if (w.L) return resolve(w.L);
        const existing = document.querySelector("script[data-leaflet]") as HTMLScriptElement | null;
        if (existing) return existing.addEventListener("load", () => resolve(w.L));
        const s = document.createElement("script");
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.async = true;
        s.setAttribute("data-leaflet", "");
        s.onload = () => resolve(w.L);
        document.body.appendChild(s);
      });

    loadJs().then((L) => {
      if (cancelled || !ref.current || !L) return;
      map = L.map(ref.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const pin = `<span style="display:block;width:26px;height:26px;transform:translate(-13px,-26px)">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#d6296b" stroke="white" stroke-width="1.5">
          <path d="M12 22s7-7.16 7-12a7 7 0 1 0-14 0c0 4.84 7 12 7 12z"/>
          <circle cx="12" cy="10" r="2.6" fill="white" stroke="none"/>
        </svg></span>`;
      const icon = L.divIcon({ html: pin, className: "", iconSize: [0, 0], iconAnchor: [0, 0] });

      const latlngs: [number, number][] = [];
      points.forEach(({ c, lat, lng }) => {
        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`<strong style="color:#3b1c4a">${c.name}</strong><br/>${c.address}`);
        latlngs.push([lat, lng]);
      });

      if (latlngs.length === 1) map.setView(latlngs[0], 14);
      else map.fitBounds(latlngs, { padding: [50, 50] });
    });

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [centres]);

  return (
    <Reveal delay={0.1}>
      <div
        ref={ref}
        title={title}
        className="relative z-0 h-[380px] w-full overflow-hidden rounded-3xl border border-border/70 shadow-soft"
      />
    </Reveal>
  );
}

/* ---------- Contact information block ---------- */
export function ContactInfo({
  centres,
  eyebrow = "Contact Information",
  title,
  subtitle,
}: {
  centres: Centre[];
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
}) {
  const single = centres.length === 1;
  return (
    <section className="bg-white py-8 md:py-14">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow={eyebrow}
          title={title ?? <>Get in touch with <em className="font-display italic text-[color:var(--rose)]">our team</em></>}
          subtitle={subtitle}
        />
        <Stagger className={`mt-9 grid grid-cols-1 gap-6 ${single ? "max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
          {centres.map((c) => (
            <StaggerItem key={c.slug}>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[color:var(--plum)]">{c.name}, {cityBySlug(c.citySlug)?.name}</h3>
                  {c.isHeadOffice && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--rose)]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">Head Office</span>
                  )}
                </div>
                <div className="mt-4 flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.address}
                </div>
                <div className="mt-3 flex items-center gap-2.5 text-[15px] text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0 text-[color:var(--rose)]" /> {c.hours}
                </div>
                <div className="mt-3 flex items-center gap-2.5 text-[15px] text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-[color:var(--rose)]" />
                  <a href={`tel:+${c.phone}`} className="font-medium hover:text-[color:var(--rose)]">{c.phoneLabel}</a>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--plum)]/15 px-4 py-2 text-xs font-semibold text-[color:var(--plum)] transition hover:bg-[color:var(--plum)]/5">
                    <Navigation className="h-3.5 w-3.5" /> Directions
                  </a>
                  <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--plum)]/15 px-4 py-2 text-xs font-semibold text-[color:var(--plum)] transition hover:bg-[color:var(--plum)]/5">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <a href="/#book" className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rose)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">
                    <Calendar className="h-3.5 w-3.5" /> Book
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Local highlights: landmarks + areas served (local intent) ---------- */
export function LocalHighlights({ centre }: { centre: Centre }) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHead eyebrow="Landmarks" title={<>How to <em className="font-display italic text-[color:var(--rose)]">spot us</em></>} />
          <ul className="mt-6 space-y-3">
            {centre.landmarks.map((l) => (
              <li key={l} className="flex items-start gap-3 text-[15px] leading-relaxed text-[color:var(--plum)]/90">
                <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" /> {l}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHead eyebrow="Areas served" title={<>Patients we serve in <em className="font-display italic text-[color:var(--rose)]">{centre.area}</em> & nearby</>} />
          <div className="mt-6 flex flex-wrap gap-2">
            {centre.nearby.map((n) => (
              <span key={n} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-[color:var(--plum)] shadow-soft">
                <MapPin className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How to reach (transit / directions — visible local content) ---------- */
export function HowToReach({ centre }: { centre: Centre }) {
  return (
    <section className="bg-white py-8 md:py-14">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead center eyebrow="How to reach" title={<>Getting to our <em className="font-display italic text-[color:var(--rose)]">{centre.area} centre</em></>} subtitle={centre.address} />
        <Stagger className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
          {centre.howToReach.map((h) => (
            <StaggerItem key={h}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <Route className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--rose)]" />
                <span className="text-[15px] leading-relaxed text-[color:var(--plum)]/90">{h}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Treatments offered at this centre (real internal links) ----------
 * Reuses the homepage <TreatmentCard> so centre pages share the exact same
 * card design (icon, name, description, "Learn more" link). */
export function TreatmentsOffered({ slugs, area }: { slugs: string[]; area: string }) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <SectionHead center eyebrow="Treatments offered" title={<>Fertility treatments at <em className="font-display italic text-[color:var(--rose)]">{area} center</em></>} />
      <Stagger className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {slugs.map((slug) => {
          const c = treatmentCardData(slug);
          return (
            <StaggerItem key={slug}>
              <TreatmentCard icon={c.icon} title={c.name} desc={c.desc} href={c.href} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/* ---------- Women's health & maternity services at this centre ----------
 * Reusable, data-driven section. The host page passes the location NAME and a
 * resolved service list; it reuses the homepage <TreatmentCard> verbatim, so it
 * inherits the exact radius, shadow, spacing, typography, hover (lift + gradient
 * sweep + icon rotate + arrow slide) and whole-card link affordance — it reads
 * as if it has always been part of the site. Each card is a crawlable internal
 * link to its service page, strengthening Location → Service topical relevance.
 * SectionHead emits the section <h2> and each card an <h3> (clean hierarchy).
 * Scales from 6 to 20+ services with no redesign; `tone` lets the host slot it
 * into the page's alternating section-background rhythm. */
export function AvailableServicesSection({
  location,
  services,
  tone = "tint",
  serviceLabel = "Women's health services",
}: {
  location: string;
  services: WomensHealthService[];
  tone?: "plain" | "tint" | "white";
  serviceLabel?: string;
}) {
  if (!services.length) return null;
  const bg = tone === "tint" ? "bg-[color:var(--rose-soft)]/40 " : tone === "white" ? "bg-white " : "";
  return (
    <section
      className={`${bg}py-8 md:py-14`}
      aria-label={`${serviceLabel} available at ${location}`}
    >
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow="Women's Health & Maternity"
          title={<>{serviceLabel} available at <em className="font-display italic text-[color:var(--rose)]">{location}</em></>}
          subtitle={`Access advanced maternity, fetal medicine and pregnancy care services at our ${location} center.`}
        />
        <Stagger className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {services.map((s) => (
            <StaggerItem key={s.key}>
              <TreatmentCard icon={s.icon} title={s.name} desc={s.desc} href={serviceHref(s)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Facilities list (sub-location pages) ---------- */
export function Facilities({ items, area }: { items: string[]; area: string }) {
  return (
    <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
      <SectionHead
        center
        eyebrow="Facilities"
        title={<>What's available at <em className="font-display italic text-[color:var(--rose)]">{area} center</em></>}
      />
      <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <StaggerItem key={f}>
            <div className="flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--rose)]" />
              <span className="text-[15px] font-medium text-[color:var(--plum)]">{f}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
