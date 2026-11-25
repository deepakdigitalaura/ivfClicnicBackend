"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { INQUIRY_TREATMENTS, INQUIRY_LOCATIONS } from "@/components/home-page";
import { loadRecaptcha } from "@/lib/recaptcha";

/* =====================================================================
 * Appointment pop-up.
 * ---------------------------------------------------------------------
 * A short lead form that opens over the page. It posts to the SAME
 * /inquiry route the main form uses, so every lead lands in the admin
 * panel's Inquiries list with no extra plumbing — and carries a `source`
 * of "Popup — <path>", which the admin list already renders as a badge
 * and includes in its CSV export, so pop-up leads can be told apart from
 * the rest.
 *
 * ON NOT BEING OBNOXIOUS. A pop-up that fires instantly, on every page,
 * every visit, costs more in bounced visitors than it earns in leads.
 * So:
 *   - it waits, and also opens on exit intent, whichever comes first
 *   - once submitted it never returns for that visitor
 *   - once dismissed it stays away for a week
 *   - it never opens on the pages that already ask for the same details
 *     (contact, book, the admin panel), where it would just be in the way
 *   - Escape and a backdrop click both close it, and focus moves into the
 *     dialog on open and back to the page on close
 *
 * Spam handling mirrors the main form: a hidden honeypot plus the same
 * reCAPTCHA widget, both already understood by the /inquiry route.
 * ===================================================================== */

const DELAY_MS = 25_000;
const DISMISS_DAYS = 7;
const KEY_DONE = "bfi.popup.submitted";
const KEY_SNOOZE = "bfi.popup.snoozeUntil";

