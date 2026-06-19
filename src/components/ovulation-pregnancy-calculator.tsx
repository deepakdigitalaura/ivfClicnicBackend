"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Phone,
  MessageCircle,
  CheckCircle2,
  Baby,
  Activity,
  Heart,
  Droplets,
  Sparkles,
  Clock,
  Lock,
  RotateCcw,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { CalculatorCrossLinks } from "@/components/calculator-cross-links";

const BABY_SIZES: Record<number, { name: string; emoji: string; desc: string }> = {
  1: { name: "Early Development", emoji: "🔬", desc: "Early development stage. Your body prepares for ovulation." },
  2: { name: "Cell Division", emoji: "🔬", desc: "Rapid cell division occurring. This is when fertilization may happen." },
  3: { name: "Implantation", emoji: "🔬", desc: "Embryo attaches to uterine lining. Pregnancy hormones begin production. Embryo size: 0.1mm" },
  4: { name: "Poppy Seed", emoji: "🌱", desc: "Pregnancy tests can now detect hCG hormone. Embryo size: 0.2mm" },
  5: { name: "Sesame Seed", emoji: "🌾", desc: "Embryo size: 1.5mm. Neural tube forming, which becomes brain and spinal cord" },
  6: { name: "Sweet Pea", emoji: "🫛", desc: "Your embryo is approximately 6mm long and starting to develop facial features" },
  7: { name: "Blueberry", emoji: "🫐", desc: "Your baby is around 13mm long and developing arm and leg buds" },
  8: { name: "Raspberry", emoji: "🍓", desc: "Your baby measures about 16mm long and all essential organs are beginning to form" },
  9: { name: "Grape", emoji: "🍇", desc: "Your baby is approximately 23mm long and now officially called a fetus" },
  10: { name: "Prune", emoji: "🫒", desc: "Your baby measures about 31mm from crown to rump and is developing more defined features" },
  11: { name: "Fig", emoji: "🍑", desc: "Your baby is approximately 41mm long and starting to move around actively" },
  12: { name: "Lime", emoji: "🍋", desc: "Your baby measures about 5.4cm long and is fully formed with all organs in place" },
  13: { name: "Peach", emoji: "🍑", desc: "Your baby is approximately 7.4cm long and has unique fingerprints forming" },
  14: { name: "Lemon", emoji: "🍋", desc: "Your baby measures about 8.7cm long and can now make facial expressions" },
  15: { name: "Orange", emoji: "🍊", desc: "Your baby is approximately 10.1cm long and can sense light through closed eyelids" },
  16: { name: "Avocado", emoji: "🥑", desc: "Your baby measures about 11.6cm long and weighs approximately 100 grams" },
  17: { name: "Grapefruit", emoji: "🍊", desc: "Your baby is approximately 13cm long and developing adipose (fat) tissue" },
  18: { name: "Bell Pepper", emoji: "🫑", desc: "Your baby measures about 14.2cm long and weighs around 190 grams" },
  19: { name: "Mango", emoji: "🥭", desc: "Your baby is approximately 15.3cm long and developing a protective coating called vernix" },
  20: { name: "Banana", emoji: "🍌", desc: "Your baby measures about 16.4cm long and weighs around 300 grams" },
  21: { name: "Corn", emoji: "🌽", desc: "Your baby is approximately 26.7cm long (head to heel) and can now swallow" },
  22: { name: "Papaya", emoji: "🥭", desc: "Your baby measures about 27.8cm long and weighs around 430 grams" },
  23: { name: "Daikon", emoji: "🥬", desc: "Your baby is approximately 28.9cm long and developing rapid eye movements" },
  24: { name: "Cauliflower", emoji: "🥦", desc: "Your baby measures about 30cm long and weighs around 600 grams" },
  25: { name: "Scallion", emoji: "🧅", desc: "Your baby is approximately 34.6cm long and weighs about 660 grams" },
  26: { name: "Jicama", emoji: "🥔", desc: "Your baby measures about 35.6cm long and weighs around 760 grams" },
  27: { name: "Rutabaga", emoji: "🥔", desc: "Your baby is approximately 36.6cm long and weighs around 875 grams" },
  28: { name: "Eggplant", emoji: "🍆", desc: "Your baby measures about 37.6cm long and weighs around 1kg" },
  29: { name: "Butternut Squash", emoji: "🎃", desc: "Your baby is approximately 38.6cm long and weighs about 1.15kg" },
  30: { name: "Acorn Squash", emoji: "🎃", desc: "Your baby measures about 39.9cm long and weighs around 1.3kg" },
  31: { name: "Coconut", emoji: "🥥", desc: "Your baby is approximately 41.1cm long and weighs about 1.5kg" },
  32: { name: "Rhubarb", emoji: "🌿", desc: "Your baby measures about 42.4cm long and weighs around 1.7kg" },
  33: { name: "Pineapple", emoji: "🍍", desc: "Your baby is approximately 43.7cm long and weighs about 1.9kg" },
  34: { name: "Cantaloupe", emoji: "🍈", desc: "Your baby measures about 45cm long and weighs about 2.1kg" },
  35: { name: "Honeydew Melon", emoji: "🍈", desc: "Your baby is approximately 46.2cm long and weighs about 2.4kg" },
  36: { name: "Romaine Lettuce", emoji: "🥬", desc: "Your baby measures about 47.4cm long and weighs around 2.6kg" },
  37: { name: "Winter Melon", emoji: "🫧", desc: "Your baby is approximately 48.6cm long and weighs about 2.9kg. Now considered full term!" },
  38: { name: "Pumpkin", emoji: "🎃", desc: "Your baby measures about 49.8cm long and weighs around 3.1kg" },
  39: { name: "Watermelon", emoji: "🍉", desc: "Your baby is approximately 50.7cm long and weighs about 3.3kg" },
  40: { name: "Jackfruit", emoji: "🌾", desc: "Your baby measures about 51.2cm long and weighs around 3.4kg. Ready to meet the world!" },
  41: { name: "Jackfruit", emoji: "🌾", desc: "Your baby is approximately 51.7cm long and weighs about 3.6kg. Fully developed and ready for birth" },
  42: { name: "Jackfruit", emoji: "🌾", desc: "Your baby measures about 52.3cm long and weighs about 3.7kg. You are now post-term" },
};

