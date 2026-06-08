import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog-article";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getBlogBySlug, getPublishedBlogSlugs } from "@/lib/payload";
import type { Author, Media } from "@/payload-types";

const DEFAULT_OG_IMAGE = "/assets/hero-mother-baby1.png";
const asObj = <T,>(v: T | number | null | undefined): T | null =>
  v && typeof v === "object" ? (v as T) : null;

/** Pre-render every published blog at build (static). New slugs render on
 *  demand (dynamicParams default) and are cached + tag-revalidated. */
export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
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

  const authorNode = author
    ? {
        "@type": "Person",
        name: author.name,
        ...(author.role ? { jobTitle: author.role } : {}),
        ...(author.sameAs?.length ? { sameAs: author.sameAs.map((s) => s.url).filter(Boolean) } : {}),
      }
    : undefined;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: blog.title,
      ...(blog.excerpt ? { description: blog.excerpt } : {}),
      ...(hero?.url ? { image: abs(hero.url) } : {}),
      ...(blog.publishedAt ? { datePublished: blog.publishedAt } : {}),
      ...(blog.updatedAt ? { dateModified: blog.updatedAt } : {}),
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
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <BlogArticle blog={blog} />
    </>
  );
}
