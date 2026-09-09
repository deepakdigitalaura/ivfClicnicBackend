/* =====================================================================
 * Blog registry + treatment→blog mapping
 * ---------------------------------------------------------------------
 * Powers the "Related Blogs" section on every treatment page. Real posts
 * live in BLOG_POSTS and declare which treatment slugs they relate to via
 * `treatments`, so mapping is data-driven and future-proof: publish a post,
 * tag it with treatment slugs, and it appears on those pages automatically.
 *
 * Until enough real, published posts exist for a given treatment,
 * `blogsForTreatment()` tops up the list with clearly-marked placeholder
 * cards (published: false) that point at the blog hub. No dead links, no
 * empty sections — and the architecture is ready for dynamic CMS mapping.
 * ===================================================================== */

import { destinationHref } from "@/lib/internal-links";
import type { Blog, Category } from "@/payload-types";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Canonical URL the post will live at (e.g. /blog/<slug>). */
  href: string;
  /** False = placeholder card (links to the blog hub, marked "coming soon"). */
  published: boolean;
  /** Treatment slugs this post is relevant to — drives the mapping. */
  treatments: string[];
  readMins?: number;
  image?: string;
};

/** Map a CMS `Blog` doc (as returned by getBlogsByTreatmentSlug /
 *  getBlogsByLocationSlug) into the card shape both `blogsForTreatment()`
 *  and `blogsForLocation()` already render — so real, published posts slot
 *  into the exact same placeholder-replacing logic with zero UI changes. */
export function toBlogPost(blog: Blog): BlogPost {
  const category = blog.category && typeof blog.category === "object" ? (blog.category as Category) : null;
  return {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt ?? "",
    category: category?.title ?? "Article",
    href: `/blogs/${blog.slug}`,
    published: true,
    treatments: (blog.treatmentSlugs ?? []).map((t) => t.slug),
    readMins: blog.readMins ?? undefined,
  };
}

/** Real/seed posts. Add entries here (or from a CMS) and tag `treatments`. */
export const BLOG_POSTS: BlogPost[] = [
  // Seed posts are intentionally empty for now; placeholder cards below keep
  // every treatment page populated until editorial content is published.
];

const PLACEHOLDER_TEMPLATES = [
  {
    suffix: "explained",
    category: "Guide",
    title: (name: string) => `${name}: A Complete Guide for Couples`,
    excerpt: (name: string) =>
      `Everything you need to understand about ${name} — how it works, who it helps and what to expect on your journey.`,
    readMins: 6,
  },
  {
    suffix: "cost",
    category: "Cost & Planning",
    title: (name: string) => `${name} Cost in India — What's Included & How to Plan`,
    excerpt: (name: string) =>
      `A transparent look at ${name} costs, EMI options and the Suraksha Kavach package, so you can plan with confidence.`,
    readMins: 5,
  },
  {
    suffix: "success",
    category: "Success Factors",
    title: (name: string) => `Improving Your ${name} Success Rate — Expert Tips`,
    excerpt: (name: string) =>
      `Our specialists share the factors that influence ${name} outcomes and the steps that can improve your chances.`,
    readMins: 7,
  },
];

function placeholderPost(treatmentSlug: string, shortName: string, i: number): BlogPost {
  const tpl = PLACEHOLDER_TEMPLATES[i % PLACEHOLDER_TEMPLATES.length];
  return {
    slug: `${treatmentSlug}-${tpl.suffix}`,
    title: tpl.title(shortName),
    excerpt: tpl.excerpt(shortName),
    category: tpl.category,
    href: destinationHref("blog"),
    published: false,
    treatments: [treatmentSlug],
    readMins: tpl.readMins,
  };
}

/**
 * Blogs to show on a treatment page. Returns real, published posts tagged for
 * the treatment first (CMS posts passed via `cmsPosts` — fetched server-side
 * by the route through `getBlogsByTreatmentSlug()` — take precedence over the
 * legacy `BLOG_POSTS` registry), then tops the list up to `count` with
 * clearly-marked placeholder cards. The moment real posts are published &
 * tagged, they take precedence and the placeholders fall away — no page
 * edits needed.
 */
export function blogsForTreatment(
  treatmentSlug: string,
  shortName: string,
  count = 3,
  cmsPosts: BlogPost[] = [],
): BlogPost[] {
  const real = [
    ...cmsPosts,
    ...BLOG_POSTS.filter((b) => b.published && b.treatments.includes(treatmentSlug)),
  ];
  if (real.length >= count) return real.slice(0, count);
  const fillers = Array.from({ length: count - real.length }, (_, i) =>
    placeholderPost(treatmentSlug, shortName, i),
  );
  return [...real, ...fillers];
}

const LOCATION_PLACEHOLDER_TEMPLATES = [
  {
    suffix: "best-ivf-clinic",
    category: "Choosing a Clinic",
    title: (name: string) => `How to Choose the Best IVF Clinic in ${name}`,
    excerpt: (name: string) =>
      `What to look for in an IVF clinic in ${name} — lab quality, doctor experience, transparent pricing and patient care.`,
    readMins: 5,
  },
  {
    suffix: "ivf-cost",
    category: "Cost & Planning",
    title: (name: string) => `IVF Treatment Cost in ${name} — What's Included`,
    excerpt: (name: string) =>
      `A transparent look at IVF costs in ${name}, EMI options and the Suraksha Kavach package, so you can plan with confidence.`,
    readMins: 5,
  },
  {
    suffix: "fertility-guide",
    category: "Guide",
    title: (name: string) => `Fertility Treatment in ${name}: A Patient's Guide`,
    excerpt: (name: string) =>
      `Everything to know before starting fertility treatment in ${name} — from first consultation to follow-up care.`,
    readMins: 6,
  },
];

function locationPlaceholderPost(citySlug: string, cityName: string, i: number): BlogPost {
  const tpl = LOCATION_PLACEHOLDER_TEMPLATES[i % LOCATION_PLACEHOLDER_TEMPLATES.length];
  return {
    slug: `${citySlug}-${tpl.suffix}`,
    title: tpl.title(cityName),
    excerpt: tpl.excerpt(cityName),
    category: tpl.category,
    href: destinationHref("blog"),
    published: false,
    treatments: [],
    readMins: tpl.readMins,
  };
}

/** Blogs to show on a city/centre location page — same real-first,
 *  placeholder-topped-up pattern as `blogsForTreatment()`, keyed by city
 *  slug instead of treatment slug (drives `locationSlugs` on a Blog). */
export function blogsForLocation(
  citySlug: string,
  cityName: string,
  count = 3,
  cmsPosts: BlogPost[] = [],
): BlogPost[] {
  if (cmsPosts.length >= count) return cmsPosts.slice(0, count);
  const fillers = Array.from({ length: count - cmsPosts.length }, (_, i) =>
    locationPlaceholderPost(citySlug, cityName, i),
  );
  return [...cmsPosts, ...fillers];
}
