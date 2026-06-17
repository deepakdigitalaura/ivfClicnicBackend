#!/usr/bin/env node
/* =====================================================================
 * upload-hero-images.mjs
 * Downloads Indian-origin Pexels photos, uploads them to Payload Media,
 * and sets heroImage on each of the 5 pilot blog posts.
 *
 * Run against LOCAL:
 *   node scripts/upload-hero-images.mjs
 *
 * Run against PROD:
 *   PAYLOAD_URL=https://... SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... node scripts/upload-hero-images.mjs
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL        ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const log = (msg) => console.log(`[hero-upload] ${msg}`);

/* ── All 5 pilot posts with Indian-origin Pexels photos ─────────────── */
const HEROES = [
  {
    slug: "iui-vs-ivf-which-fertility-treatment-is-right-for-you",
    url: "https://images.pexels.com/photos/18277954/pexels-photo-18277954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Indian couple sharing a loving outdoor moment during pregnancy — the destination IUI and IVF both work toward",
    filename: "iui-vs-ivf-indian-couple-hero.jpg",
  },
  {
    slug: "ivf-treatment-cost-in-ahmedabad-across-india",
    url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Confident Indian female doctor in a modern medical laboratory in Delhi — IVF cost and treatment quality in Ahmedabad",
    filename: "ivf-cost-indian-doctor-hero.jpg",
  },
  {
    slug: "top-fertility-treatments-for-women-with-pcos",
    url: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Doctor consulting with a patient at a fertility clinic — personalised PCOS treatment pathway",
    filename: "pcos-doctor-consultation-hero.jpg",
  },
  {
    slug: "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
    url: "https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Embryologist examining embryos through a microscope in a fertility lab — what happens after embryo transfer",
    filename: "embryo-transfer-lab-hero.jpg",
  },
  {
    slug: "azoospermia-can-you-have-a-baby-with-zero-sperm-count",
    url: "https://images.pexels.com/photos/35441879/pexels-photo-35441879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Indian couple in traditional attire celebrating pregnancy — the hopeful outcome of azoospermia treatment with TESA/PESA and IVF",
    filename: "azoospermia-indian-couple-hero.jpg",
  },
];

async function main() {
  log(`Connecting to ${BASE} ...`);

  /* ── Login ─────────────────────────────────────────────────────── */
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
  const { token } = await loginRes.json();
  const authHeader = { Authorization: `JWT ${token}` };
  log("Login OK\n");

  for (const hero of HEROES) {
    log(`Processing: ${hero.slug}`);

    /* ── 1. Download image from Pexels ──────────────────────────── */
    log(`  Downloading: ${hero.url.slice(0, 60)}...`);
    const imgRes = await fetch(hero.url);
    if (!imgRes.ok) {
      log(`  ✗ Failed to download image: HTTP ${imgRes.status}`);
      continue;
    }
    const imgBlob = await imgRes.blob();
    log(`  Downloaded: ${(imgBlob.size / 1024).toFixed(0)} KB`);

    /* ── 2. Upload to Payload Media ─────────────────────────────── */
    const formData = new FormData();
    formData.append("file", imgBlob, hero.filename);
    formData.append("alt", hero.alt);

    const uploadRes = await fetch(`${BASE}/api/media`, {
      method: "POST",
      headers: authHeader,
      body: formData,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      log(`  ✗ Upload failed: ${err.slice(0, 120)}`);
      continue;
    }
    const uploadData = await uploadRes.json();
    const mediaId = uploadData.doc?.id ?? uploadData.id;
    if (!mediaId) {
      log(`  ✗ No media ID returned`);
      continue;
    }
    log(`  ✓ Uploaded to Payload Media — id=${mediaId}`);

    /* ── 3. Find blog by slug and set heroImage ──────────────────── */
    const blogRes = await fetch(
      `${BASE}/api/blogs?where[slug][equals]=${encodeURIComponent(hero.slug)}&depth=0&limit=1`,
      { headers: authHeader }
    );
    const blogData = await blogRes.json();
    const blog = blogData.docs?.[0];
    if (!blog) {
      log(`  ✗ Blog not found: ${hero.slug}`);
      continue;
    }

    const patchRes = await fetch(`${BASE}/api/blogs/${blog.id}`, {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ heroImage: mediaId }),
    });
    if (!patchRes.ok) {
      const err = await patchRes.text();
      log(`  ✗ PATCH failed: ${err.slice(0, 120)}`);
      continue;
    }
    log(`  ✓ heroImage set on blog id=${blog.id}\n`);

    /* Brief pause between uploads */
    await new Promise(r => setTimeout(r, 500));
  }

  log("✅ All hero images processed.");
}

main().catch(err => {
  console.error("[hero-upload] FAILED:", err.message);
  process.exit(1);
});
