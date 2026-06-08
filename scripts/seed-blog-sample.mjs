#!/usr/bin/env node
/* =====================================================================
 * Seed sample blog content via REST (UTF-8 safe): two authors (writer +
 * medical reviewer), a category, and one published post with Lexical content.
 * Idempotent by slug. Run: node scripts/seed-blog-sample.mjs
 * ===================================================================== */
const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const text = (t) => ({ type: "text", text: t, version: 1, detail: 0, format: 0, mode: "normal", style: "" });
const para = (t) => ({ type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", textFormat: 0, textStyle: "", children: [text(t)] });
const heading = (t, tag = "h2") => ({ type: "heading", tag, version: 1, format: "", indent: 0, direction: "ltr", children: [text(t)] });

const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [
      para("In vitro fertilization (IVF) helps couples conceive when natural conception is difficult — eggs are retrieved, fertilised in the laboratory, and the best embryo is transferred to the uterus."),
      heading("Who can benefit from IVF?"),
      para("IVF is recommended for blocked fallopian tubes, low ovarian reserve, male-factor infertility, endometriosis, or after other treatments have not worked. A thorough evaluation always comes first."),
      heading("What to expect"),
      para("A typical cycle spans two to three weeks — stimulation, egg retrieval, fertilisation, and transfer — followed by a pregnancy test about two weeks later."),
    ],
  },
};

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}`);
  return (await res.json()).token;
};

const upsert = async (collection, slug, data, auth) => {
  const found = await fetch(`${BASE}/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`, { headers: auth }).then((r) => r.json());
  const body = JSON.stringify(data);
  const res = found.docs?.length
    ? await fetch(`${BASE}/api/${collection}/${found.docs[0].id}`, { method: "PATCH", headers: auth, body })
    : await fetch(`${BASE}/api/${collection}`, { method: "POST", headers: auth, body });
  const out = await res.json();
  if (!res.ok) throw new Error(`${collection}/${slug} HTTP ${res.status}: ${JSON.stringify(out)}`);
  return out.doc.id;
};

const run = async () => {
  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  const writer = await upsert("authors", "bfi-editorial", {
    name: "BFI Editorial Team", slug: "bfi-editorial", role: "Medical Content Writer",
  }, auth);
  const reviewer = await upsert("authors", "himanshu-bavishi-author", {
    name: "Dr. Himanshu Bavishi", slug: "himanshu-bavishi-author", role: "Fertility Specialist", credentials: "MD",
    sameAs: [{ url: "https://www.linkedin.com/in/dr-himanshu-bavishi" }],
  }, auth);
  const category = await upsert("categories", "fertility-basics", {
    title: "Fertility Basics", slug: "fertility-basics", description: "Foundational guides to fertility and IVF.",
  }, auth);

  const blogId = await upsert("blogs", "what-is-ivf-a-simple-guide", {
    title: "What Is IVF? A Simple Guide for Couples",
    slug: "what-is-ivf-a-simple-guide",
    excerpt: "A clear, compassionate introduction to IVF — how it works, who it helps, and what to expect.",
    content,
    author: writer,
    reviewedBy: reviewer,
    category,
    readMins: 6,
    publishedAt: "2026-06-01T00:00:00.000Z",
    treatmentSlugs: [{ slug: "ivf" }],
    _status: "published",
    seo: {
      metaTitle: "What Is IVF? A Simple Guide for Couples — Bavishi Fertility Institute",
      metaDescription: "Understand IVF step by step — how it works, who it helps and what to expect. Reviewed by Bavishi Fertility Institute specialists.",
    },
  }, auth);

  console.log(`[seed-blog] authors(writer=${writer}, reviewer=${reviewer}) category=${category} blog=${blogId}`);
};

run().catch((e) => { console.error("[seed-blog] FAILED:", e.message); process.exit(1); });
