#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

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
  
  const slugsToDelete = [
    "embryo-freezing",
    "sperm-freezing",
    "egg-freezing",
    "ivf-evaluation",
    "era-test",
    "pgt",
    "surrogacy"
  ];

  for (const slug of slugsToDelete) {
    const findRes = await fetch(
      `${BASE}/api/treatments?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];

    if (existing) {
      const res = await fetch(`${BASE}/api/treatments/${existing.id}`, { method: "DELETE", headers: auth });
      if (!res.ok) throw new Error(`${slug} failed to delete: HTTP ${res.status}`);
      console.log(`Deleted ${slug}`);
    } else {
      console.log(`Slug ${slug} not found in DB`);
    }
  }
  console.log("Done deleting extra treatments.");
};

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
