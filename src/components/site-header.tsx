"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Calendar, Globe, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { useBodyLock } from "./conversion";
import { doctorMenuData } from "@/lib/doctors";
import { useHeader } from "@/components/header-provider";
import type { HeaderNavItem, HeaderMegaItem, DoctorMenuData } from "@/lib/header";

// Hardcoded fallback — used only when the CMS has no doctors with navRole set yet.
const DOCTOR_MENU_FALLBACK = doctorMenuData();

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "mr", label: "मराठी" },
];

export function SiteHeader({
  logoSrc,
  logoAlt,
}: { logoSrc?: string; logoAlt?: string } = {}) {
  // Header content is CMS-managed via the `header` global (Phase 3.5B, Item 4):
  // the root layout resolves it (getHeader) and passes it through HeaderProvider;
  // here we read it with useHeader(), which falls back to HEADER_DEFAULTS so the
  // markup is byte-identical when the CMS is empty. Per-page logo overrides still
  // win (e.g. the maternity service page) — props take precedence over branding.
  const { branding, nav: NAV, cta } = useHeader();
  const finalLogoSrc = logoSrc ?? branding.logoUrl;
  const finalLogoAlt = logoAlt ?? branding.logoAlt;
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
            <span>India's Trusted Fertility Experts · Since 1998</span>
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
            <img src={finalLogoSrc} alt={finalLogoAlt} className="h-12 w-auto" />
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
                    {...(item.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
            <a href={cta.href} className="hidden items-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:brightness-110 transition md:inline-flex">
              <Calendar className="h-4 w-4" /> {cta.label}
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
              <DoctorsMegaPanel menu={activeItem.doctorMenu} />
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
                              <span className="text-sm font-semibold capitalize text-[color:var(--plum)] transition-colors group-hover/sub:text-[color:var(--rose)]">{it.label}</span>
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
                              <div className="text-sm font-semibold capitalize text-[color:var(--plum)] group-hover:text-[color:var(--rose)] transition-colors">{it.label}</div>
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
              <img src={finalLogoSrc} alt={finalLogoAlt} className="h-11 w-auto" />
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
              <a href={cta.href} className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--rose)] px-5 py-3 text-sm font-semibold text-white shadow-soft">
                <Calendar className="h-4 w-4" /> {cta.label}
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

function MobileNavItem({ item, onNavigate }: { item: HeaderNavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  if (item.doctors) return <MobileDoctorsItem onNavigate={onNavigate} menu={item.doctorMenu} />;
  if (!item.mega) {
    return (
      <a
        href={item.href || "#"}
        {...(item.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={onNavigate}
        className="block rounded-lg px-3 py-3 text-sm font-semibold text-[color:var(--plum)] hover:bg-[color:var(--ivory)]"
      >
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
                        <a href={it.href} onClick={onNavigate} className="block py-1.5 text-sm capitalize text-[color:var(--plum)]/80 hover:text-[color:var(--rose)]">{it.label}</a>
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

function MobileSubItem({ item, onNavigate }: { item: HeaderMegaItem; onNavigate: () => void }) {
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
function DoctorsMegaPanel({ menu }: { menu?: DoctorMenuData }) {
  const { senior, specialists } = menu ?? DOCTOR_MENU_FALLBACK;
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
function MobileDoctorsItem({ onNavigate, menu }: { onNavigate: () => void; menu?: DoctorMenuData }) {
  const [open, setOpen] = useState(false);
  const { senior, specialists } = menu ?? DOCTOR_MENU_FALLBACK;
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
