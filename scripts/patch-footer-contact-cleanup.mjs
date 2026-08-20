#!/usr/bin/env node
/* Patch: remove "Video Consultation" from the entire site.
 *  1. Footer Contact section — remove Video Consultation, WhatsApp Chat,
 *     Find a Centre, Patient Support; fix Book Appointment → /contact#book.
 *  2. Homepage FAQ — remove "Do you offer video consultations?" and update
 *     "How do I get started?" to drop "or by video".
 *  3. Contact FAQ — remove "Can I have an online (video) consultation?" and
 *     update international patients answer to drop video mention.
 *
 * Run:  PAYLOAD_URL=https://... node scripts/patch-footer-contact-cleanup.mjs
 */
const BASE     = process.env.PAYLOAD_URL     ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status}`);
  return (await res.json()).token;
};

async function getGlobal(slug, auth) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, { headers: auth });
  if (!res.ok) throw new Error(`GET ${slug} failed: ${res.status}`);
  return res.json();
}

async function postGlobal(slug, body, auth) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`POST ${slug} failed: ${res.status} — ${err}`);
  }
}

// ── Footer ──────────────────────────────────────────────────────────────────
const REMOVE_LABELS = new Set([
  "Video Consultation",
  "WhatsApp Chat",
  "Find a Centre",
  "Find A Centre",
  "Patient Support",
]);

async function patchFooter(auth) {
  console.log("\n── Footer Contact ──");
  const footer = await getGlobal("footer", auth);
  let changed = false;

  for (const grp of footer.navGroups ?? []) {
    if (grp.title !== "Contact") continue;

    const before = grp.links.length;
    grp.links = grp.links.filter((link) => {
      if (REMOVE_LABELS.has(link.label)) {
        console.log(`  REMOVE: ${link.label}`);
        return false;
      }
      return true;
    });

    for (const link of grp.links) {
      if (link.label === "Book Appointment" && link.url !== "/contact#book") {
        console.log(`  Book Appointment: ${link.url} → /contact#book`);
        link.url = "/contact#book";
        changed = true;
      }
    }

    if (grp.links.length < before) changed = true;
  }

  if (!changed) {
    console.log("  No changes needed.");
    return;
  }

  await postGlobal("footer", { navGroups: footer.navGroups }, auth);
  console.log("  ✓ Footer Contact section updated.");
}

// ── Homepage FAQ ────────────────────────────────────────────────────────────
async function patchHomepageFaq(auth) {
  console.log("\n── Homepage FAQ ──");
  const hp = await getGlobal("homepage", auth);
  const items = hp.faq?.items;
  if (!items?.length) {
    console.log("  No FAQ items found — skipping.");
    return;
  }

  let changed = false;
  const filtered = items.filter((item) => {
    if (item.q?.includes("video consultations")) {
      console.log(`  REMOVE FAQ: "${item.q}"`);
      changed = true;
      return false;
    }
    return true;
  });

  for (const item of filtered) {
    if (item.q === "How do I get started?" && item.a?.includes("or by video")) {
      item.a = "Begin with a consultation at any of our 14 centres. Our specialists will review your history and design a personalised plan.";
      console.log(`  UPDATE: "How do I get started?" answer`);
      changed = true;
    }
  }

  if (!changed) {
    console.log("  No changes needed.");
    return;
  }

  await postGlobal("homepage", { faq: { ...hp.faq, items: filtered } }, auth);
  console.log("  ✓ Homepage FAQ updated.");
}

// ── Contact FAQ ─────────────────────────────────────────────────────────────
async function patchContactFaq(auth) {
  console.log("\n── Contact FAQ ──");
  const res = await fetch(`${BASE}/api/pages?where[slug][equals]=contact&limit=1`, { headers: auth });
  if (!res.ok) throw new Error(`GET pages?slug=contact failed: ${res.status}`);
  const data = await res.json();
  const page = data.docs?.[0];
  if (!page) {
    console.log("  No contact page found — skipping.");
    return;
  }

  const faqs = page.faqs;
  if (!faqs?.length) {
    console.log("  No FAQs found — skipping.");
    return;
  }

  let changed = false;
  const filtered = faqs.filter((f) => {
    if (f.question?.includes("online (video) consultation")) {
      console.log(`  REMOVE FAQ: "${f.question}"`);
      changed = true;
      return false;
    }
    return true;
  });

  for (const f of filtered) {
    if (f.question?.includes("international patients") && f.answer?.includes("video consultations")) {
      f.answer = "Yes — 300+ international patients choose Bavishi Fertility Institute every year. We provide end-to-end support including treatment planning and coordination across our 14 centres.";
      console.log(`  UPDATE: "${f.question}" answer`);
      changed = true;
    }
  }

  if (!changed) {
    console.log("  No changes needed.");
    return;
  }

  const patchRes = await fetch(`${BASE}/api/pages/${page.id}`, {
    method: "PATCH",
    headers: auth,
    body: JSON.stringify({ faqs: filtered }),
  });
  if (!patchRes.ok) {
    const err = await patchRes.text();
    throw new Error(`PATCH pages/${page.id} failed: ${patchRes.status} — ${err}`);
  }
  console.log("  ✓ Contact FAQ updated.");
}

// ── Main ────────────────────────────────────────────────────────────────────
const run = async () => {
  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  await patchFooter(auth);
  await patchHomepageFaq(auth);
  await patchContactFaq(auth);

  console.log("\n[patch] All done.");
};

run().catch((e) => {
  console.error("[patch] FAILED:", e.message);
  process.exit(1);
});
