import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { SitemapPage } from "@/components/sitemap-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { abs, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getPageBySlug, getPublishedPageSlugs } from "@/lib/payload";
import { withPageSeoOverride } from "@/lib/page-seo";

const KNOWN_SLUGS = new Set([
  "privacy-policy",
  "terms-of-service",
  "refund-policy",
  "cookie-policy",
  "sitemap",
]);

export const revalidate = 21600;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPageSlugs();
    return slugs
      .filter((s) => KNOWN_SLUGS.has(s))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  if (!KNOWN_SLUGS.has(slug)) return {};
  if (slug === "sitemap") {
    return withPageSeoOverride("/sitemap", {
      title: "Sitemap — Bavishi Fertility Institute",
      description: "Browse all pages on the Bavishi Fertility Institute website.",
      alternates: { canonical: "/sitemap" },
    });
  }
  const page = await getPageBySlug(slug);
  if (!page) return {};
  const path = `/${slug}`;
  const title = page.seo?.metaTitle || page.title;
  const description = page.seo?.metaDescription || page.hero?.subtitle || undefined;
  return withPageSeoOverride(path, {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo?.ogTitle || title,
      description: page.seo?.ogDescription || description,
      url: abs(path),
      type: "website",
    },
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!KNOWN_SLUGS.has(slug)) notFound();

  if (slug === "sitemap") {
    const graph = [
      {
        "@type": "WebPage",
        "@id": `${abs("/sitemap")}#webpage`,
        url: abs("/sitemap"),
        name: "Sitemap",
        isPartOf: { "@id": WEBSITE_ID },
      },
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Sitemap", url: "/sitemap" },
      ]),
    ];
    return (
      <>
        <JsonLd graph={graph} />
        <PageSeoSchema path="/sitemap" />
        <SitemapPage />
      </>
    );
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const path = `/${slug}`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: page.title,
      isPartOf: { "@id": WEBSITE_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: page.title, url: path },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={path} />
      <LegalPage
        title={page.title}
        subtitle={page.hero?.subtitle}
        content={(page as unknown as Record<string, unknown>).content}
        lastUpdated={page.updatedAt}
      />
    </>
  );
}
