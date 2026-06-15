# ADR-0001 — Entity-Relationship Architecture (slug-string vs Payload relationship fields)

**Status:** Proposed — decision required before Wave 4.5
**Date:** 2026-06-09
**Branch context:** `feat/payload-cms-poc`, after Wave 4.4 (Treatments CMS complete, `2cca94a`)
**Scope:** Architecture only. No code is changed by this document.

---

## 0. TL;DR

- **Recommendation: Wave 4.5 proceeds on Option A (slug-string relationships).** Do **not** migrate the entity graph to Payload `relationship` fields now.
- The blocking reason is structural, not preference: **Locations are not yet a CMS collection**, and `centre.treatments` references **category slugs** (`male-infertility`, …) that have no 1:1 treatment document. A naïve relationship migration cannot represent the graph that exists today.
- Adopt a **"relationship-ready" convention** (slugs stay the contract; the resolver stays per-field-fallback) so a *selective* Option B migration later is cheap on the edges where it actually pays — and only after Locations becomes a collection and the treatment taxonomy is reconciled.
- The codebase already encodes this intent: three collections carry comments saying these slugs *"become a relationship in Phase 5 / once the entity graph migrates."* This ADR sets the conditions under which that flip is worth making.

---

## 1. Current relationship model

The entity graph is expressed as **plain `string[]` slug references**, resolved into internal links and schema.org nodes at render time. Three of the four entities are CMS-backed for *content*, but every *relationship* between them is still a code-owned slug.

### 1.1 Where relationships live

| Edge | Stored as | Owner | Resolver |
|---|---|---|---|
| Doctor → Treatments | `Doctor.treatments: string[]` | code (`src/lib/doctors.ts`), CMS overlay via `{value}[]` rows | `resolveDoctor()` per-field fallback |
| Doctor → Locations | `Doctor.locations: string[]` | code + CMS overlay | `resolveDoctor()` |
| Treatment → Related | `Treatment.related: string[]` | code (`src/lib/treatments.ts`); CMS `related[]` list exists but registry resolves it | `treatmentCardData()` / `treatmentRef()` |
| Treatment → Reviewer | `Treatment.reviewerSlug: string` (CMS text) / `defaultReviewer()` (code) | code-owned registry | `doctorBySlug()` |
| Centre → Doctors | `Centre.doctors: string[]` | code (`src/lib/locations.ts`) | `doctorsForLocation()` |
| Centre → Treatments | `Centre.treatments: string[]` | code | direct slug → `treatmentRef()` |
| Centre/City → Women's Health | `womensHealth?: string[]` | code | keys into `WOMENS_HEALTH_SERVICES` |
| City → Doctors | `CITY_DOCTORS: Record<string,string[]>` + centre rollup | code | `doctorSlugsForCity()` |
| Treatment → Doctors (display) | none stored — computed | code | `doctorsForTreatment()` (ranking only, **not JSON-LD**) |
| Blog → Author / Reviewer / Category | **real Payload `relationship`** | CMS (`Authors`, `Categories`) | Payload populate |
| Blog → Treatments | `Blog.treatmentSlugs: {slug}[]` | CMS text | `blogsForTreatment()` slug-match |

### 1.2 Two important asymmetries

1. **Blog already proves Option B works in this repo.** `Authors` and `Categories` are collections, and `Blogs` points at them with `type: "relationship"`. The team has the Payload-relationship pattern in production already — for *net-new* content where both endpoints were collections from day one.

2. **The slug graph is deliberately "loose."** It tolerates references that a foreign key cannot:
   - **Category slugs**: `centre.treatments` contains `male-infertility`, `female-infertility`, `fertility-preservation` — taxonomy buckets, not treatment documents. They resolve through `treatmentRef()` to a registry entry, which may point at an anchor (`/#treatments`) rather than a page.
   - **Forward references**: `related[]` includes slugs like `recurrent-miscarriage` whose page is not built. `internal-links.ts` (`SITE_DESTINATIONS`, `published` flag) degrades these to the nearest live anchor instead of a dead link.
   - **Code-owned defaults that outrank CMS**: `doctorsForTreatment()` is a display ranking, explicitly *not* used for medical (`reviewedBy`) claims.

The current model's defining property is **graceful degradation**: a reference need not resolve to anything that exists yet.

---

## 2. Advantages of staying with slug-string relationships (Option A)