/** Pages that already lead with a form, plus anything behind the admin login. */
const SKIP = [/^\/admin-panel/, /^\/contact/, /^\/book/, /^\/inquiry/, /^\/edit\//, /^\/preview/];

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

/** "Ahmedabad" from /locations/ahmedabad/paldi, so the centre is pre-filled
 *  for a visitor who is already reading about one. */
function cityFromPath(path: string): string {
  const m = /^\/locations\/([a-z-]+)/.exec(path);
  if (!m) return "";
  const guess = m[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return INQUIRY_LOCATIONS.find((l) => l.toLowerCase() === m[1]) ? guess : "";
}

export function LeadPopup() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", treatment: "", location: "", message: "" });
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const [captcha, setCaptcha] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<Element | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const captchaId = useRef<number | null>(null);

  const blocked = SKIP.some((re) => re.test(pathname));

  /* ---- when to open ---- */
  useEffect(() => {
    if (blocked) return;
    if (read(KEY_DONE)) return;
    const snooze = Number(read(KEY_SNOOZE) ?? 0);
    if (snooze && Date.now() < snooze) return;

    let fired = false;
    const show = () => {
      if (fired) return;
      fired = true;
      openerRef.current = document.activeElement;
      setOpen(true);
    };
    const timer = window.setTimeout(show, DELAY_MS);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    document.addEventListener("mouseout", onLeave);
    return () => { window.clearTimeout(timer); document.removeEventListener("mouseout", onLeave); };
  }, [blocked, pathname]);

  const close = useCallback((snooze: boolean) => {
    setOpen(false);
    if (snooze) write(KEY_SNOOZE, String(Date.now() + DISMISS_DAYS * 86_400_000));
    const opener = openerRef.current;
    if (opener instanceof HTMLElement) opener.focus();
  }, []);

  /* ---- Escape, background scroll, and focus ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(true); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  /* ---- reCAPTCHA, only once the dialog is actually open ---- */
  useEffect(() => {
    const el = captchaRef.current;
    if (!open || sent || !RECAPTCHA_SITE_KEY || !el) return;
    let live = true;
    loadRecaptcha().then((g) => {
      if (!live || el.hasChildNodes()) return;
      captchaId.current = g.render(el, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (t: string) => { setCaptcha(t); setErrors((e) => ({ ...e, captcha: "" })); },
        "expired-callback": () => setCaptcha(""),
      });
    });
    return () => { live = false; };
  }, [open, sent]);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please tell us your name";
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) next.phone = "Please enter a valid phone number";
    if (RECAPTCHA_SITE_KEY && !captcha) next.captcha = "Please confirm you are not a robot";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setServerError("");
    try {
      const res = await fetch("/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          location: form.location || cityFromPath(pathname),
          company,                       // honeypot
          captcha,
          source: `Popup — ${pathname}`, // shown in the admin list as a badge
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
      write(KEY_DONE, "1");
    } catch {
      setServerError("Could not send that just now. Please call +91 97126 22288 — we are happy to help.");
      if (captchaId.current !== null) loadRecaptcha().then((g) => g.reset(captchaId.current!));
      setCaptcha("");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  const field = (k: string) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-[color:var(--plum)] outline-none transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-[color:var(--rose)]/30 ${
      errors[k] ? "border-red-400" : "border-border/70"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(true); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-white p-5 shadow-lift md:p-7"
      >
        <button
          type="button"
          onClick={() => close(true)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-[color:var(--rose-soft)]/50 hover:text-[color:var(--rose)]"
        >
          <X className="h-5 w-5" />
        </button>

        {sent ? (
          <div className="py-8 text-center">
            <h2 id="lead-popup-title" className="text-2xl font-semibold text-[color:var(--plum)]">
              Thank you — we have your details
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Our team will call you back shortly. If you would rather speak to someone now,
              call <a href="tel:+919712622288" className="font-semibold text-[color:var(--rose)]">+91 97126 22288</a>.
            </p>
            <button
              type="button"
              onClick={() => close(false)}
              className="mt-6 rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id="lead-popup-title" className="pr-10 text-lg font-semibold leading-snug text-[color:var(--plum)] md:text-xl">
              Facing fertility issues?{" "}
              <em className="font-display italic text-[color:var(--rose)]">Book an appointment today</em>
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Leave your number and our team will call you back. No obligation.
            </p>

            <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="lp-name" className="mb-1 block text-sm font-medium text-[color:var(--plum)]">
                    Name <span className="text-[color:var(--rose)]">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="lp-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    className={field("name")}
                    autoComplete="name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="lp-phone" className="mb-1 block text-sm font-medium text-[color:var(--plum)]">
                    Phone number <span className="text-[color:var(--rose)]">*</span>
                  </label>
                  <input
                    id="lp-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="Mobile number"
                    className={field("phone")}
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="lp-treatment" className="mb-1 block text-sm font-medium text-[color:var(--plum)]">
                    What can we help with?
                  </label>
                  <select
                    id="lp-treatment"
                    value={form.treatment}
                    onChange={(e) => set("treatment", e.target.value)}
                    className={`${field("treatment")} appearance-none`}
                  >
                    <option value="">Select an option</option>
                    {INQUIRY_TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="lp-location" className="mb-1 block text-sm font-medium text-[color:var(--plum)]">
                    Nearest centre
                  </label>
                  <select
                    id="lp-location"
                    value={form.location || cityFromPath(pathname)}
                    onChange={(e) => set("location", e.target.value)}
                    className={`${field("location")} appearance-none`}
                  >
                    <option value="">Select a centre</option>
                    {INQUIRY_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="lp-message" className="mb-1 block text-sm font-medium text-[color:var(--plum)]">
                  Message <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="lp-message"
                  rows={1}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Anything you would like us to know"
                  className={field("message")}
                />
              </div>

              {/* Honeypot — off-screen, never shown to a real visitor. */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              {RECAPTCHA_SITE_KEY && (
                <div>
                  <div ref={captchaRef} />
                  {errors.captcha && <p className="mt-1 text-xs text-red-500">{errors.captcha}</p>}
                </div>
              )}

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Book my appointment"}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                We never share your details. You can also call{" "}
                <a href="tel:+919712622288" className="font-medium text-[color:var(--rose)]">+91 97126 22288</a>.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
