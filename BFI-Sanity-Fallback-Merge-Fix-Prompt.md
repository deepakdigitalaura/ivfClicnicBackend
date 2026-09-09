# BFI Website — Sanity/Hardcoded Fallback Merge Fix
### Whole-Site Audit, Migration & Resolver Fix — Claude Code Execution Prompt

---

## CONTEXT (read fully before doing anything)

This codebase was built in two phases:
1. **Phase A:** Full site built with hardcoded, client-approved content (copy, doctor
   profiles, treatments, locations, etc.) — this is real production content, not
   placeholder or fake data. It was reviewed and signed off by the client.
2. **Phase B:** Sanity CMS was layered on top. Resolvers were written so that content
   is fetched from Sanity, and if Sanity has nothing, the hardcoded content is shown
   as a fallback.

**The bug:** several (likely most) resolvers implement the fallback as an
**all-or-nothing switch**, not a per-item merge:

```
if (Sanity returns ANY documents for this content type) {
  return ONLY the Sanity documents;
} else {
  return the full hardcoded dataset;
}
```

This means the moment an editor adds even ONE new item in Sanity (e.g. 2 doctors out
of 15), every other hardcoded item for that content type disappears from the live
site immediately — not because it was deleted, but because the resolver stopped
looking at the hardcoded source entirely. This has already happened once in
production (Doctors) and caused a client-facing incident. **It must not happen again,
anywhere else in the site, and must not happen again in Doctors either.**

**Root cause confirmed previously via full read of `payload.ts`, all Sanity schemas
in `src/sanity/schemas/`, all resolvers in `src/lib/`, the admin-panel route tree,
and the actual route files** (see prior backend content audit, commit `0828b2c`,
audited 2026-07-20). That audit is the starting map for this work — re-verify it,
do not assume it's still 100% current.

---

## NON-NEGOTIABLE RULES FOR THIS ENTIRE TASK

1. **No commits to `main`, no pushes that trigger a production Vercel deploy, at any
   point in Phase 1–3 below.** All work happens on a branch and is verified on a
   Vercel **preview** deployment first.
2. **Never delete or overwrite hardcoded content files.** They remain in the
   codebase permanently as the fallback layer — this is intentional, not technical
   debt to "clean up."
3. **Never assume hardcoded content is fake or placeholder.** It is real,
   client-approved content. If you encounter a resolver or comment implying
   otherwise, flag it in your report — do not act on that assumption.
4. **Do not write to the production Sanity dataset directly.** If a Sanity dataset
   for staging/testing does not exist, stop and ask before proceeding — do not
   create migration scripts that write against production data untested.
5. **One content area at a time.** Do not attempt a single sweeping change across
   all sections. Each section (Doctors, Treatments, Services, Locations, About,
   Testimonials, Education Videos, Blogs, Homepage, etc.) is audited, migrated,
   fixed, and verified independently, in the order given in Phase 4.
6. If at any point the required fix is unclear, ambiguous, or would require touching
   more than the resolver + a migration script for that section, **stop and report
   back** rather than guessing.

---

## PHASE 1 — AUDIT ONLY (no code changes)

For every content area in the site (use the prior backend audit as your checklist —
all 13 "live/admin-editable" areas and all 4 "safe fallback, no admin form" areas),
inspect the actual resolver code and answer, per area:

1. **Fallback pattern type** — is it:
   - (a) All-or-nothing switch (any Sanity data → hardcoded ignored entirely), or
   - (b) Per-item merge (Sanity items override hardcoded items by matching key;
     unmatched hardcoded items still render), or
   - (c) Something else — describe exactly what.
2. **Matching key** — if merge were implemented, what stable identifier would be
   used to match a Sanity document to its hardcoded counterpart (slug, id, name)?
   Does one already consistently exist in both the Sanity schema and the hardcoded
   data structure, or would one need to be added?
3. **Current live risk** — is this content area currently fully hardcoded (zero
   Sanity documents, so the bug hasn't been triggered yet), or does it already have
   partial Sanity data live right now (meaning it may already be silently missing
   hardcoded items today)?
4. **Blast radius if triggered** — what exactly disappears from the live site if
   one new Sanity document is added today for this content area?

Produce this as a single markdown report, one section per content area, before
writing any fix code. Do not skip this phase even for areas that seem obviously
fine — verify, don't assume.

---

## PHASE 2 — MIGRATION (per content area, only after Phase 1 report is reviewed)

For each content area confirmed to use the all-or-nothing pattern:

1. Write a one-time, idempotent migration script that reads the full hardcoded
   dataset for that content area and writes it into Sanity as real documents,
   using the matching key identified in Phase 1.
2. The script must be **safe to re-run** — if a document with that key already
   exists in Sanity (e.g. the 2 doctors already added), it must skip or update it
   without duplicating, and must not overwrite manual edits already made in Sanity
   for that item.
3. Run the migration only against a **staging/test Sanity dataset**, never
   production, until explicitly approved.
4. After migration, output a count comparison: hardcoded item count vs. migrated
   Sanity item count, per content area, so it can be manually verified nothing was
   dropped.

---

## PHASE 3 — RESOLVER FIX (per content area, after migration is verified)

For each content area:

1. Change the resolver from the all-or-nothing switch to a **merge by key**:
   - Fetch hardcoded dataset (unchanged, still in codebase).
   - Fetch Sanity dataset.
   - For each hardcoded item, if a Sanity item exists with the matching key, use
     the Sanity version; otherwise use the hardcoded version.
   - Include any Sanity item that has no hardcoded counterpart (i.e. brand new
     items added purely in Sanity, with no legacy hardcoded equivalent).
2. Add a code comment above each fixed resolver explaining the merge behavior, so
   future edits don't accidentally regress it back to an all-or-nothing switch.
3. Do not change anything else in the resolver — field shapes, component props,
   and rendering logic stay exactly as they are.

---

## PHASE 4 — ORDER OF WORK

Work through content areas in this order, stopping for verification after each one:

1. **Doctors** — already caused a live incident; highest priority, prove the pattern
   works here first.
2. **Treatments**
3. **Maternity / Women's Services**
4. **Locations**
5. **About page**
6. **All remaining "live/admin-editable" areas from the audit** (Testimonials,
   Education Videos, Blogs+CME, Site Settings, etc.) — only if Phase 1 found they
   also carry the all-or-nothing pattern. Skip any area Phase 1 confirms is already
   a safe merge or is a singleton document with no fallback-loss risk.

---

## PHASE 5 — VERIFICATION BEFORE ANY PRODUCTION DEPLOY

For each content area, before merging to `main`:

1. Deploy the branch to a Vercel **preview** URL.
2. Manually compare the preview against the current live site for that section —
   confirm every previously-visible hardcoded item still renders, and the newly
   migrated/added Sanity items also render correctly.
3. Test the actual failure scenario: add or edit one item in the staging Sanity
   dataset, confirm on the preview URL that no other items disappear.
4. Only after explicit sign-off does that content area's branch get merged and
   deployed to production — one content area at a time, not a single combined
   deploy of everything.

---

## DELIVERABLE FORMAT

At the end of Phase 1, before touching any code, output:
- The audit report described above.
- A proposed migration + resolver-fix plan per content area, in the Phase 4 order.
- A clear statement of which content areas are safe to leave alone (already
  correct merge behavior, or no fallback in use).

Wait for explicit go-ahead before starting Phase 2 on any individual content area.
