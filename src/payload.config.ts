/* =====================================================================
 * Payload CMS configuration — Phase 1 POC
 * ---------------------------------------------------------------------
 * Runs ALONGSIDE the existing TypeScript content system. The live site
 * (src/app/(frontend)) is untouched; Payload mounts under src/app/(payload)
 * and exposes /admin + /api. Local PostgreSQL (port 5433) is the datastore.
 *
 * Phase 1 collections: Users (admin auth), Media (uploads). The Pages
 * collection that powers the Contact-page POC is added in the next step.
 * ===================================================================== */
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Blogs } from "./collections/Blogs";
import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { Services } from "./collections/Services";
import { Doctors } from "./collections/Doctors";
import { Treatments } from "./collections/Treatments";
import { Cities } from "./collections/Cities";
import { Centres } from "./collections/Centres";
import { Inquiries } from "./collections/Inquiries";
import { Testimonials } from "./collections/Testimonials";
import { Redirects } from "./collections/Redirects";
import { SiteSettings } from "./globals/SiteSettings";
import { ContactInfo } from "./globals/ContactInfo";
import { BlogHub } from "./globals/BlogHub";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";
import { Homepage } from "./globals/Homepage";
import { About } from "./globals/About";
import { SeoSettings } from "./globals/SeoSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    // Force the brand light theme — the admin never renders the default dark
    // (black) mode, and the light/dark toggle is removed. Brand colours are
    // layered on top via src/app/(payload)/admin-theme.css.
    theme: "light",
    importMap: { baseDir: path.resolve(dirname) },
    // Friendly welcome panel at the top of the Dashboard for non-technical staff
    // (stat cards + quick actions + a "where to find things" guide). Payload's
    // own grouped collection/global cards still render below it.
    components: {
      beforeDashboard: ["/components/admin/WelcomeDashboard#WelcomeDashboard"],
      // Forces the sidebar open on desktop (a closed Payload nav is `inert` =
      // unclickable), so staff always see every section and links stay clickable.
      // Plus a pinned "Pages & Builder" link at the top → the inline-editor launchpad.
      beforeNavLinks: [
        "/components/admin/ForceNavOpen#ForceNavOpen",
        "/components/admin/PagesBuilderNavLink#PagesBuilderNavLink",
      ],
      // Clinic branding on the login screen + sidebar header (replaces the
      // default Payload mark). Plain <img> of /public/assets/logo.png.
      graphics: {
        Logo: "/components/admin/BrandLogo#BrandLogo",
        Icon: "/components/admin/BrandLogo#BrandIcon",
      },
    },
  },
  collections: [Inquiries, Testimonials, Pages, Blogs, Authors, Categories, Services, Doctors, Treatments, Cities, Centres, Redirects, Media, Users],
  globals: [SiteSettings, ContactInfo, BlogHub, Footer, Header, Homepage, About, SeoSettings],
  // Vercel's serverless functions have a read-only filesystem (only /tmp is
  // writable) — writing uploads to Media's local `staticDir` 500s in production
  // (ENOENT mkdir '/vercel'). Route uploads to Vercel Blob instead when a store
  // is connected (BLOB_READ_WRITE_TOKEN present).
  //
  // IMPORTANT: the plugin call itself must always run, even when the token is
  // absent (e.g. local dev) — it self-disables via its own `!token` check, but
  // still always registers its client component in the import map. Wrapping
  // this call in an `if (token)` (as an earlier version of this file did)
  // causes `payload generate:importmap` to omit that component when run
  // without the token locally, producing a prod-only "PayloadComponent not
  // found in importMap" admin-panel blank-screen — see the plugin's own
  // initClientUploads comment ("always part of the import map, to avoid
  // import map discrepancies between dev and prod").
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
  sharp,
});
