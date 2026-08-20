#!/usr/bin/env node
/**
 * patch-cme-images-all.mjs
 *
 * For each of the 8 remaining CME blogs:
 * 1. Downloads the real WP featured image → uploads to Payload Media → sets as heroImage
 * 2. Fetches WP post content to extract real event photo URLs
 * 3. Replaces the generic lab externalImage block + adds real event photos throughout content
 *
 * Run: node scripts/patch-cme-images-all.mjs
 * Dry: node scripts/patch-cme-images-all.mjs --dry-run
 */

const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const WP_BASE  = "https://ivfclinic.com";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[cme-img] ${msg}`);
const uid  = () => Math.random().toString(36).slice(2, 10);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// Map: Payload blog ID → { slug, wpFeaturedUrl, wpSlug, altText }
const CME_BLOGS = [
  {
    payloadId: 49,
    slug: "cme-program-on-infertility-management-successfully-conducted-at-idar",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2026/02/image1-3.png",
    heroFilename: "cme-idar-infertility-management.png",
    heroAlt: "CME Program on Infertility Management — Bavishi Fertility Institute successfully conducted at Idar",
  },
  {
    payloadId: 24,
    slug: "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2026/02/image1-2.png",
    heroFilename: "cme-east-ahmedabad-gynaecologist.png",
    heroAlt: "Bavishi Fertility Institute hosts joint educational CME with East Ahmedabad Gynaecologist Association",
  },
  {
    payloadId: 20,
    slug: "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2025/09/Bavishi-Fertility-Institute-Conducts-an-Educational-Programme-at-Rajkot-1.png",
    heroFilename: "cme-educational-programme-rajkot.png",
    heroAlt: "Bavishi Fertility Institute conducts an educational programme at Rajkot — CME event photo",
  },
  {
    payloadId: 19,
    slug: "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2025/09/image1-1.png",
    heroFilename: "cme-bardoli-program.png",
    heroAlt: "Bavishi Fertility Institute conducts a successful CME program at Bardoli — event photo",
  },
  {
    payloadId: 25,
    slug: "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2025/09/image1.png",
    heroFilename: "cme-bharuch-ob-gy-society.png",
    heroAlt: "Bavishi Fertility Institute knowledge sharing program with Bharuch OB & GY Society — event photo",
  },
  {
    payloadId: 67,
    slug: "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2025/07/Empowering-Women-in-Medicine-Knowledge-Sharing-Program-on-Advanced-Fertility-and-IVF-Techniques-at-Nikol.png",
    heroFilename: "cme-nikol-empowering-women-fertility.png",
    heroAlt: "Empowering Women in Medicine — knowledge sharing program on advanced fertility and IVF techniques at Nikol by Bavishi Fertility Institute",
  },
  {
    payloadId: 58,
    slug: "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2024/12/Dr.-Himanshu-Bavishi-Speaks-on-IVF-at-SOGOG-Conference-1.png",
    heroFilename: "cme-dr-himanshu-sogog-ivf.png",
    heroAlt: "Dr. Himanshu Bavishi speaks on IVF at SOGOG Conference — Bavishi Fertility Institute",
  },
  {
    payloadId: 57,
    slug: "dr-falguni-bavishi-at-sogog-conference-on-iui-success",
    wpFeaturedUrl: "https://ivfclinic.com/wp-content/uploads/2024/12/Dr.-Falguni-Bavishi-at-SOGOG-Conference-on-IUI-Success.png",
    heroFilename: "cme-dr-falguni-sogog-iui.png",
    heroAlt: "Dr. Falguni Bavishi at SOGOG Conference on IUI success — Bavishi Fertility Institute",
  },
];

// ── Extract image URLs from WP post HTML content ──────────────────────────────
// Handles: standard src="", data-popup="", data-thumbnail="", data-src="", data-lazy-src=""
// (Robo Gallery and lazy-loading plugins use non-standard attributes)
function extractImgUrls(htmlContent) {
  const ATTRS = ["data-popup", "data-src", "data-lazy-src", "data-thumbnail", "src"];
  const seen = new Set();
  const all = [];

  for (const attr of ATTRS) {
    const re = new RegExp(`${attr}="(https?:\\/\\/ivfclinic\\.com\\/wp-content\\/uploads\\/[^"]+\\.(jpg|jpeg|png))"`, "gi");
    for (const m of htmlContent.matchAll(re)) {
      const url = m[1];
      if (!seen.has(url)) { seen.add(url); all.push(url); }
    }
  }

  // Prefer originals (no size suffix like -300x200)
  const originals = all.filter(u => !u.match(/-\d+x\d+\.(jpg|jpeg|png)$/i));
  // Fall back to any size if no originals found
  const result = originals.length ? originals : all;
  return result.slice(0, 6); // max 6 content images per blog
}

// ── Fetch WP post content images ─────────────────────────────────────────────
async function fetchWpContentImages(slug) {
  const url = `${WP_BASE}/wp-json/wp/v2/posts?slug=${slug}&_fields=content`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]?.content?.rendered) return [];
  return extractImgUrls(data[0].content.rendered);
}

// ── Build alt text for content images ────────────────────────────────────────
function makeImgAlt(slug, index) {
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return `${title} — event photo ${index + 1} from Bavishi Fertility Institute CME program`;
}

// ── externalImage block factory ───────────────────────────────────────────────
const mkExternalImage = ({ url, alt, caption = null, credit = "Photo: Bavishi Fertility Institute" }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption, credit },
});

