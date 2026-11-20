"use client";

import { useEffect } from "react";
import { classify, type Attribution } from "@/lib/attribution";

/* =====================================================================
 * Captures where a visit came from, once, on arrival.
 * ---------------------------------------------------------------------
 * Mounted in the root layout so it runs on whichever page the visitor lands
 * on. That timing is the whole point: on /contact, document.referrer is an
 * internal URL and the original source has already been lost.
 *
 * Storage is first-party and deliberately small:
 *   sessionStorage  this visit — what the enquiry is attributed to
 *   localStorage    the first visit we ever saw — kept for 180 days
 *
 * Nothing is sent anywhere on its own. The values travel only when the
 * visitor submits the enquiry form, as part of that submission, which is why
 * this sits outside the consent-gated analytics scripts: it records the
 * provenance of a message the visitor chose to send.
 * ===================================================================== */

export const SESSION_KEY = "bfi_attr_session";
export const FIRST_KEY = "bfi_attr_first";
const FIRST_TOUCH_TTL_DAYS = 180;

function safeGet(store: Storage | undefined, key: string): Attribution | null {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null; // private mode, blocked storage, or corrupted value
  }
}

function safeSet(store: Storage | undefined, key: string, value: Attribution) {
  try {
    store?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — attribution is a nice-to-have, never a blocker */
  }
}

/** Read what we know for a form submission. Safe to call anywhere. */
export function readAttribution(): {
  lastTouch: Attribution | null;
  firstTouch: Attribution | null;
} {
  if (typeof window === "undefined") return { lastTouch: null, firstTouch: null };
  return {
    lastTouch: safeGet(window.sessionStorage, SESSION_KEY),
    firstTouch: safeGet(window.localStorage, FIRST_KEY),
  };
}

export function AttributionCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already captured this visit: the referrer on later pages is our own
    // site, so overwriting would destroy the real source.
    if (safeGet(window.sessionStorage, SESSION_KEY)) return;

    const attr = classify(document.referrer || "", window.location.search || "");
    attr.landingPage = window.location.pathname || "/";

    safeSet(window.sessionStorage, SESSION_KEY, attr);

    // First touch is written once and then left alone, unless it has aged out.
    const existing = safeGet(window.localStorage, FIRST_KEY);
    const stale =
      existing?.capturedAt &&
      Date.now() - new Date(existing.capturedAt).getTime() >
        FIRST_TOUCH_TTL_DAYS * 86_400_000;

    if (!existing || stale) safeSet(window.localStorage, FIRST_KEY, attr);
  }, []);

  return null;
}
