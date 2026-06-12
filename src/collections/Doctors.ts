import type { CollectionConfig, Field, Validate } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";
import { imageUploadField } from "@/fields/image";

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
 *  resolver's `rows()` helper unwraps. `readOnly` locks website-team-managed
 *  lists in the panel (UI only; seeds run as admin and are unaffected). */
const strArr = (name: string, label: string, description?: string, readOnly = false): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  ...(readOnly ? { access: { update: isAdminField } } : {}),
  admin: description ? { description } : undefined,
  fields: [{ name: "value", type: "text", required: true, label }],
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

/* Every doctor field, defined once and grouped into admin Tabs below (UNNAMED
 * tabs → stored data shape unchanged). Cleaner editing only. */
const DOCTOR_FIELDS: Field[] = [
    // ---- Identity ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, unique: true, index: true, label: "Page URL", access: { update: isAdminField }, admin: { width: "50%", description: "The profile's web address (→ /doctors/<this>). Set when creating — ask the website team to change it later." } },
        { name: "name", type: "text", required: true, label: "Name", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "credentials", type: "text", label: "Credentials", admin: { width: "50%", description: "Post-nominal degrees, e.g. 'MBBS, MD'. Required once verified." } },
        { name: "specialty", type: "text", required: true, label: "Specialty", admin: { width: "50%", description: "Specialty line shown on cards, e.g. 'Fertility & IVF Specialist'." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "role", type: "text", required: true, label: "Role / Title", admin: { width: "50%", description: "Job title, e.g. 'Founder & Chief IVF Specialist'." } },
        { name: "image", type: "text", label: "Current Photo Path (default)", admin: { width: "50%", description: "Leave empty for new doctors — use 'Replace Photo' below to upload a portrait. This field stores the built-in code default for existing doctors." } },
      ],
    },
    imageUploadField("photo", "Replace Photo", "Upload or pick a new portrait photo to replace the current one. Leave empty to keep the current photo."),
    {
      type: "row",
      fields: [
        { name: "experienceLabel", type: "text", label: "Experience (shown on site)", admin: { width: "50%", description: "Experience as shown on the site, e.g. '35+ yrs'." } },
        { name: "experienceYears", type: "number", label: "Years of Experience", admin: { width: "50%", description: "Number of years (used for sorting)." } },
      ],
    },
    strArr("medicalSpecialty", "Search Engine Specialty Tag (website team)", "Search-engine specialty tags. Managed by the website team.", true),

    // ---- Reach (text slugs — relationships deferred) ----
    strArr("cities", "City (display)", "City names the doctor consults in (shown on the profile)."),
    strArr("locations", "Linked Location ID (website team)", "Location IDs used for internal links. Managed by the website team.", true),
    strArr("treatments", "Linked Treatment ID (website team)", "Treatment IDs the doctor practises. Managed by the website team.", true),

    // ---- Bio ----
    { name: "shortBio", type: "textarea", required: true, label: "Short Bio", admin: { description: "One-line summary used on cards and in search results." } },
    strArr("bio", "Bio Paragraph", "Full bio — one entry per paragraph."),

    // ---- Credentials / E-E-A-T ----
    strArr("knowsAbout", "Area of Expertise", "Areas of expertise (helps search engines understand the doctor)."),
    strArr("alumniOf", "Degree", "Education / degrees. Required (at least one) once verified."),
    strArr("memberOf", "Membership", "Professional society memberships."),
    strArr("awards", "Award", "Awards & recognition."),
    strArr("training", "Training", "Advanced training / fellowships at named institutes."),
    strArr("publications", "Publication", "Books / notable publications authored."),
    strArr("languages", "Language", "Languages spoken."),
    strArr("sameAs", "Profile Link", "Official profile links (e.g. LinkedIn, professional society pages)."),

    // ---- Flags ----
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      access: { create: isAdminField, update: isAdminField },
      validate: validateVerified,
      label: "Verified Credentials (admin only)",
      admin: {
        description:
          "Admin only. Confirms the degrees and experience have been verified — needed before this doctor can be shown as a medical reviewer. Requires non-empty credentials and at least one degree.",
      },
    },
    {
      name: "visitsAllCentres",
      type: "checkbox",
      defaultValue: false,
      label: "Visiting Specialist (all centres)",
      admin: { description: "Visiting senior specialist who rotates across all centres (shows a single 'visits across cities' card)." },
    },

    // ---- Navigation placement (drives header mega-menu + footer Doctors group) ----
    {
      type: "row",
      fields: [
        {
          name: "navRole",
          type: "select",
          label: "Menu Role",
          options: [
            { label: "Senior Specialist (featured card in header)", value: "senior-specialist" },
            { label: "Specialist (list in header)", value: "specialist" },
          ],
          admin: {
            width: "50%",
            description: "Controls where this doctor appears in the header Doctors panel and footer. Leave empty to hide from menus.",
          },
        },
        {
          name: "navOrder",
          type: "number",
          label: "Menu Order",
          admin: {
            width: "50%",
            description: "Order within the group. Lower numbers appear first (e.g. 10, 20, 30).",
          },
        },
      ],
    },

    // ---- Profile-page section labels (eyebrows/headings/subtitles) ----
    {
      name: "profileLabels",
      type: "group",
      label: "Page Section Labels",
      admin: { description: "Labels shown on this doctor's profile page. Leave empty to use the defaults." },
      fields: [
        { name: "aboutEyebrow", type: "text", label: "'About' Section Label" },
        { name: "treatmentsEyebrow", type: "text", label: "'Treatments' Section Label" },
        { name: "consultsEyebrow", type: "text", label: "'Consults At' Section Label" },
        { name: "consultsSubtitle", type: "textarea", label: "'Where to meet' Sub-heading" },
        { name: "visitsHeading", type: "text", label: "'Visits across cities' Card Heading" },
        { name: "visitsParagraph", type: "textarea", label: "'Visits across cities' Card Paragraph" },
        { name: "doctorSpeakEyebrow", type: "text", label: "'Doctor Speak' Section Label" },
        { name: "doctorSpeakSubtitle", type: "text", label: "'Doctor Speak' Sub-heading" },
        { name: "ctaHeading", type: "text", label: "Closing CTA Heading (before name)" },
      ],
    },
];

export const Doctors: CollectionConfig = {
  slug: "doctors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "specialty", "verified", "_status"],
    group: "Doctors",
  },
  versions: { drafts: true },
  hooks: {
    ...revalidateCollection("doctors"),
    beforeChange: [
      ({ data, operation }: { data: Record<string, unknown>; operation: string }) => {
        if (operation === "create" && !data.href && data.slug) {
          data.href = `/doctors/${data.slug}`;
        }
        return data;
      },
    ],
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Profile", fields: DOCTOR_FIELDS.slice(0, 5) },
        { label: "Reach", fields: DOCTOR_FIELDS.slice(5, 9) },
        { label: "Bio", fields: DOCTOR_FIELDS.slice(9, 11) },
        { label: "Credentials", fields: DOCTOR_FIELDS.slice(11, 19) },
        { label: "Settings", fields: DOCTOR_FIELDS.slice(19, 22) },
        { label: "Page Labels", fields: DOCTOR_FIELDS.slice(22) },
      ],
    },
  ],
};