// ── API helpers ───────────────────────────────────────────────────────────────
async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed ${res.status}: ${await res.text()}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function uploadHeroImage(blog, auth) {
  log(`  Downloading: ${blog.wpFeaturedUrl}`);
  const dlRes = await fetch(blog.wpFeaturedUrl);
  if (!dlRes.ok) throw new Error(`Download failed ${dlRes.status}`);
  const blob = await dlRes.blob();
  log(`  Downloaded ${(blob.size / 1024).toFixed(0)} KB`);

  const form = new FormData();
  form.append("file", blob, blog.heroFilename);
  form.append("_payload", JSON.stringify({ alt: blog.heroAlt }));

  const upRes = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!upRes.ok) throw new Error(`Upload failed: ${await upRes.text()}`);
  const data = await upRes.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  log(`  Uploaded → Media ID ${id}`);
  return id;
}

async function fetchBlog(payloadId, auth) {
  const res = await fetch(`${BASE}/api/blogs/${payloadId}?depth=0`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${payloadId}: ${res.status}`);
  return res.json();
}

async function patchBlog(payloadId, payload, auth) {
  const res = await fetch(`${BASE}/api/blogs/${payloadId}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PATCH ${payloadId}: ${await res.text()}`);
  return res.json();
}

// ── Inject real event photos into lexical content ────────────────────────────
function buildUpdatedContent(existingContent, contentImgUrls, slug) {
  const children = existingContent?.root?.children ?? [];
  if (!contentImgUrls.length) return null;

  const newChildren = [];
  let imgIndex = 0;
  let replacedExisting = false;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    // Replace the first existing generic externalImage block with first real event photo
    if (
      !replacedExisting &&
      node.type === "block" &&
      node.fields?.blockType === "externalImage" &&
      contentImgUrls[imgIndex]
    ) {
      newChildren.push(mkExternalImage({
        url: contentImgUrls[imgIndex],
        alt: makeImgAlt(slug, imgIndex),
        caption: "Bavishi Fertility Institute medical education event.",
      }));
      imgIndex++;
      replacedExisting = true;
      continue;
    }

    newChildren.push(node);

    // After every h3 heading, insert a real event photo (up to available photos)
    if (node.type === "heading" && node.tag === "h3" && contentImgUrls[imgIndex]) {
      newChildren.push(mkExternalImage({
        url: contentImgUrls[imgIndex],
        alt: makeImgAlt(slug, imgIndex),
        caption: "Bavishi Fertility Institute CME — continuing medical education programme.",
      }));
      imgIndex++;
    }
  }

  // Add any remaining photos before conclusionPanel
  const conclusionIdx = newChildren.findIndex(
    n => n.type === "block" && n.fields?.blockType === "conclusionPanel"
  );
  while (contentImgUrls[imgIndex]) {
    const insertAt = conclusionIdx >= 0 ? conclusionIdx : newChildren.length;
    newChildren.splice(insertAt, 0, mkExternalImage({
      url: contentImgUrls[imgIndex],
      alt: makeImgAlt(slug, imgIndex),
    }));
    imgIndex++;
  }

  return { root: { ...existingContent.root, children: newChildren } };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  log(`Connecting to ${BASE} …`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes");

  const auth = await login();
  log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < CME_BLOGS.length; i++) {
    const blog = CME_BLOGS[i];
    log(`[${i + 1}/${CME_BLOGS.length}] ${blog.slug}`);

    try {
      // 1. Upload featured image as new hero
      let heroMediaId;
      if (!DRY_RUN) {
        heroMediaId = await uploadHeroImage(blog, auth);
        await wait(600);
      } else {
        heroMediaId = `DRY_${blog.payloadId}`;
        log(`  [DRY] Would upload: ${blog.wpFeaturedUrl}`);
      }

      // 2. Fetch WP content images
      log(`  Fetching WP content images …`);
      const wpImages = await fetchWpContentImages(blog.slug);
      log(`  Found ${wpImages.length} content image(s) from WP`);
      if (wpImages.length) log(`  → ${wpImages[0]}`);
      await wait(300);

      // 3. Fetch current Payload blog
      const payloadBlog = await fetchBlog(blog.payloadId, auth);

      // 4. Build updated content
      const updatedContent = wpImages.length
        ? buildUpdatedContent(payloadBlog.content, wpImages, blog.slug)
        : null;

      const patch = { heroImage: heroMediaId };
      if (updatedContent) patch.content = updatedContent;

      const imgCount = updatedContent
        ? (updatedContent.root.children.filter(
            n => n.type === "block" && n.fields?.blockType === "externalImage" &&
                 wpImages.some(u => n.fields.url === u)
          )).length
        : 0;

      // 5. Patch
      if (!DRY_RUN) {
        await patchBlog(blog.payloadId, patch, auth);
        log(`  ✅ Hero set to Media ID ${heroMediaId}, ${imgCount} event photo(s) added to content`);
      } else {
        log(`  [DRY] Would PATCH ID ${blog.payloadId}: hero=${heroMediaId}, content images=${imgCount}`);
      }

      success++;
    } catch (err) {
      log(`  ✗ ERROR: ${err.message}`);
      errors++;
    }

    log("");
    await wait(500);
  }

  log("─".repeat(60));
  log(`Done! ${success} updated, ${errors} errors${DRY_RUN ? " (DRY RUN)" : ""}`);
}

run().catch(err => {
  console.error("[cme-img] FATAL:", err.message);
  process.exit(1);
});
