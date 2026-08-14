#!/usr/bin/env node
/**
 * patch-cme-images-blog1.mjs
 *
 * Blog: "Advancing Ovarian Science: A Full-Day Scientific Program in Surat"
 * Payload ID: 15
 *
 * 1. Downloads the real WP featured image and uploads it to Payload Media
 * 2. Replaces the generic lab externalImage block with real event photos
 * 3. Adds remaining event photos interspersed through the content
 */

const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const BLOG_ID  = 15;
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[cme-img-1] ${msg}`);
const uid  = () => Math.random().toString(36).slice(2, 10);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// Real event photos from the WordPress blog content
const EVENT_IMAGES = [
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3214-Copy-1024x683.jpg",
    alt: "CME session at Surat — Bavishi Fertility Institute doctors presenting ovarian science to Surat Obstetric & Gynaecological Society",
    caption: "Bavishi Fertility Institute specialists sharing expertise on ovarian physiology with Surat gynecologists.",
    credit: "Photo: Bavishi Fertility Institute",
  },
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3258-Copy-683x1024.jpg",
    alt: "Expert speaker addressing attendees at the Surat ovarian science CME program organized by Bavishi Fertility Institute",
    caption: "Expert BFI specialists led focused discussions on ovarian reserve and advanced fertility management strategies.",
    credit: "Photo: Bavishi Fertility Institute",
  },
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3192-Copy-1024x683.jpg",
    alt: "Bavishi Fertility Institute CME program participants — Surat Obstetric & Gynaecological Society banner visible in background",
    caption: "Record attendance of 130 gynecologists from Surat and surrounding areas at this scientific program.",
    credit: "Photo: Bavishi Fertility Institute",
  },
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3341-Copy-1024x683.jpg",
    alt: "Panel discussion at the BFI full-day ovarian science program in Surat with Dr. Himanshu Bavishi and faculty",
    caption: "Interactive panel discussions bridged academic knowledge with real-world clinical practice.",
    credit: "Photo: Bavishi Fertility Institute",
  },
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3140-Copy-1024x683.jpg",
    alt: "Audience of Surat gynecologists at the Bavishi Fertility Institute CME scientific program at Hotel Marriott",
    caption: "Gynecologists from Surat and surrounding regions came together for this collaborative learning event.",
    credit: "Photo: Bavishi Fertility Institute",
  },
  {
    url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3067-Copy-683x1024.jpg",
    alt: "BFI specialist presenting at the Surat CME program on ovarian science and fertility management",
    caption: "BFI doctors shared evidence-based insights and practical approaches to managing complex ovarian conditions.",
    credit: "Photo: Bavishi Fertility Institute",
  },
];

// Real event photo — used as both hero card image and first content image
const FEATURED_IMAGE = {
  url: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_2924-Copy.jpg",
  filename: "cme-advancing-ovarian-science-surat-event.jpg",
  alt: "Advancing Ovarian Science CME — Bavishi Fertility Institute full-day scientific program in Surat with Surat Gynaecologists Society",
};

const mkExternalImage = ({ url, alt, caption = null, credit = null }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption, credit },
});

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

async function uploadFeaturedImage(auth) {
  log(`Downloading WP featured image …`);
  const dlRes = await fetch(FEATURED_IMAGE.url);
  if (!dlRes.ok) throw new Error(`Download failed: ${dlRes.status} ${FEATURED_IMAGE.url}`);
  const blob = await dlRes.blob();
  log(`Downloaded ${(blob.size / 1024).toFixed(0)} KB`);

  const form = new FormData();
  form.append("file", blob, FEATURED_IMAGE.filename);
  form.append("_payload", JSON.stringify({ alt: FEATURED_IMAGE.alt }));

  const upRes = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!upRes.ok) throw new Error(`Upload failed: ${await upRes.text()}`);
  const data = await upRes.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  log(`Uploaded featured image → Media ID ${id}`);
  return id;
}

async function fetchBlog(auth) {
  const res = await fetch(`${BASE}/api/blogs/${BLOG_ID}?depth=0`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${BLOG_ID}: ${res.status}`);
  return res.json();
}

async function patchBlog(payload, auth) {
  const res = await fetch(`${BASE}/api/blogs/${BLOG_ID}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PATCH failed: ${await res.text()}`);
  return res.json();
}