1. **Zero migration cost.** Wave 4.4 shipped 34/34 treatment routes byte-identically using the per-field-fallback resolver. Nothing about the graph needs to move for Wave 4.5.
2. **Forward references are legal.** You can reference a page before it exists; `internal-links.ts` handles the fallback. This is structurally impossible with a Payload relationship (the target doc must exist to be selected).
3. **Category/taxonomy slugs are first-class.** `male-infertility` as a centre treatment "just works" — no need to model categories as a separate collection or invent placeholder docs.
4. **Serialisable across the server→client boundary.** Plain strings cross into client components (`treatment-page.tsx`, location templates) with no populate depth, no circular-reference risk, no `Object`-vs-`id` ambiguity.
5. **Deterministic, code-owned ordering.** `CORE_DOCTOR_SLUGS`-first ranking, order-preserving `getDoctors`/`getTreatments`, `generateStaticParams` — all stay in code where they are reviewable and diffable.
6. **Decoupled from `payload-types.ts`.** The loose `*Source` types (`DoctorSource`, `ServiceSource`) intentionally avoid the generated types, so a schema regen can't silently break the render path.
7. **The fallback chain is unconditional.** `try getX() → catch → code default` means CMS downtime, a missing doc, or a bad migration never takes a page down. Relationships with `depth` populate add a failure mode here.
8. **Locations don't need to be a collection to participate.** The graph spans a code-only entity (Locations) and three CMS entities today without friction.

---

## 3. Advantages of Payload relationship fields (Option B)

1. **Referential integrity.** A relationship cannot point at a non-existent doc. Broken edges become impossible *for edges where that invariant is actually desirable*.
2. **Editorial UX.** Editors pick from a searchable dropdown of real docs instead of typing a slug correctly. This is the single biggest day-to-day win.
3. **Bidirectional joins.** Payload `relationship` + the Local API let you query "which treatments reference this doctor" without maintaining inverse arrays by hand (today `doctorsForTreatment` and `doctorsForLocation` are hand-rolled inverses).
4. **Cascade-aware revalidation.** A relationship edit gives a precise hook target — editing a treatment's reviewer can bust exactly the treatment tag.
5. **Single source of truth for the edge.** No drift between `Doctor.treatments` and `Centre.doctors`; the relation lives in one place.
6. **Future GraphQL/API consumers** (a mobile app, a partner feed) get a typed graph for free rather than a bag of slugs to re-resolve.
7. **Consistency with Blog.** Blog already does this; extending it unifies the mental model.

> Note: items 1–7 are **authoring/data-layer** wins. **None of them change the rendered HTML or the emitted JSON-LD**, because the front end already resolves slugs to the same links and schema nodes. Option B improves how the graph is *edited and validated*, not what users or crawlers receive.

---

## 4. Migration cost of each option

### Option A — staying
**Cost: ~zero.** Wave 4.5 continues the established pattern. The only ongoing cost is editorial discipline (typing correct slugs) and hand-maintained inverse arrays.

### Option B — adopting relationship fields
Real, front-loaded, and gated on prerequisites:

1. **Prerequisite: Locations must become a collection.** Half the graph (centre↔doctor, centre↔treatment, city↔doctor) terminates at Locations, which is pure code today. No location relationship can exist until a `Locations`/`Centres`/`Cities` collection ships. This is itself a Wave-sized effort (mirrors Wave 4.3/4.4).
2. **Prerequisite: reconcile the treatment taxonomy.** `male-infertility`/`female-infertility`/`fertility-preservation` must either become real (category) docs or be split into a separate `treatmentCategories` relationship. Otherwise `centre.treatments` cannot be a relationship to `treatments`.
3. **Prerequisite: resolve forward references.** Every `related[]` / destination slug that points at an unbuilt page must either get a stub doc or stay a slug. Mixed relationship+slug on the same field is awkward.
4. **Resolver rework.** The byte-identical `resolveDoctor()/resolveTreatment()` pattern unwraps `{value}[]` rows. Relationships return either an ID or a populated object depending on `depth`; the resolvers, the `*Source` types, and the seed/roundtrip scripts all change shape.
5. **Seed + roundtrip rewrite.** Seeds currently upsert slug strings. Relationships need a two-pass seed (create all docs, then wire relations by looked-up ID) and a roundtrip that compares populated relations, not strings.
6. **Re-baseline SEO snapshots.** 47-route `seo:diff` baseline must be re-verified after the populate path changes (even if output is intended to be identical).

**Order-of-magnitude:** Option B is not a refactor — it is **one or more new Waves** (Locations collection + taxonomy + relationship migration), each with the same seed/roundtrip/SEO-gate ceremony as Waves 4.1–4.4.

---

## 5. SEO implications

