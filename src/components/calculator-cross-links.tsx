"use client";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";

const ALL_CALCULATORS = [
  { title: "IVF Success Rate Calculator", href: "/ivf-success-rate-calculator", emoji: "📊" },
  { title: "Fertile Period Calculator", href: "/fertile-period-calculator", emoji: "🌸" },
  { title: "Risk of Repeat Miscarriage Calculator", href: "/risk-of-repeat-miscarriage-calculator", emoji: "🛡️" },
  { title: "Natural Pregnancy Calculator", href: "/natural-pregnancy-calculator", emoji: "🌿" },
  { title: "IVF Cost Calculator", href: "/ivf-cost-calculator", emoji: "💰" },
  { title: "AMH Level Interpreter", href: "/amh-level-interpreter", emoji: "🔬" },
  { title: "Ovulation Calculator", href: "/ovulation-calculator", emoji: "📅" },
  { title: "Semen Analysis Calculator", href: "/semen-analysis-calculator", emoji: "🧬" },
];

export function CalculatorCrossLinks({ current }: { current?: string }) {
  const others = ALL_CALCULATORS.filter((c) => c.href !== current);

  return (
    <section className="container-px mx-auto max-w-5xl py-10 md:py-14">
      <Reveal>
        <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">
          Fertility Calculators To Plan Your Pregnancy Journey
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Use our expert-designed fertility calculators to estimate IVF success rates, track ovulation, understand your fertile window, and plan your journey to parenthood with confidence.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((c) => (
            <a
              key={c.href}
              href={c.href}
              className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:border-[color:var(--rose)]/50 hover:bg-[color:var(--rose-soft)]/20"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="flex-1 text-xs font-semibold leading-snug text-[color:var(--plum)]">{c.title}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[color:var(--rose)]" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
