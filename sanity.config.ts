import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "bfi-cms",
  title: "BFI Admin",
  basePath: "/studio",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("BFI CMS")
          .items([
            S.listItem()
              .title("🏠 Homepage")
              .child(S.document().schemaType("homepage").documentId("homepage")),
            S.listItem()
              .title("⚙️ Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("ℹ️ About Page")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.divider(),
            S.documentTypeListItem("treatment").title("💉 Treatments"),
            S.documentTypeListItem("service").title("🏥 Services"),
            S.documentTypeListItem("city").title("📍 Locations — Cities"),
            S.documentTypeListItem("centre").title("🏢 Locations — Centres"),
            S.divider(),
            S.documentTypeListItem("inquiry").title("📨 Inquiries"),
            S.documentTypeListItem("doctor").title("🩺 Doctors"),
            S.documentTypeListItem("testimonial").title("⭐ Testimonials"),
            S.documentTypeListItem("educationVideo").title("🎬 Education Videos"),
            S.documentTypeListItem("blog").title("📝 Blog Posts"),
            S.divider(),
            S.listItem()
              .title("🤖 Robots.txt")
              .child(S.document().schemaType("robotsConfig").documentId("robotsConfig")),
            S.listItem()
              .title("📜 Script Injection")
              .child(S.document().schemaType("scriptsConfig").documentId("scriptsConfig")),
            S.listItem()
              .title("↩️ Redirects")
              .child(S.document().schemaType("redirectsConfig").documentId("redirectsConfig")),
            S.listItem()
              .title("🗺️ Sitemap")
              .child(S.document().schemaType("sitemapConfig").documentId("sitemapConfig")),
            S.listItem()
              .title("📊 Structured Data (JSON-LD)")
              .child(S.document().schemaType("schemaOrgConfig").documentId("schemaOrgConfig")),
            S.divider(),
            S.documentTypeListItem("pageSeo").title("📄 Page SEO"),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemas },
});
