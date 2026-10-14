#!/usr/bin/env node
/* =====================================================================
 * Point the links inside blog articles at the current URLs.
 *
 * PR #60 fixed the header, footer and templates. The article bodies were
 * left alone, and they carry the bulk of it: 27 retired addresses linked
 * 699 times across the blog, led by /what-is-ivf in 161 posts. Every one of
 * those links costs the reader a redirect, and shows Google the site linking
 * to addresses it has retired.
 *
 * WHAT IT CHANGES
 *   Only the value of a "url" key -- a Lexical link node's fields.url, and
 *   the url on a block's buttons. Never a "text" value, so no visible word on
 *   any page changes. The link label, its position and the surrounding copy
 *   stay exactly as they are; only the address behind it is corrected.
 *
 * WHY IT IS SAFE TO RUN ON EVERY DEPLOY
 *   It matches whole paths, so "/pcos" can never match inside "/pcos-diet",
 *   and it only writes a document that actually contains one of the old
 *   addresses. After the first run nothing matches, so later runs are no-ops.
 *   contentRaw is the only field touched; lastUpdatedAt is deliberately left
 *   alone so the "Updated" date shown on 300 articles does not jump.
 *
 * EVERY DESTINATION WAS VERIFIED
 *   All 27 were fetched from the live site on 14 October 2026 and each
 *   returned 200 directly, with no redirect of its own. The mapping below is
 *   that verified list -- see October 2026/blog-old-links-by-url.csv.
 *
 * Runs from `prebuild`, so merging to main is the whole deploy step: the
 * workflow pulls the production .env (carrying SANITY_API_TOKEN) before
 * building, the same route seed-manual-reviews.mjs relies on.
 *
 * Remove the prebuild wiring once a deploy reports "0 posts changed" --
 * at that point every link has been corrected and the script has no work
 * left to do.
 *
 * Manual run:  node scripts/fix-blog-internal-links.mjs [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log("[fix-blog-links]", ...a);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  try {
    for (const raw of readFileSync(envPath, "utf8").split("\n")) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(raw.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* ignore */ }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

/* Retired address -> current address. Each destination was fetched live and
 * returned 200 with no redirect of its own. */
