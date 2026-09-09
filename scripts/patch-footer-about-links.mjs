#!/usr/bin/env node
/* Patch footer About section links — point Suraksha Kavach and Why BFI to their actual pages.
 * Run:  PAYLOAD_URL=https://... node scripts/patch-footer-about-links.mjs
 */
const BASE     = process.env.PAYLOAD_URL     ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";

const ABOUT_URLS = {
  "Suraksha Kavach": "/suraksha-kavach",
  "Why Bavishi Fertility Institute": "/why-bfi",
};

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status}`);
  return (await res.json()).token;
};

const run = async () => {
  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  const getRes = await fetch(`${BASE}/api/globals/footer`, { headers: auth });
  if (!getRes.ok) throw new Error(`GET footer failed: ${getRes.status}`);
  const footer = await getRes.json();

  let patched = 0;
  for (const grp of footer.navGroups ?? []) {
    if (grp.title !== "About") continue;
    for (const link of grp.links ?? []) {
      const correctUrl = ABOUT_URLS[link.label];
      if (correctUrl && link.url !== correctUrl) {
        console.log(`  ${link.label}: ${link.url} → ${correctUrl}`);
        link.url = correctUrl;
        patched++;
      }
    }
  }

  if (!patched) {
    console.log("[patch] No links needed updating.");
    return;
  }

  const postRes = await fetch(`${BASE}/api/globals/footer`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ navGroups: footer.navGroups }),
  });
  if (!postRes.ok) {
    const err = await postRes.text();
    throw new Error(`POST footer failed: ${postRes.status} — ${err}`);
  }
  console.log(`[patch] Updated ${patched} About links in production footer.`);
};

run().catch((e) => {
  console.error("[patch] FAILED:", e.message);
  process.exit(1);
});
