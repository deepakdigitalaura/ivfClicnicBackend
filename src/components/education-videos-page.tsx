"use client";
import { useState } from "react";
import { PlayCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

type VideoEntry = {
  id: string;
  title: string;
  desc: string;
  tab: string;
};

/** Built-in fallback list — used only when the CMS `education-videos`
 * collection is empty, so the page renders identically before it is seeded. */
const DEFAULT_VIDEOS: VideoEntry[] = [
  /* IVF */
  { id: "lovYgHlbZoE", title: "Fertility Expert Dr. Janki Bavishi on IVF", desc: "A comprehensive overview of In Vitro Fertilisation explained by our senior specialist.", tab: "IVF" },
  { id: "Pzbwv2EZlrM", title: "Ovarian Cyst Before IVF — What to Do", desc: "Do you need to remove an ovarian cyst before starting your IVF cycle? Dr. Bavishi explains.", tab: "IVF" },
  { id: "AO_J6jKeCck", title: "How Many Eggs Are Needed for IVF?", desc: "Understanding egg numbers and their impact on IVF outcomes — a patient guide.", tab: "IVF" },
  { id: "8eietbeNbfw", title: "Side Effects of IVF — Q&A with Our Doctors", desc: "Common concerns and honest answers about IVF side effects and what to expect.", tab: "IVF" },
  /* IVF Cost */
  { id: "7Gy15T3JoEg", title: "IVF Cost in Ahmedabad", desc: "A transparent breakdown of IVF treatment costs at Bavishi Fertility Institute, Ahmedabad.", tab: "IVF Cost" },
  { id: "BQ9nbKU9WM8", title: "IVF Examination Cost Explained", desc: "What does an IVF evaluation include and what does it cost? Your questions answered.", tab: "IVF Cost" },
  { id: "LnZWhnY64Bo", title: "Low Cost IVF — Is It Right for You?", desc: "Understanding low-cost IVF options, indications, and expected outcomes.", tab: "IVF Cost" },
  /* Male Infertility */
  { id: "22xqpk3-z2I", title: "How to Increase Sperm Count", desc: "Practical, science-backed advice from our specialists on improving male fertility.", tab: "Male Infertility" },
  /* Embryo Transfer */
  { id: "5oKbplu1Qzs", title: "Medicines After Embryo Transfer", desc: "Which medications are necessary after embryo transfer and why they matter.", tab: "Embryo Transfer" },
  /* Fertility Preservation */
  { id: "eON_mr8bz-A", title: "Egg Freezing vs Embryo Freezing", desc: "Dr. Parth Bavishi explains the key differences and which option suits you best.", tab: "Fertility Preservation" },
  { id: "f3N5WJtGwmk", title: "5 Things to Know Before Egg Freezing", desc: "Essential information every woman should know before starting her egg-freezing journey.", tab: "Fertility Preservation" },
  /* Female Infertility */
  { id: "bNZiMbg4Wkw", title: "Natural Pregnancy After 40?", desc: "Understanding your real chances and options for conceiving naturally after 40.", tab: "Female Infertility" },
];

function EduVideoCard({ id, title, desc, tab }: VideoEntry) {
  const [play, setPlay] = useState(false);
  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <div className="relative aspect-video">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Play video: ${title}`}
            className="group/yt absolute inset-0 h-full w-full"
          >
            <img
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/yt:scale-105"
            />
            <span className="absolute inset-0 bg-[color:var(--plum)]/15 transition-colors duration-300 group-hover/yt:bg-[color:var(--plum)]/5" />
            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[color:var(--rose)] shadow-lift transition-transform duration-300 group-hover/yt:scale-110">
              <PlayCircle className="h-7 w-7" />
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full bg-[color:var(--rose)]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--rose)]">
          {tab}
        </span>
        <h3 className="mt-2.5 font-display text-base font-semibold leading-snug text-[color:var(--plum)]">{title}</h3>
        <p className="mt-1.5 text-sm text-[color:var(--plum)]/65 line-clamp-2">{desc}</p>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--rose)] hover:underline"
        >
          Watch on YouTube <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.article>
  );
}

export function EducationVideosPage({ videos }: { videos?: VideoEntry[] }) {
  const VIDEOS = videos?.length ? videos : DEFAULT_VIDEOS;
  const TABS = ["All", ...Array.from(new Set(VIDEOS.map((v) => v.tab)))];
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? VIDEOS : VIDEOS.filter((v) => v.tab === activeTab);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[color:var(--rose-soft)]/40 py-14 md:py-20">
          <div className="container-px mx-auto max-w-[1400px]">
            <Reveal>
              <span className="mb-4 inline-block rounded-full bg-[color:var(--rose)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--rose)]">
                Education
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--plum)] md:text-5xl lg:text-6xl">
                Learn from the{" "}
                <em className="font-display italic text-[color:var(--rose)]">Experts.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--plum)]/70">
                Clear, trustworthy fertility education from Bavishi Fertility Institute's specialists —
                covering IVF, male infertility, fertility preservation, embryo transfer, and more.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Filter Tabs + Grid */}
        <section className="container-px mx-auto max-w-[1400px] py-10 md:py-14">
          {/* Tabs */}
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[color:var(--rose)] text-white shadow-soft"
                      : "border border-border bg-white text-[color:var(--plum)]/70 hover:border-[color:var(--rose)]/40 hover:text-[color:var(--rose)]"
                  }`}
                >
                  {tab}
                  {tab !== "All" && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({VIDEOS.filter((v) => v.tab === tab).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((v) => (
                  <StaggerItem key={v.id}>
                    <EduVideoCard {...v} />
                  </StaggerItem>
                ))}
              </Stagger>
            </motion.div>
          </AnimatePresence>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl bg-[color:var(--plum)]/5 p-8 text-center">
              <p className="text-lg font-semibold text-[color:var(--plum)]">Watch more on our YouTube channel</p>
              <p className="text-sm text-[color:var(--plum)]/60">
                New educational videos added regularly by our specialists.
              </p>
              <a
                href="https://www.youtube.com/@BavishiFertilityInstitute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-300 hover:scale-[1.03]"
              >
                Visit YouTube Channel <ExternalLink className="h-4 w-4" />
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