- **No first-order SEO difference.** The entity graph's SEO value comes from (a) real internal links between pages and (b) schema.org nodes (`Physician`, `MedicalProcedure`, `MedicalClinic`, `areaServed`, `worksFor`). Both are generated from slugs *today* and would be generated from the same resolved slugs under Option B. Google sees identical HTML.
- **Integrity risk cuts both ways.** Option A can ship a typo'd slug that silently links to a fallback anchor (a soft SEO miss — no 404, but a weaker link). Option B makes that specific class of error impossible. This is a *quality-of-graph* gain, not a ranking mechanism change.
- **YMYL `reviewedBy` is the one edge where integrity matters most.** `reviewerSlug` → a wrong/empty doctor weakens the medical-authorship signal Google's medical quality bar rewards. This is the **highest-value candidate** for a relationship (both endpoints — Treatments, Doctors — are already collections), and the code comment already flags it.
- **Risk during migration > steady-state risk.** The dangerous moment for SEO is the populate-path change itself (depth/serialisation regressions). The 47-route `seo:diff` gate is the control; any Option B step must pass it unchanged.

---

## 6. Editorial workflow implications

- **Option A:** editors maintain relationships by typing slugs into `{value}[]` rows. Error-prone (silent typos), no discoverability, requires the editor to know the slug vocabulary. Inverse edges (doctor-side vs centre-side) must be kept in sync manually.
- **Option B:** dropdown selection, no typos, discoverable, and the inverse is derivable. **This is the strongest argument for B** and the one that compounds as non-engineers take over editing.
- **Caveat:** Option B's editorial win only materialises for edges where *both endpoints are collections*. Until Locations is a collection, centre/city relationships still can't be picked from a dropdown — so the workflow win is partial today.

---

## 7. Build-time implications

- **Option A:** slugs are static data; `generateStaticParams` and per-page resolution are pure and fast. No populate, no relation-resolution depth.
- **Option B:** static builds must populate relationships at build time. With Payload SSG this is fine but adds resolution cost and a `depth` decision per query; over-populating a deep graph (treatment → reviewer → treatments → …) can balloon build-time queries. Requires deliberate `depth` capping.
- Both remain compatible with the current `○ Static` route profile, provided Option B caps populate depth.

---

## 8. Revalidation implications

