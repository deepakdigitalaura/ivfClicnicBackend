/* =====================================================================
 * Create the six October 2026 blog posts approved on the staging site.
 *
 * Content was written and signed off at bfi-blog.vercel.app, including the
 * client's September feedback round. It is reproduced here verbatim in the
 * Lexical shape the live site stores, so nothing has to be retyped in the
 * admin panel.
 *
 * Hero images ship with this PR at public/blog-media/oct-2026/<slug>.webp,
 * re-encoded from the supplied 1.8 MB PNGs to roughly 110 KB each.
 *
 * Idempotent: createOrReplace on a deterministic _id, so a second run updates
 * rather than duplicating.
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \\
 *     scripts/create-blogs-october-2026.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";

const DRY = process.argv.includes("--dry-run");

/* Built on first use rather than at import, so --dry-run can verify the
 * content without any credentials present. */
let _client: ReturnType<typeof createClient> | null = null;
const sanity = () =>
  (_client ??= createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
  }));

const DOCS = [
  {
    "_id": "blog-recurrent-implantation-failure-what-to-do-next",
    "_type": "blog",
    "slug": "recurrent-implantation-failure-what-to-do-next",
    "title": "Recurrent Implantation Failure: What It Means and What to Do Next",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "ivf",
    "categoryTitle": "IVF",
    "readMins": 9,
    "excerpt": "Good embryos, a good lining, and still a negative test. Here's what's actually being investigated after repeated failed transfers — and what should change before you try again.",
    "heroImageUrl": "/blog-media/oct-2026/recurrent-implantation-failure-what-to-do-next.webp",
    "heroImageAlt": "Recurrent implantation failure — what it means and what to do next, Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "ivf-failure",
      "ivf",
      "pgt"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "How many failed transfers before it's called recurrent implantation failure?",
        "answer": "There's no single agreed definition, which surprises most patients. The most commonly used working definition is three or more failed transfers of good-quality embryos in a woman under 40, or two or more where the embryos were genetically tested. What matters more than the exact number is that after two failed transfers of good embryos, it's reasonable to stop and investigate rather than simply repeat the same cycle again."
      },
      {
        "question": "Does a failed transfer mean the embryo was abnormal?",
        "answer": "Often, yes — chromosomal abnormality is the single most common reason a good-looking embryo doesn't implant, and it becomes more likely with age. That's exactly why genetic testing of embryos is one of the first things considered after repeated failure: it separates 'the embryo was never going to work' from 'something about the uterus or timing needs fixing'."
      },
      {
        "question": "Is recurrent implantation failure the same as recurrent miscarriage?",
        "answer": "No. In implantation failure the pregnancy test never turns positive — the embryo doesn't attach at all. In recurrent miscarriage the embryo does implant and the pregnancy is lost afterwards. The investigations overlap but they aren't the same problem, and they aren't managed identically."
      },
      {
        "question": "Should I change clinics after repeated failures?",
        "answer": "Not automatically, but you should expect a change in approach. Repeating an identical cycle after two or three failures without new investigation is the real warning sign — not the clinic's name. Ask what specifically will be different next time. If the answer is 'nothing, let's just try again', that's worth questioning wherever you are."
      }
    ],
    "seoMetaTitle": "Recurrent Implantation Failure: What It Means and What to Do Next",
    "seoMetaDescription": "Good embryos, good lining, and still no pregnancy. What recurrent implantation failure actually means, the tests worth doing, and the treatment changes that…",
    "seoOgTitle": "Recurrent Implantation Failure: What It Means and What to Do Next",
    "seoOgDescription": "Good embryos, good lining, and still no pregnancy. What recurrent implantation failure actually means, the tests worth doing, and the treatment changes that…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "2–3",
                  "label": "Failed transfers before investigating further",
                  "id": "aef53a2774de"
                },
                {
                  "value": "Embryo",
                  "label": "Most common single cause, especially over 35",
                  "id": "5a9faa448f7b"
                },
                {
                  "value": "Both",
                  "label": "Embryo and uterus are assessed, not just one",
                  "id": "acb5ab030ebd"
                },
                {
                  "value": "Change",
                  "label": "The next cycle should differ from the last",
                  "id": "614b0f65d517"
                }
              ],
              "id": "015d162cad13",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Recurrent implantation failure (RIF) isn’t a diagnosis in itself — it’s a signal to stop repeating and start investigating.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "When good-quality embryos are transferred two or three times without a positive test, the cause usually sits in one of three places: the embryo’s chromosomes, the uterus and its lining, or maternal health or immune conditions. The single most important thing that should happen after repeated failure is that",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "something changes",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "— a test, a protocol, a technique. Simply running the same cycle again and hoping for a different result is the pattern worth questioning.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What Actually Counts as RIF",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "There is no universally agreed definition, which is genuinely confusing for patients who look it up. The most widely used working definition is three or more failed transfers of good-quality embryos in a woman under 40 — or two or more failures where the embryos had already been genetically tested and found normal. The second situation is more important, because it rules out the genetic reasons — but embryo quality and embryo genetics are not the same. Even if embryos are genetically normal, their quality as observed under the microscope is equally important.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "In practice, most careful clinics don’t wait for a formal label. After two failed transfers of good embryos, a proper review is reasonable — not because something is certainly wrong, but because the cost of investigating is far lower than the cost of another blind cycle.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Why Implantation Fails",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Three Places the Problem Usually Sits",
              "intro": "Almost every case traces back to one of these, or a combination",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "The embryo",
                  "recommendation": "Chromosomal abnormality is the single most common cause. An embryo can look perfect under the microscope and still carry the wrong number of chromosomes.",
                  "id": "ace21b891a1a"
                },
                {
                  "icon": "Sparkles",
                  "situation": "The uterus",
                  "recommendation": "Polyps, fibroids distorting the cavity, adhesions, a thin lining, or hydrosalpinx. Several of these are correctable once they are actually found.",
                  "id": "0c70fbdba594"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Maternal contributors",
                  "recommendation": "The health of the woman is crucial. Metabolic issues, chronic inflammation, a hyperactive immune system or blood clotting disorders can all reduce the chance of an embryo implanting.",
                  "id": "83492e4caab5"
                },
                {
                  "icon": "Sparkles",
                  "situation": "The quiet contributors",
                  "recommendation": "Thyroid, blood sugar and sperm DNA fragmentation. Cheap to measure, often skipped, and each can affect implantation on its own.",
                  "id": "4a3e15a4ca1b"
                }
              ],
              "id": "0f7470f3f3db",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Embryo Side",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the biggest single factor, and the one most often underestimated. An embryo can look perfect under the microscope and still carry the wrong number of chromosomes — grading assesses appearance and growth rate, not genetics. The proportion of chromosomally abnormal embryos rises steadily with the age of the egg, which is why two women with identical-looking embryos can have very different outcomes.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "Preimplantation genetic testing (PGT-A)",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/pgt",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "432c2bf6173b"
              },
              {
                "mode": "normal",
                "text": "is what separates this cause from the rest.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Uterine Side",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The second group of causes sits in the uterus itself: fibroids distorting the cavity, polyps, intrauterine adhesions, a thin or poorly responsive lining, or",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "hydrosalpinx",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/blocked-fallopian-tubes-diagnosis-treatment",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "bbc7414a2dc6"
              },
              {
                "mode": "normal",
                "text": "— fluid in a blocked tube that can leak back into the cavity and reduce implantation. Several of these are correctable, which is exactly why looking is worthwhile. A hysteroscopy, which inspects the cavity directly, finds problems that an ultrasound alone can miss.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Other Contributing Factors",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Beyond the embryo and the cavity, three things are consistently worth checking: thyroid function, blood sugar and insulin resistance, and",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "sperm DNA fragmentation",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "2cefd096cb7a"
              },
              {
                "mode": "normal",
                "text": "in the male partner. None of these is exotic, all are measurable, and each can quietly affect implantation while every other test looks normal.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "Where the Problem Usually Sits",
              "columns": [
                {
                  "header": "Embryo-Side Picture",
                  "id": "ed0b691c8aa0"
                },
                {
                  "header": "Uterine-Side Picture",
                  "id": "03212b8f7c72"
                }
              ],
              "rows": [
                {
                  "rowLabel": "Typical clue",
                  "cells": [
                    {
                      "value": "Older eggs, untested embryos",
                      "id": "4dc213d4be8d"
                    },
                    {
                      "value": "Good embryos, often PGT-normal",
                      "id": "6d85af0fd4ce"
                    }
                  ],
                  "id": "7bb8b6eb9468"
                },
                {
                  "rowLabel": "First test",
                  "cells": [
                    {
                      "value": "PGT-A on the next cohort",
                      "id": "55869822760c"
                    },
                    {
                      "value": "Hysteroscopy + saline scan",
                      "id": "e5e300730926"
                    }
                  ],
                  "id": "80baeb9012ac"
                },
                {
                  "rowLabel": "What often changes",
                  "cells": [
                    {
                      "value": "Embryo selection, lab technique",
                      "id": "8fc6079bc8d5"
                    },
                    {
                      "value": "Cavity correction, lining prep",
                      "id": "6d1a9a07e058"
                    }
                  ],
                  "id": "a34d869be351"
                },
                {
                  "rowLabel": "Male partner check",
                  "cells": [
                    {
                      "value": "DNA fragmentation (DFI)",
                      "id": "d253fc0c58bb"
                    },
                    {
                      "value": "Usually already done",
                      "id": "e96b2a964e28"
                    }
                  ],
                  "id": "7cb614e97c66"
                }
              ],
              "id": "c7cffa35ddf3",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Tests Worth Doing",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "After repeated failure, a focused work-up usually covers the uterine cavity, the lining, the embryos, and a small number of systemic factors. The aim is not to run every test that exists — it is to rule in or out the causes that would actually change the next cycle.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "How a Review Works at BFI",
              "intro": "Structured, not scattershot",
              "note": "The output of this review should be a written plan of what will be different next cycle — not a repeat of the same protocol.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Look at the cavity",
                  "recommendation": "Hysteroscopy and a saline ultrasound to find polyps, adhesions, septa, or fibroids distorting the cavity — problems that are correctable once seen.",
                  "id": "ae8d206deaf7"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Re-examine the embryos",
                  "recommendation": "Review grading, culture conditions, and whether genetic testing of the next cohort would meaningfully change selection.",
                  "id": "85822bb88ff5"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Check the supporting factors",
                  "recommendation": "Thyroid, blood sugar, vitamin D, and sperm DNA fragmentation — quiet contributors that are cheap to test and often fixable.",
                  "id": "f76d63554296"
                }
              ],
              "id": "53d540ed854b",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What Changes in the Next Cycle",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Depending on what the work-up finds, the next attempt might involve genetic testing of embryos, a corrected uterine cavity, a different lining preparation (a natural-cycle frozen transfer instead of a medicated one, or vice versa), a change in sperm selection technique such as",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "PICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/picsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "b9edc403e00c"
              },
              {
                "mode": "normal",
                "text": "or",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "IMSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/imsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "4d511d355d66"
              },
              {
                "mode": "normal",
                "text": "where DNA fragmentation is high, or adjusted transfer timing. The specifics matter less than the principle: the plan is now built around a finding, not around hope.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "IMPLANTATION FAILURE REVIEW AT BFI",
              "tagline": "A structured second look",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Couples who have had two or more transfers of good-quality embryos without a positive test, particularly where the same protocol has simply been repeated each time.",
              "facts": [
                {
                  "label": "Cavity Check",
                  "value": "Hysteroscopy",
                  "id": "24a9595733f7"
                },
                {
                  "label": "Embryo Assessment",
                  "value": "PGT-A where indicated",
                  "id": "b4f6ee4e2e3b"
                },
                {
                  "label": "Male Factor",
                  "value": "DFI included",
                  "id": "da51436c3d47"
                },
                {
                  "label": "Output",
                  "value": "Written change plan",
                  "id": "5c007e364168"
                }
              ],
              "id": "0059c1954ffc",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Treatments That Sound Good but Don’t Help",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the part patients are rarely told plainly. After repeated failure, people are often offered add-ons with confident marketing and thin evidence — immune therapies such as lymphocyte immune therapy without a clear immunological diagnosis, routine endometrial scratching, or blanket prescriptions of blood thinners such as heparin injections without a clotting problem. Some of these have a role in specific, carefully selected cases. Used routinely, they mostly add cost and side effects without improving the odds.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Ask for a written summary of what will be different in the next cycle.",
                  "id": "403beceef5aa"
                },
                {
                  "text": "Push for a look inside the cavity if it hasn't been done — hysteroscopy finds what scans miss.",
                  "id": "f953568cf9fe"
                },
                {
                  "text": "Have the male partner's DNA fragmentation checked, not just a standard semen analysis.",
                  "id": "acc0e001f182"
                },
                {
                  "text": "Give yourself a cycle's gap if you need it emotionally — it doesn't reduce your chances.",
                  "id": "01e4a2e6e3ff"
                }
              ],
              "cons": [
                {
                  "text": "Repeating an identical protocol a third time without any new information.",
                  "id": "0505e7a7d0e7"
                },
                {
                  "text": "Paying for immune add-ons without a specific diagnosis that justifies them.",
                  "id": "9113bff31d25"
                },
                {
                  "text": "Assuming a failed transfer means your embryos or your body have 'failed' — most often it's chromosomal chance.",
                  "id": "c734d5875800"
                },
                {
                  "text": "Changing three things at once, so you never learn which one mattered.",
                  "id": "b5560b114903"
                }
              ],
              "id": "386b8d1a7112",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Repeated failure is a reason to investigate, never a reason to be told to simply keep trying.",
                  "id": "93491a07ad49"
                },
                {
                  "icon": "Sparkles",
                  "text": "We tell you plainly which add-ons have evidence behind them and which don't, even when that means recommending less.",
                  "id": "bcc04c7ef7d3"
                },
                {
                  "icon": "Sparkles",
                  "text": "Both partners are reviewed — male-factor contributors to implantation failure are easy to miss if nobody looks.",
                  "id": "6808c0687213"
                },
                {
                  "icon": "Sparkles",
                  "text": "You leave the review with a specific written plan for the next cycle, not a vague reassurance.",
                  "id": "e3e438544848"
                }
              ],
              "id": "94acb6861bc4",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "After two or more failed transfers, we stop and run a structured review before planning anything else — cavity, embryos, lining, and the supporting factors on both sides. Where an",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "IVF failure evaluation",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/ivf-failure",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "1750f1947e37"
              },
              {
                "mode": "normal",
                "text": "finds something correctable, we correct it first. Where it finds nothing, we say so honestly and explain what that means for the odds, rather than filling the gap with unproven add-ons.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Had two or more transfers that didn't work?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "There is no agreed number of failures that defines RIF, but after two failed transfers of good embryos, investigating beats repeating.",
                  "id": "d67d0bdb3dcd"
                },
                {
                  "icon": "Sparkles",
                  "text": "Chromosomal abnormality in the embryo is the commonest single cause, and genetic testing is what separates it from a uterine problem.",
                  "id": "962bf01c0591"
                },
                {
                  "icon": "Sparkles",
                  "text": "A hysteroscopy finds cavity problems that ultrasound alone misses, and many of those are fixable.",
                  "id": "08397e3af20c"
                },
                {
                  "icon": "Sparkles",
                  "text": "Both partners matter: thyroid, blood sugar and sperm DNA fragmentation are cheap to test and genuinely relevant.",
                  "id": "49604e61e8af"
                },
                {
                  "icon": "Sparkles",
                  "text": "Be cautious with immune add-ons and routine scratching. They have a narrow role and are often sold far beyond it.",
                  "id": "0bb4c3a558cd"
                },
                {
                  "icon": "Sparkles",
                  "text": "The one thing that should never happen after repeated failure is an identical cycle with nothing changed.",
                  "id": "6ee23264b6ec"
                }
              ],
              "id": "3871a0ae782a",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Had two or more transfers that didn't work?",
              "subtext": "Book a consultation for a structured implantation failure review — cavity, embryos, and both partners.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "779946c66404"
                },
                {
                  "label": "IVF Failure Evaluation",
                  "url": "https://ivfclinic.com/treatments/ivf-failure",
                  "variant": "secondary",
                  "id": "927062fbdc05"
                }
              ],
              "id": "ce9778a39530",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  },
  {
    "_id": "blog-picsi-imsi-macs-spindle-view-icsi-compared",
    "_type": "blog",
    "slug": "picsi-imsi-macs-spindle-view-icsi-compared",
    "title": "PICSI, IMSI, MACS & Spindle View ICSI: Which Technique, and When",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "ivf",
    "categoryTitle": "IVF",
    "readMins": 9,
    "excerpt": "Four advanced selection techniques that sit alongside ICSI. What each one actually does, who genuinely benefits — and when adding it changes nothing but the bill.",
    "heroImageUrl": "/blog-media/oct-2026/picsi-imsi-macs-spindle-view-icsi-compared.webp",
    "heroImageAlt": "PICSI, IMSI, MACS and Spindle View ICSI compared — Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "picsi",
      "imsi",
      "macs",
      "icsi"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "Do I need any of these techniques, or is standard ICSI enough?",
        "answer": "For most couples, standard ICSI is enough. These four techniques exist for specific situations — high sperm DNA fragmentation, repeated fertilisation failure, severe morphology problems, or previous cycles where embryo development was unexpectedly poor. If none of those apply to you, adding them is unlikely to change your outcome."
      },
      {
        "question": "What's the difference between PICSI and IMSI in simple terms?",
        "answer": "IMSI is about looking: the embryologist views sperm at very high magnification to spot structural defects invisible at normal magnification. PICSI is about behaviour: sperm are offered a hyaluronan surface, and only the mature ones bind to it. One selects on appearance, the other on a functional test of maturity."
      },
      {
        "question": "Does MACS improve IVF success rates?",
        "answer": "The evidence is mixed and honest clinics say so. MACS removes sperm showing early signs of cell death, and the strongest rationale is in men with high DNA fragmentation. It is not a routine add-on that lifts success rates for everyone, and it shouldn't be sold as one."
      },
      {
        "question": "Are these techniques safe for the baby?",
        "answer": "These are laboratory selection steps applied to sperm or used to visualise the egg before injection — they don't alter the sperm or egg genetically. Where safety data exists, it has been reassuring, though it's fair to say long-term follow-up data is stronger for ICSI itself than for each individual add-on."
      }
    ],
    "seoMetaTitle": "PICSI, IMSI, MACS & Spindle View ICSI: Which Technique, and When",
    "seoMetaDescription": "Four advanced sperm and egg selection techniques used alongside ICSI — what each one actually does, the specific situations it helps in, and when it adds…",
    "seoOgTitle": "PICSI, IMSI, MACS & Spindle View ICSI: Which Technique, and When",
    "seoOgDescription": "Four advanced sperm and egg selection techniques used alongside ICSI — what each one actually does, the specific situations it helps in, and when it adds…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "4",
                  "label": "Selection techniques, four different problems",
                  "id": "300907b29c95"
                },
                {
                  "value": "6000×",
                  "label": "IMSI magnification vs. ~400× for standard ICSI",
                  "id": "6caa3c47e219"
                },
                {
                  "value": "DFI",
                  "label": "The test that usually decides PICSI or MACS",
                  "id": "2e79905b93ee"
                },
                {
                  "value": "Not all",
                  "label": "None of these is needed by every patient",
                  "id": "343d2b890810"
                }
              ],
              "id": "086c75850980",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "These are four different tools for four different problems — not a ladder where more expensive means better.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "In standard",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/icsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "238a8ff9abf2"
              },
              {
                "mode": "normal",
                "text": ", an embryologist picks a single sperm by eye at around 400× magnification and injects it into the egg. Each of these techniques changes one specific part of that decision: IMSI changes how closely the sperm is",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "seen",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": ", PICSI and MACS change how it is",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "selected",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": ", and Spindle View changes what is known about the",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "egg",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "before injection. Which one helps depends entirely on what your tests have already shown.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Why Selection Matters at All",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "In natural conception, millions of sperm compete and the journey itself filters out many of the damaged ones. ICSI removes that filter completely — one sperm is chosen by a human being and placed directly inside the egg. That is exactly why ICSI works for severe male-factor infertility, and also why the quality of that single choice matters more than in any other setting. Standard selection is based on how a sperm looks and moves, which tells you a lot but not everything — notably, it cannot show DNA damage inside the sperm head.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Four Techniques",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "At a Glance",
              "intro": "One line on what each technique actually changes",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "PICSI",
                  "recommendation": "Sperm are offered a hyaluronan surface and only the mature ones bind to it. Selection by behaviour rather than appearance.",
                  "id": "f2f66e25c734"
                },
                {
                  "icon": "Sparkles",
                  "situation": "IMSI",
                  "recommendation": "Sperm viewed at around 6000x instead of 400x, revealing structural defects that are invisible at standard magnification.",
                  "id": "492c2f070b2d"
                },
                {
                  "icon": "Sparkles",
                  "situation": "MACS",
                  "recommendation": "The whole sample is filtered first. Sperm showing early markers of cell death are magnetically removed before selection begins.",
                  "id": "89bb8a9c7f1e"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Spindle View ICSI",
                  "recommendation": "Looks at the egg rather than the sperm, making the meiotic spindle visible so the injection can avoid it.",
                  "id": "bce7888a0f78"
                }
              ],
              "id": "b1f1ad7970ef",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "PICSI — Physiological ICSI",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "PICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/picsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "a0e4b0aab413"
              },
              {
                "mode": "normal",
                "text": "uses a simple biological test instead of a visual one. Sperm are placed on a dish coated with hyaluronan, the same substance that surrounds the egg naturally. Mature sperm with intact membranes bind to it; immature ones with more DNA damage generally don’t. The embryologist then picks from the sperm that bound. It is, in effect, letting the sperm sit an exam that nature would otherwise set.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Most relevant when:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "DNA fragmentation is raised, or previous cycles produced poor embryo development despite a normal-looking semen analysis.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "IMSI — High-Magnification Sperm Selection",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "IMSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/imsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "a60c267e2458"
              },
              {
                "mode": "normal",
                "text": "magnifies the sperm up to around 6000×, compared with roughly 400× in standard ICSI. At that magnification the embryologist can see small structural defects inside the sperm head — particularly vacuoles — that are entirely invisible at normal ICSI magnification. The selection is still visual, but it is a far more detailed view.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Most relevant when:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "severe teratozoospermia (very poor morphology), or repeated failure where sperm structure is the leading suspect.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "MACS — Magnetic-Activated Cell Sorting",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "MACS",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/macs",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "aba8e67c9602"
              },
              {
                "mode": "normal",
                "text": "works differently again: rather than choosing one sperm, it cleans up the whole sample first. Magnetic beads bind to sperm showing early markers of apoptosis (programmed cell death), and those are pulled out before selection begins. The embryologist then chooses from a healthier pool.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Most relevant when:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "high DNA fragmentation, particularly alongside repeated pregnancy loss. The evidence here is genuinely mixed, and any clinic offering it should tell you that.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Spindle View ICSI (Polscope)",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "Spindle View ICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/spindle-view-icsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "d8bba360736b"
              },
              {
                "mode": "normal",
                "text": "is the odd one out — it examines the",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "egg",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": ", not the sperm. A polarised light microscope makes the egg’s meiotic spindle visible without damaging it. The spindle is the structure that organises the chromosomes, and knowing exactly where it sits lets the embryologist inject away from it, reducing the risk of disturbing it. It also gives information about egg maturity that normal microscopy cannot.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Most relevant when:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "previous fertilisation failure, poor egg quality, or a low number of eggs where every single one matters.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Side by Side",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "Four Techniques, Four Questions",
              "columns": [
                {
                  "header": "What it examines",
                  "id": "8a24ab67afad"
                },
                {
                  "header": "Typical reason to use it",
                  "id": "4192ee71cba0"
                }
              ],
              "rows": [
                {
                  "rowLabel": "PICSI",
                  "cells": [
                    {
                      "value": "Sperm maturity, by binding test",
                      "id": "b9689a9ab03c"
                    },
                    {
                      "value": "Raised DNA fragmentation",
                      "id": "f07c29ed6dd2"
                    }
                  ],
                  "id": "fbd4091c0d1c"
                },
                {
                  "rowLabel": "IMSI",
                  "cells": [
                    {
                      "value": "Sperm structure, at ~6000×",
                      "id": "b903f8b2a367"
                    },
                    {
                      "value": "Severe morphology problems",
                      "id": "3c051093808a"
                    }
                  ],
                  "id": "93f66b5b9360"
                },
                {
                  "rowLabel": "MACS",
                  "cells": [
                    {
                      "value": "The whole sample, pre-filtered",
                      "id": "13850a032da8"
                    },
                    {
                      "value": "High DFI, recurrent loss",
                      "id": "37aaa5bd7872"
                    }
                  ],
                  "id": "284ac2c165d6"
                },
                {
                  "rowLabel": "Spindle View",
                  "cells": [
                    {
                      "value": "The egg's spindle and maturity",
                      "id": "7a9959c4b85a"
                    },
                    {
                      "value": "Fertilisation failure, few eggs",
                      "id": "71785fca95dd"
                    }
                  ],
                  "id": "06d6d12c57e0"
                }
              ],
              "id": "4a3ad99b4e80",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Who Actually Needs Which",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The honest starting point is that the majority of ICSI cycles do not need any of these. They earn their place when a specific test result or a specific previous outcome points to them — which is why the decision usually comes after a",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "DNA fragmentation test",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "6aa50594c13b"
              },
              {
                "mode": "normal",
                "text": "or a detailed review of an earlier cycle, not before.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Choosing a Technique at BFI",
              "intro": "Test first, then decide — never the other way round",
              "note": "If a clinic recommends an advanced technique before any test justifies it, it's entirely reasonable to ask which specific result led to that recommendation.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Full male work-up",
                  "recommendation": "Semen analysis plus DNA fragmentation where indicated, so the decision rests on numbers rather than assumptions.",
                  "id": "ca8c5a3d3302"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Review any previous cycle",
                  "recommendation": "Fertilisation rate, embryo development and any earlier failures usually point to which part of the process needs help.",
                  "id": "c6b5ccaec742"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Match technique to finding",
                  "recommendation": "The technique follows the finding — and if nothing points to one, we say plainly that standard ICSI is the right choice.",
                  "id": "9ad2a396eec1"
                }
              ],
              "id": "ffb310d0f42d",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "ADVANCED ICSI AT BFI",
              "tagline": "All four available — used selectively",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Couples with raised sperm DNA fragmentation, severe morphology problems, previous fertilisation failure, or repeated poor embryo development — where a targeted change in selection is justified by a specific finding.",
              "facts": [
                {
                  "label": "PICSI",
                  "value": "Available",
                  "id": "23c580fec604"
                },
                {
                  "label": "IMSI",
                  "value": "Available",
                  "id": "3e94943620fe"
                },
                {
                  "label": "MACS",
                  "value": "Available",
                  "id": "093b9fdb8739"
                },
                {
                  "label": "Spindle View",
                  "value": "Available",
                  "id": "f2aa6d19e05d"
                }
              ],
              "id": "8a7b92d46fa2",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Honest Limits",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Every one of these techniques improves",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "selection",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": ". None of them repairs a sperm or an egg. If the underlying problem is severe DNA damage across the whole sample, choosing more carefully from a damaged pool has limits — which is why lifestyle changes, treating a varicocele, or using surgically retrieved sperm sometimes matter more than any lab technique. It is also why three months of genuine improvement work before a cycle can occasionally do more than any add-on during it.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Ask which specific test result or previous outcome led to the recommendation.",
                  "id": "0707ab9153bd"
                },
                {
                  "text": "Get your DNA fragmentation (DFI) tested before deciding on PICSI vs routine ICSI — it's the number that usually decides.",
                  "id": "ac9f8e636f2a"
                },
                {
                  "text": "Ask what the technique is expected to change: fertilisation rate, embryo quality, or miscarriage risk.",
                  "id": "0d7d04559af8"
                }
              ],
              "cons": [
                {
                  "text": "Assuming more techniques stacked together means a better cycle.",
                  "id": "3e98c9d4e816"
                },
                {
                  "text": "Paying for an advanced technique that no test result points towards.",
                  "id": "af3d204f6880"
                },
                {
                  "text": "Expecting selection to fix a sample where the whole pool is damaged.",
                  "id": "eb94e97ded8f"
                },
                {
                  "text": "Comparing your protocol to someone else's — the right technique is specific to your results.",
                  "id": "10996808d959"
                }
              ],
              "id": "1364e3e3cad1",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "We have all four techniques in our labs, which means we can recommend none of them when none is indicated.",
                  "id": "9708b2294507"
                },
                {
                  "icon": "Sparkles",
                  "text": "Where the evidence for a technique is mixed — as it genuinely is for MACS — we tell you that rather than overselling it.",
                  "id": "12f69aa2c385"
                },
                {
                  "icon": "Sparkles",
                  "text": "Every recommendation traces back to a specific number in your file, not to a package tier.",
                  "id": "2365b1cdd3c2"
                },
                {
                  "icon": "Sparkles",
                  "text": "Our Class 1000 labs and in-house andrology support mean male-factor cases are handled fully, not referred out mid-cycle.",
                  "id": "a2d6ecee63ab"
                }
              ],
              "id": "189e2b2fb993",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "We offer all four techniques, and we use them selectively. A male fertility work-up — including",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "DNA fragmentation testing",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "0aff901ce332"
              },
              {
                "mode": "normal",
                "text": "where it’s indicated — comes first, and the selection technique follows from what it shows. If your results point to standard",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/icsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "1e2e765af2a6"
              },
              {
                "mode": "normal",
                "text": "being the right choice, that is what we will recommend, and we will explain why.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Not sure which technique your cycle actually needs?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Most ICSI cycles need none of these. They exist for specific findings, not as a quality ladder you climb by paying more.",
                  "id": "4e7bc0edcb97"
                },
                {
                  "icon": "Sparkles",
                  "text": "PICSI and MACS are usually decided by one number: your sperm DNA fragmentation index (DFI).",
                  "id": "a4371818972e"
                },
                {
                  "icon": "Sparkles",
                  "text": "IMSI is about seeing sperm structure in detail. Spindle View is about the egg, and not about sperm at all.",
                  "id": "703658c1db78"
                },
                {
                  "icon": "Sparkles",
                  "text": "The evidence for MACS is genuinely mixed, and any clinic offering it should say so plainly.",
                  "id": "d7bc090e457b"
                },
                {
                  "icon": "Sparkles",
                  "text": "None of these repairs a sperm or an egg. They only improve which one gets chosen.",
                  "id": "39188818a6dd"
                },
                {
                  "icon": "Sparkles",
                  "text": "If a technique is recommended to you, ask which specific result led to it. There should be a clear answer.",
                  "id": "e686d134fe5a"
                }
              ],
              "id": "f4bd981bfe89",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Not sure which technique your cycle actually needs?",
              "subtext": "Book a consultation for a full male fertility work-up — the results decide the technique, not the other way round.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "daeb18d264f8"
                },
                {
                  "label": "Male Infertility Treatment",
                  "url": "https://ivfclinic.com/treatments/male-infertility",
                  "variant": "secondary",
                  "id": "0ab9c90fa0a8"
                }
              ],
              "id": "a8babb34c699",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  },
  {
    "_id": "blog-tese-vs-pesa-vs-testicular-biopsy",
    "_type": "blog",
    "slug": "tese-vs-pesa-vs-testicular-biopsy",
    "title": "TESE vs PESA vs Testicular Biopsy: Sperm Retrieval Compared",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "male-infertility",
    "categoryTitle": "Male infertility",
    "readMins": 8,
    "excerpt": "Four different procedures, often used interchangeably in conversation — but chosen for very different reasons. Here's which one suits which situation, and why.",
    "heroImageUrl": "/blog-media/oct-2026/tese-vs-pesa-vs-testicular-biopsy.webp",
    "heroImageAlt": "TESE, PESA and testicular biopsy compared — surgical sperm retrieval at Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "surgical-sperm-retrieval",
      "azoospermia",
      "male-infertility"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "Is sperm retrieval painful?",
        "answer": "The procedures themselves are done under anaesthesia — local sedation for the needle-based ones like PESA and TESA, and usually general anaesthesia for TESE and Micro-TESE. Afterwards, most men describe a dull ache and tenderness for a few days rather than sharp pain, managed with simple painkillers and supportive underwear."
      },
      {
        "question": "Which procedure gives the best chance of finding sperm?",
        "answer": "It depends entirely on the type of azoospermia. If the problem is a blockage, simple needle methods like PESA succeed in the large majority of cases, because sperm production is normal. If the testicles are producing very little sperm, Micro-TESE — which uses an operating microscope to search for the few productive areas — gives the best chance, and no simpler method matches it."
      },
      {
        "question": "Can retrieved sperm be frozen for later use?",
        "answer": "Yes, and it's often planned that way. Freezing retrieved sperm means one procedure can serve more than one ICSI attempt, sparing the man a repeat operation. Whether freezing is sensible depends on how much sperm is found and its quality, which the embryology team assesses on the day."
      },
      {
        "question": "Will a child conceived this way inherit the fertility problem?",
        "answer": "It depends on the underlying cause. Some causes of azoospermia are genetic — Y chromosome microdeletions, for example — and can be passed to a son. This is exactly why genetic testing is recommended before surgical retrieval in non-obstructive cases: not to discourage treatment, but so you can make the decision with the full picture."
      }
    ],
    "seoMetaTitle": "TESE vs PESA vs Testicular Biopsy: Sperm Retrieval Compared",
    "seoMetaDescription": "PESA, TESA, TESE and Micro-TESE explained side by side — which procedure suits which type of azoospermia, what recovery involves, and what the success rates…",
    "seoOgTitle": "TESE vs PESA vs Testicular Biopsy: Sperm Retrieval Compared",
    "seoOgDescription": "PESA, TESA, TESE and Micro-TESE explained side by side — which procedure suits which type of azoospermia, what recovery involves, and what the success rates…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "~1%",
                  "label": "Of men have azoospermia — no sperm in the ejaculate",
                  "id": "a7d3d3252698"
                },
                {
                  "value": "2 types",
                  "label": "Obstructive and non-obstructive, treated differently",
                  "id": "dc39a40786c9"
                },
                {
                  "value": "Day care",
                  "label": "Most retrievals are same-day procedures",
                  "id": "31265c89ede5"
                },
                {
                  "value": "ICSI",
                  "label": "Retrieved sperm is always used with ICSI",
                  "id": "956d185ca529"
                }
              ],
              "id": "f002ef65af07",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The right procedure is decided by why there’s no sperm in the semen, not by preference.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "If sperm is being produced normally but can’t get out — a blockage — it can usually be collected with a fine needle from the epididymis or testicle, quickly and with minimal recovery. If the testicles are producing very little sperm, a needle is likely to miss it, and an open microsurgical search (",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "Micro-TESE",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/surgical-sperm-retrieval",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "648bde9c5b5c"
              },
              {
                "mode": "normal",
                "text": ") gives by far the best chance. Whatever is retrieved is then used with",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ICSI",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/icsi",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "b2163ce5e1a3"
              },
              {
                "mode": "normal",
                "text": ", because the numbers involved are far too small for any other method.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Two Types of Azoospermia",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Everything about this decision follows from one distinction, so it’s worth being clear about it.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Obstructive azoospermia",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "means production is fine, but the pathway is blocked — from a previous vasectomy, an infection, surgery, or a congenital absence of the vas deferens. Hormone levels are usually normal and the testicles are of normal size. Sperm is there; it simply needs collecting.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Non-obstructive azoospermia",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "means the testicles themselves are producing very little or no sperm. FSH is often raised, testicular volume may be reduced, and a genetic cause is more likely. Sperm may still exist, but only in scattered pockets — which changes the entire surgical approach.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Telling the two apart uses hormone tests, examination, and sometimes genetic testing — and it happens",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "before",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "any procedure is booked. Read more about the underlying condition in our guide to",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "azoospermia treatment",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/azoospermia",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "494cb15862a5"
              },
              {
                "mode": "normal",
                "text": ".",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Procedures",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Four Procedures, At a Glance",
              "intro": "Ordered from least to most invasive",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "PESA",
                  "recommendation": "A fine needle into the epididymis. No incision, local anaesthesia, over in minutes. First choice when there is a blockage.",
                  "id": "dc9879587073"
                },
                {
                  "icon": "Sparkles",
                  "situation": "TESA",
                  "recommendation": "The same needle approach, but sampling the testicle itself. Used when PESA does not yield sperm.",
                  "id": "1dbcbef1cdfa"
                },
                {
                  "icon": "Sparkles",
                  "situation": "TESE",
                  "recommendation": "A small incision, with tissue removed and searched by the embryology team. More tissue than a needle, but sampled somewhat blindly.",
                  "id": "da6f8068547e"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Micro-TESE",
                  "recommendation": "An operating microscope is used to find the fuller tubules most likely to hold sperm. The standard where production is impaired.",
                  "id": "250c3a11eb78"
                }
              ],
              "id": "a16c2f09b666",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "PESA — Percutaneous Epididymal Sperm Aspiration",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "A fine needle is passed through the scrotal skin into the epididymis — the coiled tube where sperm matures and is stored — and fluid is aspirated. No incision, done under local anaesthesia with sedation, and typically over in minutes. Where there is a clear blockage, PESA succeeds in the large majority of cases.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Used for:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "obstructive azoospermia, as the first choice.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "TESA — Testicular Sperm Aspiration",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Similar in approach, but the needle samples the testicle itself rather than the epididymis. It’s used when PESA doesn’t yield sperm, or where the epididymis is absent or inaccessible. Still needle-based, still minimally invasive, still same-day.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Used for:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "obstructive cases where PESA fails or isn’t suitable.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "TESE — Testicular Sperm Extraction",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is where \"testicular biopsy\" comes in — the terms are often used for the same thing. A small incision is made and one or more pieces of testicular tissue are removed and examined by the embryology team for sperm. It samples far more tissue than a needle, but it does so somewhat blindly: tissue is taken from selected areas rather than from areas known to be productive.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Used for:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "non-obstructive cases, and obstructive cases where needle methods have failed.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Micro-TESE — Microsurgical TESE",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The most refined option. Using an operating microscope at high magnification, the surgeon examines the seminiferous tubules directly and selects the fuller, more opaque ones that are more likely to contain sperm. This means less tissue is removed overall, blood supply is better preserved, and the chance of finding sperm in difficult cases is meaningfully higher than with standard TESE.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Used for:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "non-obstructive azoospermia — where it is the clear standard of care.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Side by Side",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "Four Procedures Compared",
              "columns": [
                {
                  "header": "Needle-Based (PESA / TESA)",
                  "id": "baca3bbeccda"
                },
                {
                  "header": "Open Surgical (TESE / Micro-TESE)",
                  "id": "0665538711af"
                }
              ],
              "rows": [
                {
                  "rowLabel": "Best suited to",
                  "cells": [
                    {
                      "value": "Obstructive azoospermia",
                      "id": "01ed2f5e45a5"
                    },
                    {
                      "value": "Non-obstructive azoospermia",
                      "id": "c4344cab9247"
                    }
                  ],
                  "id": "efd39b6f6ccc"
                },
                {
                  "rowLabel": "Incision",
                  "cells": [
                    {
                      "value": "None — fine needle only",
                      "id": "a95bbc5f08d1"
                    },
                    {
                      "value": "Small incision required",
                      "id": "586523ea9bad"
                    }
                  ],
                  "id": "74bf215ea20f"
                },
                {
                  "rowLabel": "Anaesthesia",
                  "cells": [
                    {
                      "value": "Local with sedation",
                      "id": "e674f947c76a"
                    },
                    {
                      "value": "Usually general",
                      "id": "627c4a5cde5a"
                    }
                  ],
                  "id": "6f247ca08f85"
                },
                {
                  "rowLabel": "Tissue sampled",
                  "cells": [
                    {
                      "value": "Minimal",
                      "id": "a0dd0d586d73"
                    },
                    {
                      "value": "More, targeted under microscope in Micro-TESE",
                      "id": "06a70f67d6f6"
                    }
                  ],
                  "id": "d4d110ea8d2f"
                },
                {
                  "rowLabel": "Typical recovery",
                  "cells": [
                    {
                      "value": "1–2 days of tenderness",
                      "id": "90146bb9844e"
                    },
                    {
                      "value": "About a week of restricted activity",
                      "id": "d56a0791f3e5"
                    }
                  ],
                  "id": "ea2c7b385cf5"
                },
                {
                  "rowLabel": "Chance of finding sperm",
                  "cells": [
                    {
                      "value": "High, when there's a true blockage",
                      "id": "b31e8cae163f"
                    },
                    {
                      "value": "Best available option when production is impaired",
                      "id": "0a7855e02d19"
                    }
                  ],
                  "id": "84666207f483"
                }
              ],
              "id": "0f49d9d485dd",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What Recovery Involves",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "For needle-based retrieval, most men are back to desk work the next day, with some scrotal tenderness and bruising for a couple of days. For TESE and Micro-TESE, expect about a week of taking it easy — no lifting, no cycling, no gym — with supportive underwear and simple painkillers. Swelling and discomfort that is improving day by day is expected; pain that is worsening, spreading redness, or fever is not, and should be reported straight away.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "The Pathway at BFI",
              "intro": "Diagnosis first, procedure second, ICSI third",
              "note": "Timing is coordinated with the female partner's cycle where fresh sperm is planned, so both sides of the treatment line up on the day.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Establish the type",
                  "recommendation": "Hormone profile, examination and genetic testing where indicated, to separate obstructive from non-obstructive azoospermia.",
                  "id": "fc9b21c268de"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Match the procedure",
                  "recommendation": "Needle-based retrieval where there's a blockage; Micro-TESE where production is impaired and a careful search is needed.",
                  "id": "08543bc821f6"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Freeze or use fresh",
                  "recommendation": "Retrieved sperm is used with ICSI, and frozen where quantity allows — so one procedure can cover more than one attempt.",
                  "id": "3005af24a101"
                }
              ],
              "id": "82701243758f",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "SURGICAL SPERM RETRIEVAL AT BFI",
              "tagline": "All four procedures, one team",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Men diagnosed with azoospermia on two separate semen analyses, including those previously told that donor sperm was the only remaining option.",
              "facts": [
                {
                  "label": "Procedures",
                  "value": "PESA / TESA / TESE / Micro-TESE",
                  "id": "7d790c5eba0a"
                },
                {
                  "label": "Lab",
                  "value": "Class 1000, on site",
                  "id": "8559332c74df"
                },
                {
                  "label": "Freezing",
                  "value": "Available same day",
                  "id": "68ba68e1b5cd"
                },
                {
                  "label": "Used With",
                  "value": "ICSI",
                  "id": "2a5e7f74c188"
                }
              ],
              "id": "05d56311f282",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "If No Sperm Is Found",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the possibility every honest discussion has to include. In non-obstructive azoospermia, even a well-performed Micro-TESE does not always find sperm. Knowing this in advance matters — it’s why we discuss the alternative paths, including",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "donor sperm",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/sperm-donation",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "ff0a6b5526aa"
              },
              {
                "mode": "normal",
                "text": ", before the procedure rather than in the recovery room. Being prepared for both outcomes is not pessimism; it is what allows a couple to make the decision calmly.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Have at least two semen analyses confirming azoospermia, including a centrifuged sample.",
                  "id": "7b77ae9ba3f1"
                },
                {
                  "text": "Complete hormone testing and genetic screening before booking a non-obstructive procedure.",
                  "id": "e8c641bb6737"
                },
                {
                  "text": "Ask whether the embryology lab will be searching the sample on the same day, on site.",
                  "id": "22782d6bc20d"
                },
                {
                  "text": "Discuss freezing in advance, so one procedure can potentially serve more than one ICSI attempt.",
                  "id": "7333c3d93a4d"
                }
              ],
              "cons": [
                {
                  "text": "Agreeing to a needle procedure for non-obstructive azoospermia — it's far more likely to miss.",
                  "id": "55ebad4db242"
                },
                {
                  "text": "Having the retrieval somewhere the tissue has to be transported to a distant lab.",
                  "id": "708053b1db83"
                },
                {
                  "text": "Skipping genetic testing because the result feels uncomfortable to know.",
                  "id": "6b04829f78cf"
                },
                {
                  "text": "Assuming a diagnosis of azoospermia rules out biological fatherhood — for many men it doesn't.",
                  "id": "8c08e661745d"
                }
              ],
              "id": "8655a801c1a4",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Zero sperm in a semen analysis is a starting point for investigation, not a final answer.",
                  "id": "710cb54688fb"
                },
                {
                  "icon": "Sparkles",
                  "text": "We establish the type of azoospermia before choosing a procedure — the diagnosis drives the surgery, never the other way round.",
                  "id": "9e9a0b2da2ba"
                },
                {
                  "icon": "Sparkles",
                  "text": "Surgery and embryology happen in the same building on the same day, so nothing is lost in transit.",
                  "id": "c8506d0cb6fd"
                },
                {
                  "icon": "Sparkles",
                  "text": "We talk through what happens if no sperm is found before the procedure, not afterwards.",
                  "id": "5f6a2b3f3d43"
                }
              ],
              "id": "1becb8953e5b",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Our andrology team performs all four retrieval procedures, and the choice follows from a complete work-up rather than from what is convenient to schedule. Because our",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "surgical sperm retrieval",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/surgical-sperm-retrieval",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "18013dec5fec"
              },
              {
                "mode": "normal",
                "text": "happens alongside an on-site Class 1000 embryology lab, the sample is searched immediately and frozen the same day where quantity allows — which for many men means one procedure rather than two.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Been told there's no sperm in the sample?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "The procedure is chosen by the type of azoospermia, obstructive or non-obstructive, and never by preference.",
                  "id": "aeadacd40933"
                },
                {
                  "icon": "Sparkles",
                  "text": "Where there is a true blockage, simple needle retrieval succeeds in the large majority of cases.",
                  "id": "c53f8b508ad6"
                },
                {
                  "icon": "Sparkles",
                  "text": "Where production is impaired, Micro-TESE gives the best chance and no simpler method matches it.",
                  "id": "70f0d5fb1fe3"
                },
                {
                  "icon": "Sparkles",
                  "text": "Retrieved sperm is always used with ICSI, and can usually be frozen so one procedure covers more than one attempt.",
                  "id": "d5096f7b2f43"
                },
                {
                  "icon": "Sparkles",
                  "text": "Genetic testing before non-obstructive retrieval matters, because some causes can be passed to a son.",
                  "id": "bcd38956b2f9"
                },
                {
                  "icon": "Sparkles",
                  "text": "A diagnosis of azoospermia does not rule out biological fatherhood for most men.",
                  "id": "75fa8b6fa5f5"
                }
              ],
              "id": "7539ea4de78a",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Been told there's no sperm in the sample?",
              "subtext": "Book a consultation for a full male work-up — in many cases, biological fatherhood is still possible.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "98b31b605a43"
                },
                {
                  "label": "Surgical Sperm Retrieval",
                  "url": "https://ivfclinic.com/treatments/surgical-sperm-retrieval",
                  "variant": "secondary",
                  "id": "f9731d6b094e"
                }
              ],
              "id": "fc5667acf356",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  },
  {
    "_id": "blog-donor-egg-ivf-who-its-for-and-how-donors-are-screened",
    "_type": "blog",
    "slug": "donor-egg-ivf-who-its-for-and-how-donors-are-screened",
    "title": "Donor Egg IVF: Who It's For and How Donors Are Screened",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "ivf",
    "categoryTitle": "IVF",
    "readMins": 9,
    "excerpt": "For many couples this is the conversation they were least prepared for. Here's when donor eggs are genuinely the right recommendation, how donors are screened, and what the law requires.",
    "heroImageUrl": "/blog-media/oct-2026/donor-egg-ivf-who-its-for-and-how-donors-are-screened.webp",
    "heroImageAlt": "Donor egg IVF — who it is for and how donors are screened at Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "egg-donation",
      "ivf",
      "ovarian-reserve"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "Will the baby look like me if we use a donor egg?",
        "answer": "The baby inherits its genes from the donor and the male partner, so physical resemblance to the birth mother isn't inherited in that direction. Donors are matched on physical characteristics — height, complexion, build, blood group — so family resemblance is often closer than people expect. What is genuinely shared is the pregnancy itself: the birth mother carries, nourishes and delivers the baby."
      },
      {
        "question": "Can we choose or meet the donor?",
        "answer": "No. Under India's ART (Regulation) Act, 2021, egg donation is anonymous and donors are sourced only through registered ART banks. Parents receive non-identifying information such as age, blood group, height, complexion and education, but identity is protected on both sides by law."
      },
      {
        "question": "Is donor egg IVF legal in India?",
        "answer": "Yes, and it is regulated. The ART (Regulation) Act, 2021 sets the rules: donors must be married women aged 23-35 with at least one living child of their own, may donate only once in their lifetime, and must be sourced through a registered ART bank. Clinics must be registered, and consent and record-keeping requirements are specific."
      },
      {
        "question": "Are donor egg success rates really higher?",
        "answer": "Usually yes, and the reason is simple: success in IVF tracks the age of the egg far more closely than the age of the woman carrying the pregnancy. Because donors are young and pre-screened for ovarian reserve, embryo quality tends to be good. It isn't a guarantee — the uterus, the lining and the sperm all still matter."
      }
    ],
    "seoMetaTitle": "Donor Egg IVF: Who It's For and How Donors Are Screened",
    "seoMetaDescription": "When donor eggs are recommended, how donors are screened under India's ART Act, what the process involves step by step, and the questions worth asking…",
    "seoOgTitle": "Donor Egg IVF: Who It's For and How Donors Are Screened",
    "seoOgDescription": "When donor eggs are recommended, how donors are screened under India's ART Act, what the process involves step by step, and the questions worth asking…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "23–35",
                  "label": "Legal age range for egg donors in India",
                  "id": "1f8f15411f65"
                },
                {
                  "value": "Once",
                  "label": "A woman may donate only once in her lifetime",
                  "id": "55d9031a1965"
                },
                {
                  "value": "Anonymous",
                  "label": "Required by the ART Act, 2021",
                  "id": "dbdf1b1720c9"
                },
                {
                  "value": "Egg age",
                  "label": "Predicts success more than the mother's age",
                  "id": "5aa4e4813e1f"
                }
              ],
              "id": "469f66dd4b2d",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Donor egg IVF uses eggs from a young, screened donor, fertilised with your partner’s sperm, with the resulting embryo carried by you.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "It is recommended when the eggs themselves are the limiting factor — very low ovarian reserve, premature ovarian insufficiency, repeated cycles with poor egg or embryo quality, or a genetic condition that would otherwise be passed on. Success rates are generally higher than own-egg IVF in these situations, because outcomes follow the age of the egg far more closely than the age of the woman carrying the pregnancy.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Who Donor Egg IVF Is For",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is rarely a first-line recommendation, and it should never feel like one. It generally enters the conversation in five situations:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "A good clinic will have exhausted the reasonable own-egg options first, and will be able to explain exactly which findings led to this recommendation.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "How Donors Are Screened",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Four Layers of Screening",
              "intro": "What a donor goes through before she is ever matched",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "Eligibility",
                  "recommendation": "Aged 23 to 35, married, and with at least one living child of her own, exactly as the ART Act requires.",
                  "id": "a0f336a5ea20"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Medical",
                  "recommendation": "General health, ovarian reserve testing, ultrasound assessment, and full infectious disease screening including HIV, hepatitis B and C, and syphilis.",
                  "id": "46d5d3f4210b"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Genetic",
                  "recommendation": "Family history review and genetic screening, including thalassaemia carrier status, which matters a great deal in India.",
                  "id": "e975dd30ad95"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Counselling & consent",
                  "recommendation": "Counselling to confirm she understands the process and is donating freely, with documented informed consent.",
                  "id": "55909a70040e"
                }
              ],
              "id": "ca5cda35891b",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the question patients most want answered and least often see written down. Screening runs across four areas:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What the ART Act Requires",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "India’s ART (Regulation) Act, 2021 changed egg donation substantially, and the rules are not optional:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "The Legal Framework",
              "columns": [
                {
                  "header": "Requirement",
                  "id": "656ddbd54ee2"
                },
                {
                  "header": "Why it exists",
                  "id": "32744c0509dc"
                }
              ],
              "rows": [
                {
                  "rowLabel": "Donor age 23–35",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "f579b15eaeae"
                    },
                    {
                      "value": "Egg quality and donor safety",
                      "id": "7fe1d8eede6d"
                    }
                  ],
                  "id": "bdabd6861aa7"
                },
                {
                  "rowLabel": "Must have a living child",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "e7c2fa9c5b44"
                    },
                    {
                      "value": "Protects the donor's own fertility interests",
                      "id": "cc8d01438dbd"
                    }
                  ],
                  "id": "effe31273abb"
                },
                {
                  "rowLabel": "One donation per lifetime",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "8b437ef02613"
                    },
                    {
                      "value": "Prevents repeated exploitation of donors",
                      "id": "281100f67e3a"
                    }
                  ],
                  "id": "6fa72741b757"
                },
                {
                  "rowLabel": "Sourced via registered ART bank",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "f94a7c33edf7"
                    },
                    {
                      "value": "Traceability and screening standards",
                      "id": "517522b1ebed"
                    }
                  ],
                  "id": "a4a2bbef58e9"
                },
                {
                  "rowLabel": "Anonymity",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "fbb6e6f607b9"
                    },
                    {
                      "value": "Protects both donor and recipient family",
                      "id": "877d98a5f927"
                    }
                  ],
                  "id": "76b47f943fcc"
                },
                {
                  "rowLabel": "Clinic registration",
                  "cells": [
                    {
                      "value": "Mandatory",
                      "id": "a55ebeb7ea8d"
                    },
                    {
                      "value": "Accountability and record-keeping",
                      "id": "c3ace68d18b4"
                    }
                  ],
                  "id": "5e3e134e37bf"
                }
              ],
              "id": "38f7dd863e11",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Process, Step by Step",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "How a Donor Egg Cycle Runs",
              "intro": "Two people's cycles, brought into line",
              "note": "Because most donor cycles now use frozen eggs or a frozen embryo transfer, the two cycles no longer have to be synchronised to the day — which makes scheduling far less stressful than it used to be.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Matching",
                  "recommendation": "A screened donor is matched on physical characteristics and blood group through a registered ART bank, with non-identifying details shared with you.",
                  "id": "f671334df95c"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Donor stimulation & retrieval",
                  "recommendation": "The donor undergoes stimulation and egg retrieval. Your partner's sperm is used to fertilise the eggs, usually with ICSI.",
                  "id": "d5777bc22ef2"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Your lining, your transfer",
                  "recommendation": "Your uterine lining is prepared with medication, and the embryo is transferred to you — often as a frozen transfer, which allows better timing.",
                  "id": "673d1880ecb4"
                }
              ],
              "id": "a66983d64027",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Why Success Rates Are Different",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The single most useful thing to understand is that IVF success follows the",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "age of the egg",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "much more closely than the age of the woman carrying the pregnancy. A 42-year-old using her own eggs and a 42-year-old using eggs from a 28-year-old donor are in genuinely different statistical situations — not because of anything about her body’s ability to carry, but because chromosomal abnormality in eggs rises sharply with age.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What still matters on your side: the uterine cavity and lining, thyroid and blood sugar control, and your partner’s sperm quality. Donor eggs solve one problem well; they don’t remove the need for everything else to be right.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "EGG DONATION AT BFI",
              "tagline": "Screened donors, no waiting list",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Women with very low ovarian reserve, premature ovarian insufficiency, repeated poor egg quality, or a heritable genetic condition — after own-egg options have been properly considered.",
              "facts": [
                {
                  "label": "Donor Age",
                  "value": "23–35, as per law",
                  "id": "2ab519eb00d4"
                },
                {
                  "label": "Screening",
                  "value": "Medical + genetic",
                  "id": "f203e1656c09"
                },
                {
                  "label": "Sourcing",
                  "value": "Registered ART bank",
                  "id": "1eb1be16e4ff"
                },
                {
                  "label": "Lab",
                  "value": "Class 1000",
                  "id": "73790dafd33b"
                }
              ],
              "id": "9fea7c4a4b8e",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Part Nobody Prepares You For",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Medically, donor egg IVF is well understood. Emotionally, it is often the hardest conversation in a couple’s fertility journey — there is usually a period of grief for the genetic connection that was expected, and that deserves to be acknowledged rather than rushed past. Many couples find it helps to take a few weeks between the recommendation and the decision, and to talk to a counsellor rather than only to a doctor. Whether and how to tell the child later is a personal decision; counselling support exists for that too, and there is no single right answer.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Ask exactly which of your results led to this recommendation, in writing.",
                  "id": "736f8cab0c07"
                },
                {
                  "text": "Confirm the donor is sourced through a registered ART bank, as the law requires.",
                  "id": "378c5f97315e"
                },
                {
                  "text": "Ask what screening the donor has had — medical, genetic and infectious disease.",
                  "id": "f5eeed13599f"
                },
                {
                  "text": "Give yourselves time, and consider counselling before deciding rather than after.",
                  "id": "9a7348d69c58"
                }
              ],
              "cons": [
                {
                  "text": "Agreeing at the same appointment where it's first raised, unless you're ready.",
                  "id": "276b0cd58569"
                },
                {
                  "text": "Working with any clinic that offers to let you select or meet a donor — that isn't legal here.",
                  "id": "d1057b71dfdc"
                },
                {
                  "text": "Assuming donor eggs remove the need for your own work-up — lining and thyroid still matter.",
                  "id": "a3dce36c0cf9"
                },
                {
                  "text": "Comparing quoted success rates between clinics without asking how they're calculated.",
                  "id": "0303eac46bee"
                }
              ],
              "id": "9a6f593abcc8",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "We recommend donor eggs only after own-egg options have been properly explored, and we show you the results that led there.",
                  "id": "f7164461d158"
                },
                {
                  "icon": "Sparkles",
                  "text": "Donors are sourced strictly through registered ART banks and screened medically, genetically and psychologically.",
                  "id": "cb8e50387c02"
                },
                {
                  "icon": "Sparkles",
                  "text": "Take the time you need. This is one decision where we would rather you came back in three weeks than agreed in three minutes.",
                  "id": "e0856ab8cba1"
                },
                {
                  "icon": "Sparkles",
                  "text": "Counselling support is part of the pathway, not an optional extra you have to ask for.",
                  "id": "61ae3a142ebf"
                }
              ],
              "id": "91ce1651c6f4",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Our",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "egg donation programme",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/egg-donation",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "b9c5ea02faa1"
              },
              {
                "mode": "normal",
                "text": "works only with donors sourced through registered ART banks, screened to the standards the ART Act requires. Before recommending it, we go through your own results with you — ovarian reserve, previous cycle outcomes, and whether anything else is worth trying first. If you would rather explore",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ovarian rejuvenation",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/ovarian-rejuvenation",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "e1d6846cffa6"
              },
              {
                "mode": "normal",
                "text": "or another own-egg protocol before deciding, we will tell you honestly what the realistic odds look like either way.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Been told donor eggs might be the next step?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Donor eggs are recommended when the eggs themselves are the limiting factor, and only after own-egg options have been properly considered.",
                  "id": "56e008b84dfc"
                },
                {
                  "icon": "Sparkles",
                  "text": "Success follows the age of the egg far more closely than the age of the woman carrying the pregnancy.",
                  "id": "0156509c65e3"
                },
                {
                  "icon": "Sparkles",
                  "text": "Under the ART Act, 2021, donation is anonymous, donors are aged 23 to 35 with a child of their own, and may donate only once.",
                  "id": "ad90a725caf6"
                },
                {
                  "icon": "Sparkles",
                  "text": "Donors must be sourced through a registered ART bank. A clinic offering to let you choose or meet a donor is operating outside the law.",
                  "id": "233c4abfad48"
                },
                {
                  "icon": "Sparkles",
                  "text": "Your lining, thyroid and your partner's sperm still matter. Donor eggs solve one problem, not all of them.",
                  "id": "bd65a454b11e"
                },
                {
                  "icon": "Sparkles",
                  "text": "The emotional side is the hardest part, and taking a few weeks plus counselling before deciding is entirely reasonable.",
                  "id": "b692424468dd"
                }
              ],
              "id": "e6fad6afef97",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Been told donor eggs might be the next step?",
              "subtext": "Book a consultation to go through your results properly before deciding anything.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "bddf8745290b"
                },
                {
                  "label": "Egg Donation Treatment",
                  "url": "https://ivfclinic.com/treatments/egg-donation",
                  "variant": "secondary",
                  "id": "a4d70d5fd5b7"
                }
              ],
              "id": "28c7b419e5b5",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  },
  {
    "_id": "blog-minimal-stimulation-ivf-who-its-right-for",
    "_type": "blog",
    "slug": "minimal-stimulation-ivf-who-its-right-for",
    "title": "Minimal Stimulation IVF (Mini-IVF): Who It's Actually Right For",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "ivf",
    "categoryTitle": "IVF",
    "readMins": 8,
    "excerpt": "Fewer injections, fewer eggs, lower cost per cycle. A genuinely good option for a specific group of women — and a quiet disadvantage for everyone else.",
    "heroImageUrl": "/blog-media/oct-2026/minimal-stimulation-ivf-who-its-right-for.webp",
    "heroImageAlt": "Minimal stimulation IVF (mini-IVF) — who it is right for, Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "ivf",
      "ovarian-reserve"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "Is mini-IVF less effective than conventional IVF?",
        "answer": "Per cycle, usually yes — fewer eggs means fewer embryos and fewer chances. The more useful comparison is per unit of time and money: for a woman with very low ovarian reserve who would only produce two or three eggs on any protocol, a gentler cycle may reach a similar place with less medication and cost. For someone who would have produced twelve eggs conventionally, mini-IVF genuinely gives up a real advantage."
      },
      {
        "question": "Does mini-IVF have fewer side effects?",
        "answer": "Generally yes. Lower medication doses mean less bloating, fewer injections, and a substantially lower risk of ovarian hyperstimulation syndrome (OHSS). For women at high risk of OHSS — particularly those with PCOS — that's a meaningful safety argument, though modern conventional protocols with a freeze-all approach also manage that risk well."
      },
      {
        "question": "Is mini-IVF the same as natural cycle IVF?",
        "answer": "No, though they're often confused. Natural cycle IVF uses no stimulation at all and aims to collect the single egg your body would release anyway. Mini-IVF uses low-dose medication, usually oral tablets like letrozole or clomiphene with small amounts of injectable hormone, to gently encourage two to five eggs."
      },
      {
        "question": "Will I need more mini-IVF cycles to succeed?",
        "answer": "Often, yes — that's the honest trade-off. Fewer eggs per cycle usually means more cycles to reach the same cumulative chance. When comparing costs between protocols, the number worth asking about is the total expected cost to a reasonable chance of pregnancy, not the price of a single cycle."
      }
    ],
    "seoMetaTitle": "Minimal Stimulation IVF (Mini-IVF): Who It's Actually Right For",
    "seoMetaDescription": "Fewer injections, fewer eggs, lower cost — and a narrower group of people it genuinely suits. An honest look at mini-IVF, how it compares to conventional…",
    "seoOgTitle": "Minimal Stimulation IVF (Mini-IVF): Who It's Actually Right For",
    "seoOgDescription": "Fewer injections, fewer eggs, lower cost — and a narrower group of people it genuinely suits. An honest look at mini-IVF, how it compares to conventional…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "2–5",
                  "label": "Eggs typically retrieved, vs 8–15 conventionally",
                  "id": "61d03b29d974"
                },
                {
                  "value": "Lower",
                  "label": "Medication dose, cost and OHSS risk",
                  "id": "2aa0f3b9f571"
                },
                {
                  "value": "Oral",
                  "label": "Letrozole or clomiphene lead the protocol",
                  "id": "261c74d9b97c"
                },
                {
                  "value": "Specific",
                  "label": "Suits a narrow group, not everyone",
                  "id": "d40bcdcfbab9"
                }
              ],
              "id": "ae77011c629e",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Mini-IVF is conventional IVF with the stimulation turned down.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "Instead of higher-dose injections aiming for ten or more eggs, it uses oral tablets — usually letrozole or clomiphene — with small doses of injectable hormone, aiming for two to five good eggs. Everything after retrieval is the same: fertilisation, embryo culture, transfer. It genuinely helps women whose ovaries were never going to produce many eggs anyway, and women at real risk of overstimulation. For a woman with normal reserve who would have produced twelve eggs, it quietly gives up a real advantage.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What Mini-IVF Actually Is",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The logic behind it is that in women with a genuinely limited egg supply, pushing the dose higher doesn’t reliably produce more eggs — it mostly produces more medication, more cost, and more side effects for the same two or three follicles. A gentler protocol works with what the ovary was going to give anyway.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "It is not the same as",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "natural cycle IVF",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "95b24447612f"
              },
              {
                "mode": "normal",
                "text": ", which uses no stimulation at all and collects the single egg the body would have released. Mini-IVF sits between that and conventional stimulation.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Mini-IVF vs Conventional IVF",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "Two Protocols Compared",
              "columns": [
                {
                  "header": "Mini-IVF",
                  "id": "a40c819f321a"
                },
                {
                  "header": "Conventional IVF",
                  "id": "5aad5c436686"
                }
              ],
              "rows": [
                {
                  "rowLabel": "Typical eggs retrieved",
                  "cells": [
                    {
                      "value": "2–5",
                      "id": "4866df04931f"
                    },
                    {
                      "value": "8–15",
                      "id": "b16e88b9576c"
                    }
                  ],
                  "id": "3f04142695bc"
                },
                {
                  "rowLabel": "Medication",
                  "cells": [
                    {
                      "value": "Mostly oral, low-dose injections",
                      "id": "9468a45c9b09"
                    },
                    {
                      "value": "Higher-dose injections throughout",
                      "id": "fbca7e207543"
                    }
                  ],
                  "id": "ffe047b82aac"
                },
                {
                  "rowLabel": "Injections per cycle",
                  "cells": [
                    {
                      "value": "Few",
                      "id": "8621d1d1c9fa"
                    },
                    {
                      "value": "Daily for 8–14 days",
                      "id": "e1b9c505df7b"
                    }
                  ],
                  "id": "744f7b86f593"
                },
                {
                  "rowLabel": "OHSS risk",
                  "cells": [
                    {
                      "value": "Very low",
                      "id": "3bb1518b6286"
                    },
                    {
                      "value": "Low but real, managed by protocol",
                      "id": "c3bf6c6c282c"
                    }
                  ],
                  "id": "ac4c33714801"
                },
                {
                  "rowLabel": "Cost per cycle",
                  "cells": [
                    {
                      "value": "Lower",
                      "id": "0aa9b0872c67"
                    },
                    {
                      "value": "Higher",
                      "id": "f7863d87ae53"
                    }
                  ],
                  "id": "6b5b1034930c"
                },
                {
                  "rowLabel": "Embryos to freeze",
                  "cells": [
                    {
                      "value": "Often none spare",
                      "id": "d577721768a2"
                    },
                    {
                      "value": "Frequently several",
                      "id": "6c56524a5f77"
                    }
                  ],
                  "id": "653ad75a2b18"
                },
                {
                  "rowLabel": "Chance per cycle",
                  "cells": [
                    {
                      "value": "Lower",
                      "id": "d12bd91e4408"
                    },
                    {
                      "value": "Higher",
                      "id": "340c36fc90aa"
                    }
                  ],
                  "id": "25fea475a48f"
                }
              ],
              "id": "7d1343561ceb",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Who It Genuinely Suits",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Four Situations Where Mini-IVF Makes Sense",
              "intro": "Where a gentler protocol gives up little or nothing",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "Very low ovarian reserve",
                  "recommendation": "Where AMH and antral follicle count show only a few eggs will be retrieved whatever the dose, higher stimulation mostly adds cost rather than eggs.",
                  "id": "9172174763b1"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Previous poor responders",
                  "recommendation": "Women who have already had a conventional cycle on high doses and still produced very few eggs.",
                  "id": "a198fa09f57d"
                },
                {
                  "icon": "Sparkles",
                  "situation": "High OHSS risk",
                  "recommendation": "Particularly women with PCOS, where a gentler approach reduces a genuine and sometimes serious safety risk.",
                  "id": "943b856a8fbd"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Poor tolerance of stimulation",
                  "recommendation": "Where a previous cycle was badly tolerated, or there is a medical reason to keep hormonal exposure to a minimum.",
                  "id": "b3c56a3abaf0"
                }
              ],
              "id": "b9da81c46427",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "There are four situations where mini-IVF is a sound clinical choice:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "How the Decision Is Made at BFI",
              "intro": "Your ovarian reserve leads, not the price list",
              "note": "If mini-IVF is recommended to you, ask what your expected egg yield would be on a conventional protocol. If the honest answer is 'about the same', the gentler route makes sense. If it's substantially higher, weigh it carefully.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Measure the reserve",
                  "recommendation": "AMH, antral follicle count and FSH give a realistic picture of how many eggs any protocol is likely to produce.",
                  "id": "1cc67cdb6151"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Review any previous response",
                  "recommendation": "If a conventional cycle has already been run, how the ovaries actually responded is the most useful single piece of evidence.",
                  "id": "b6743e301c7b"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Choose — and explain the trade-off",
                  "recommendation": "We set out expected egg numbers and likely number of cycles for each option, so the choice is made with the real numbers in front of you.",
                  "id": "b88e484acb01"
                }
              ],
              "id": "386cb8e7cdca",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Who Should Think Twice",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Mini-IVF is a poor fit for women with good ovarian reserve who are simply hoping to spend less. With normal reserve, a conventional cycle usually produces several embryos — some transferred fresh, others frozen for later attempts. That single retrieval can carry two or three chances at pregnancy. A mini-IVF cycle producing three eggs often yields one embryo and no spares, so the same overall chance requires repeating the retrieval — with the anaesthetic, the monitoring and the cost that comes with it each time.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "It is also a difficult choice where time matters — for women in their late thirties or early forties, where each additional month of delay carries its own cost.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "PROTOCOL SELECTION AT BFI",
              "tagline": "The protocol follows your ovaries",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Women with low ovarian reserve or a poor previous response, women at high OHSS risk, and anyone who has struggled with high-dose stimulation before.",
              "facts": [
                {
                  "label": "Assessment",
                  "value": "AMH + AFC + FSH",
                  "id": "e6ca89dff896"
                },
                {
                  "label": "Protocols",
                  "value": "Mini, conventional, natural",
                  "id": "d7909092cda5"
                },
                {
                  "label": "OHSS Policy",
                  "value": "Risk-scored every cycle",
                  "id": "f4bd2dc900fa"
                },
                {
                  "label": "Counselling",
                  "value": "Expected yield explained upfront",
                  "id": "cb7cd6690b90"
                }
              ],
              "id": "94f51e35d765",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Cost Question, Honestly",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Mini-IVF is cheaper per cycle, largely because medication is a substantial part of IVF cost and this protocol uses far less of it. That saving is real. But the number that actually matters to a couple is the total cost of reaching a pregnancy, not the cost of one attempt — and if a gentler protocol needs two or three retrievals to match one conventional cycle, the arithmetic can reverse.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "For a woman with very low reserve, where conventional stimulation wouldn’t have produced more eggs anyway, mini-IVF is often cheaper both per cycle and overall. For a woman with normal reserve, it frequently isn’t. Any clinic recommending it should be willing to walk you through both figures.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Ask for your expected egg yield on both a mini and a conventional protocol.",
                  "id": "21299e1d7fb8"
                },
                {
                  "text": "Ask for the likely total cost to a reasonable chance of pregnancy, not just the price per cycle.",
                  "id": "1652e8462fdc"
                },
                {
                  "text": "Raise it directly if you had a bad experience with high-dose stimulation before — it's a valid clinical factor.",
                  "id": "1eab176349be"
                },
                {
                  "text": "Ask specifically about OHSS risk if you have PCOS or a high antral follicle count.",
                  "id": "e06f2e9fafe4"
                }
              ],
              "cons": [
                {
                  "text": "Choosing mini-IVF purely on the headline price with normal ovarian reserve.",
                  "id": "5f327f453d7d"
                },
                {
                  "text": "Assuming 'gentler' means 'safer in every way' — fewer embryos carries its own cost in time.",
                  "id": "35805158747f"
                },
                {
                  "text": "Confusing mini-IVF with natural cycle IVF — they're different protocols with different aims.",
                  "id": "93c3c187f695"
                },
                {
                  "text": "Delaying a decision for months while comparing protocols, if age is already a factor.",
                  "id": "93439b585a83"
                }
              ],
              "id": "20cb2720fbec",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "The protocol is chosen from your ovarian reserve and previous response — never from a package price.",
                  "id": "17a6daf074eb"
                },
                {
                  "icon": "Sparkles",
                  "text": "We tell you the expected egg yield for each option before you choose, so the trade-off is visible.",
                  "id": "d18c8ea10f2e"
                },
                {
                  "icon": "Sparkles",
                  "text": "Where mini-IVF isn't the right choice for you, we'll say so — even though it's the cheaper cycle to sell.",
                  "id": "402ee7ceec14"
                },
                {
                  "icon": "Sparkles",
                  "text": "BFI is an OHSS-free clinic by protocol design, so a gentler cycle is never the only way to stay safe.",
                  "id": "47a1942b177f"
                }
              ],
              "id": "cea7d4cefc5c",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "We run minimal stimulation, conventional and natural cycle protocols, and the choice is made from your",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ovarian reserve",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/ovarian-reserve",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "fa50ac5ad5b6"
              },
              {
                "mode": "normal",
                "text": "testing and any previous response. Before you decide, you get the expected egg numbers and the likely number of cycles for each route — because the honest comparison between protocols is only possible with both sets of figures in front of you.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Wondering which stimulation protocol suits you?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Mini-IVF is conventional IVF with the stimulation turned down. Everything after retrieval is the same.",
                  "id": "97813b18e6c1"
                },
                {
                  "icon": "Sparkles",
                  "text": "It typically retrieves two to five eggs rather than eight to fifteen, using mostly oral medication.",
                  "id": "6dea30d32b32"
                },
                {
                  "icon": "Sparkles",
                  "text": "It genuinely suits low ovarian reserve, previous poor responders, and women at real risk of OHSS.",
                  "id": "ae8d9d3c68c2"
                },
                {
                  "icon": "Sparkles",
                  "text": "With normal ovarian reserve it quietly gives up an advantage, because conventional cycles often leave spare embryos to freeze.",
                  "id": "85445e6f14d7"
                },
                {
                  "icon": "Sparkles",
                  "text": "Cheaper per cycle is not the same as cheaper overall. Ask for the expected total cost to a reasonable chance of pregnancy.",
                  "id": "948093fad3b4"
                },
                {
                  "icon": "Sparkles",
                  "text": "It is not the same as natural cycle IVF, which uses no stimulation at all.",
                  "id": "09b290ee113b"
                }
              ],
              "id": "8d35c3f9f077",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Wondering which stimulation protocol suits you?",
              "subtext": "Book a consultation for ovarian reserve testing and a straight comparison of your options.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "83a53c1c7d22"
                },
                {
                  "label": "IVF Treatment at BFI",
                  "url": "https://ivfclinic.com/treatments/ivf",
                  "variant": "secondary",
                  "id": "8730f6b8f48a"
                }
              ],
              "id": "4529990df825",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  },
  {
    "_id": "blog-diabetes-obesity-and-ivf-success",
    "_type": "blog",
    "slug": "diabetes-obesity-and-ivf-success",
    "title": "Can Diabetes or Obesity Affect IVF Success? What the Data Shows",
    "status": "published",
    "publishedAt": "2026-10-12T06:30:00.000Z",
    "lastUpdatedAt": "2026-10-12T06:30:00.000Z",
    "categorySlug": "ivf",
    "categoryTitle": "IVF",
    "readMins": 9,
    "excerpt": "Both influence an IVF cycle — but not as much as people fear, and not in the ways most often assumed. Here's where they actually act, and how much of it you can change before you start.",
    "heroImageUrl": "/blog-media/oct-2026/diabetes-obesity-and-ivf-success.webp",
    "heroImageAlt": "How diabetes and obesity affect IVF success — Bavishi Fertility Institute",
    "heroImagePosition": "center center",
    "heroTextDark": false,
    "treatmentSlugs": [
      "ivf",
      "pcos",
      "female-infertility"
    ],
    "locationSlugs": [],
    "faqs": [
      {
        "question": "Will my IVF cycle be cancelled if my BMI is high?",
        "answer": "Policies differ between clinics and countries. Some set a BMI cut-off, usually on anaesthetic safety grounds for egg retrieval rather than success rates alone. At most Indian clinics the approach is individual rather than a hard cut-off, weighing anaesthetic risk, other health conditions and how much improvement is realistically achievable first."
      },
      {
        "question": "How much weight loss actually makes a difference?",
        "answer": "Less than most people assume. Research consistently finds that a 5–10% reduction in body weight improves ovulation, insulin sensitivity and cycle outcomes — for someone at 80 kg, that's 4–8 kg, not a transformation. The improvement comes largely from better insulin sensitivity, which is why the metabolic change matters more than the number on the scale."
      },
      {
        "question": "What HbA1c should I aim for before starting IVF?",
        "answer": "Your own doctor sets your target, but pre-conception targets are usually tighter than routine diabetes targets, because early pregnancy is when blood sugar affects organ development. This is a conversation for your physician and fertility specialist together — and one worth having a few months before you plan to start, not the week before."
      },
      {
        "question": "Does well-controlled diabetes reduce IVF success?",
        "answer": "Well-controlled diabetes has much less effect on IVF outcomes than poorly controlled diabetes. The distinction that matters clinically is control, not the diagnosis itself — which is genuinely good news, because control is something that can be worked on in the months before a cycle."
      }
    ],
    "seoMetaTitle": "Can Diabetes or Obesity Affect IVF Success? What the Data Shows",
    "seoMetaDescription": "How blood sugar and weight influence egg quality, embryo development, implantation and miscarriage risk in an IVF cycle — and how much of that is modifiable…",
    "seoOgTitle": "Can Diabetes or Obesity Affect IVF Success? What the Data Shows",
    "seoOgDescription": "How blood sugar and weight influence egg quality, embryo development, implantation and miscarriage risk in an IVF cycle — and how much of that is modifiable…",
    "contentRaw": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "block",
            "fields": {
              "blockType": "statStrip",
              "items": [
                {
                  "value": "5–10%",
                  "label": "Weight reduction that measurably improves outcomes",
                  "id": "bd6b2ec900cb"
                },
                {
                  "value": "Control",
                  "label": "Matters more than the diagnosis itself",
                  "id": "2def58b6691d"
                },
                {
                  "value": "~3 mths",
                  "label": "Useful window to optimise before a cycle",
                  "id": "ba24cd3459f1"
                },
                {
                  "value": "Both",
                  "label": "Male and female partners are affected",
                  "id": "023c6ef50d0a"
                }
              ],
              "id": "9b7f9d31c573",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Short Answer",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Yes, both affect IVF outcomes — but the size of the effect depends far more on control than on the diagnosis.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 1,
                "version": 1
              },
              {
                "mode": "normal",
                "text": "Well-managed diabetes has a modest effect on an IVF cycle; poorly controlled diabetes has a much larger one, and matters most in early pregnancy rather than at retrieval. Raised BMI is associated with more medication needed, slightly fewer eggs, and a somewhat higher miscarriage rate — but plenty of women with a high BMI have successful cycles. The genuinely useful part is that both factors are among the few things in IVF you can actively improve in the months before you start.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Where It Actually Acts in a Cycle",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "It helps to be specific rather than vague about \"affecting success\". Metabolic factors act at four identifiable points:",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "comparisonTable",
              "rowHeader": "Four Points in the Cycle",
              "columns": [
                {
                  "header": "What can be affected",
                  "id": "a5568e455d36"
                },
                {
                  "header": "What the pattern looks like",
                  "id": "f873f6834a08"
                }
              ],
              "rows": [
                {
                  "rowLabel": "Stimulation response",
                  "cells": [
                    {
                      "value": "Medication dose needed",
                      "id": "4481bb56b0b2"
                    },
                    {
                      "value": "Higher doses often required at higher BMI",
                      "id": "28077775e5b6"
                    }
                  ],
                  "id": "1941496a10ba"
                },
                {
                  "rowLabel": "Egg quality",
                  "cells": [
                    {
                      "value": "Maturity and developmental potential",
                      "id": "8e539190acfd"
                    },
                    {
                      "value": "Reduced where insulin resistance is significant",
                      "id": "b8936c56d72e"
                    }
                  ],
                  "id": "bb9d40771c0d"
                },
                {
                  "rowLabel": "Embryo development",
                  "cells": [
                    {
                      "value": "Blastocyst formation",
                      "id": "b086e425ae94"
                    },
                    {
                      "value": "Somewhat lower rates in poorly controlled diabetes",
                      "id": "6d83248db280"
                    }
                  ],
                  "id": "a194f3dd7925"
                },
                {
                  "rowLabel": "Implantation & early pregnancy",
                  "cells": [
                    {
                      "value": "Miscarriage risk",
                      "id": "f54b809e2ebf"
                    },
                    {
                      "value": "Rises with poor glycaemic control",
                      "id": "fa8e753daf87"
                    }
                  ],
                  "id": "b82f78657faf"
                }
              ],
              "id": "95f6e1d1a420",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Two Factors, Separately",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Blood Sugar and Insulin",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The mechanism worth understanding is insulin resistance rather than blood sugar alone. When cells respond poorly to insulin, the body produces more of it, and raised insulin disrupts the hormonal signalling that governs follicle development and ovulation. This is the same mechanism that links",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "PCOS",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/pcos",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "fad739cc0dc5"
              },
              {
                "mode": "normal",
                "text": "to fertility difficulty — which is why many women are, in effect, managing an early-stage blood sugar problem without ever having been called diabetic.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "In an IVF cycle specifically, this shows up as eggs that are less consistently mature and embryos that are somewhat less likely to reach blastocyst. In early pregnancy, poor control is associated with higher miscarriage risk — which is exactly why pre-conception targets are tighter than routine ones.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h3",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Weight and BMI",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The relationship here is real but frequently overstated in the way it’s communicated. Higher BMI is associated with needing more stimulation medication, retrieving somewhat fewer eggs, and a modestly higher miscarriage rate. Retrieval can also be technically harder, which is a practical and anaesthetic consideration rather than a fertility one.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What matters is the size of the effect: it shifts the odds, it does not close the door. Being told bluntly to \"lose weight first\" without any number attached is unhelpful — the evidence points to a 5-10% reduction producing measurable improvement, which is a far more achievable target than most people are led to expect. Our guide on",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "how obesity affects fertility",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/the-hidden-threat-to-fertility-how-obesity-affects-your-chances",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "155c4f706502"
              },
              {
                "mode": "normal",
                "text": "covers the conception side in more detail.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "The Male Partner’s Side",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This gets discussed far less, and shouldn’t. Diabetes in men is associated with lower testosterone, reduced sperm motility and higher",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "sperm DNA fragmentation",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/blogs/understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "c239dfa24560"
              },
              {
                "mode": "normal",
                "text": "— and DNA fragmentation is directly relevant to embryo development and miscarriage risk in an IVF cycle. Raised BMI in men shows a similar association. If metabolic health is being optimised before a cycle, it is a two-person project, not a female-partner one.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "How Much Is Actually Modifiable",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "What You Can and Cannot Change",
              "intro": "Most IVF factors are fixed. These two are not.",
              "items": [
                {
                  "icon": "Sparkles",
                  "situation": "Cannot change",
                  "recommendation": "Your age, your ovarian reserve, your genetics, and the chromosomal quality of the eggs you have. These set the baseline.",
                  "id": "26e630d67c46"
                },
                {
                  "icon": "Sparkles",
                  "situation": "Can change, in about 3 months",
                  "recommendation": "HbA1c, insulin sensitivity, body weight, and for the male partner a full cycle of sperm production, which takes roughly 74 days.",
                  "id": "1aadb37f121e"
                },
                {
                  "icon": "Sparkles",
                  "situation": "The target that works",
                  "recommendation": "A 5 to 10 percent weight reduction measurably improves ovulation and cycle outcomes. For someone at 80 kg that is 4 to 8 kg, not a transformation.",
                  "id": "8c0bf90d075e"
                },
                {
                  "icon": "Sparkles",
                  "situation": "The catch worth naming",
                  "recommendation": "Optimising takes months, and ovarian reserve declines with time. Whether waiting is worth it depends on your age, and should be discussed openly.",
                  "id": "558d6e27b54c"
                }
              ],
              "id": "2d61a6fec5f3",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the encouraging part. Most factors in IVF — your age, your ovarian reserve, your genetics — cannot be changed. Metabolic health can, and on a timescale that fits neatly before a cycle. Roughly three months is a meaningful window: long enough for HbA1c to shift, for insulin sensitivity to improve with consistent exercise, and — for the male partner — for a full cycle of sperm production to complete, since sperm takes around 74 days to develop.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "decisionList",
              "heading": "Pre-Cycle Metabolic Optimisation",
              "intro": "A focused window, with measurable targets",
              "note": "If you're on diabetes medication, this plan runs alongside your existing care and with your physician's involvement — never instead of it, and never by adjusting doses yourself.",
              "items": [
                {
                  "icon": "CheckCircle2",
                  "situation": "Measure both partners",
                  "recommendation": "HbA1c, fasting insulin and thyroid for her; the same plus a semen analysis with DNA fragmentation for him.",
                  "id": "5a95a1a41def"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Set realistic targets",
                  "recommendation": "A 5–10% weight reduction and a specific HbA1c target agreed with your physician — not a vague instruction to 'get healthier'.",
                  "id": "b16e10f1c52e"
                },
                {
                  "icon": "CheckCircle2",
                  "situation": "Re-test, then start",
                  "recommendation": "Numbers are re-checked before the cycle begins, so treatment starts from the best realistic position rather than from hope.",
                  "id": "66c91e62b045"
                }
              ],
              "id": "12b5700c33b6",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "highlightCard",
              "badge": "METABOLIC ASSESSMENT AT BFI",
              "tagline": "Checked as standard, both partners",
              "icon": "HeartPulse",
              "color": "rose",
              "bestSuitedFor": "Couples with diagnosed diabetes or prediabetes, PCOS, raised BMI, or unexplained infertility where a metabolic contributor hasn't yet been ruled out.",
              "facts": [
                {
                  "label": "Testing",
                  "value": "HbA1c + fasting insulin",
                  "id": "04b495397843"
                },
                {
                  "label": "Male Panel",
                  "value": "Testosterone + DFI",
                  "id": "46dbdc08c587"
                },
                {
                  "label": "Coordination",
                  "value": "With your physician",
                  "id": "0e7dd3ff95e4"
                },
                {
                  "label": "Window",
                  "value": "~3 months pre-cycle",
                  "id": "69fe17dae177"
                }
              ],
              "id": "a85957de8705",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Should You Delay Treatment?",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "This is the hardest question in the whole conversation, and it doesn’t have one answer. Optimising metabolic health takes months; ovarian reserve declines with time. For a woman of 32 with good reserve and an HbA1c well above target, three focused months is almost certainly worth it. For a woman of 41 with low AMH, the calculation is very different — delaying may cost more than the improvement gains.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "A good clinic will weigh both sides with you explicitly rather than applying a blanket rule in either direction. If you are told to lose weight first with no reference to your age or ovarian reserve, that is a conversation worth reopening.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "prosConsGrid",
              "prosLabel": "Do",
              "consLabel": "Avoid",
              "pros": [
                {
                  "text": "Get HbA1c and fasting insulin tested for both partners, not just the woman.",
                  "id": "47a6da3c79c3"
                },
                {
                  "text": "Aim for a 5–10% weight reduction if BMI is raised — measurable and achievable, unlike a vague goal.",
                  "id": "46b75fef8259"
                },
                {
                  "text": "Prioritise consistent moderate exercise; it improves insulin sensitivity independently of weight loss.",
                  "id": "1e1a98949129"
                },
                {
                  "text": "Agree a specific pre-conception HbA1c target with your physician, not a general one.",
                  "id": "8932989fc02b"
                }
              ],
              "cons": [
                {
                  "text": "Crash dieting in the weeks before a cycle — it stresses the body at exactly the wrong time.",
                  "id": "a5860d3f5cd9"
                },
                {
                  "text": "Adjusting or stopping diabetes medication without your physician's involvement.",
                  "id": "e756b48ebdaf"
                },
                {
                  "text": "Delaying treatment indefinitely for weight loss without weighing it against your age and ovarian reserve.",
                  "id": "4dbf6f602ad3"
                },
                {
                  "text": "Assuming a high BMI or a diabetes diagnosis rules out IVF — for most people, it doesn't.",
                  "id": "fc36ffbb9daf"
                }
              ],
              "id": "51ef880e7882",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "The BFI Message for You",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Metabolic health is one of the few IVF factors you can genuinely improve — we treat it as an opportunity, not a disqualification.",
                  "id": "df8459f74ff2"
                },
                {
                  "icon": "Sparkles",
                  "text": "Both partners are tested, because diabetes affects sperm quality as clearly as it affects egg quality.",
                  "id": "62144120e6cf"
                },
                {
                  "icon": "Sparkles",
                  "text": "We weigh the cost of delaying against your age and ovarian reserve openly, rather than applying a blanket rule.",
                  "id": "2997205c72cb"
                },
                {
                  "icon": "Sparkles",
                  "text": "We coordinate with your existing physician rather than working around them.",
                  "id": "bb8e8d304cd6"
                }
              ],
              "id": "9b56d6f2be09",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "What to Expect at Bavishi Fertility Institute",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Metabolic health — blood sugar, insulin resistance and thyroid function — is part of the standard work-up for both partners, not an optional add-on. Where the numbers suggest a focused pre-cycle window would help, we say so and set specific targets with your physician. Where your age or",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              },
              {
                "type": "link",
                "format": "",
                "indent": 0,
                "version": 3,
                "children": [
                  {
                    "mode": "normal",
                    "text": "ovarian reserve",
                    "type": "text",
                    "style": "",
                    "detail": 0,
                    "format": 0,
                    "version": 1
                  }
                ],
                "direction": "ltr",
                "fields": {
                  "url": "https://ivfclinic.com/treatments/ovarian-reserve",
                  "newTab": false,
                  "linkType": "custom"
                },
                "id": "002dad654e5d"
              },
              {
                "mode": "normal",
                "text": "means waiting would cost more than it gains, we say that too, and plan the cycle around managing the risk instead.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "block",
            "fields": {
              "blockType": "conclusionPanel",
              "headline": "Managing diabetes or weight and planning IVF?",
              "points": [
                {
                  "icon": "Sparkles",
                  "text": "Control matters far more than the diagnosis. Well-managed diabetes has a modest effect on an IVF cycle; poorly managed diabetes has a much larger one.",
                  "id": "054ffa91ca57"
                },
                {
                  "icon": "Sparkles",
                  "text": "Raised BMI shifts the odds rather than closing the door, and a 5 to 10 percent reduction is enough to measurably help.",
                  "id": "b4b1bf0c0409"
                },
                {
                  "icon": "Sparkles",
                  "text": "Insulin resistance, not blood sugar alone, is the mechanism that disrupts follicle development and ovulation.",
                  "id": "44b9f8ee1141"
                },
                {
                  "icon": "Sparkles",
                  "text": "Diabetes affects the male partner too, through testosterone, motility and sperm DNA fragmentation. Test both sides.",
                  "id": "652504098cc3"
                },
                {
                  "icon": "Sparkles",
                  "text": "Roughly three months is a useful optimisation window, and it is one of the few things in IVF you can actively improve.",
                  "id": "22f3f038cb06"
                },
                {
                  "icon": "Sparkles",
                  "text": "Whether to delay treatment depends on your age and ovarian reserve. A blanket rule in either direction is worth questioning.",
                  "id": "c8ff692eab14"
                }
              ],
              "id": "36dae91e61dc",
              "blockName": ""
            },
            "format": "",
            "version": 2
          },
          {
            "type": "block",
            "fields": {
              "blockType": "inlineCta",
              "accent": "rose",
              "headline": "Managing diabetes or weight and planning IVF?",
              "subtext": "Book a consultation for a full fertility and metabolic work-up for both partners.",
              "buttons": [
                {
                  "label": "Book a Consultation",
                  "url": "https://ivfclinic.com/contact",
                  "variant": "primary",
                  "id": "381b868d7a40"
                },
                {
                  "label": "IVF Treatment at BFI",
                  "url": "https://ivfclinic.com/treatments/ivf",
                  "variant": "secondary",
                  "id": "2af0cdaab412"
                }
              ],
              "id": "36dd050c0896",
              "blockName": ""
            },
            "format": "",
            "version": 2
          }
        ],
        "direction": "ltr"
      }
    }
  }
] as const;

async function main() {
  for (const doc of DOCS) {
    const blocks = doc.contentRaw.root.children.filter((n: any) => n.type === "block").length;
    console.log(
      `${DRY ? "[dry-run] " : ""}${doc.slug}\n` +
        `    title   ${doc.title}\n` +
        `    cat     ${doc.categorySlug} | ${doc.readMins} min | ${doc.faqs.length} FAQs\n` +
        `    body    ${doc.contentRaw.root.children.length} nodes (${blocks} graphical blocks)\n` +
        `    hero    ${doc.heroImageUrl}`,
    );
    if (!DRY) {
      await sanity().createOrReplace(doc as any);
      console.log("    -> written");
    }
  }
  console.log(
    DRY
      ? `\n[dry-run] ${DOCS.length} posts prepared, nothing written.`
      : `\n${DOCS.length} posts written. They appear on /blogs immediately ` +
        `(ISR revalidates within 60s).`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
