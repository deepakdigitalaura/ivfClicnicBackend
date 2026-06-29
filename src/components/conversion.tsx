"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Phone, MessageCircle, Calendar, ArrowUp } from "lucide-react";

/* ---------- Top scroll progress bar (global) ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[color:var(--rose)] via-[color:var(--rose)] to-[color:var(--gold)]"
    />
  );
}

/* ---------- Scroll to top ---------- */
export function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      className={`fixed right-4 bottom-20 z-40 grid h-11 w-11 place-items-center rounded-full bg-[color:var(--rose)] text-white shadow-lift ring-1 ring-white/30 transition-all duration-300 hover:brightness-110 md:bottom-6 md:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

/* ---------- Desktop slide-out contact action bar ----------
   Fixed to the right edge, icon-only by default. Each pill expands
   leftward on hover/focus to reveal its label — pure CSS (no state,
   no re-renders), GPU-/width-friendly transitions only. */
const ctaActions = [
  { href: "https://wa.me/919712622288", label: "WhatsApp Us", Icon: MessageCircle, bg: "bg-[#25D366]", external: true },
  { href: "tel:+919712622288", label: "Call Now", Icon: Phone, bg: "bg-[color:var(--plum)]", external: false },
  { href: "/contact#book", label: "Book Consultation", Icon: Calendar, bg: "bg-[color:var(--rose)]", external: false },
];

export function FloatingCTA() {
  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 pr-3 md:flex">
      {ctaActions.map(({ href, label, Icon, bg, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={label}
          className={`group flex items-center overflow-hidden rounded-full ${bg} text-white shadow-lift outline-none ring-1 ring-white/15 transition-[filter] duration-300 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white/80`}
        >
          {/* Label — collapsed to zero width until hover/focus (tooltip-style reveal) */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-[max-width,opacity,padding] duration-300 ease-out group-hover:max-w-[12rem] group-hover:pl-5 group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:pl-5 group-focus-visible:opacity-100">
            {label}
          </span>
          {/* Icon — pinned to the right edge as the constant, recognisable anchor */}
          <span className="grid h-12 w-12 shrink-0 place-items-center">
            <Icon className="h-5 w-5" />
          </span>
        </a>
      ))}
    </div>
  );
}

/* ---------- Mobile sticky bottom bar ---------- */
export function MobileBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_-8px_rgba(46,24,75,0.15)] md:hidden">
      <div className="grid grid-cols-3 divide-x divide-border/60">
        <a href="tel:+919712622288" className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-[color:var(--plum)] active:bg-[color:var(--ivory)]">
          <Phone className="h-5 w-5 text-[color:var(--rose)]" /> Call
        </a>
        <a href="https://wa.me/919712622288" className="flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-[color:var(--plum)] active:bg-[color:var(--ivory)]">
          <MessageCircle className="h-5 w-5 text-[#25D366]" /> WhatsApp
        </a>
        <a href="/contact#book" className="flex flex-col items-center gap-1 bg-[color:var(--rose)] py-3 text-[11px] font-semibold text-white active:brightness-110">
          <Calendar className="h-5 w-5" /> Book Now
        </a>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}

/* ---------- Lock body scroll on mobile menu ---------- */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}
