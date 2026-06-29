#!/usr/bin/env node
/* Patch footer calculator links — point each to its actual page instead of /#tools.
 * Run:  PAYLOAD_URL=https://... node scripts/patch-footer-calculator-links.mjs
 */
const BASE     = process.env.PAYLOAD_URL     ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";

const CALC_URLS = {
  "IVF Success Rate":   "/ivf-success-rate-calculator",
  "IVF Cost Estimate":  "/ivf-cost-calculator",
  "AMH Interpreter":    "/amh-level-interpreter",
  "Ovulation Calculator": "/ovulation-calculator",
  "Fertile Period":     "/fertile-period-calculator",
  "Semen Analysis":     "/semen-analysis-calculator",
  "Natural Pregnancy":  "/natural-pregnancy-calculator",
  "Miscarriage Risk":   "/risk-of-repeat-miscarriage-calculator",
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

  // Fetch current footer
  const getRes = await fetch(`${BASE}/api/globals/footer`, { headers: auth });
  if (!getRes.ok) throw new Error(`GET footer failed: ${getRes.status}`);
  const footer = await getRes.json();

  // Find the Calculators group and fix URLs
  let patched = 0;
  for (const grp of footer.navGroups ?? []) {
    if (grp.title !== "Calculators") continue;
    for (const link of grp.links ?? []) {
      const correctUrl = CALC_URLS[link.label];
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

  // POST updated footer back
  const postRes = await fetch(`${BASE}/api/globals/footer`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ navGroups: footer.navGroups }),
  });
  if (!postRes.ok) {
    const err = await postRes.text();
    throw new Error(`POST footer failed: ${postRes.status} — ${err}`);
  }
  console.log(`[patch] Updated ${patched} calculator links in production footer.`);
};

run().catch((e) => {
  console.error("[patch] FAILED:", e.message);
  process.exit(1);
});
