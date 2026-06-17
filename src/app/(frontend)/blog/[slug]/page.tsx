import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog-article";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { getBlogBySlug, getPublishedBlogSlugs, getRelatedBlogs } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";
import { extractHeadings } from "@/lib/headings";
import type { Author, Category, Media } from "@/payload-types";

const DEFAULT_OG_IMAGE = "/assets/hero-mother-baby1.png";
const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

/** ISR: re-fetch from DB every 6 hours so enrichment / CMS edits go live
 *  without a full redeploy. Pages are still edge-cached between refreshes. */
export const revalidate = 21600;

/** Pre-render every published blog at build (static). New slugs render on
 *  demand (dynamicParams default) and are cached + tag-revalidated. */
export async function generateStaticParams() {
  try {
    const slugs = await getPublishedBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  const path = `/blog/${slug}`;
  const hero = asObj<Media>(blog.heroImage ?? undefined);
  const ogImg = asObj<Media>(blog.seo?.ogImage ?? undefined);
  const title = blog.seo?.metaTitle || blog.title;
  const description = blog.seo?.metaDescription || blog.excerpt || undefined;
  const image = ogImg?.url || hero?.url || DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: blog.seo?.ogTitle || title,
      description: blog.seo?.ogDescription || description,
      url: abs(path),
      type: "article",
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const path = `/blog/${slug}`;
  const url = abs(path);
  const hero = asObj<Media>(blog.heroImage ?? undefined);
  const author = asObj<Author>(blog.author);
  const reviewedBy = asObj<Author>(blog.reviewedBy ?? undefined);
  const category = asObj<Category>(blog.category ?? undefined);
  const dateModified = blog.lastUpdatedAt || blog.updatedAt;

  const authorNode = author
    ? {
        "@type": "Person",
        name: author.name,
        ...(author.role ? { jobTitle: author.role } : {}),
        ...(author.sameAs?.length ? { sameAs: author.sameAs.map((s) => s.url).filter(Boolean) } : {}),
      }
    : undefined;

  const treatmentSlugs = (blog.treatmentSlugs ?? []).map((t) => t.slug);
  const [relatedBlogs, headings] = await Promise.all([
    getRelatedBlogs(slug, treatmentSlugs, category?.id ?? null),
    Promise.resolve(extractHeadings(blog.content)),
  ]);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: blog.title,
      ...(blog.excerpt ? { description: blog.excerpt } : {}),
      ...(hero?.url ? { image: abs(hero.url) } : {}),
      ...(blog.publishedAt ? { datePublished: blog.publishedAt } : {}),
      ...(dateModified ? { dateModified } : {}),
      ...(authorNode ? { author: authorNode } : {}),
      ...(reviewedBy ? { reviewedBy: { "@type": "Person", name: reviewedBy.name } } : {}),
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
      mainEntityOfPage: url,
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: blog.title, url: path },
    ]),
    ...(blog.faqs?.length ? [faqSchema(blog.faqs.map((f) => ({ q: f.question, a: f.answer })))] : []),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <BlogArticle blog={blog} relatedBlogs={relatedBlogs.map(toBlogPost)} headings={headings} />
    </>
  );
}
