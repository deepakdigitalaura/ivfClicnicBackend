/* =====================================================================
 * Icon-name registry — the bridge between CMS-stored icon NAMES and the
 * Lucide component instances the templates render (Phase 4.1, Services).
 * ---------------------------------------------------------------------
 * WHY: a CMS can only store serialisable data, so an icon is stored as a
 * curated NAME string (a `select` option on the collection). The client
 * template maps that name back to the exact Lucide component via ICON_MAP.
 * `iconKey()` is the inverse (component → name) used when shaping the typed
 * code fallback (SERVICE_CONTENT, which still holds real components) into the
 * serialisable resolved model — guaranteeing a lossless round-trip so the
 * empty-CMS path renders byte-identically.
 *
 * Pure module (lucide-react only) — safe in both server and client bundles.
 * Scoped to the icons used by the Services/Women's-Health surface plus the
 * Treatments surface (Wave 4.4); extend the set (and ICON_NAMES) as later
 * waves adopt it.
 * ===================================================================== */
import type { LucideIcon } from "lucide-react";
import {
  ScanLine, Feather, Baby, Stethoscope, ShieldCheck, Users,
  HeartPulse, Activity, ClipboardList, CalendarCheck, Eye, Clock,
  Microscope, Sparkles, Hand,
  // ---- Treatments surface (Wave 4.4) ----
  FlaskConical, Filter, Magnet, Layers, Zap, Egg, Droplets, Snowflake,
  Dna, Beaker, Target, Leaf, ListChecks, ClipboardCheck, Syringe, Award,
} from "lucide-react";

/** Name → Lucide component. Keys are the curated `select` options stored in
 *  the CMS. The string keys MUST equal the imported component names so the
 *  seed (which serialises code defaults) and the admin select stay in sync. */
export const ICON_MAP = {
  ScanLine, Feather, Baby, Stethoscope, ShieldCheck, Users,
  HeartPulse, Activity, ClipboardList, CalendarCheck, Eye, Clock,
  Microscope, Sparkles, Hand,
  // ---- Treatments surface (Wave 4.4) ----
  FlaskConical, Filter, Magnet, Layers, Zap, Egg, Droplets, Snowflake,
  Dna, Beaker, Target, Leaf, ListChecks, ClipboardCheck, Syringe, Award,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;

/** The curated option list for a Payload `select` icon field. */
export const ICON_NAMES = Object.keys(ICON_MAP) as IconName[];

/** Human-readable label for each icon — shown in the admin panel select. */
const ICON_LABEL_MAP: Record<IconName, string> = {
  ScanLine:      "Scan / Laser",
  Feather:       "Feather / Gentle",
  Baby:          "Baby",
  Stethoscope:   "Stethoscope",
  ShieldCheck:   "Shield / Protection",
  Users:         "Team / People",
  HeartPulse:    "Heart Rate",
  Activity:      "Activity / Stats",
  ClipboardList: "Checklist",
  CalendarCheck: "Calendar / Appointment",
  Eye:           "Eye / Vision",
  Clock:         "Clock / Time",
  Microscope:    "Microscope / Lab",
  Sparkles:      "Sparkles",
  Hand:          "Hand / Care",
  FlaskConical:  "Flask / Test Tube",
  Filter:        "Filter",
  Magnet:        "Magnet",
  Layers:        "Layers / Stack",
  Zap:           "Zap / Energy",
  Egg:           "Egg",
  Droplets:      "Droplets / Fluid",
  Snowflake:     "Snowflake / Freeze",
  Dna:           "DNA",
  Beaker:        "Beaker / Lab",
  Target:        "Target / Goal",
  Leaf:          "Leaf / Natural",
  ListChecks:    "List / Multi-check",
  ClipboardCheck:"Clipboard / Done",
  Syringe:       "Syringe / Injection",
  Award:         "Award / Trophy",
};

/** Human-labeled `{label, value}` pairs for Payload `select` icon fields.
 *  Values are the raw component names (resolver round-trip safe); labels are
 *  plain English for clinic staff. */
export const ICON_OPTIONS: { label: string; value: IconName }[] =
  ICON_NAMES.map((n) => ({ label: ICON_LABEL_MAP[n] ?? n, value: n }));

/** Default when a stored name is unknown/empty — never throws, never renders
 *  a missing-component. `Sparkles` matches the existing fallback used by the
 *  treatment card helper. */
const DEFAULT_ICON: LucideIcon = Sparkles;

/** Resolve a stored icon NAME → component (with safe fallback). */
export function resolveIcon(name?: string | null): LucideIcon {
  return (name && ICON_MAP[name as IconName]) || DEFAULT_ICON;
}

/* Component → name, built once by reference. Lucide components are stable
 * module singletons, so identity lookup is exact and the name round-trips. */
const NAME_BY_COMPONENT = new Map<LucideIcon, IconName>(
  (Object.entries(ICON_MAP) as [IconName, LucideIcon][]).map(([k, v]) => [v, k]),
);

/** Inverse of resolveIcon: a component → its curated name (for serialising the
 *  code fallback). Unknown components fall back to "Sparkles" so the shape
 *  stays valid; add any missing icon to ICON_MAP rather than relying on this. */
export function iconKey(icon: LucideIcon): IconName {
  return NAME_BY_COMPONENT.get(icon) ?? "Sparkles";
}