const MAP = {
  "/10-foods-to-improve-female-egg-quality": "/blogs/10-foods-to-improve-female-egg-quality",
  "/3d-4d-sonography-services-in-ahmedabad": "/services/3d-4d-sonography",
  "/ahmedabad": "/locations/ahmedabad",
  "/best-ivf-doctors": "/doctors",
  "/best-ivf-doctors/dr-binal-shah": "/doctors/binal-shah",
  "/best-ivf-doctors/dr-deep-gajiwala": "/doctors/deep-gajiwala",
  "/best-ivf-doctors/dr-deepali-pandya": "/doctors/deepali-pandya",
  "/best-ivf-doctors/dr-falguni-bavishi": "/doctors/falguni-bavishi",
  "/best-ivf-doctors/dr-himanshu-bavishi": "/doctors/himanshu-bavishi",
  "/best-ivf-doctors/dr-janki-bavishi": "/doctors/janki-bavishi",
  "/best-ivf-doctors/dr-jaydeep-patel": "/doctors/jaydeep-patel",
  "/best-ivf-doctors/dr-nilesh-jain": "/doctors/nilesh-jain",
  "/best-ivf-doctors/dr-parth-bavishi": "/doctors/parth-bavishi",
  "/best-ivf-doctors/dr-surbhi-vegad": "/doctors/surbhi-vegad",
  "/bhavnagar": "/locations/bhavnagar",
  "/bhuj": "/locations/bhuj",
  "/blog/are-ivf-babies-healthy-as-naturally-conceived": "/blogs/are-ivf-babies-healthy-as-naturally-conceived",
  "/blog/ectopic-pregnancy": "/blogs/ectopic-pregnancy",
  "/blog/factors-to-consider-right-clinic-for-ivf-journey": "/blogs/factors-to-consider-right-clinic-for-ivf-journey",
  "/blog/ivf-failure-treatment-is-possible": "/blogs/ivf-failure-treatment-is-possible",
  "/blog/miscarriages-during-ivf-signs-causes-prevention": "/blogs/miscarriages-during-ivf-signs-causes-prevention-hope",
  "/blog/ovarian-hyperstimulation-syndrome": "/blogs/ovarian-hyperstimulation-syndrome",
  "/category/ivf-failure": "/treatments/ivf-failure",
  "/counselling": "/treatments",
  "/delhi": "/locations",
  "/does-stress-affect-ivf-success": "/blogs/does-stress-affect-ivf-success",
  "/dr-himanshu-bavishi": "/doctors/himanshu-bavishi",
  "/embryo-transfer-procedure-for-in-vitro-fertilization-ivf": "/blogs/embryo-transfer-procedure-for-in-vitro-fertilization-ivf",
  "/endometrial-lining-remedies-for-abnormal-thickness": "/blogs/endometrial-lining-remedies-for-abnormal-thickness",
  "/endoscopy-operations": "/treatments/female-infertility",
  "/era-test": "/treatments/era-test",
  "/female-infertility": "/treatments/female-infertility",
  "/fertility-assessment": "/treatments/ivf-evaluation",
  "/fertility-evaluation": "/treatments/ivf-evaluation",
  "/fertility-preservation": "/treatments/egg-freezing",
  "/fetal-medicine-services-in-ahmedabad": "/services/fetal-medicine",
  "/high-risk-pregnancy-care-in-ahmedabad": "/services/high-risk-pregnancy-care",
  "/how-age-affects-fertility-myths-vs-facts": "/blogs/how-age-affects-fertility-myths-vs-facts",
  "/how-conception-occur": "/treatments/conceive-naturally",
  "/how-does-follicle-count-affect-ivf-success-rates": "/blogs/how-does-follicle-count-affect-ivf-success-rates",
  "/how-does-letrozole-help-with-ovulation-and-pregnancy": "/blogs/how-does-letrozole-help-with-ovulation-and-pregnancy",
  "/how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility": "/blogs/how-does-the-climate-and-lifestyle-in-ahmedabad-affect-fertility",
  "/how-does-the-number-of-eggs-affect-ivf-success-rate": "/blogs/how-does-the-number-of-eggs-affect-ivf-success-rate",
  "/how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility": "/blogs/how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility",
  "/how-pre-implantation-genetic-testing-boosts-ivf-success": "/blogs/how-pre-implantation-genetic-testing-boosts-ivf-success",
  "/how-to-improve-ovulation-naturally-when-you-have-pcos": "/blogs/how-to-improve-ovulation-naturally-when-you-have-pcos",
  "/impact-of-age-repeated-ivf-cycles-on-pregnancy": "/blogs/impact-of-age-repeated-ivf-cycles-on-pregnancy",
  "/indian-celebrities-who-improved-fertility-through-yoga": "/blogs/indian-celebrities-who-improved-fertility-through-yoga",
  "/infrastructure": "/about-bfi",
  "/innovative-treatments-for-low-amh": "/blogs/innovative-treatments-for-low-amh",
  "/international-patients": "/contact",
  "/iui-success-rate-what-to-expect-after-iui-treatment": "/blogs/iui-success-rate-what-to-expect-after-iui-treatment",
  "/ivf-and-career-balancing-work-and-fertility-treatments": "/blogs/ivf-and-career-balancing-work-and-fertility-treatments",
  "/ivf-for-single-women-in-india-navigating-new-art-law": "/blogs/ivf-for-single-women-in-india-navigating-new-art-law",
  "/ivf-pregnancy-week-by-week-symptoms-and-safety": "/blogs/ivf-pregnancy-week-by-week-symptoms-and-safety",
  "/lifestyle-changes-that-boost-fertility-in-pcos-women": "/blogs/lifestyle-changes-that-boost-fertility-in-pcos-women",
  "/lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy": "/blogs/lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy",
  "/male-infertility": "/treatments/male-infertility",
  "/male-infertility-signs-causes-prevention-diagnosis-treatment": "/blogs/male-infertility-signs-causes-treatment",
  "/male-infertility-treatment-options-in-ahmedabad-what-you-should-know": "/blogs/male-infertility-treatment-options-in-ahmedabad-what-you-should-know",
  "/maternity-services": "/services/normal-delivery",
  "/mumbai": "/locations/mumbai",
  "/natural-conception-with-low-amh-levels": "/blogs/natural-conception-with-low-amh-levels",
  "/normal-delivery-services-in-ahmedabad": "/services/normal-delivery",
  "/our-team": "/doctors",
  "/our-treatments": "/treatments",
  "/ovarian-cysts-symptoms-causes-treatment-diagnosis": "/blogs/ovarian-cysts-symptoms-causes-treatment-diagnosis",
  "/pre-implantation-genetic-testing-pgt": "/treatments/pgt",
  "/pregnancy-care": "/services/high-risk-pregnancy-care",
  "/pregnancy-complications": "/blogs/pregnancy-complications",
  "/prp-platelet-rich-plasma-therapy-in-infertility": "/treatments/prp-infertility",
  "/questions-to-ask-ivf-specialist-at-1st-visit": "/blogs/questions-to-ask-ivf-specialist-at-1st-visit",
  "/semen-analysis-calculator": "/calculators/semen-analysis",
  "/step-by-step-process-of-embryo-freezing-in-an-ivf-cycle": "/blogs/step-by-step-process-of-embryo-freezing-in-an-ivf-cycle",
  "/stories-from-indian-celebrities-of-egg-freezing": "/blogs/stories-from-indian-celebrities-of-egg-freezing",
  "/surat": "/locations/surat",
  "/surrogacy": "/treatments/surrogacy",
  "/the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility": "/blogs/the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility",
  "/the-role-of-endometrial-receptivity-in-ivf-success": "/blogs/the-role-of-endometrial-receptivity-in-ivf-success",
  "/the-thyroid-connection-understanding-its-role-in-female-fertility-health": "/blogs/the-thyroid-connection-understanding-its-role-in-female-fertility-health",
  "/tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide": "/blogs/12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide",
  "/top-10-reasons-to-consider-egg-freezing": "/blogs/top-10-reasons-to-consider-egg-freezing",
  "/twin-and-multiple-pregnancies-after-ivf-risks-and-care": "/blogs/twin-and-multiple-pregnancies-after-ivf-risks-and-care",
  "/twin-pregnancy-care-in-ahmedabad": "/services/twin-pregnancy-care",
  "/understanding-frozen-embryo-transfer-fet-in-ivf": "/blogs/understanding-frozen-embryo-transfer-fet-in-ivf",
  "/understanding-male-fertility-azoospermia-vs-oligospermia": "/blogs/understanding-male-fertility-azoospermia-vs-oligospermia",
  "/understanding-reality-behind-ivf-success-rates": "/blogs/understanding-reality-behind-ivf-success-rates",
  "/understanding-the-reasons-for-ivf-failure": "/blogs/understanding-the-reasons-for-ivf-failure",
  "/understanding-the-success-rate-of-ivf-treatment": "/blogs/understanding-the-success-rate-of-ivf-treatment",
  "/vadodara": "/locations/vadodara",
  "/what-happens-after-embryo-transfer-day-by-day": "/blogs/what-happens-after-embryo-transfer-day-by-day",
  "/what-to-expect-during-each-stage-of-ivf": "/blogs/what-to-expect-during-each-stage-of-ivf",
  "/when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained": "/blogs/when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained",
};