function buildUpdatedContent(existingContent) {
  const children = existingContent?.root?.children ?? [];

  // Replace the existing generic lab externalImage with the first real event photo
  // Add more event photos at strategic positions throughout the content
  const newChildren = [];
  let eventImgIndex = 0;

  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    // Replace existing generic externalImage with first real event photo
    if (node.type === "block" && node.fields?.blockType === "externalImage" && eventImgIndex === 0) {
      newChildren.push(mkExternalImage(EVENT_IMAGES[0]));
      eventImgIndex++;
      continue;
    }

    newChildren.push(node);

    // After "Record-Breaking Attendance" heading → insert second event photo (audience shot)
    if (
      node.type === "heading" &&
      node.children?.some?.(c => c.text?.includes("Record-Breaking"))
    ) {
      newChildren.push(mkExternalImage(EVENT_IMAGES[2])); // audience shot
      eventImgIndex++;
    }

    // After "Commitment to Excellence" heading → insert panel discussion photo
    if (
      node.type === "heading" &&
      node.children?.some?.(c => c.text?.includes("Commitment"))
    ) {
      newChildren.push(mkExternalImage(EVENT_IMAGES[3])); // panel discussion
      eventImgIndex++;
    }

    // After "Eminent Participation" heading → insert speaker photo
    if (
      node.type === "heading" &&
      node.children?.some?.(c => c.text?.includes("Eminent") || c.text?.includes("Participation"))
    ) {
      newChildren.push(mkExternalImage(EVENT_IMAGES[5])); // speaker photo
      eventImgIndex++;
    }
  }

  // Add remaining event photo before conclusionPanel if it exists
  const hasConclusionPanel = newChildren.some(n => n.type === "block" && n.fields?.blockType === "conclusionPanel");
  if (hasConclusionPanel && EVENT_IMAGES[4]) {
    const conclusionIdx = newChildren.findIndex(n => n.type === "block" && n.fields?.blockType === "conclusionPanel");
    newChildren.splice(conclusionIdx, 0, mkExternalImage(EVENT_IMAGES[4]));
  }

  return { root: { ...existingContent.root, children: newChildren } };
}

async function run() {
  log(`Connecting to ${BASE} …`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes");

  const auth = await login();
  log("Login OK");

  // 1. Upload real featured image
  let heroMediaId;
  if (!DRY_RUN) {
    heroMediaId = await uploadFeaturedImage(auth);
    await wait(500);
  } else {
    heroMediaId = "DRY_HERO";
    log(`[DRY] Would upload: ${FEATURED_IMAGE.url}`);
  }

  // 2. Fetch current blog content
  log(`Fetching blog ${BLOG_ID} …`);
  const blog = await fetchBlog(auth);
  log(`Current heroImage ID: ${typeof blog.heroImage === "object" ? blog.heroImage?.id : blog.heroImage}`);

  // 3. Build updated content with real event photos
  const updatedContent = buildUpdatedContent(blog.content);
  const eventImagesAdded = (updatedContent.root.children.filter(
    n => n.type === "block" && n.fields?.blockType === "externalImage" &&
         EVENT_IMAGES.some(e => n.fields.url === e.url)
  )).length;
  log(`Event photos to add/replace in content: ${eventImagesAdded}`);

  // 4. PATCH blog
  const patch = {
    heroImage: heroMediaId,
    content: updatedContent,
  };

  if (!DRY_RUN) {
    log("PATCHing blog …");
    await patchBlog(patch, auth);
    log(`✅ Done! Blog ID ${BLOG_ID} updated:`);
    log(`   heroImage → Media ID ${heroMediaId}`);
    log(`   ${eventImagesAdded} real event photo(s) added to content`);
    log(`\n   Preview: https://ivf-clicnic-backend-weld.vercel.app/blog/advancing-ovarian-science-a-full-day-scientific-program-in-surat`);
  } else {
    log(`[DRY] Would PATCH blog ${BLOG_ID} with heroImage=${heroMediaId}, ${eventImagesAdded} content images`);
  }
}

run().catch(err => {
  console.error("[cme-img-1] FATAL:", err.message);
  process.exit(1);
});
