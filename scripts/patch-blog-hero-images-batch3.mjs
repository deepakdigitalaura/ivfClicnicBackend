#!/usr/bin/env node
/**
 * patch-blog-hero-images-batch3.mjs
 *
 * Third batch — 79 new images. Batches 1 (19) + 2 (44) are excluded.
 * Skipped (no matching blog in CMS):
 *   - Can PCOS Be Cured.png
 *   - IVF Process Step by Step.png
 *   - Pregnancy Signs & Symptoms.png
 *
 * Run: node scripts/patch-blog-hero-images-batch3.mjs
 * Dry: node scripts/patch-blog-hero-images-batch3.mjs --dry-run
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir    = dirname(fileURLToPath(import.meta.url));
const MEDIA    = resolve(__dir, "../public/blog-media");
const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[blog-img3] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

const BLOG_IMAGES = [
  { file: "10 Foods to Improve Egg Quality.png",          id: 10  },  // "10 foods to improve female egg quality"
  { file: "12 Tips for Getting Pregnant with PCOS.png",   id: 263 },  // "12 tips for getting pregnant faster with PCOS"
  { file: "13 Best IVF Clinics in Mumbai.png",            id: 265 },  // "13 best IVF Clinics in Mumbai"
  { file: "Are IVF Babies Healthy.png",                   id: 272 },  // "Are IVF Babies Healthy as Naturally Conceived Babies?"
  { file: "Blighted Ovum.png",                            id: 34  },  // "Blighted Ovum Symptoms, Causes and More"
  { file: "Can IVF Work with Low AMH.png",                id: 42  },  // "Can IVF Work with Low AMH?"
  { file: "Can You Get Pregnant After Periods Stop.png",  id: 40  },  // "Can a woman get pregnant once her periods stop?"
  { file: "Conceiving Naturally with Low AMH.png",        id: 157 },  // "Natural conception with low AMH levels"
  { file: "Day 5 vs Day 3 Embryo Transfer.png",           id: 48  },  // "Choosing between a day 5 vs. day 3 embryo transfer"
  { file: "Debunking IVF Bed Rest Myth.png",              id: 273 },  // "Debunking the Bed Rest Myth in IVF"
  { file: "DFI Test for Male Infertility.png",            id: 202 },  // "The DFI test: A crucial diagnostic tool for male infertility"
  { file: "Do's & Don'ts After IUI.png",                  id: 204 },  // "The essential Do's and Don'ts after IUI treatment"
  { file: "Do's & Don'ts During IVF Stimulation.png",     id: 56  },  // "Do's and Don'ts during IVF stimulation"
  { file: "Embryo Transfer Procedure.png",                id: 66  },  // "Embryo transfer procedure for In Vitro Fertilization (IVF)"
  { file: "Endometrial Lining Thickness.png",             id: 68  },  // "Endometrial lining: Remedies for abnormal thickness"
  { file: "Endometriosis & IVF.png",                      id: 71  },  // "Endometriosis and IVF: What to Expect and How to Prepare?"
  { file: "Essential Tests for Male Infertility.png",     id: 75  },  // "Essential tests for male infertility: What to expect?"
  { file: "Explaining Periods to Men.png",                id: 12  },  // "A complete guide on explaining periods to men"
  { file: "FOGSI Training Program.png",                   id: 23  },  // "Bavishi Fertility Institute Hosts FOGSI-Recognized Training Program"
  { file: "Foods to Boost Sperm Count.png",               id: 9   },  // "10 foods that will increase sperm count and 5 foods to avoid"
  { file: "Frozen Embryo Transfer (FET).png",             id: 226 },  // "Understanding Frozen Embryo Transfer (FET) in IVF"
  { file: "Government vs Private IVF Centres.png",        id: 86  },  // "Government vs Private IVF centres in Ahmedabad"
  { file: "Gynecologist Visits After Delivery.png",       id: 104 },  // "How long should you see a gynecologist after delivery?"
  { file: "How Human Fertilization Works.png",            id: 98  },  // "How human fertilization works: Step-by-Step explanation"
  { file: "How Letrozole Works.png",                      id: 99  },  // "How Letrozole works: A comprehensive guide to boosting ovulation"
  { file: "How to Increase AMH Levels.png",               id: 90  },  // "How can I increase my AMH levels?"
  { file: "Hypospermia Signs & Treatment.png",            id: 227 },  // "Understanding hypospermia: Signs, Symptoms, and Treatment options"
  { file: "ICSI Do's and Don'ts.png",                     id: 121 },  // "ICSI: Do's and Don'ts"
  { file: "ICSI vs IVF Compared.png",                     id: 123 },  // "ICSI Vs. IVF: Success rates, benefits, and risks compared"
  { file: "Indian Celebrities & Egg Freezing.png",        id: 196 },  // "Stories from Indian Celebrities of Egg Freezing"
  { file: "Indian Celebrities & Fertility Yoga.png",      id: 129 },  // "Indian Celebrities Who Improved Fertility Through Yoga"
  { file: "Innovative Treatments for Low AMH.png",        id: 130 },  // "Innovative Treatments for Low AMH"
  { file: "Is IVF Painful.png",                           id: 135 },  // "Is IVF painful?"
  { file: "IVF Cost in Ahmedabad.png",                    id: 145 },  // "IVF cost in Ahmedabad: What's included & How to plan your budget?"
  { file: "IVF Cost Planning Ahmedabad.png",              id: 145 },  // same blog — more specific image overwrites above
  { file: "IVF for Single Women in India.png",            id: 147 },  // "IVF for Single Women in India: Navigating the New ART Law"
  { file: "IVF Journey with Egg Donors.png",              id: 14  },  // "A quick guide on the IVF journey with egg donors"
  { file: "IVF Success Rate.png",                         id: 231 },  // "Understanding reality behind IVF Success Rates"
  { file: "IVF Without Injections.png",                   id: 136 },  // "Is IVF possible without injections? Understanding easy IVF"
  { file: "Lifestyle Changes to Boost IVF.png",           id: 154 },  // "Lifestyle Changes to Boost IVF Success"
  { file: "Low AMH & Menstrual Irregularity.png",         id: 105 },  // "How Low AMH Affects Menstrual Cycle Regularity?"
  { file: "Microplastics & Reproductive Health.png",      id: 262 },  // "What are microplastics and how do they affect reproductive health?"
  { file: "Miracle of Implantation Signs.png",            id: 209 },  // "The miracle of implantation: Recognizing the signs"
  { file: "Miscarriages During IVF.png",                  id: 269 },  // "Miscarriages during IVF: Signs, Causes, Prevention and Hope"
  { file: "Necrozoospermia.png",                          id: 159 },  // "Necrozoospermia: Symptoms, Causes and Treatment options"
  { file: "Negative Signs After Embryo Transfer.png",     id: 229 },  // "Understanding negative signs after embryo transfer"
  { file: "Non-Stress Test (NST) in Pregnancy.png",       id: 244 },  // "What is the Non-Stress Test (NST) in pregnancy"
  { file: "Nourishing Body After Embryo Transfer.png",    id: 161 },  // "Nourishing your body after embryo transfer"
  { file: "Number of Eggs & IVF Success.png",             id: 97  },  // "How does the number of eggs affect IVF success rate?"
  { file: "Ovarian Hyperstimulation Syndrome.png",        id: 277 },  // "Ovarian Hyperstimulation Syndrome"
  { file: "PCOD vs PCOS Difference.png",                  id: 242 },  // "What is the difference between PCOD & PCOS?"
  { file: "PCOS & Infertility Link.png",                  id: 6   },  // "The link between PCOS and Infertility"
  { file: "PCOS and AMH Relationship.png",                id: 245 },  // "What is the relationship between PCOS and AMH level?"
  { file: "PGT Advantages & Disadvantages.png",           id: 16  },  // "Advantages and Disadvantages of PGT – Preimplantation Genetic Testing"
  { file: "PGT Boosts IVF Success.png",                   id: 111 },  // "How Pre-implantation Genetic Testing (PGT) Boosts IVF Success?"
  { file: "PGT vs TGT vs PRT Embryo Testing.png",         id: 173 },  // "PGT vs TGT vs PRT: Which embryo testing method is right for you?"
  { file: "Post-Embryo Transfer Timeline.png",            id: 174 },  // "Post-embryo transfer timeline: What happens after 3, 5, 7, and 9 days"
  { file: "Precautions After Embryo Transfer.png",        id: 74  },  // "Essential precautions to take after embryo transfer for IVF success"
  { file: "Pregnancy Test Timing After IUI.png",          id: 254 },  // "When to take a pregnancy test after IUI: Timing and Accuracy explained"
  { file: "Pregnant with Ovarian Cysts.png",              id: 45  },  // "Can you get pregnant with ovarian cysts?"
  { file: "Pregnant Without Removing Fibroids.png",       id: 78  },  // "Fibroids and IVF: Should you remove them before treatment?"
  { file: "Prepare for First IUI Cycle.png",              id: 117 },  // "How to prepare for your first IUI cycle: Tips and Advice"
  { file: "Prepare for First IVF Cycle.png",              id: 179 },  // "Preparing for Your First IVF Cycle: Tips and Advice"
  { file: "Pros & Cons of Donor Eggs.png",                id: 181 },  // "Pros and Cons of using donor eggs"
  { file: "PRP Ovarian Rejuvenation.png",                 id: 182 },  // "PRP ovarian rejuvenation: Boosting egg quality and Fertility"
  { file: "Reasons Behind Low AMH.png",                   id: 267 },  // "Reasons behind Low AMH Levels and ways to increase it"
  { file: "Reasons for IUI Failure.png",                  id: 186 },  // "Reasons for IUI failure – Symptoms and Causes"
  { file: "Sperm Cramps Explained.png",                   id: 232 },  // "Understanding Sperm Cramps: Symptoms, Causes, Diagnosis & Treatment"
  { file: "Sperm Cramps Symptoms & Treatment.png",        id: 232 },  // same blog — more specific image overwrites above
  { file: "Teratozoospermia.png",                         id: 200 },  // "Teratozoospermia: Uncovering the Causes, Symptoms, and Solutions"
  { file: "Top 10 Reasons for Egg Freezing.png",          id: 219 },  // "Top 10 Reasons to consider Egg Freezing" (specific image for this blog)
  { file: "Twins and IVF Myth.png",                       id: 275 },  // "Dispelling the Myth: Understanding Twins and IVF"
  { file: "Types of IVF Treatments.png",                  id: 13  },  // "A guide to the different types of IVF treatments"
  { file: "Ultrasound Every Pregnancy Visit.png",         id: 260 },  // "Do I need an ultrasound in every pregnancy visit? Is it safe?"
  { file: "Varicocele Without Surgery.png",               id: 44  },  // "Can varicocele be treated without surgery? Exploring your options"
  { file: "What Happens After Embryo Transfer Day by Day.png", id: 240 }, // "What happens after embryo transfer day by day"
  { file: "What is Epigenetics.png",                      id: 241 },  // "What is epigenetics? Does it affect IVF pregnancies only?"
  { file: "What to Eat During Pregnancy.png",             id: 246 },  // "What to eat during pregnancy: A week-by-week nutrition plan"
  { file: "Why Don't Embryos Stick.png",                  id: 258 },  // "Why don't embryos stick? Key reasons you need to know"
];

// Skipped — no matching blog found in CMS (279 blogs searched):
//   "Can PCOS Be Cured.png"
//   "IVF Process Step by Step.png"
//   "Pregnancy Signs & Symptoms.png"

function mimeType(filename) {
  if (filename.endsWith(".jfif")) return "image/jpeg";
  if (filename.endsWith(".png"))  return "image/png";
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

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

async function fetchBlogTitle(id, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}?depth=0&_fields=id,title`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${id}: ${res.status}`);
  return res.json();
}

async function uploadLocalImage(filename, auth) {
  const buffer      = readFileSync(resolve(MEDIA, filename));
  const mime        = mimeType(filename);
  const storageName = filename
    .replace(/\s*\(\d+\)/, "")
    .replace(/[—–]/g, "-")
    .replace(/[&+]/g, "and")
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\.]/g, "")
    .toLowerCase();

  const blob = new Blob([buffer], { type: mime });
  const form = new FormData();
  form.append("file", blob, storageName);
  form.append("_payload", JSON.stringify({ alt: filename.replace(/\.[^.]+$/, "") }));

  const res = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const data = await res.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  return id;
}

async function patchBlog(id, heroMediaId, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ heroImage: heroMediaId }),
  });
  if (!res.ok) throw new Error(`PATCH failed: ${await res.text()}`);
  return res.json();
}

async function run() {
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes");
  log(`Processing ${BLOG_IMAGES.length} new images (63 from batches 1+2 skipped)\n`);

  const auth = await login();
  log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < BLOG_IMAGES.length; i++) {
    const { file, id } = BLOG_IMAGES[i];
    log(`[${i + 1}/${BLOG_IMAGES.length}] "${file}" → Blog ID ${id}`);

    try {
      const blog = await fetchBlogTitle(id, auth);
      log(`  Blog: "${blog.title}"`);

      if (DRY_RUN) {
        log(`  [DRY] Would upload and set heroImage\n`);
        success++;
        continue;
      }

      const mediaId = await uploadLocalImage(file, auth);
      log(`  Uploaded → Media ID ${mediaId}`);
      await wait(400);

      await patchBlog(id, mediaId, auth);
      log(`  ✅ heroImage updated\n`);
      success++;
    } catch (err) {
      log(`  ✗ ERROR: ${err.message}\n`);
      errors++;
    }

    await wait(400);
  }

  log("─".repeat(60));
  log(`Done! ${success} updated, ${errors} errors${DRY_RUN ? " (DRY RUN)" : ""}`);
  log(`\nSkipped (no matching blog in CMS):`);
  log(`  - Can PCOS Be Cured.png`);
  log(`  - IVF Process Step by Step.png`);
  log(`  - Pregnancy Signs & Symptoms.png`);
}

run().catch(err => {
  console.error("[blog-img3] FATAL:", err.message);
  process.exit(1);
});
