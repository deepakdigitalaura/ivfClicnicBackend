"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Calendar, Globe, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
const logo = "/assets/logo.png";
import { useBodyLock } from "./conversion";
import { destinationHref } from "@/lib/internal-links";
import { doctorMenuData } from "@/lib/doctors";

type MegaItem = { label: string; href: string; desc?: string; children?: { label: string; href: string }[] };
type MegaCol = { heading: string; headingHref?: string; items: MegaItem[] };
type NavItem = { label: string; href?: string; mega?: MegaCol[]; megaCols?: number; featured?: { title: string; desc: string; href: string }[]; hideFeatured?: boolean; doctors?: boolean };

/* Compact, doctor-first "Doctors" mega menu data — see <DoctorsMegaPanel>.
 * Built from DOCTORS so it stays in sync as doctors are added. */
const DOCTOR_MENU = doctorMenuData();

const NAV: NavItem[] = [
  {
    label: "About",
    mega: [
      { heading: "", items: [
        { label: "About Bavishi Fertility Institute", href: "/about-bfi" },
        { label: "Why Bavishi Fertility Institute", href: "/#about" },
        { label: "Simple Treatment", href: "/#about" },
        { label: "Safe Treatment", href: "/#about" },
        { label: "Smart Treatment", href: "/#about" },
        { label: "Success Benchmarks", href: "/#about" },
      ]},
      { heading: "", items: [
        { label: "History", href: "/#about" },
        { label: "Our Team", href: "/#doctors" },
        { label: "Infrastructure", href: "/#about" },
        { label: "Suraksha Kavach Package", href: destinationHref("suraksha-kavach") },
        { label: "Easy / Interest Free EMI", href: "/#about" },
      ]},
    ],
  },
  {
    label: "Doctors",
    doctors: true,
  },
  {
    label: "IVF Treatments",
    mega: [
      { heading: "Advanced IVF Treatment", items: [
        { label: "IVF", href: "/what-is-ivf" },
        { label: "IVF Failure", href: "/ivf-failure" },
        { label: "IUI", href: "/intra-uterine-insemination-iui" },
        { label: "ICSI", href: "/icsi-treatment-intracytoplasmic-sperm-injection" },
        { label: "PICSI", href: "/physiological-intracytoplasmic-sperm-injection-picsi" },
        { label: "IMSI", href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi" },
        { label: "MACS", href: "/magnetic-activated-cell-sorting-macs" },
        { label: "Spindle View ICSI", href: "/spindle-view-icsi" },
        { label: "Blastocyst Transfer", href: "/blastocyst-culture-blastocyst-transfer" },
        { label: "Laser Hatching", href: "/laser-assisted-hatching" },
      ]},
      { heading: "Donor Services", items: [
        { label: "Egg Donation", href: "/egg-donation" },
        { label: "Sperm Donation", href: "/sperm-donation" },
        { label: "Embryo Donation", href: "/embryo-donation" },
      ]},
      { heading: "Male Infertility", items: [
        { label: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
        { label: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
        { label: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
        { label: "PESA / TESA / TESE / Micro TESE", href: "/surgical-sperm-retrieval" },
        { label: "Varicocele / Micro Surgery", href: "/varicocele" },
        { label: "Erectile Dysfunction", href: "/erectile-dysfunction" },
      ]},
      { heading: "Female Infertility", items: [
        { label: "Conceive Naturally", href: "/conceive-naturally" },
        { label: "PRP Infertility", href: "/prp-infertility" },
        { label: "PCOS", href: "/pcos" },
        { label: "Poor Ovarian Reserve / Low Egg Count / Low AMH", href: "/ovarian-reserve" },
        { label: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
        { label: "Fibroid", href: "/fibroids" },
        { label: "Endometriosis", href: "/endometriosis" },
      ]},
      { heading: "Fertility Preservation", items: [
        { label: "Cryopreservation", href: "/cryopreservation" },
      ]},
    ],
  },
  {
    label: "Maternity Services",
    hideFeatured: true,
    mega: [
      { heading: "", items: [
        { label: "3D/4D Sonography", href: "/services/3d-4d-sonography" },
        { label: "Painless Delivery", href: "/services/painless-delivery" },
        { label: "Normal Delivery", href: "/services/normal-delivery" },
      ]},
      { heading: "", items: [
        { label: "Fetal Medicine", href: "/services/fetal-medicine" },
        { label: "High Risk Pregnancy Care", href: "/services/high-risk-pregnancy-care" },
        { label: "Twin Pregnancy Care", href: "/services/twin-pregnancy-care" },
      ]},
    ],
  },
  {
    label: "Locations",
    megaCols: 4,
    mega: [
      { heading: "Ahmedabad", headingHref: "/locations/ahmedabad", items: [
        { label: "Paldi", href: "/locations/ahmedabad/paldi" },
        { label: "Sindhu Bhavan Road", href: "/locations/ahmedabad/sindhu-bhavan-road" },
        { label: "Nikol", href: "/locations/ahmedabad/nikol" },
      ]},
      { heading: "Mumbai", headingHref: "/locations/mumbai", items: [
        { label: "Ghatkopar", href: "/locations/mumbai/ghatkopar" },
        { label: "Thane", href: "/locations/mumbai/thane" },
        { label: "Vile Parle", href: "/locations/mumbai/vile-parle" },
        { label: "Borivali", href: "/locations/mumbai/borivali" },
        { label: "Vashi", href: "/locations/mumbai/vashi" },
      ]},
      // Single-centre cities: heading is plain text (no separate hub) — the
      // centre link below navigates straight to the bare city path.
      { heading: "Vadodara", items: [{ label: "Vadodara Centre", href: "/locations/vadodara" }] },
      { heading: "Surat", items: [{ label: "Surat Centre", href: "/locations/surat" }] },
      { heading: "Bhuj", items: [{ label: "Bhuj Centre", href: "/locations/bhuj" }] },
      { heading: "Bhavnagar", items: [{ label: "Bhavnagar Centre", href: "/locations/bhavnagar" }] },
      { heading: "Anand", items: [{ label: "Anand Centre", href: "/locations/anand" }] },
      { heading: "Varanasi", items: [{ label: "Varanasi Centre", href: "/locations/varanasi" }] },
    ],
  },
  {
    label: "Calculators",
    mega: [
      { heading: "Fertility & IVF", items: [
        { label: "IVF Success Rate Calculator", href: "/#tools" },
        { label: "IVF Cost Calculator", href: "/#tools" },
        { label: "AMH Level Interpreter", href: "/#tools" },
        { label: "Sperm Analysis Calculator", href: "/#tools" },
      ]},
      { heading: "Conception & Pregnancy", items: [
        { label: "Ovulation Calculator", href: "/#tools" },
        { label: "Fertile Period Calculator", href: "/#tools" },
        { label: "Natural Pregnancy Calculator", href: "/#tools" },
        { label: "Miscarriage Risk Calculator", href: "/#tools" },
      ]},
    ],
  },
  {
    label: "Resources",
    mega: [
      { heading: "Learn", items: [
        { label: "Blog", href: destinationHref("blog") },
        { label: "Success Stories", href: "/#stories" },
        { label: "Videos", href: "/#videos" },
        { label: "Events & Webinars", href: "/#events" },
      ]},
      { heading: "Tools", items: [
        { label: "Fertility Calculators", href: "/#tools" },
        { label: "Check IVF Eligibility", href: "/#book" },
      ]},
    ],
  },
  { label: "Contact", href: "/contact" },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "mr", label: "मराठी" },
];

export function SiteHeader({
  logoSrc = logo,
  logoAlt = "Bavishi Fertility Institute",
}: { logoSrc?: string; logoAlt?: string } = {}) {
  const [hover, setHover] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);
  useBodyLock(mobile);

  const openMega = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setHover(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHover(null), 120);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-lang]")) setLangOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const activeItem = NAV.find((n) => n.label === hover && (n.mega || n.doctors));

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden border-b border-border/60 bg-[color:var(--plum)] text-white lg:block">
        <div className="container-px mx-auto flex h-9 max-w-[1400px] items-center justify-between text-xs">
          <div className="flex items-center gap-5 text-white/70">
            <span>India's Trusted Fertility Experts · Since 1983</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+919712622288" className="flex items-center gap-1.5 text-white/80 hover:text-white"><Phone className="h-3 w-3" /> +91 97126 22288</a>
            <a href="https://wa.me/919712622288" className="flex items-center gap-1.5 text-white/80 hover:text-white"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
            <a href="/#book" className="flex items-center gap-1.5 text-white/80 hover:text-white">24×7 Care</a>
            <span className="h-3 w-px bg-white/20" />
            {/* Language */}
            <div className="relative" data-lang>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }}
                className="flex items-center gap-1.5 text-white/80 hover:text-white"
              >
                <Globe className="h-3 w-3" />
                {LANGS.find((l) => l.code === lang)?.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 z-[70] mt-2 w-40 overflow-hidden rounded-xl border border-border bg-white shadow-lift">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[color:var(--ivory)] ${lang === l.code ? "text-[color:var(--rose)] font-semibold" : "text-[color:var(--plum)]"}`}
                    >
                      {l.label}
                      {lang === l.code && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--rose)]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-border/60 bg-[color:var(--ivory)]/90 backdrop-blur-xl"
        onMouseLeave={scheduleClose}
      >
        <div className="container-px mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6">
          <a href="/" className="flex shrink-0 items-center gap-3">
            <img src={logoSrc} alt={logoAlt} className="h-12 w-auto" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center xl:flex">
            <ul className="flex items-center gap-0.5 text-[14px] font-medium text-[color:var(--plum)]">
              {NAV.map((item) => (
                <li
                  key={item.label}
                  onMouseEnter={() => (item.mega || item.doctors) ? openMega(item.label) : setHover(null)}
                >
                  <a
                    href={item.href || (item.doctors ? "/doctors" : "#")}
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 transition-colors hover:bg-white/60 hover:text-[color:var(--rose)] ${hover === item.label ? "text-[color:var(--rose)]" : ""}`}
                  >
                    {item.label}
                    {(item.mega || item.doctors) && <ChevronDown className={`h-3 w-3 transition-transform ${hover === item.label ? "rotate-180" : ""}`} />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <a href="/#book" className="hidden items-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:brightness-110 transition md:inline-flex">
              <Calendar className="h-4 w-4" /> Book Appointment
            </a>

            <button
              type="button"
              onClick={() => setMobile(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white/60 text-[color:var(--plum)] xl:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        {activeItem && (activeItem.mega || activeItem.doctors) && (
          <div
            className="absolute inset-x-0 top-full hidden border-b border-border/60 bg-white shadow-lift xl:block"
            onMouseEnter={() => openMega(activeItem.label)}
            onMouseLeave={scheduleClose}
          >
            {activeItem.doctors ? (
              <DoctorsMegaPanel />
            ) : (
            <div className="container-px mx-auto max-w-[1400px] py-10">
              <div className="grid gap-x-8 gap-y-7" style={{ gridTemplateColumns: `repeat(${activeItem.megaCols ?? activeItem.mega!.length}, minmax(0, 1fr))` }}>
                {activeItem.mega!.map((col, ci) => (
                  <div key={col.heading || ci}>
                    {col.heading && (
                      col.headingHref
                        ? <a href={col.headingHref} className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)] transition-opacity hover:opacity-70">{col.heading}</a>
                        : <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">{col.heading}</div>
                    )}
                    <ul className={`space-y-2.5 ${col.heading ? "mt-4" : ""}`}>
                      {col.items.map((it) => (
                        it.children ? (
                          <li key={it.label} className="group/sub">
                            <a href={it.href} className="block">
                              <span className="text-sm font-semibold text-[color:var(--plum)] transition-colors group-hover/sub:text-[color:var(--rose)]">{it.label}</span>
                            </a>
                            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-hover/sub:grid-rows-[1fr] group-focus-within/sub:grid-rows-[1fr]">
                              <div className="overflow-hidden">
                                <ul className="mt-1.5 space-y-1 border-l border-border/70 pl-3">
                                  {it.children.map((ch) => (
                                    <li key={ch.label}>
                                      <a href={ch.href} className="block text-[13px] text-[color:var(--plum)]/70 transition-colors hover:text-[color:var(--rose)]">{ch.label}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <li key={it.label}>
                            <a href={it.href} className="group block">
                              <div className="text-sm font-semibold text-[color:var(--plum)] group-hover:text-[color:var(--rose)] transition-colors">{it.label}</div>
                              {it.desc && <div className="text-xs text-muted-foreground">{it.desc}</div>}
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        )}
      </motion.header>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-[80] xl:hidden">
          <div className="absolute inset-0 bg-[color:var(--plum)]/40 backdrop-blur-sm" onClick={() => setMobile(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <img src={logoSrc} alt={logoAlt} className="h-11 w-auto" />
              <button type="button" onClick={() => setMobile(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border border-border text-[color:var(--plum)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-[color:var(--ivory)] p-1">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition ${lang === l.code ? "bg-white text-[color:var(--rose)] shadow-soft" : "text-[color:var(--plum)]/70"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <nav className="px-2 pb-6">
              {NAV.map((item) => (
                <MobileNavItem key={item.label} item={item} onNavigate={() => setMobile(false)} />
              ))}
            </nav>

            <div className="space-y-2 border-t border-border px-5 py-5">
              <a href="/#book" className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-3 text-sm font-semibold text-white shadow-soft">
                <Calendar className="h-4 w-4" /> Book Appointment
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href="tel:+919712622288" className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-[color:var(--plum)]"><Phone className="h-4 w-4" /> Call</a>
                <a href="https://wa.me/919712622288" className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-[color:var(--plum)]"><MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  if (item.doctors) return <MobileDoctorsItem onNavigate={onNavigate} />;
  if (!item.mega) {
    return (
      <a href={item.href || "#"} onClick={onNavigate} className="block rounded-lg px-3 py-3 text-sm font-semibold text-[color:var(--plum)] hover:bg-[color:var(--ivory)]">
        {item.label}
      </a>
    );
  }
  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-[color:var(--plum)] hover:bg-[color:var(--ivory)]">
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="space-y-3 px-5 py-2">
            {item.mega.map((col, ci) => (
              <div key={col.heading || ci}>
                {col.heading && (
                  col.headingHref
                    ? <a href={col.headingHref} onClick={onNavigate} className="block text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">{col.heading}</a>
                    : <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">{col.heading}</div>
                )}
                <ul className={`space-y-1 ${col.heading ? "mt-1.5" : ""}`}>
                  {col.items.map((it) => (
                    it.children ? (
                      <MobileSubItem key={it.label} item={it} onNavigate={onNavigate} />
                    ) : (
                      <li key={it.label}>
                        <a href={it.href} onClick={onNavigate} className="block py-1.5 text-sm text-[color:var(--plum)]/80 hover:text-[color:var(--rose)]">{it.label}</a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSubItem({ item, onNavigate }: { item: MegaItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-1.5 text-left text-sm text-[color:var(--plum)]/80 hover:text-[color:var(--rose)]">
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <ul className="space-y-0.5 border-l border-border/70 pl-3">
            {item.children?.map((ch) => (
              <li key={ch.label}>
                <a href={ch.href} onClick={onNavigate} className="block py-1 text-[13px] text-[color:var(--plum)]/60 hover:text-[color:var(--rose)]">{ch.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

/* ---------- Doctors mega — compact, doctor-first (desktop) ----------
 * Section 1 features the senior promoters; Section 2 lists every other
 * specialist doctor-first with their city as a muted secondary label. */
function DoctorsMegaPanel() {
  const { senior, specialists } = DOCTOR_MENU;
  return (
    <div className="container-px mx-auto max-w-[1400px] py-7">
      {/* Senior Specialists */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">Senior Specialists</span>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {senior.map((d) => (
          <a key={d.href} href={d.href} className="group rounded-xl border border-border/60 bg-[color:var(--rose-soft)]/30 px-3.5 py-2.5 transition-colors hover:border-[color:var(--rose)]/40 hover:bg-[color:var(--rose-soft)]/60">
            <div className="text-sm font-semibold text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">{d.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{[d.city, d.meta].filter(Boolean).join(" · ")}</div>
          </a>
        ))}
      </div>

      {/* All IVF Specialists */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">All IVF Specialists</span>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-0.5 lg:grid-cols-3">
        {specialists.map((d) => (
          <a key={d.href} href={d.href} className="group flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-[color:var(--ivory)]">
            <span className="text-sm font-medium text-[color:var(--plum)] transition-colors group-hover:text-[color:var(--rose)]">{d.name}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{d.city}</span>
          </a>
        ))}
      </div>

      {/* Browse */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-4 text-sm">
        <a href="/doctors" className="inline-flex items-center gap-1 font-semibold text-[color:var(--rose)] transition-opacity hover:opacity-70">All Doctors <ArrowRight className="h-3.5 w-3.5" /></a>
        <a href="/#locations" className="font-medium text-[color:var(--plum)] transition-colors hover:text-[color:var(--rose)]">By Location</a>
        <a href="/#book" className="font-medium text-[color:var(--plum)] transition-colors hover:text-[color:var(--rose)]">Book Consultation</a>
      </div>
    </div>
  );
}

/* ---------- Doctors mega — compact, doctor-first (mobile) ---------- */
function MobileDoctorsItem({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const { senior, specialists } = DOCTOR_MENU;
  const row = (d: { name: string; href: string; city: string }) => (
    <li key={d.href}>
      <a href={d.href} onClick={onNavigate} className="flex items-baseline justify-between gap-3 py-1.5 text-sm text-[color:var(--plum)]/80 hover:text-[color:var(--rose)]">
        <span className="font-medium">{d.name}</span>
        <span className="shrink-0 text-[11px] text-muted-foreground">{d.city}</span>
      </a>
    </li>
  );
  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-[color:var(--plum)] hover:bg-[color:var(--ivory)]">
        Doctors
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="px-5 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">Senior Specialists</div>
            <ul className="mt-1">{senior.map(row)}</ul>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--rose)]">All IVF Specialists</div>
            <ul className="mt-1">{specialists.map(row)}</ul>
            <a href="/doctors" onClick={onNavigate} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--rose)]">All Doctors <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