const PHASES: Record<"menstrual" | "fertile" | "ovulation" | "luteal", { name: string; desc: string; color: string }> = {
  menstrual: { name: "Menstruation", desc: "Low probability of getting pregnant", color: "bg-blue-100 text-blue-700" },
  fertile: { name: "Fertile Window", desc: "There is a chance of getting pregnant", color: "bg-amber-100 text-amber-700" },
  ovulation: { name: "Ovulation", desc: "High probability of getting pregnant", color: "bg-emerald-100 text-emerald-700" },
  luteal: { name: "Luteal Phase", desc: "Low probability of getting pregnant", color: "bg-rose-100 text-rose-700" },
};

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmt(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

type OvulationCycle = {
  periodStart: Date;
  fertileStart: Date;
  fertileEnd: Date;
  ovulationDate: Date;
  pregnancyTestDate: Date;
};

type PregnancyResult = {
  lmp: Date;
  dueDate: Date;
  daysPregnant: number;
  currentWeek: number;
  remainingDays: number;
  progressPercent: number;
  t1End: Date;
  t2End: Date;
  currentTrimester: 1 | 2 | 3;
  t1Progress: number;
  t2Progress: number;
  t3Progress: number;
  babySize: { name: string; emoji: string; desc: string };
  weeks: number;
  extraDays: number;
};

export function OvulationPregnancyCalculatorPage() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"ovulation" | "pregnancy">("ovulation");

  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [ovulationError, setOvulationError] = useState("");
  const [ovulationResult, setOvulationResult] = useState<{
    lmp: Date;
    ovulationDate: Date;
    fertileStart: Date;
    fertileEnd: Date;
    pregnancyTestDate: Date;
    nextPeriodStart: Date;
    phase: "menstrual" | "fertile" | "ovulation" | "luteal";
    dayOfCycle: number;
    cycles: OvulationCycle[];
  } | null>(null);

  const [pregnancyMethod, setPregnancyMethod] = useState<"lmp" | "dueDate">("lmp");
  const [pregnancyLastPeriodDate, setPregnancyLastPeriodDate] = useState("");
  const [pregnancyCycleLength, setPregnancyCycleLength] = useState(28);
  const [dueDateInput, setDueDateInput] = useState("");
  const [pregnancyError, setPregnancyError] = useState("");
  const [pregnancyResult, setPregnancyResult] = useState<PregnancyResult | null>(null);

  const scrollToWidget = () => widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const resetAll = () => {
    setOvulationResult(null);
    setPregnancyResult(null);
    setOvulationError("");
    setPregnancyError("");
  };

  const handleTabChange = (tab: "ovulation" | "pregnancy") => {
    setActiveTab(tab);
    resetAll();
    scrollToWidget();
  };

  const calculateOvulation = () => {
    if (!lastPeriodDate) {
      setOvulationError("Please enter the first day of your last menstrual period.");
      return;
    }
    if (cycleLength < 20 || cycleLength > 42) {
      setOvulationError("Please enter a cycle length between 20 and 42 days.");
      return;
    }

    const lmp = new Date(lastPeriodDate);
    const ovulationDate = addDays(lmp, cycleLength - 14);
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = addDays(ovulationDate, 1);
    const pregnancyTestDate = addDays(ovulationDate, 14);
    const nextPeriodStart = addDays(lmp, cycleLength);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfCycle = Math.floor((today.getTime() - lmp.getTime()) / 86400000) + 1;
    const fertileStartDay = cycleLength - 19;
    const fertileEndDay = cycleLength - 15;
    const ovulationDay = cycleLength - 14;

    const phase =
      dayOfCycle >= 1 && dayOfCycle <= 5
        ? "menstrual"
        : dayOfCycle >= fertileStartDay && dayOfCycle <= fertileEndDay
        ? "fertile"
        : dayOfCycle >= ovulationDay - 1 && dayOfCycle <= ovulationDay + 1
        ? "ovulation"
        : "luteal";

    const cycles = Array.from({ length: 6 }, (_, i) => {
      const periodStart = addDays(lmp, cycleLength * i);
      const ov = addDays(periodStart, cycleLength - 14);
      const fsStart = addDays(ov, -5);
      const fsEnd = addDays(ov, 1);
      const testDate = addDays(ov, 14);
      return { periodStart, fertileStart: fsStart, fertileEnd: fsEnd, ovulationDate: ov, pregnancyTestDate: testDate };
    });

    setOvulationResult({
      lmp,
      ovulationDate,
      fertileStart,
      fertileEnd,
      pregnancyTestDate,
      nextPeriodStart,
      phase,
      dayOfCycle,
      cycles,
    });
    setOvulationError("");
    scrollToWidget();
  };

  const calculatePregnancy = () => {
    let lmp: Date;
    let dueDate: Date;

    if (pregnancyMethod === "lmp") {
      if (!pregnancyLastPeriodDate) {
        setPregnancyError("Please enter the first day of your last menstrual period.");
        return;
      }
      if (pregnancyCycleLength < 20 || pregnancyCycleLength > 42) {
        setPregnancyError("Please enter a cycle length between 20 and 42 days.");
        return;
      }
      lmp = new Date(pregnancyLastPeriodDate);
      dueDate = addDays(lmp, 280);
    } else {
      if (!dueDateInput) {
        setPregnancyError("Please enter your estimated due date.");
        return;
      }
      dueDate = new Date(dueDateInput);
      lmp = addDays(dueDate, -280);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pregnancyStartMs = lmp.getTime();
    const daysPregnant = Math.max(0, Math.floor((today.getTime() - pregnancyStartMs) / 86400000));
    const currentWeek = Math.min(42, Math.max(1, Math.floor(daysPregnant / 7) + 1));
    const remainingDays = Math.max(0, Math.round((dueDate.getTime() - today.getTime()) / 86400000));
    const progressPercent = Math.max(0, Math.min(100, Math.round((daysPregnant / 280) * 100)));
    const t1End = addDays(lmp, 84);
    const t2End = addDays(lmp, 189);
    const currentTrimester = today.getTime() <= t1End.getTime() ? 1 : today.getTime() <= t2End.getTime() ? 2 : 3;
    const t1Progress = currentTrimester === 1 ? Math.round((daysPregnant / 84) * 100) : currentTrimester > 1 ? 100 : 0;
    const t2Progress = currentTrimester === 2 ? Math.round(((daysPregnant - 84) / 105) * 100) : currentTrimester > 2 ? 100 : 0;
    const t3Progress = currentTrimester === 3 ? Math.round(((daysPregnant - 189) / 91) * 100) : 0;
    const weeks = Math.floor(daysPregnant / 7);
    const extraDays = daysPregnant % 7;
    const babySize = BABY_SIZES[Math.min(42, Math.max(1, currentWeek))];

    setPregnancyResult({
      lmp,
      dueDate,
      daysPregnant,
      currentWeek,
      remainingDays,
      progressPercent,
      t1End,
      t2End,
      currentTrimester,
      t1Progress: Math.max(0, Math.min(100, t1Progress)),
      t2Progress: Math.max(0, Math.min(100, t2Progress)),
      t3Progress: Math.max(0, Math.min(100, t3Progress)),
      babySize,
      weeks,
      extraDays,
    });
    setPregnancyError("");
    scrollToWidget();
  };

  const formInputClass =
    "h-14 w-full rounded-2xl border-2 border-border bg-white px-5 text-[15px] font-semibold text-[color:var(--plum)] outline-none transition-colors focus:border-[color:var(--rose)] focus:ring-4 focus:ring-[color:var(--rose)]/10";

  const renderOvulationForm = () => (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
            First day of last period
          </label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            className={formInputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
            Cycle length (days)
          </label>
          <input
            type="number"
            min={20}
            max={42}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className={formInputClass}
          />
        </div>
      </div>
      {ovulationError && (
        <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">
          {ovulationError}
        </p>
      )}
      <div className="mt-9 flex justify-end border-t border-border/60 pt-7">
        <button type="button" onClick={calculateOvulation} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
          Calculate <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderPregnancyForm = () => {
    const todayIso = new Date().toISOString().split("T")[0];
    return (
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { value: "lmp", label: "Last Period", description: "Calculate due date from your last menstrual period." },
            { value: "dueDate", label: "Due Date", description: "Calculate your pregnancy progress from an estimated due date." },
          ].map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                setPregnancyMethod(option.value as "lmp" | "dueDate");
                setPregnancyError("");
              }}
              className={`rounded-3xl border p-5 text-left transition-all ${
                pregnancyMethod === option.value
                  ? "border-[color:var(--rose)] bg-[color:var(--rose-soft)]/30 shadow-soft"
                  : "border-border bg-white hover:border-[color:var(--rose)]/40"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-sm font-semibold text-[color:var(--plum)]">{option.label}</span>
                {pregnancyMethod === option.value && <CheckCircle2 className="h-5 w-5 text-[color:var(--rose)]" />}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {pregnancyMethod === "lmp" ? (
            <>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                  First day of last period
                </label>
                <input
                  type="date"
                  max={todayIso}
                  value={pregnancyLastPeriodDate}
                  onChange={(e) => setPregnancyLastPeriodDate(e.target.value)}
                  className={formInputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                  Cycle length (days)
                </label>
                <input
                  type="number"
                  min={20}
                  max={42}
                  value={pregnancyCycleLength}
                  onChange={(e) => setPregnancyCycleLength(Number(e.target.value))}
                  className={formInputClass}
                />
              </div>
            </>
          ) : (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[color:var(--plum)]/70">
                Estimated due date
              </label>
              <input
                type="date"
                min={todayIso}
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                className={formInputClass}
              />
            </div>
          )}
        </div>

        {pregnancyError && (
          <p role="alert" className="mt-5 rounded-xl bg-[color:var(--rose)]/10 px-4 py-3 text-sm text-[color:var(--rose)]">
            {pregnancyError}
          </p>
        )}

        <div className="mt-9 flex justify-end border-t border-border/60 pt-7">
          <button type="button" onClick={calculatePregnancy} className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
            Calculate <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <a href="/#tools" className="hover:text-[color:var(--rose)]">Calculators</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Ovulation &amp; Pregnancy Calculator</span>
        </nav>
      </div>

      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[34rem] w-[34rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px relative mx-auto max-w-3xl py-14 text-center md:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rose)]/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[color:var(--rose)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Clinically Informed · Ovulation &amp; Pregnancy Tools
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-medium leading-[1.1] text-[color:var(--plum)] md:text-5xl text-balance">
              Know Your <em className="font-display italic text-[color:var(--rose)]">Fertile Window</em> &amp; Due Date
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Use this free calculator to estimate your ovulation date, fertile window, pregnancy test date, next period, and baby progress through the full pregnancy.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {[
                { icon: Heart, t: "Free Tool" },
                { icon: Clock, t: "Instant Results" },
                { icon: Lock, t: "No Data Stored" },
              ].map((badge) => (
                <span key={badge.t} className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold text-[color:var(--plum)] shadow-soft">
                  <badge.icon className="h-3.5 w-3.5 text-[color:var(--rose)]" /> {badge.t}
                </span>
              ))}
            </div>
          </Reveal>
          {/* Hero stats */}
          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { stat: "6 Days", label: "Fertile window average" },
                { stat: "24h", label: "Egg survival after ovulation" },
                { stat: "5 Days", label: "Sperm can survive in body" },
                { stat: "Day 14", label: "Typical ovulation (28-day cycle)" },
              ].map((s) => (
                <div key={s.stat} className="rounded-2xl border border-[color:var(--rose)]/20 bg-white/80 px-5 py-3 text-center shadow-soft backdrop-blur">
                  <div className="font-display text-xl font-bold text-[color:var(--rose)]">{s.stat}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How This Calculator Works */}
      <section className="container-px mx-auto max-w-5xl py-10 md:py-14">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-[color:var(--plum)] md:text-3xl">How This Calculator Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Based on well-established menstrual cycle science — quick, accurate, and private.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "1", title: "Enter Your Cycle Data", desc: "Input the first day of your last period and your average cycle length. Most women have cycles between 24–35 days." },
              { n: "2", title: "We Calculate Ovulation", desc: "Using the standard luteal phase formula (cycle length minus 14 days), we estimate your most likely ovulation date." },
              { n: "3", title: "Get Your Fertile Window", desc: "Your fertile window spans 5 days before ovulation to 1 day after — when sperm can survive and meet an egg." },
              { n: "4", title: "Plan Up to 6 Months", desc: "See your ovulation dates and fertile windows for the next 6 cycles in one clear, printable table." },
            ].map((step) => (
              <div key={step.n} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--rose)] font-display text-lg font-bold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-base font-semibold text-[color:var(--plum)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Patient Testimonials */}
      <section className="container-px mx-auto max-w-5xl py-4 md:py-8">
        <Reveal>
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What Our Patients Tell Us</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { quote: "I had been trying for over a year and always thought Day 14 was the magic day. The calculator showed me my cycle was 31 days — so I was missing my fertile window completely. That was the breakthrough.", color: "border-[color:var(--rose)]" },
              { quote: "I used it to figure out when to time intercourse after my IUI. Knowing I was in my fertile window gave us extra hope during that two-week wait. We got pregnant on our second IUI.", color: "border-emerald-500" },
              { quote: "My cycles are irregular — 26 days one month, 33 the next. Entering different lengths helped me understand how much my window was shifting. My doctor said tracking this was the first step to understanding my PCOS.", color: "border-blue-500" },
              { quote: "The 6-cycle table was a game changer. My husband travels for work and we could actually plan around his schedule for the next few months. It felt like we finally had control over something.", color: "border-amber-500" },
            ].map((t, i) => (
              <div key={i} className={`rounded-3xl border-l-4 ${t.color} border border-border/70 bg-card p-6 shadow-soft`}>
                <p className="text-sm italic leading-relaxed text-[color:var(--plum)]/80">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">— Patient at Bavishi Fertility Institute</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section ref={widgetRef} className="container-px mx-auto max-w-[760px] py-10 md:py-14">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lift md:p-10">
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Ovulation Calculator", value: "ovulation" },
                { label: "Pregnancy Calculator", value: "pregnancy" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab.value as "ovulation" | "pregnancy")}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    activeTab === tab.value
                      ? "bg-[color:var(--rose)] text-white"
                      : "border border-border bg-white text-[color:var(--plum)] hover:border-[color:var(--rose)]/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "ovulation" ? renderOvulationForm() : renderPregnancyForm()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal delay={0.05}>
          <div className="rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/25 p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">What this calculator helps you do</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Calendar,
                  title: "Find Your Fertile Window",
                  desc: "Discover the best days for conception based on your cycle length.",
                },
                {
                  icon: Droplets,
                  title: "Estimate Your Due Date",
                  desc: "Track pregnancy progress with weeks, trimester milestones and baby size data.",
                },
                {
                  icon: Sparkles,
                  title: "Plan Your Next Steps",
                  desc: "Use the estimates to time tests and appointments with more confidence.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                  <item.icon className="h-6 w-6 text-[color:var(--rose)]" />
                  <h3 className="mt-4 text-base font-semibold text-[color:var(--plum)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-px mx-auto max-w-[760px] py-4 md:py-8">
        <AnimatePresence mode="wait">
          {activeTab === "ovulation" && ovulationResult ? (
            <motion.div
              key="ovulation-result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-9"
            >
              <button
                type="button"
                onClick={() => setOvulationResult(null)}
                className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Recalculate
              </button>

              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { label: "Ovulation Date", value: fmt(ovulationResult.ovulationDate) },
                  {
                    label: "Fertile Window",
                    value: `${fmt(ovulationResult.fertileStart)} - ${fmt(ovulationResult.fertileEnd)}`,
                  },
                  { label: "Pregnancy Test Date", value: fmt(ovulationResult.pregnancyTestDate) },
                  { label: "Next Period", value: fmt(ovulationResult.nextPeriodStart) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                    <div className="text-sm font-semibold text-muted-foreground">{item.label}</div>
                    <div className="mt-3 text-xl font-semibold text-[color:var(--plum)]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Current Cycle Phase</div>
                    <div className="mt-2 text-2xl font-semibold text-[color:var(--plum)]">{PHASES[ovulationResult.phase].name}</div>
                  </div>
                  <span className={`${PHASES[ovulationResult.phase].color} inline-flex rounded-full px-4 py-2 text-xs font-semibold`}>
                    Day {ovulationResult.dayOfCycle}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{PHASES[ovulationResult.phase].desc}</p>
              </div>

              <div className="mt-7 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[color:var(--rose-soft)]/30 text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Period #</th>
                        <th className="px-4 py-3">Period Start</th>
                        <th className="px-4 py-3">Fertile Window</th>
                        <th className="px-4 py-3">Ovulation Date</th>
                        <th className="px-4 py-3">Test Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ovulationResult.cycles.map((cycle, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-[color:var(--ivory)]"}>
                          <td className="px-4 py-3 font-semibold text-[color:var(--plum)]">{index + 1}</td>
                          <td className="px-4 py-3">{fmt(cycle.periodStart)}</td>
                          <td className="px-4 py-3">{fmt(cycle.fertileStart)} - {fmt(cycle.fertileEnd)}</td>
                          <td className="px-4 py-3">{fmt(cycle.ovulationDate)}</td>
                          <td className="px-4 py-3">{fmt(cycle.pregnancyTestDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                * The results of this calculator are estimations only. Please consult your doctor for personal advice.
              </p>
            </motion.div>
          ) : null}

          {activeTab === "pregnancy" && pregnancyResult ? (
            <motion.div
              key="pregnancy-result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-9"
            >
              <button
                type="button"
                onClick={() => setPregnancyResult(null)}
                className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground transition hover:border-[color:var(--rose)] hover:text-[color:var(--rose)]"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Recalculate
              </button>

              <div className="rounded-[2rem] border border-[color:var(--rose)]/20 bg-gradient-to-b from-[color:var(--rose-soft)]/40 via-white to-white p-8 text-center shadow-lift md:p-12">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">Days until birth</div>
                <div className="mt-4 text-6xl font-black text-[color:var(--rose)]">{pregnancyResult.remainingDays}</div>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Estimated due date is <strong className="text-[color:var(--plum)]">{fmt(pregnancyResult.dueDate)}</strong>. This timeline helps you follow pregnancy progress safely.
                </p>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-card p-6 text-center shadow-soft">
                  <div className="text-4xl">{pregnancyResult.babySize.emoji}</div>
                  <div className="mt-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">Baby Size</div>
                  <div className="mt-2 text-xl font-semibold text-[color:var(--plum)]">{pregnancyResult.babySize.name}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pregnancyResult.babySize.desc}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <span>Trimester Progress</span>
                    <span>{pregnancyResult.progressPercent}%</span>
                  </div>
                  <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[color:var(--ivory)]">
                    <div className="h-full bg-[color:var(--rose)]" style={{ width: `${Math.min(100, pregnancyResult.t1Progress)}%` }} />
                    <div className="h-full bg-[color:var(--amber)]" style={{ width: `${Math.min(100, pregnancyResult.t2Progress)}%` }} />
                    <div className="h-full bg-[color:var(--emerald)]" style={{ width: `${Math.min(100, pregnancyResult.t3Progress)}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>T1</span>
                    <span>T2</span>
                    <span>T3</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 p-6 shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="text-center md:text-left">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Start Date</div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{fmt(pregnancyResult.lmp)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pregnancy Age</div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{pregnancyResult.weeks} weeks {pregnancyResult.extraDays} days</div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Due Date</div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{fmt(pregnancyResult.dueDate)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Week", value: `${pregnancyResult.currentWeek} of 40` },
                  { label: "Progress", value: `${pregnancyResult.progressPercent}%` },
                  { label: "Trimester", value: `Trimester ${pregnancyResult.currentTrimester}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
                    <div className="mt-2 text-xl font-semibold text-[color:var(--plum)]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">T1</div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{fmt(pregnancyResult.lmp)} – {fmt(pregnancyResult.t1End)}</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">T2</div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{fmt(addDays(pregnancyResult.t1End, 1))} – {fmt(pregnancyResult.t2End)}</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card p-5 text-center shadow-soft">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">T3</div>
                  <div className="mt-2 text-sm font-semibold text-[color:var(--plum)]">{fmt(addDays(pregnancyResult.t2End, 1))} – {fmt(pregnancyResult.dueDate)}</div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                * The results of this calculator are estimations only. Please consult your doctor for personal advice.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section className="container-px mx-auto max-w-5xl py-8 md:py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark noise px-7 py-12 text-white md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_42%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Ready to feel confident?</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Get expert guidance after your ovulation and pregnancy estimates.</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Book a consultation with our fertility specialists to validate your cycle tracking, confirm your due date, or plan the next step.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Magnetic as="a" href="/contact" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-7 py-3.5 text-sm font-semibold text-white shadow-glow">
                  <Calendar className="h-4 w-4" /> Book Consultation
                </Magnetic>
                <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Support
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Who Should Use */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)] md:text-2xl">Who Should Use This Calculator?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { emoji: "🌱", title: "Just started trying to conceive", desc: "Learn when your fertile window actually falls — most couples are surprised by the timing." },
              { emoji: "📅", title: "Irregular cycle trackers", desc: "Adjust cycle length each month to see how your fertile window shifts with irregular cycles." },
              { emoji: "🏥", title: "Timing IUI or natural cycles", desc: "Use the ovulation date estimate to plan intercourse or IUI timing with greater precision." },
              { emoji: "✈️", title: "Planning around travel or schedules", desc: "The 6-month calendar helps you and your partner plan ahead when time apart is a factor." },
              { emoji: "🤰", title: "Already pregnant", desc: "Switch to pregnancy mode to track your due date, trimester progress, and baby size week by week." },
              { emoji: "🔍", title: "Understanding your cycle", desc: "Not ready to try yet? Use the tool to understand your natural rhythm before you start." },
            ].map((p) => (
              <div key={p.title} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[color:var(--plum)]">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* About This Tool */}
      <section className="container-px mx-auto max-w-5xl py-6 md:py-10">
        <Reveal>
          <div className="rounded-3xl border border-border/70 bg-card p-7 md:p-10">
            <h2 className="text-xl font-semibold text-[color:var(--plum)] md:text-2xl">About This Tool</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                The Ovulation Calculator uses the standard luteal phase method: ovulation is estimated to occur 14 days before the start of the next period (cycle length minus 14 days). The fertile window is calculated as 5 days before ovulation through 1 day after, reflecting the typical lifespan of sperm (up to 5 days) and the egg (12–24 hours post-ovulation).
              </p>
              <p>
                This method assumes a consistent luteal phase length. Women with irregular cycles, anovulatory cycles, PCOS, thyroid disorders, or those approaching perimenopause may have unpredictable ovulation timing. In these cases, the calculator provides a starting estimate — but monitoring with ovulation predictor kits (OPKs), basal body temperature (BBT) charting, or ultrasound follicle tracking will be more accurate.
              </p>
              <p>
                The Pregnancy Calculator uses Naegele&apos;s Rule: add 280 days (40 weeks) to the first day of the last menstrual period for an estimated due date. Trimester boundaries are set at weeks 1–12 (T1), 13–27 (T2), and 28–40 (T3). Baby size comparisons are for educational purposes only.
              </p>
              <p className="text-xs">
                This tool is for educational purposes only. All results are estimates. Always confirm your ovulation timing and pregnancy dates with a qualified healthcare provider.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <CalculatorCrossLinks current="/ovulation-calculator" />
      <Locations />
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
