# BFI Admin Panel — Forms for Treatments, Services, Locations, About
### Claude Code Execution Prompt — Phase: Close the Sanity Studio Gap

---

## CONTEXT

The nav fallback bug (`fix/nav-fallback-all-or-nothing`) is merged to `main`. The
site now has 13 content areas fully editable via `/admin-panel/...` routes, backed
by a schema + resolver each (Homepage, Doctors, Testimonials, Education Videos,
Blogs+CME, Leads/Inquiries, Site Settings, Robots.txt, Script Injection, Redirects,
Sitemap overrides, Structured Data, Page SEO).

Four content areas have real data in Sanity, safe per-section merge resolvers
already proven correct (see `BFI-Sanity-Fallback-Audit-Phase1-Report.md`), but
**no admin panel form yet** — editing them today means opening raw Sanity Studio:

- **Treatments**
- **Maternity / Women's Services**
- **Locations** (Cities + Centres)
- **About page**

**Goal of this task:** build `/admin-panel/...` forms for all four, so the site
owner and their client never need to open `/studio` for normal content work again.
Sanity remains the underlying database — only the *editing surface* changes.

---

## NON-NEGOTIABLE RULES (same as the nav fix — carry these forward)

1. **No commits to `main` until each section is individually reviewed and
   approved on a preview deployment.** Work on a branch per section, or one
   branch for all four if that's cleaner — your call — but nothing merges without
   sign-off.
2. **Do not touch the resolvers, merge logic, or schemas for these four areas
   unless a genuine gap is found.** They are already confirmed correct (per-section
   merge, safe code∪Sanity union for list/static-params). This task adds an
   editing UI on top of what already works — it is not a rewrite of the data layer.
3. **Follow the existing pattern exactly.** Do not invent a new admin-panel
   convention. Use one of the 13 working sections (Doctors is the best reference —
   it also has a collection + per-item structure, similar to Treatments/Services/
   Locations) as the template for route structure, form component patterns, save/
   publish behavior, and validation.
4. **One content area at a time**, each independently built, previewed, and
   approved before starting the next. Suggested order: **About** (singleton, no
   collection — simplest, good pattern-check) → **Treatments** → **Services** →
   **Locations** (has a nested Cities→Centres structure, most complex — do last).
5. **Do not change field shapes or add new fields** to the underlying Sanity
   schemas as part of this task unless a field genuinely doesn't exist yet and is
   required for the form to function (e.g. if `navCategory` needs a friendlier
   picker UI, that's fine — but don't restructure the schema).
6. If anything is ambiguous — e.g. how nested Cities→Centres should be represented
   in the admin UI — stop and ask rather than guessing a structure that might not
   match how the client actually thinks about their own locations.

---

## PHASE 1 — PATTERN AUDIT (no code changes)

Before building anything, read the existing Doctors admin panel implementation in
full (`/admin-panel/doctors`, its schema, its resolver, its save/publish flow) and
report:

1. What does the route structure look like (list view → detail/edit view)?
2. How does save/publish work — direct write, or draft-then-approve (per the
   human-approval workflow noted in the system's architecture)?
3. What validation exists, and how are required fields enforced in the form vs.
   the schema?
4. How are images/media handled in the form?
5. Is there anything Doctors-specific that won't translate directly to
   Treatments/Services/Locations/About (e.g. Doctors doesn't have the nested
   structure Locations does) — flag these as open questions before building.

---

## PHASE 2 — BUILD, ONE SECTION AT A TIME

For each section, in the order given in Rule 4:

1. Build the `/admin-panel/[section]` route(s) following the Phase 1 pattern.
2. List view: shows all items (code-registered + Sanity-only), matching what the
   nav/page resolvers already treat as the full merged set — so the admin panel
   list is never missing an item the live site actually shows.
3. Edit view: one item at a time, matching the schema fields, with the same
   draft/approve behavior as existing sections.
4. **About** is a singleton — no list view needed, just a single edit form for
   the one document.
5. **Locations** — confirm with the person (don't assume) whether Cities and
   Centres should be two separate admin sections, or one nested UI (City → its
   Centres). Ask before building this one specifically.
6. After each section is built, deploy to a preview URL and report back for
   review before starting the next section.

---

## PHASE 3 — VERIFICATION PER SECTION

For each section, before merging:

1. Preview deploy — confirm the admin form loads, lists existing items correctly
   (including any items that only exist in Sanity, not in the code registry).
2. Edit an existing item through the form, save, confirm the change appears
   correctly on the live page (via preview) and that sibling items are unaffected
   — this is the same regression check used for the nav fix, applied here too.
3. Add a brand-new item through the form (not via raw Studio), confirm it appears
   correctly on its live page and in navigation, with no other items dropping out.
4. Confirm the draft/human-approval workflow is preserved if that's how the
   existing 13 sections behave — do not skip this even if it adds friction, per
   the project's stated architecture requirement.

---

## DELIVERABLE

After Phase 1, output the pattern audit and any open questions (especially the
Locations nested-structure question) before writing any code. Wait for go-ahead
before starting Phase 2 on **About** (first section).
