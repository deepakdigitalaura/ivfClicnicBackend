/**
 * One-off patch for the `parth-bavishi-author` author record:
 *   1. Uploads /public/assets/doctors/parth.webp to Payload Media
 *      (dedupes — safe to re-run)
 *   2. Sets author.avatar → the uploaded media id
 *   3. Fixes author.sameAs[0].url to the LOCAL path /doctors/parth-bavishi
 *      (the original import used the absolute live-site URL which breaks the
 *      "View Full Profile" link on the local site)
 *
 * Run: npx tsx --tsconfig tsconfig.json scripts/import-blogs/patch-author.mts
 * (dev server must be running on localhost:3000)
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const AUTHOR_SLUG = "parth-bavishi-author";
const PHOTO_PATH = path.resolve(
  import.meta.dirname,
  "../../public/assets/doctors/parth.webp",
);
const PROFILE_URL = "/doctors/parth-bavishi";

/* ── Auth ─────────────────────────────────────────────────────── */
async function login(): Promise<string> {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).token;
}

/* ── Upload photo ─────────────────────────────────────────────── */
async function uploadPhoto(authHeader: string): Promise<number> {
  const filename = "parth.webp";

  // Dedupe: check if already uploaded by filename
  const existing = await fetch(
    `${BASE}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1&depth=0`,
    { headers: { Authorization: authHeader } },
  ).then((r) => r.json());

  if (existing?.docs?.[0]?.id) {
    console.log(`[patch-author] media already exists id=${existing.docs[0].id}`);
    return existing.docs[0].id as number;
  }

  // Read local file and upload
  const buf = fs.readFileSync(PHOTO_PATH);
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "image/webp" }), filename);
  form.append("_payload", JSON.stringify({ alt: "Dr. Parth Bavishi" }));

  const res = await fetch(`${BASE}/api/media`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: form,
  });
  const out = await res.json();
  if (!res.ok) throw new Error(`media upload HTTP ${res.status}: ${JSON.stringify(out)}`);
  const id = out.doc?.id as number;
  console.log(`[patch-author] uploaded parth.webp → media id=${id}`);
  return id;
}

/* ── Patch author ─────────────────────────────────────────────── */
async function patchAuthor(avatarId: number, auth: Record<string, string>) {
  // Find the author
  const found = await fetch(
    `${BASE}/api/authors?where[slug][equals]=${encodeURIComponent(AUTHOR_SLUG)}&depth=0&limit=1`,
    { headers: auth },
  ).then((r) => r.json());

  if (!found?.docs?.length) {
    throw new Error(`Author '${AUTHOR_SLUG}' not found — run import-blogs/run.mts first`);
  }

  const authorId = found.docs[0].id as number;
  const res = await fetch(`${BASE}/api/authors/${authorId}`, {
    method: "PATCH",
    headers: auth,
    body: JSON.stringify({
      avatar: avatarId,
      sameAs: [{ url: PROFILE_URL }],
    }),
  });
  const out = await res.json();
  if (!res.ok) throw new Error(`PATCH author HTTP ${res.status}: ${JSON.stringify(out)}`);
  console.log(`[patch-author] ✓ author id=${authorId} avatar=${avatarId} sameAs[0]=${PROFILE_URL}`);
}

/* ── Run ──────────────────────────────────────────────────────── */
async function run() {
  console.log("[patch-author] starting…");
  const token = await login();
  const auth = {
    Authorization: `JWT ${token}`,
    "Content-Type": "application/json",
  };

  const avatarId = await uploadPhoto(auth.Authorization);
  await patchAuthor(avatarId, auth);
  console.log("[patch-author] done ✓");
}

run().catch((e) => {
  console.error("[patch-author] fatal:", e);
  process.exit(1);
});