/* Seven retired addresses are deliberately NOT in the map above. Their target
 * no longer exists, so the site redirects them to a generic page -- the home
 * page or the blog index. Rewriting the article to point there would bake a
 * dead end into the copy permanently and invisibly, where today at least the
 * redirect table records the intent. They want a content decision instead:
 *
 *   /testimonials                      -> home page   (3 links)
 *   /do-and-dont-for-fertility         -> home page   (2 links)
 *   /smart                             -> home page   (2 links)
 *   /ivf-after-35-navigating-...       -> /blogs      (2 links)
 *   /key-questions-to-discuss-...      -> /blogs      (2 links)
 *   /a-quick-guide-on-the-ivf-...      -> /blogs      (1 link)
 *   /how-nutrition-impacts-...         -> /blogs      (1 link)
 *
 * Either republish the article, point it at the nearest real page, or drop the
 * link from the sentence. Until then the redirect keeps them working. */

const ORIGIN = "https://ivfclinic.com";

/* The byline and reviewer line are built from these slugs, so a stale one
 * sends every article's author link through a redirect -- 288 and 287 posts
 * respectively, which made them the two most-linked stale URLs on the site.
 * These are the slugs the admin panel itself writes when a doctor is picked
 * from the list, and both targets were fetched live and answer 200. */
const AUTHOR_SLUGS = {
  "parth-bavishi-author": "parth-bavishi",
  "dr-himanshu-bavishi": "himanshu-bavishi",
};

/* Resolve one href. Returns null when it should be left alone. Handles the
 * absolute form and a trailing slash, and preserves any query or fragment. */
