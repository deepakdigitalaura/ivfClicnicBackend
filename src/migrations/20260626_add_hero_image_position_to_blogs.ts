import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blogs" ADD COLUMN "hero_image_position" varchar DEFAULT 'center center';
    ALTER TABLE "_blogs_v" ADD COLUMN "version_hero_image_position" varchar DEFAULT 'center center';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "hero_image_position";
    ALTER TABLE "_blogs_v" DROP COLUMN IF EXISTS "version_hero_image_position";
  `)
}
