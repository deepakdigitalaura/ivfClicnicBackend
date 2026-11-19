"use client";

import { ArrowRight, Award, FlaskConical, HeartPulse, Building2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHead } from "@/components/ivf-page";

/* "About Bavishi Fertility Institute" for the location pages.
 *
 * A visitor who lands on a city page from search has never seen /about, and
 * the page otherwise talks only about one address. This gives the institute
 * behind it in a few lines, then sends them to the full page.
 *
 * Every figure is taken from ABOUT_DEFAULTS in src/lib/about.ts — the same
 * numbers the About page itself renders — and deliberately avoids the ones
 * already scrolling in the StatsStrip at the top of this page, so nothing is
 * stated twice. Copy is kept short on purpose: this is context, not a second
 * About page. */

const FACTS = [
  { icon: Award, n: "Since 1998", l: "Pioneering fertility care in India" },
  { icon: HeartPulse, n: "30,000+", l: "Successful pregnancies" },
  { icon: FlaskConical, n: "3,000+", l: "IVF cycles every year" },
  { icon: Building2, n: "14 centres", l: "Across 8 cities in India" },
];

export function AboutBfiSection({ city }: { city: string }) {
  return (
    <section className="bg-[color:var(--rose-soft)]/25 py-10 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <SectionHead
          center
          eyebrow="About Bavishi Fertility Institute"
          title={
            <>
              The institute behind our{" "}
              <em className="font-display italic text-[color:var(--rose)]">
                {city} centre{city === "Ahmedabad" ? "s" : ""}
              </em>
            </>
          }
          subtitle={`Founded in 1998 by Dr. Himanshu Bavishi and Dr. Falguni Bavishi, Bavishi Fertility Institute has grown from a single Ahmedabad clinic into a 14-centre network — while keeping the same promise: treatment that is simple, safe, smart and successful.`}
        />

        <Stagger className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {FACTS.map((f) => (
            <StaggerItem key={f.n}>
              <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-2xl font-bold leading-none text-[color:var(--plum)] md:text-[28px]">
                  {f.n}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{f.l}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-9 max-w-3xl text-center">
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              The same protocols, the same Class 1000 embryology standard and the same senior
              doctors apply at every centre, so the care you receive in {city} is the care the
              institute is known for. Bavishi Fertility Institute has been recognised as the Most
              Trusted Fertility Chain Hospital in Gujarat and is a six-time winner of IVF Chain of
              the Year (West) at the ET Healthworld National Fertility Awards.
            </p>
            <a
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 text-sm font-semibold text-[color:var(--plum)] shadow-soft transition-colors duration-300 hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
            >
              More about Bavishi Fertility Institute
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