function remap(href) {
  if (typeof href !== "string" || !href) return null;

  let rest = href;
  let prefix = "";
  if (rest.startsWith(ORIGIN)) {
    prefix = ORIGIN;
    rest = rest.slice(ORIGIN.length) || "/";
  }
  if (!rest.startsWith("/")) return null;

  const cut = rest.search(/[?#]/);
  const tail = cut === -1 ? "" : rest.slice(cut);
  const path = cut === -1 ? rest : rest.slice(0, cut);

  const hadSlash = path.length > 1 && path.endsWith("/");
  const bare = hadSlash ? path.slice(0, -1) : path;

  const target = MAP[bare];
  if (!target) return null;
  return prefix + target + tail;
}

/* Walk the Lexical tree and rewrite every "url" value. "text" is never
 * touched, so nothing a reader sees changes. */
function rewrite(node, changes) {
  if (Array.isArray(node)) {
    for (const child of node) rewrite(child, changes);
    return;
  }
  if (!node || typeof node !== "object") return;

  for (const [key, value] of Object.entries(node)) {
    if (key === "url" && typeof value === "string") {
      const next = remap(value);
      if (next) {
        node[key] = next;
        changes.push([value, next]);
      }
    } else if (value && typeof value === "object") {
      rewrite(value, changes);
    }
  }
}

async function main() {
  if (DRY) log("dry run - nothing will be written");

  if (!projectId) {
    log("no Sanity project configured - skipping (expected outside deploy).");
    return;
  }
  if (!token && !DRY) {
    log("no Sanity write token here - skipping (expected outside deploy).");
    return;
  }

  const client = createClient({
    projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token,
  });

  const posts = await client.fetch(
    `*[_type == "blog" && status != "draft"]{ _id, slug, contentRaw, authorSlug, reviewerSlug }`,
  );
  log(`${posts.length} published posts to check`);

  let changedPosts = 0;
  let changedLinks = 0;
  let changedBylines = 0;
  const tally = new Map();

  for (const post of posts) {
    // The byline slugs live on the document, not in the body, so they are
    // handled separately -- and a post can need one, the other, or both.
    const patch = {};
    const author = AUTHOR_SLUGS[post.authorSlug];
    if (author) patch.authorSlug = author;
    const reviewer = AUTHOR_SLUGS[post.reviewerSlug];
    if (reviewer) patch.reviewerSlug = reviewer;

    if (typeof post.contentRaw !== "string") {
      if (Object.keys(patch).length) {
        changedBylines += 1;
        if (!DRY) await client.patch(post._id).set(patch).commit();
        log(`${post.slug} -> byline slug`);
      }
      continue;
    }

    // Cheap pre-filter: skip the parse unless an old address is in there.
    const mightHaveLinks = Object.keys(MAP).some((old) =>
      post.contentRaw.includes(`"${old}`) || post.contentRaw.includes(`${ORIGIN}${old}`),
    );
    if (!mightHaveLinks) {
      if (Object.keys(patch).length) {
        changedBylines += 1;
        if (!DRY) await client.patch(post._id).set(patch).commit();
        log(`${post.slug} -> byline slug`);
      }
      continue;
    }

    let doc;
    try {
      doc = JSON.parse(post.contentRaw);
    } catch {
      log(`${post.slug} -> SKIPPED, contentRaw is not valid JSON`);
      continue;
    }

    const changes = [];
    rewrite(doc, changes);
    if (!changes.length && !Object.keys(patch).length) continue;
    if (Object.keys(patch).length) changedBylines += 1;

    for (const [from] of changes) {
      tally.set(from, (tally.get(from) ?? 0) + 1);
    }
    if (changes.length) {
      changedPosts += 1;
      changedLinks += changes.length;
      patch.contentRaw = JSON.stringify(doc);
    }

    if (!DRY) {
      await client.patch(post._id).set(patch).commit({ autoGenerateArrayKeys: false });
    }
    log(
      `${post.slug} -> ${changes.length} link${changes.length === 1 ? "" : "s"}` +
        (patch.authorSlug || patch.reviewerSlug ? " + byline slug" : ""),
    );
  }

  log("");
  for (const [from, n] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
    log(`  ${String(n).padStart(3)}x  ${from}  ->  ${MAP[from.replace(/\/$/, "")] ?? remap(from)}`);
  }
  log("");
  log(
    DRY
      ? `[dry-run] would change ${changedLinks} links across ${changedPosts} posts, ` +
        `and ${changedBylines} byline slugs.`
      : `${changedLinks} links corrected across ${changedPosts} posts, ` +
        `and ${changedBylines} byline slugs.`,
  );
}

main().catch((e) => {
  console.error("[fix-blog-links]", e);
  process.exit(1);
});
