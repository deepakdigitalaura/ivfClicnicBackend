"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_KEY = "bfi_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    document.cookie = `${COOKIE_KEY}=accepted; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    document.cookie = `${COOKIE_KEY}=declined; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 md:bottom-6 md:left-auto md:right-6 md:max-w-sm md:px-0"
    >
      <div className="relative rounded-2xl border border-border/60 bg-white/95 p-5 shadow-[0_8px_40px_-8px_rgba(46,24,75,0.22)] backdrop-blur-xl ring-1 ring-black/5">
        <button
          type="button"
          onClick={decline}
          aria-label="Close cookie banner"
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[color:var(--rose-soft)] hover:text-[color:var(--plum)]"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="mb-1 text-sm font-semibold text-[color:var(--plum)]">
          We use cookies
        </p>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          We use cookies to improve your experience and analyse site traffic. By
          clicking&nbsp;<strong>Accept</strong>, you agree to our{" "}
          <Link
            href="/cookie-policy"
            className="font-medium text-[color:var(--rose)] underline-offset-2 hover:underline"
          >
            Cookie Policy
          </Link>
          .
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded-xl bg-[color:var(--rose)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--rose)]"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={decline}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:bg-[color:var(--rose-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--plum)]"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
