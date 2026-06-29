import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "content" jsonb;
    ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_content" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN IF EXISTS "content";
    ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_content";
  `)
}
