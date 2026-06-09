import type { CollectionConfig, Field, Validate } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";

/**
 * Doctors — CMS source of truth for each doctor's EDITORIAL PROFILE content
 * (Wave 4.3). Mirrors the `Doctor` type in src/lib/doctors.ts 1:1 (NOT a generic
 * block builder) so the existing <DoctorProfile> / <DoctorsIndex> templates and
 * physicianSchema render unchanged — the two /doctors* routes reshape a doc into
 * the typed model via resolveDoctor(), falling back PER FIELD to the code default
 * so an empty/partial CMS stays byte-identical.
 *
 * SCOPE (deliberate, mirrors Phase 4.1): only the /doctors index + /doctors/[slug]
 * read the CMS. The header mega-menu, location/centre cards, treatment/service
 * `reviewedBy` and generateStaticParams stay code-driven from DOCTORS. Treatments/
 * locations stay TEXT slugs (relationships deferred until those become collections);
 * `image` stays a text path (upload relation deferred); `bio` stays a string array
 * (Lexical RichText deferred). No `seoField` this wave — doctor metadata is still
 * code-derived, so an editable-but-inert SEO field would only confuse editors.
 *
 * Drafts on; public reads published-only; edits bust `doctors` + `doctors:<slug>`.
 * RBAC: editors manage content; the trust-bearing `verified` flag is ADMIN-ONLY
 * (it gates YMYL reviewer use + schema claims) and, when true, requires real
 * credentials — preserving the data-honesty rule from src/lib/doctors.ts.
 */

/** Uniform array-of-strings field (single `value` subfield) — the shape the
 *  resolver's `rows()` helper unwraps. */
const strArr = (name: string, label: string, description?: string): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  admin: description ? { description } : undefined,
  fields: [{ name: "value", type: "text", required: true }],
});

/** When `verified` is checked, the doctor must carry real credentials — a
 *  non-empty `credentials` string and at least one `alumniOf` entry. Mirrors the
 *  "never invent credentials; verified gates reviewer use" rule. Reads the whole
 *  incoming doc via `data` (full on seed POST + admin-panel saves). */
const validateVerified: Validate<boolean | undefined | null> = (value, { data }) => {
  if (value !== true) return true;
  const d = (data ?? {}) as { credentials?: string | null; alumniOf?: { value?: string | null }[] | null };
  const hasCredentials = typeof d.credentials === "string" && d.credentials.trim().length > 0;
  const hasAlumni = Array.isArray(d.alumniOf) && d.alumniOf.some((a) => (a?.value ?? "").trim().length > 0);
  if (!hasCredentials || !hasAlumni) {
    return "A verified doctor must have a non-empty `credentials` and at least one `alumniOf` entry (data-honesty rule).";
  }
  return true;
};

export const Doctors: CollectionConfig = {
  slug: "doctors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "specialty", "verified", "_status"],
    group: "Content",
  },
  versions: { drafts: true },
  hooks: revalidateCollection("doctors"),
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    // ---- Identity ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, unique: true, index: true, admin: { width: "50%", description: "URL segment → /doctors/<slug>. Also the registry key." } },
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "credentials", type: "text", admin: { width: "50%", description: "Post-nominal degrees, e.g. 'MBBS, MD'. Required once verified." } },
        { name: "specialty", type: "text", required: true, admin: { width: "50%", description: "Human-readable specialty line shown on cards." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "role", type: "text", required: true, admin: { width: "50%", description: "Job title, e.g. 'Founder & Chief IVF Specialist'." } },
        { name: "image", type: "text", required: true, admin: { width: "50%", description: "Portrait image path, e.g. /assets/doctors/parth.webp (upload relation deferred)." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "experienceLabel", type: "text", admin: { width: "50%", description: "Display experience, e.g. '35+ yrs'." } },
        { name: "experienceYears", type: "number", admin: { width: "50%", description: "Numeric years (sorting/schema)." } },
      ],
    },
    strArr("medicalSpecialty", "Specialty", "schema.org medicalSpecialty values, e.g. ReproductiveMedicine."),

    // ---- Reach (text slugs — relationships deferred) ----
    strArr("cities", "City", "City labels the doctor consults in (display)."),
    strArr("locations", "Location", "Location slugs (city/area) for internal links + areaServed."),
    strArr("treatments", "Treatment", "Treatment slugs the doctor practises."),

    // ---- Bio ----
    { name: "shortBio", type: "textarea", required: true, admin: { description: "One-line summary used on cards + schema description." } },
    strArr("bio", "Paragraph", "Full bio, one entry per paragraph (RichText deferred)."),

    // ---- Credentials / E-E-A-T ----
    strArr("knowsAbout", "Topic", "schema.org knowsAbout expertise areas."),
    strArr("alumniOf", "Degree", "Education / degrees. Required (≥1) once verified."),
    strArr("memberOf", "Membership", "Professional society memberships."),
    strArr("awards", "Award", "Awards & recognition."),
    strArr("training", "Training", "Advanced training / fellowships at named institutes."),
    strArr("publications", "Publication", "Books / notable publications authored."),
    strArr("languages", "Language", "Languages spoken (knowsLanguage)."),
    strArr("sameAs", "Profile URL", "External profile/authority URLs (sameAs)."),

    // ---- Flags ----
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      access: { create: isAdminField, update: isAdminField },
      validate: validateVerified,
      admin: {
        description:
          "ADMIN ONLY. Confirms degrees/experience are verified — gates YMYL reviewer use + schema claims. Requires non-empty credentials and ≥1 alumniOf entry.",
      },
    },
    {
      name: "visitsAllCentres",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Visiting senior specialist who rotates across all centres (shows a single 'visits across cities' card)." },
    },
  ],
};
