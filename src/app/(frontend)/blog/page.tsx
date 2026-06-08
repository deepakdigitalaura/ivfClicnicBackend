import type { Metadata } from "next";
import { BlogHub } from "@/components/blog-hub";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getBlogs } from "@/lib/payload";

const PATH = "/blog";

export const metadata: Metadata = {
  title: "Fertility & IVF Blog — Bavishi Fertility Institute",
  description:
    "Expert, compassionate guidance on fertility, IVF and your journey to parenthood — articles reviewed by Bavishi Fertility Institute specialists.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Fertility & IVF Blog — Bavishi Fertility Institute",
    description:
      "Expert, compassionate guidance on fertility, IVF and parenthood — reviewed by our specialists.",
    url: abs(PATH),
    type: "website",
    images: ["/assets/hero-mother-baby1.png"],
  },
};

export default async function Page() {
  const posts = await getBlogs();
  const url = abs(PATH);

  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: "Fertility & IVF Blog",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <BlogHub posts={posts} />
    </>
  );
}
