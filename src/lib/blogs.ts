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
 * the treatment first, then tops the list up to `count` with clearly-marked
 * placeholder cards. The moment real posts are published & tagged, they take
 * precedence and the placeholders fall away — no page edits needed.
 */
export function blogsForTreatment(
  treatmentSlug: string,
  shortName: string,
  count = 3,
): BlogPost[] {
  const real = BLOG_POSTS.filter(
    (b) => b.published && b.treatments.includes(treatmentSlug),
  );
  if (real.length >= count) return real.slice(0, count);
  const fillers = Array.from({ length: count - real.length }, (_, i) =>
    placeholderPost(treatmentSlug, shortName, i),
  );
  return [...real, ...fillers];
}
