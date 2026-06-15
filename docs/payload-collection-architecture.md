# Payload Collection Architecture — Doctors, Locations, Treatments, Services

> **Status:** design only. Nothing in this document is implemented yet. It defines how the
> remaining content migrations will be modelled so they follow the **same pattern validated by
> the Contact-page POC (Phase 1) and the Globals migration (Phase 2)**.

---

## 0. The migration contract (every collection must obey this)

The POC + Globals proved a repeatable pattern. Every future collection follows it so we never
redesign UI, routes, SEO, or schema:

1. **Mirror, don't redesign.** The collection's fields map 1:1 onto the existing TypeScript type
   (`Treatment`, `Centre`, `Doctor`, `ServiceContent`). No new content model, no block builder.
2. **Templates are preserved.** The existing `*-page.tsx` component keeps rendering. The **server
   route** fetches from Payload (local API) and passes the data in as **props**. The client
   component gains optional props with the current hardcoded values as **fallback defaults**
   (coexistence — the page still works if a doc is missing).
3. **Schema builders stay pure.** `treatmentGraph`, `centerGraph`, `cityGraph`, `physicianSchema`,
   `serviceGraph` continue to live in `src/lib/*` with **no Payload import** (so client bundles
   stay clean). They take plain data and the route reshapes the CMS doc into that exact shape.
   **Stable `@id`s and the canonical origin are never CMS-editable** — entity grounding depends on
   them (this is why `seo.ts` `SITE.url`, `ORG_ID`, `WEBSITE_ID` stayed code-owned in Phase 2).
4. **Icons are names, not components.** CMS stores an icon **name** (a `select` from a curated
   set); the template maps name → Lucide component via an `ICONS` record. (Validated by the
   Phase 2 contact cards.)
5. **Prose → rich text via a shared serializer.** Long-form `paragraphs: string[]` becomes Lexical
   rich text rendered by **one reusable `<RichText>`** serializer that reproduces the current
   markup/classes **and** re-applies `Linkify`. Built once (Phase 3, Blogs), reused everywhere.
6. **Relationships by reference.** Slug-string links (`doctors[]`, `treatments[]`, `related[]`,
   `reviewerSlug`) become Payload **relationship** fields. A migration script maps slug → document
   id. Deletion rules prevent orphans.
7. **Routing unchanged.** `generateStaticParams()` queries Payload instead of the registry; URLs
   are identical. Pages stay statically prerendered from the DB at build (proven in Phase 1/2);
   **on-demand revalidation** (Payload `afterChange` hook → `revalidatePath`/`revalidateTag`) makes
   edits go live without a full rebuild.
8. **Drafts + published-only public reads** (collection `versions.drafts: true`; `access.read`
   returns `{ _status: { equals: 'published' } }` for unauthenticated). Live Preview wired per
   template.
9. **UTF-8-safe seeding.** Seed from JSON fixtures via Node `fetch`/`curl --data-binary` (never
   PowerShell string bodies — they mangle em dashes to CP1252 `0x97`).
10. **Parity gate.** Before/after diff of the prerendered HTML `<head>` + JSON-LD for each migrated
    template. YMYL site — schema output must match byte-for-byte (except deliberate, documented
    consolidations).

