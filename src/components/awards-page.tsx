"use client";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PRESS_AWARDS, ACADEMIC_AWARDS, CEREMONY_GALLERY, type AwardEntry } from "@/lib/awards";

function CategoryHeading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">{children}</h2>
    </Reveal>
  );
}

function AwardCard({ a, priority }: { a: AwardEntry; priority?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <div className="aspect-square w-full overflow-hidden bg-white">
        {a.img ? (
          <img
            src={a.img}
            alt={a.title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[color:var(--rose-soft)]/40">
            <Award className="h-10 w-10 text-[color:var(--rose)]/50" />
          </div>
        )}
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center">
        <h3 className="text-base font-semibold leading-snug text-[color:var(--plum)] md:text-lg">{a.title}</h3>
        {a.desc && <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>}
      </div>
    </motion.div>
  );
}

function AwardsGrid({ items }: { items: AwardEntry[] }) {
  return (
    <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a, i) => (
        <StaggerItem key={`${a.title}-${i}`}>
          <AwardCard a={a} priority={i < 3} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function AwardsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[color:var(--rose-soft)]/40 py-14 md:py-20">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                <Award className="h-3.5 w-3.5" />
                Awards &amp; Recognition
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Recognised for excellence in{" "}
                <em className="font-display italic text-[color:var(--rose)]">fertility care.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Three decades of pioneering IVF and fertility treatment in India — recognised by
                leading publications, industry bodies and government institutions.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[color:var(--plum)] shadow-soft">
                <Award className="h-4 w-4 text-[color:var(--rose)]" />
                First live birth in India with vitrified frozen oocytes
              </p>
            </Reveal>
          </div>
        </section>

        {/* Press & Industry Recognition */}
        <section className="container-px mx-auto max-w-[1400px] pt-12 md:pt-16">
          <CategoryHeading>Press &amp; Industry Recognition</CategoryHeading>
          <AwardsGrid items={PRESS_AWARDS} />
        </section>

        {/* Academic & Faculty Honours */}
        <section className="container-px mx-auto max-w-[1400px] pt-14 md:pt-20">
          <CategoryHeading>Academic &amp; Faculty Honours</CategoryHeading>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Recognition from national conferences and professional bodies for teaching, faculty
            contribution and academic leadership in reproductive medicine — spanning more than
            two decades.
          </p>
          <AwardsGrid items={ACADEMIC_AWARDS} />
        </section>

        {/* Ceremony gallery */}
        <section className="container-px mx-auto max-w-[1400px] py-14 md:py-20">
          <CategoryHeading>Moments From Our Award Ceremonies</CategoryHeading>
          <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CEREMONY_GALLERY.map((photo, i) => (
              <StaggerItem key={photo.src}>
                <div className="aspect-square overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={i < 4 ? "eager" : "lazy"}
                    className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* CTA */}
        <section className="container-px mx-auto max-w-[1400px] pb-12 md:pb-16">
          <Reveal>
            <div className="rounded-3xl bg-[color:var(--rose-soft)]/50 p-10 text-center">
              <h2 className="font-display text-2xl font-bold text-[color:var(--plum)] md:text-3xl">
                Experience one of the most awarded fertility chains of India.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[color:var(--plum)]/65">
                Speak with our fertility experts today — confidential, compassionate and personalised.
              </p>
              <a
                href="/contact#book"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Book a Consultation
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
