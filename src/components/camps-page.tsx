"use client";
import { MapPin, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import type { EventPoster } from "@/lib/homepage";

const DEFAULT_POSTERS: EventPoster[] = [
  {
    src: "https://cdn-kimil.nitrocdn.com/ZfwaLbMfzSTsqBVBQJtCqQvqiiILUUQF/assets/images/optimized/rev-d7cf290/ivfclinic.com/wp-content/uploads/2026/06/dr.-visit_2.jpg-768x960.jpeg",
    alt: "Doctor visit — Bavishi Fertility Institute upcoming camp",
  },
  {
    src: "https://cdn-kimil.nitrocdn.com/ZfwaLbMfzSTsqBVBQJtCqQvqiiILUUQF/assets/images/optimized/rev-d7cf290/ivfclinic.com/wp-content/uploads/2026/06/General-camp-2.jpg-768x960.jpeg",
    alt: "General fertility camp — Bavishi Fertility Institute",
  },
  {
    src: "https://cdn-kimil.nitrocdn.com/ZfwaLbMfzSTsqBVBQJtCqQvqiiILUUQF/assets/images/optimized/rev-d7cf290/ivfclinic.com/wp-content/uploads/2026/06/Camps-2.jpg-768x960.jpeg",
    alt: "Camps — Bavishi Fertility Institute upcoming event",
  },
  {
    src: "https://cdn-kimil.nitrocdn.com/ZfwaLbMfzSTsqBVBQJtCqQvqiiILUUQF/assets/images/optimized/rev-d7cf290/ivfclinic.com/wp-content/uploads/2026/06/OPD_-1.jpg-768x960.jpeg",
    alt: "OPD — Bavishi Fertility Institute outreach event",
  },
];

const WHAT_TO_EXPECT = [
  { icon: Calendar, title: "Consultations", desc: "Meet our specialists face-to-face during camp days." },
  { icon: MapPin, title: "Multiple Cities", desc: "We bring fertility care to your city — camps held across Gujarat and India." },
  { icon: Phone, title: "Follow-Up Support", desc: "Camp attendees receive priority scheduling for follow-up appointments." },
];

export function CampsPage({ posters = DEFAULT_POSTERS }: { posters?: EventPoster[] }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[color:var(--rose-soft)]/40 py-14 md:py-20">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <span className="mb-4 inline-block rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                Upcoming Events
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Fertility Camps &{" "}
                <em className="font-display italic text-[color:var(--rose)]">Outreach Events.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Bavishi Fertility Institute regularly organises free fertility camps and outreach events
                across India — bringing expert care and awareness directly to you.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Register Interest
              </a>
            </Reveal>
          </div>
        </section>

        {/* Camp Posters */}
        <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
          <Reveal>
            <h2 className="mb-8 font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
              Learn directly from{" "}
              <em className="font-display italic text-[color:var(--rose)]">our specialists.</em>
            </h2>
          </Reveal>
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {posters.map((poster, i) => (
              <StaggerItem key={poster.src}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
                >
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* What to Expect */}
        <section className="bg-[color:var(--plum)]/4 py-12 md:py-16">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <h2 className="mb-10 text-center font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
                What to expect at a{" "}
                <em className="font-display italic text-[color:var(--rose)]">BFI Camp</em>
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {WHAT_TO_EXPECT.map(({ icon: Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <div className="rounded-3xl border border-border/70 bg-white p-6 shadow-soft">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[color:var(--plum)]">{title}</h3>
                    <p className="mt-2 text-sm text-[color:var(--plum)]/65 leading-relaxed">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl bg-[color:var(--rose-soft)]/50 p-10 text-center">
              <h2 className="font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
                Want a camp in your city?
              </h2>
              <p className="mt-3 text-sm text-[color:var(--plum)]/65">
                Let us know your location and we will keep you updated about upcoming camps near you.
              </p>
              <a
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Contact Us
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
      <MobileBottomBar />
      <ScrollToTop />
    </>
  );
}