### Shared infrastructure to build *before* the big collections
| Item | Needed by | Build in |
|---|---|---|
| `<RichText>` Lexical → JSX serializer (class-parity + Linkify) | Blogs, Treatments, Services, Doctors bio, Locations intro | Phase 3 |
| `ICONS` icon-name registry + curated `select` options | Treatments, Services (and done for contact cards) | early Phase 5 |
| `seo` field group (reuse Pages' shape) + optional `@payloadcms/plugin-seo` | all | Phase 3 |
| `revalidate` afterChange hook + `getDocBySlug` helpers | all collections | Phase 3 |
| slug→id migration helper (resolve relationships) | Doctors, Locations, Treatments | Phase 4 |

---

## 1. Doctors  (`doctors`)  — Phase 4

Mirrors `Doctor` in `src/lib/doctors.ts`; renders via `doctor-page.tsx`; schema via
`physicianSchema` / `reviewerNode` (also referenced by `treatmentGraph` as `reviewedBy`).

**Fields**
- Identity: `name`, `slug` (unique/idx), `credentials`, `specialty`, `role`, `image` (→ media),
  `experienceLabel`, `experienceYears` (number), `verified` (checkbox), `visitsAllCentres`.
- `medicalSpecialty[]`, `knowsAbout[]`, `languages[]`, `alumniOf[]`, `memberOf[]`, `awards[]`,
  `training[]`, `publications[]`, `sameAs[]` → arrays of `{ value }` (or text-array).
- `shortBio` (textarea), `bio` → **rich text** (currently `string[]`).
- Relationships: `cities` → relationship→`cities`; `locations` → relationship→`centres`;
  `treatments` → relationship→`treatments`. (During migration these resolve from slug arrays.)
- `seo` group.

**Notes**: `physicianSchema` stays pure; route reshapes doc → its expected shape. The
`treatment.reviewerSlug` link becomes a relationship from **Treatments → Doctors** (see §3).
`cityDoctor` factory cards become a query (doctors filtered by city relationship).

---

## 2. Locations  (`cities` + `centres`)  — Phase 4

Two related collections mirroring `City` and `Centre` in `src/lib/locations.ts`. Renders via
`city-page.tsx` / `center-page.tsx` + `location-sections.tsx`; schema via `cityGraph` /
`centerGraph` / `centerClinicSchema`. Heaviest relationship graph.

**`cities`**: `name`, `slug`, `region`, `country`, `helpline`, `helplineLabel`, `whatsapp`,
`heroImage` (→ media), `hero360Url`, `intro` (rich text), `faqs[]`, `womensHealth[]`
(relationship→`services`), `built` (checkbox / use `_status`).

**`centres`**: `name`, `slug` (unique), `city` (relationship→`cities`), `fullName`,
`isHeadOffice`, `area`, `address`, `pin`, `phone`, `phoneLabel`, `hours`,
`opening` (group: opens/closes/days[]), `geo` (group: lat/lng), `mapQuery`, `image` (→ media),
`hero360Url`, `nearby[]`, `landmarks[]`, `howToReach[]`, `facilities[]`,
`doctors` (relationship→`doctors`), `treatments` (relationship→`treatments`),
`womensHealth` (relationship→`services`), `faqs[]`, `gallery[]` (array of `{ image→media, alt }`),
`reviewsKey` (text — stays the join key into the API-synced reviews store), `sameAs[]`, `intro`,
`seo` group.

**Notes**: `generateStaticParams` for `/locations/[city]` and `/locations/[city]/[center]` queries
these collections. `reviewsKey` deliberately stays a plain key — **reviews remain API-sourced**
(not authored; see §5 of the estimate). Galleries drive the media-migration workload.

---

## 3. Treatments  (`treatments`)  — Phase 5 (largest)

Mirrors `Treatment` in `src/lib/treatments.ts` (~35 objects, ~20 sections each). Renders via
`treatment-page.tsx`; schema via `treatmentGraph`. **Do not** flatten into a generic block
builder — model the named sections as **groups/arrays** so the template is unchanged.

**Top-level**: `slug`, `href` (derive or store), `name`, `shortName`, `alternateName`,
`breadcrumbName`, `seo` group, `procedure` (group: procedureType/bodyLocation/howPerformed/
followup), `lastReviewed` (date), `reviewer` (relationship→`doctors`, replaces `reviewerSlug`),
`related` (relationship→`treatments`, replaces `related[]` slug array).

**Section groups/arrays** (each mirrors the type): `hero` (group, incl. `image`→media, `badges[]`),
`whatIs` (heading + rich-text paragraphs + optional aside), `benefits`, `whoNeedsIt`,
`types?` / `technology?` / `whyUs?` → arrays of **IconCard** `{ icon (name), title, desc }`,
`process` (steps array: `{ icon (name), n, title, desc }`), `timeline?`, `video?`,
`success`, `cost`, `risks` (array `{ title, desc, help }`), `preparation?`, `faqs[]`, `cta`.

**Blockers handled here**: 286 icon refs → `icon` becomes a curated `select` (shared ICONS
registry); prose → `<RichText>`; `related`/`reviewer` → relationships; `treatmentGraph` fed the
reshaped doc. This collection is ~40% of remaining effort — sequence the RichText serializer and
icon registry first.

---

## 4. Services / Women's Health  (`services`)  — Phase 5

Mirrors `ServiceContent` in `src/lib/womens-health.ts` (58 icon refs). Renders via
`service-page.tsx`; schema via `serviceGraph`; route `/services/[slug]`.

**Fields**: `slug`, `name`, `meta`/`seo`, `hero` (group, `image`→media), section groups analogous
to Treatments (icon-card arrays → curated `select`; prose → rich text), `faqs[]`. Cities/centres
reference services via relationship (see §2). Same pattern as Treatments, smaller surface — good
warm-up for the Treatments migration.

---

## 5. Sequencing & dependencies

```
Phase 3  Blogs  ──> builds <RichText> serializer + seo group + revalidate hook  (shared)
Phase 4  Doctors ──┐
         Locations ┘ needs RichText; introduces relationships + slug→id migration
Phase 5  Services  ──> needs RichText + ICONS registry  (smaller, validates the pattern)
         Treatments ─> needs RichText + ICONS + relationships(related/reviewer) + Services/Doctors/Centres already migrated
```

Treatments is last because it depends on every shared primitive **and** on Doctors/Services/Centres
existing as relationship targets — exactly the original migration order, now with concrete reasons.

---

## 6. Explicit non-goals / governance (where "100% editable" is intentionally bounded)
- **Reviews** stay API-synced (Google Places + fallback); admin edits *sources/fallback config*,
  never invents reviews. `reviewsKey` on centres is the only CMS touchpoint.
- **Stable schema anchors** (`SITE.url`, `ORG_ID`, `WEBSITE_ID`, founders, `medicalSpecialty`) stay
  code-owned for entity grounding.
- **YMYL facts** (e.g. the founding-date 1984-vs-1998 discrepancy) should sit behind a review
  workflow, not free-text editing.
- **Inquiry form** submission backend is a *build* (Forms + Submissions), not a migration.
