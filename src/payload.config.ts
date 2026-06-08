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
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Blogs } from "./collections/Blogs";
import { Authors } from "./collections/Authors";
import { Categories } from "./collections/Categories";
import { SiteSettings } from "./globals/SiteSettings";
import { ContactInfo } from "./globals/ContactInfo";
import { BlogHub } from "./globals/BlogHub";
import { Footer } from "./globals/Footer";
import { Header } from "./globals/Header";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Pages, Blogs, Authors, Categories, Media, Users],
  globals: [SiteSettings, ContactInfo, BlogHub, Footer, Header],
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
