import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blogs" ADD COLUMN "hero_text_dark" boolean DEFAULT false;
    ALTER TABLE "_blogs_v" ADD COLUMN "version_hero_text_dark" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "hero_text_dark";
    ALTER TABLE "_blogs_v" DROP COLUMN IF EXISTS "version_hero_text_dark";
  `)
}
