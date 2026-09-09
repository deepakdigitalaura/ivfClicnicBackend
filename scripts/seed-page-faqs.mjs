#!/usr/bin/env node
/* =====================================================================
 * One-time seed: writes the pageFaqsConfig singleton into Sanity with the
 * exact FAQ content currently hardcoded in the 5 category hub pages, so the
 * site keeps rendering byte-identically while Sanity becomes the source of
 * truth going forward. Requires a WRITE-capable Sanity token in SANITY_API_TOKEN.
 * Run: node scripts/seed-page-faqs.mjs
 * ===================================================================== */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const pages = [
  {
    pageKey: "female-infertility",
    faqs: [
      { q: "What are the most common causes of female infertility?", a: "The most common causes include ovulation disorders (such as PCOS), blocked or damaged fallopian tubes, endometriosis, uterine fibroids, age-related decline in egg quality and quantity (diminished ovarian reserve), and hormonal imbalances. In about 10–15% of cases, no specific cause is identified (unexplained infertility)." },
      { q: "At what age does female fertility start to decline?", a: "Fertility begins to gradually decline from age 30 and more noticeably after 35. After 40, the decline accelerates significantly — both in the number and quality of eggs. However, with modern treatments like IVF, ICSI, and tailored protocols for low ovarian reserve, many women above 35 achieve successful pregnancies at Bavishi Fertility Institute." },
      { q: "What is AMH and why does it matter?", a: "AMH (Anti-Müllerian Hormone) is a blood test that estimates your ovarian reserve — the number of eggs remaining. A low AMH level suggests fewer eggs but does NOT mean you cannot conceive. It helps your doctor choose the right stimulation protocol. We offer a free AMH Level Interpreter tool on our website to help you understand your results." },
      { q: "Can PCOS be cured?", a: "PCOS is a lifelong hormonal condition that can be effectively managed but not cured. Treatment focuses on restoring regular ovulation through lifestyle changes, medications (like letrozole or clomiphene), and if needed, IVF. Many women with PCOS conceive successfully with the right treatment approach — it is one of the most treatable causes of infertility." },
      { q: "Do fibroids always affect fertility?", a: "Not always. The impact depends on the size, number, and location of the fibroids. Submucosal fibroids (inside the uterine cavity) are most likely to affect implantation and should usually be removed before fertility treatment. Intramural and subserosal fibroids may or may not require treatment depending on their size and position." },
      { q: "How is endometriosis diagnosed and treated for fertility?", a: "Endometriosis is definitively diagnosed via laparoscopy, though ultrasound can identify endometriomas (chocolate cysts). For fertility, treatment depends on severity — mild cases may respond to ovulation induction + IUI, while moderate-to-severe cases often benefit from laparoscopic excision followed by IVF. Our surgeons specialise in fertility-preserving endometriosis surgery." },
      { q: "When should I see a fertility specialist?", a: "If you're under 35 and haven't conceived after 12 months of regular unprotected intercourse, or under 6 months if you're over 35. See a specialist sooner if you have irregular or absent periods, known endometriosis, PCOS, a history of pelvic surgery, or recurrent miscarriages." },
    ],
  },
  {
    pageKey: "male-infertility",
    faqs: [
      { q: "What causes male infertility?", a: "Male infertility can result from low sperm production, abnormal sperm function, or blockages preventing sperm delivery. Contributing factors include varicocele, hormonal imbalances, infections, genetic conditions, lifestyle factors (smoking, excessive alcohol, obesity), and environmental exposures. In about 30% of cases, no identifiable cause is found (idiopathic infertility)." },
      { q: "How is male infertility diagnosed?", a: "Diagnosis typically starts with a thorough semen analysis (evaluating count, motility, and morphology per WHO 2021 standards), followed by a physical examination, hormone profile (FSH, LH, testosterone, prolactin), and if needed, scrotal ultrasound and genetic testing. Advanced tests like sperm DNA fragmentation may be recommended in specific cases." },
      { q: "Can male infertility be treated?", a: "Yes, in most cases. Treatment depends on the underlying cause — hormonal therapy for imbalances, antibiotics for infections, microsurgery for varicocele or blockages, and assisted reproductive techniques (IUI, IVF with ICSI) when natural conception isn't possible. Even men with zero sperm count (azoospermia) can father biological children through surgical sperm retrieval combined with ICSI." },
      { q: "What is the difference between TESA, PESA, and Micro-TESE?", a: "All three are surgical sperm retrieval procedures. PESA (percutaneous epididymal aspiration) uses a needle to aspirate sperm from the epididymis. TESA (testicular aspiration) retrieves tissue from the testis itself. Micro-TESE is a microsurgical approach that identifies sperm-producing areas under high magnification — it has the highest success rate for non-obstructive azoospermia." },
      { q: "Does lifestyle affect male fertility?", a: "Significantly. Smoking, excessive alcohol, recreational drugs, obesity, prolonged heat exposure (hot baths, tight clothing, laptops on lap), high stress, and poor sleep can all reduce sperm quality. Improving these factors often leads to measurable improvement in semen parameters within 3 months (one full sperm production cycle)." },
      { q: "How long does it take to see improvement after treatment?", a: "Sperm production (spermatogenesis) takes approximately 72–74 days, so most treatments — whether medical or lifestyle-based — need at least 3 months to show results on a repeat semen analysis. Surgical interventions like varicocele repair may take 3–6 months to show full improvement." },
    ],
  },
  {
    pageKey: "advanced-fertility-techniques",
    faqs: [
      { q: "What is the difference between IVF and IUI?", a: "IUI (Intrauterine Insemination) is a simpler procedure where prepared sperm is placed directly inside the uterus during ovulation. IVF (In Vitro Fertilisation) involves stimulating the ovaries, retrieving eggs, fertilising them in the lab, and transferring the resulting embryo(s) to the uterus. IUI is less invasive and less expensive but has a lower success rate per cycle. Your doctor will recommend the right option based on your diagnosis." },
      { q: "What is ICSI and when is it needed?", a: "ICSI (Intracytoplasmic Sperm Injection) involves injecting a single selected sperm directly into the egg under a microscope. It's recommended when sperm count or motility is low, after previous IVF fertilisation failure, when using surgically retrieved sperm, or when using frozen eggs. At Bavishi, ICSI is standard in most IVF cycles to maximise fertilisation rates." },
      { q: "What are PICSI, IMSI, and MACS?", a: "These are advanced sperm selection techniques used alongside ICSI. PICSI selects sperm based on their ability to bind to hyaluronan (mimicking natural selection). IMSI uses 6000× magnification to identify morphologically superior sperm. MACS uses magnetic sorting to separate healthy sperm from those with DNA damage. Your embryologist recommends the best technique based on your semen analysis." },
      { q: "How long does one IVF cycle take?", a: "A typical IVF cycle takes about 2–3 weeks from the start of ovarian stimulation to embryo transfer. This includes 8–14 days of daily hormone injections, 3–4 monitoring visits, egg retrieval (a 15-minute procedure under sedation), and embryo transfer 3–5 days later. Results from the pregnancy test come about 14 days after transfer." },
      { q: "What is the success rate of IVF?", a: "Success rates depend on several factors including age, diagnosis, egg quality, and the clinic's protocols. At Bavishi Fertility Institute, our cumulative success rates (across multiple cycles) are among the highest in India. Women under 35 with good ovarian reserve generally have the best outcomes. Your doctor will give you a realistic, personalised success estimate based on your specific situation." },
      { q: "What happens to unused embryos?", a: "Surplus good-quality embryos are frozen by vitrification (rapid freezing) and stored safely for future use. Our vitrification technique achieves near-100% survival rates. Frozen embryo transfers (FET) are often as successful as fresh transfers and give you the option to try again without repeating the stimulation and retrieval steps." },
      { q: "Is egg/embryo freezing safe?", a: "Yes. Vitrification is a well-established technique used worldwide. Eggs and embryos can be stored safely for years without degradation. Studies show no increased risk of birth defects or developmental problems in children born from frozen eggs or embryos compared to fresh cycles." },
    ],
  },
  {
    pageKey: "maternity-services",
    faqs: [
      { q: "What is painless delivery and is it safe?", a: "Painless delivery uses an epidural — a local anaesthetic administered through a thin catheter in the lower back — to numb pain during labour while keeping you fully awake and alert. It is one of the safest and most widely used pain relief methods in obstetrics worldwide. Our anaesthesia team has extensive experience with labour epidurals and monitors both mother and baby throughout." },
      { q: "Do you encourage normal delivery or C-section?", a: "We strongly encourage and support normal (vaginal) delivery whenever it's safe to do so. Our approach is to allow natural labour to progress with close monitoring, intervening only when medically necessary. Our normal delivery rates are well above the national average. However, when a C-section is genuinely needed for the safety of mother or baby, we perform it without hesitation." },
      { q: "What makes a pregnancy 'high-risk'?", a: "A pregnancy is considered high-risk when there are factors that increase the chance of complications for mother or baby. Common reasons include: advanced maternal age (over 35), IVF/ART conception, twin or multiple pregnancy, pre-existing conditions (diabetes, hypertension, thyroid disorders), previous C-section or complicated delivery, recurrent miscarriage, or pregnancy complications like pre-eclampsia or gestational diabetes." },
      { q: "How is twin pregnancy care different?", a: "Twin pregnancies need more frequent monitoring — typically fortnightly scans after 16 weeks, with additional growth scans and Doppler studies. There's a higher risk of preterm delivery, growth restriction, and preeclampsia. Our team creates an individualised monitoring plan, and we discuss delivery timing and method (vaginal vs. C-section) based on the type of twin pregnancy (identical vs. fraternal, shared placenta vs. separate)." },
      { q: "What fetal medicine services do you offer?", a: "Our fetal medicine unit provides advanced prenatal diagnosis and management: detailed anomaly scans, fetal echocardiography, first-trimester combined screening (NT scan + dual markers), non-invasive prenatal testing (NIPT), Doppler velocimetry for growth monitoring, and 3D/4D imaging. When an anomaly is detected, our team provides counselling and a management plan." },
      { q: "Can I deliver at Bavishi even if I didn't do IVF here?", a: "Absolutely. While many of our maternity patients are IVF-conceived pregnancies from our fertility programme, our maternity services are open to all women. Whether you conceived naturally or through treatment elsewhere, you'll receive the same high standard of obstetric care." },
      { q: "What should I look for in a maternity hospital?", a: "Key factors include: consultant-led deliveries (not just residents), 24/7 emergency obstetric and anaesthesia cover, an in-house neonatal ICU, high normal-delivery rates (indicating a non-interventionist philosophy), modern labour rooms with privacy, and a team experienced in high-risk pregnancies. Bavishi meets all of these criteria." },
    ],
  },
  {
    pageKey: "suraksha-kavach",
    faqs: [
      { q: "What is the Suraksha Kavach Package?", a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. Your investment covers multiple IVF cycles." },
      { q: "Who is eligible for Suraksha Kavach?", a: "Eligibility is determined after an initial consultation and medical evaluation by our senior fertility specialists. Factors such as age, medical history, ovarian reserve, and overall health are assessed. Our doctors will recommend whether Suraksha Kavach is the right fit for your situation." },
      { q: "How many IVF cycles are included?", a: "The Suraksha Kavach package covers multiple IVF/ICSI cycles as needed. The exact number depends on your personalised treatment plan. The program continues until a healthy live birth is achieved or all agreed-upon cycles are completed." },
      { q: "What happens if the treatment is not successful for me?", a: "If medical reasons prevent your treatment from succeeding, our team will discuss the best next steps and options available to you as part of your Suraksha Kavach enrolment." },
      { q: "What does the package include?", a: "The package is comprehensive: consultations, diagnostic investigations, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology and lab work, embryo transfer, and post-treatment support. There are no hidden charges." },
      { q: "What kind of results has Suraksha Kavach achieved?", a: "Suraksha Kavach patients at Bavishi Fertility Institute have achieved excellent outcomes. We are transparent about our results and can share detailed statistics during your consultation — success depends on individual factors such as age, diagnosis and medical history." },
      { q: "How do I enrol in Suraksha Kavach?", a: "Start by booking a consultation at any of our 14 centres across India. After your initial evaluation, if you are eligible, our team will walk you through the enrolment process, package details, and answer any questions you may have." },
    ],
  },
];

const run = async () => {
  await client.createOrReplace({ _id: "pageFaqsConfig", _type: "pageFaqsConfig", pages });
  console.log(`[seed-page-faqs] wrote pageFaqsConfig with ${pages.length} pages (${pages.reduce((n, p) => n + p.faqs.length, 0)} total FAQs)`);
};

run().catch((e) => {
  console.error("[seed-page-faqs] FAILED:", e.message);
  process.exit(1);
});