- **Current model** (`revalidateCollection`, `cache-tags.ts`): edits bust coarse tags (`doctors`, `doctors:<slug>`, `treatments`, `treatments:<slug>`).
- **Option A:** a relationship change is just a content edit on the owning doc → its own tag is busted. The *referencing* pages are not auto-revalidated (e.g. changing a doctor doesn't rebust every treatment page that ranks them) — but since those inverse edges are computed, the dependency is implicit and currently handled by full rebuild cadence.
- **Option B:** relationships make the dependency explicit, enabling **precise cross-entity revalidation** (edit reviewer → bust exactly the affected treatment). This is a genuine Option B advantage, but only worth wiring once edits are frequent enough that full-rebuild cadence is too slow. Today it is not.

---

## 9. Risk of future migrations

- **Option A now → B later:** **low risk, well-trodden.** Slugs are a stable, lossless wire format. A future relationship field can be added *alongside* the slug (relationship as source-of-truth, slug derived in a hook) and migrated edge-by-edge behind the same fallback resolver. The repo's per-field-fallback idiom is purpose-built for exactly this incremental swap.
- **Option B now → A later:** **higher risk, unlikely to be wanted** — but moving *back* off relationships means re-flattening to slugs, which is lossy in editorial intent.
- **Biggest migration risk is doing B prematurely** — before Locations is a collection and the taxonomy is reconciled — which forces placeholder docs, mixed relationship/slug fields, and a resolver that handles both. That hybrid mess is harder to undo than either pure option.

---

## 10. Impact on each integration

| Surface | Under Option A | Under Option B |
|---|---|---|
| **Doctors** | No change. `treatments`/`locations` stay `{value}[]`; resolver unchanged. | `treatments`/`locations` become relationships — but `locations` blocked until Locations is a collection. Reviewer-side integrity improves. |
| **Treatments** | No change. `related[]`, `reviewerSlug` stay slugs; registry resolves. | `reviewerSlug` → relationship (both endpoints exist — **best first candidate**). `related[]` → relationship only after forward-refs/taxonomy resolved. |
| **Services** | No change. | Largely unaffected — Services has few cross-entity edges; low priority for B. |
| **Locations** | No change — stays code-owned, participates via slugs. | **Hard blocker.** Must first become a collection (own Wave). Category-slug treatments must be reconciled. |
| **Navigation** | `doctorMenuData()`, header/footer stay code-driven from `DOCTORS`/registries — unaffected either way. | Could read relationships, but no benefit; nav is curated, not editor-driven. Keep code-owned. |
| **Blog** | `treatmentSlugs` stays slug-match (`blogsForTreatment`). Author/reviewer/category already relationships. | `treatmentSlugs` → relationship to `treatments` is the **cleanest, lowest-risk B win** (both endpoints are collections; comment already promises "Phase 5"). |

---

## 11. Should Wave 4.5 use Option A or Option B?

**Wave 4.5 should proceed on Option A.**

Reasoning in one line: the prerequisites for a *correct* Option B (Locations as a collection; treatment-taxonomy reconciliation; forward-reference handling) are not met, so adopting relationship fields now would force a hybrid slug+relationship model that is worse than either pure option. Wave 4.5 should not be blocked on a graph migration it doesn't need.

The one sanctioned exception — if Wave 4.5 scope touches Blog — is migrating **`Blog.treatmentSlugs` → relationship to `treatments`**, because both endpoints are already collections, the integrity win is real, and the code already commits to it. This is a *single-edge* pilot of Option B, not a graph migration.

---

## 12. What gets easier / harder under each approach

**Under Option A (staying):**
- *Easier:* shipping Wave 4.5 on schedule; adding pages that forward-reference unbuilt content; keeping curated ordering and nav in code; cross-boundary serialisation.
- *Harder:* editor self-service (slug typos); guaranteeing `reviewedBy` integrity; precise cross-entity revalidation; answering "what links to X" without hand-rolled inverses.

**Under Option B (adopting):**
- *Easier:* editor self-service; referential integrity; inverse queries; precise revalidation; a typed graph for future API consumers.
- *Harder:* every prerequisite Wave (Locations collection, taxonomy); resolver/seed/roundtrip complexity; build-time populate-depth tuning; representing taxonomy buckets and forward references; the byte-identical-fallback guarantee.

---

## Recommended decision

**Adopt Option A for Wave 4.5. Treat Option B as a staged, edge-by-edge future migration, not a switch to flip.** Concretely:

1. **Wave 4.5: Option A.** Keep slug-string relationships. No entity-graph migration.
2. **Keep the "relationship-ready" convention.** Slugs remain the contract and the serialised wire format; the per-field-fallback resolver remains the migration seam. Do not let any code assume slugs will never be backed by a relation.
3. **Sanctioned single-edge pilot (only if Wave 4.5 touches Blog):** migrate `Blog.treatmentSlugs` → relationship to `treatments`. Lowest risk, both endpoints exist, already promised in code.
4. **Define the trigger for broader Option B:** begin migrating the entity graph to relationships **only after** (a) Locations is a CMS collection, and (b) the treatment taxonomy (`male-infertility` et al.) is reconciled into either category docs or a separate relation. Until both hold, B is all cost and partial benefit.
5. **First production relationship edge, when B begins:** `Treatment.reviewerSlug → doctors`. Highest SEO/YMYL value, both endpoints already collections, smallest blast radius.

## Rationale

- The rendered output and SEO signals are **identical** under both options today — so there is no user-facing or ranking reason to pay B's migration cost now.
- B's genuine wins (editorial UX, integrity, joins, precise revalidation) are **authoring-layer** wins that compound *as editing moves to non-engineers and as Locations joins the CMS* — neither of which is true at Wave 4.5.
- The graph currently *depends on* properties only slugs provide (forward references, taxonomy buckets, a code-only Locations entity). B cannot represent today's graph without first removing those dependencies.
- The repo is already architected for an incremental A→B path (per-field fallback resolver, Blog relationship precedent, "becomes a relationship" comments). Doing B prematurely throws that gradualism away for a hybrid model.

## Long-term roadmap implications

- **Wave 4.5:** Option A. Optional Blog→treatment relationship pilot.
- **Wave 4.6 (suggested):** Locations as a CMS collection (mirrors the 4.3/4.4 playbook: resolver + collection + seed + roundtrip + SEO gate). This unblocks the location half of the graph.
- **Wave 4.7 (suggested):** Treatment taxonomy reconciliation — decide whether `male-infertility`/`female-infertility`/`fertility-preservation` become category docs or a `treatmentCategories` relation. Resolve forward references (stub docs or keep-as-slug policy).
- **Wave 4.8+ (suggested):** Selective Option B migration, edge by edge, highest-value first: `reviewerSlug → doctors`, then `Blog.treatmentSlugs`, then doctor↔treatment, then centre↔doctor/treatment — each behind the existing fallback resolver and each gated by `seo:diff`.
- **End state:** a hybrid where **relationships are the source of truth for integrity-critical edges** (reviewer, blog↔treatment, doctor↔location) while slugs remain the resolved wire format the front end consumes. The site never has to choose "all slugs" or "all relationships" globally — the seam supports both, permanently.

---

*This document records an architectural decision. It does not modify code, schema, or data.*
