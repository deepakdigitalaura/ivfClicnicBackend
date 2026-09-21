#!/usr/bin/env node
// One-time fix: set the SEO title/description on the 27 highest-traffic pages
// identified in the 21 Sep 2026 full-site audit (218 pages site-wide have a
// title over 60 chars; these 27 are the ones responsible for the largest
// share of real search impressions).
//
// Three Sanity document shapes are involved, so three separate patch paths:
//   - "blog"      -> flat seoMetaTitle / seoMetaDescription, matched by slug
//   - "treatment" / "service" -> nested seo.metaTitle / seo.metaDescription, matched by slug
//   - everything else (homepage, contact, doctor bio, location, doctors index)
//     -> "pageSeo" singleton-per-path, matched by pagePath, flat metaTitle/metaDescription
//        (created if it doesn't exist yet for that path)
//
// Usage: node scripts/fix-title-meta-priority-pages.mjs [--dry-run]
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env vars");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const blogs = [
  { slug: "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide", title: "Do's and Don'ts After IUI Treatment: Complete Guide", desc: "What to do — and avoid — after IUI, from activity restrictions to medication timing, explained by fertility specialists." },
  { slug: "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute", title: "Six Babies Born on Janmashtami at Bavishi Fertility", desc: "A heartwarming look at six babies born on Janmashtami at Bavishi Fertility Institute — a celebration of new life and hope." },
  { slug: "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained", title: "When to Take a Pregnancy Test After IUI", desc: "The right day to test after IUI for accurate results, and why testing too early can give a false negative." },
  { slug: "what-is-the-non-stress-test-nst-in-pregnancy-and-why-is-it-important", title: "What Is the Non-Stress Test (NST) in Pregnancy?", desc: "Why doctors recommend the NST in pregnancy, how it works, and what the results actually mean for you and your baby." },
  { slug: "fibroids-in-young-women-and-teenagers-early-symptoms-and-myths", title: "Fibroids in Young Women & Teenagers: Symptoms & Myths", desc: "Fibroids aren't just an older-age condition. Early symptoms, common myths, and when to see a doctor — explained simply." },
  { slug: "dos-and-donts-during-ivf-stimulation-a-comprehensive-guide", title: "Do's and Don'ts During IVF Stimulation: Full Guide", desc: "What to do — and avoid — during the IVF stimulation phase, from diet to activity, explained by fertility specialists." },
  { slug: "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle", title: "Max Number of Eggs Retrieved in an IVF Cycle", desc: "How many eggs is \"normal\" in one IVF cycle, what affects the number, and why more isn't always better." },
  { slug: "twin-pregnancy-delivery-options-normal-delivery-vs-c-section", title: "Twin Pregnancy: Normal Delivery vs C-Section", desc: "How doctors decide between normal delivery and C-section for twins, and what factors matter most for a safe birth." },
  { slug: "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester", title: "Pregnancy Diet Chart by Trimester: What to Eat", desc: "A trimester-by-trimester pregnancy diet chart — what to eat, what to avoid, and why it changes as your baby grows." },
  { slug: "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth", title: "How Long Does It Take to Heal After Giving Birth?", desc: "A realistic postpartum healing timeline — what to expect week by week, and when to call your doctor." },
  { slug: "fibroids-and-diet-foods-that-may-help-manage-symptoms-naturally", title: "Fibroids and Diet: Foods That May Help Manage Symptoms", desc: "Can diet really help manage fibroid symptoms? Foods that may help, and what the evidence actually says." },
  { slug: "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders", title: "High-Risk Pregnancy Due to Diabetes, BP & Thyroid", desc: "How diabetes, high blood pressure, and thyroid disorders affect pregnancy risk — and how they're managed safely." },
  // These two currently have NO seoMetaTitle/seoMetaDescription at all (found in the audit)
  { slug: "reasons-behind-low-amh-levels-ways-to-increase", title: "Low AMH Levels: Causes and Ways to Increase It", desc: "What causes low AMH levels, what it means for your fertility, and practical ways that may help improve it." },
  { slug: "step-by-step-process-of-embryo-freezing-in-an-ivf-cycle", title: "Embryo Freezing Process: Step-by-Step Guide", desc: "How embryo freezing works during an IVF cycle, from vitrification to storage — explained step by step." },
];

const treatments = [
  { slug: "sperm-donation", title: "Sperm Donation Treatment – Bavishi Fertility Institute", desc: "How donor sperm treatment works, who it's for, and what to expect — explained by our fertility specialists." },
  { slug: "azoospermia", title: "Azoospermia (Zero Sperm Count) Treatment", desc: "Zero sperm count doesn't always mean no biological children. Causes, diagnosis, and treatment options explained." },
  { slug: "asthenospermia", title: "Asthenospermia (Low Sperm Motility) Treatment", desc: "Low sperm motility explained — causes, diagnosis, and the ART treatments that can help you conceive." },
  { slug: "ivf", title: "IVF Treatment (In Vitro Fertilization) – Bavishi", desc: "IVF treatment explained — process, success rates, and what to expect at every step, from a team with 30+ years experience." },
];

// 3d-4d-sonography was removed from this list: its existing title
// ("3D/4D Sonography in Ahmedabad — Bavishi Fertility & Birthing", 60 chars)
// is already a good, keyword-rich, correctly-sized title -- found during the
// dry-run that this script would have overwritten it with a weaker generic
// one that drops the "in Ahmedabad" local-SEO keyword. Left alone.
const services = [];

