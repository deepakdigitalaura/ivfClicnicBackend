"use client";
import { useEffect } from "react";

/** Fires unconditionally on every page load — no cookie, no consent gate.
 *  Feeds the admin dashboard's total-traffic count so it can be reconciled
 *  against GA, which only counts visitors who accept cookies. */
export function PageviewTracker() {
  useEffect(() => {
    navigator.sendBeacon?.("/api/track");
  }, []);
  return null;
}