const pageSeoEntries = [
  { pagePath: "/", pageName: "Homepage", title: "Bavishi Fertility Institute – Trusted IVF Experts, 30+ Yrs", desc: "India's trusted IVF experts since 1998 — 30,000+ successful pregnancies, 14 centres, personalised fertility care you can rely on." },
  { pagePath: "/contact", pageName: "Contact", title: "Contact Us – Book an IVF Consultation", desc: "Get in touch with Bavishi Fertility Institute — call, WhatsApp, or book a consultation at any of our 14 centres across India." },
  { pagePath: "/locations/vadodara", pageName: "Vadodara Location", title: "Best IVF Centre in Vadodara – Bavishi Fertility", desc: "IVF, ICSI & fertility treatment in Vadodara at Jetalpur Road — experienced specialists, advanced labs, personalised care." },
  { pagePath: "/locations/surat", pageName: "Surat Location", title: "Best IVF Centre in Surat – Bavishi Fertility", desc: "IVF & fertility treatment in Surat at Lal Darwaja — experienced doctors, modern labs, and personalised patient care." },
  { pagePath: "/locations/varanasi", pageName: "Varanasi Location", title: "Best IVF Centre in Varanasi – Bavishi Fertility", desc: "IVF & fertility treatment in Varanasi at Shivpur — experienced specialists and advanced fertility care close to home." },
  { pagePath: "/locations/mumbai/borivali", pageName: "Borivali (Mumbai) Location", title: "Best IVF Centre in Borivali, Mumbai – Bavishi", desc: "IVF & fertility treatment in Borivali, Mumbai — experienced specialists and personalised care close to home." },
  { pagePath: "/doctors/himanshu-bavishi", pageName: "Dr. Himanshu Bavishi", title: "Dr. Himanshu Bavishi – IVF & Genetics Specialist", desc: "Dr. Himanshu Bavishi, Owner & Director at Bavishi Fertility Institute — infertility, IVF, and genetics specialist since 1998." },
  { pagePath: "/doctors", pageName: "Doctors Listing", title: "Our Fertility Doctors – Bavishi Fertility Institute", desc: "Meet our team of fertility specialists across 14 centres — experienced in IVF, ICSI, and complex infertility cases." },
];

let changed = 0;

console.log(`\n=== Blogs (${blogs.length}) ===`);
for (const b of blogs) {
  const doc = await client.fetch(`*[_type == "blog" && slug == $slug][0]{_id, seoMetaTitle, seoMetaDescription}`, { slug: b.slug });
  if (!doc) {
    console.log(`  NOT FOUND: ${b.slug}`);
    continue;
  }
  console.log(`  ${b.slug}\n    title: "${doc.seoMetaTitle ?? "(empty)"}" -> "${b.title}"\n    desc:  "${(doc.seoMetaDescription ?? "(empty)").slice(0, 40)}..." -> "${b.desc.slice(0, 40)}..."`);
  if (!dryRun) {
    await client.patch(doc._id).set({ seoMetaTitle: b.title, seoMetaDescription: b.desc }).commit();
    changed++;
  }
}

console.log(`\n=== Treatments (${treatments.length}) ===`);
for (const t of treatments) {
  const doc = await client.fetch(`*[_type == "treatment" && slug == $slug][0]{_id, seo}`, { slug: t.slug });
  if (!doc) {
    console.log(`  NOT FOUND: ${t.slug}`);
    continue;
  }
  console.log(`  ${t.slug}\n    title: "${doc.seo?.metaTitle ?? "(empty)"}" -> "${t.title}"`);
  if (!dryRun) {
    await client.patch(doc._id).set({ "seo.metaTitle": t.title, "seo.metaDescription": t.desc }).commit();
    changed++;
  }
}

console.log(`\n=== Services (${services.length}) ===`);
for (const s of services) {
  const doc = await client.fetch(`*[_type == "service" && slug == $slug][0]{_id, seo}`, { slug: s.slug });
  if (!doc) {
    console.log(`  NOT FOUND: ${s.slug}`);
    continue;
  }
  console.log(`  ${s.slug}\n    title: "${doc.seo?.metaTitle ?? "(empty)"}" -> "${s.title}"`);
  if (!dryRun) {
    await client.patch(doc._id).set({ "seo.metaTitle": s.title, "seo.metaDescription": s.desc }).commit();
    changed++;
  }
}

console.log(`\n=== Page SEO overrides (${pageSeoEntries.length}) ===`);
for (const p of pageSeoEntries) {
  const doc = await client.fetch(`*[_type == "pageSeo" && pagePath == $pagePath][0]{_id, metaTitle}`, { pagePath: p.pagePath });
  console.log(`  ${p.pagePath}\n    title: "${doc?.metaTitle ?? "(no pageSeo doc yet)"}" -> "${p.title}"`);
  if (!dryRun) {
    if (doc) {
      await client.patch(doc._id).set({ metaTitle: p.title, metaDescription: p.desc }).commit();
    } else {
      await client.create({
        _type: "pageSeo",
        pagePath: p.pagePath,
        pageName: p.pageName,
        metaTitle: p.title,
        metaDescription: p.desc,
      });
    }
    changed++;
  }
}

console.log(dryRun ? `\n[dry-run] No writes performed. ${blogs.length + treatments.length + services.length + pageSeoEntries.length} pages would be updated.` : `\nDone. Updated ${changed} pages.`);
