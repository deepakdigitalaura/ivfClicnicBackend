import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blogs_treatment_slugs_slug" AS ENUM('ivf', 'icsi', 'iui', 'picsi', 'imsi', 'macs', 'spindle-view-icsi', 'blastocyst-transfer', 'laser-hatching', 'ivf-failure', 'egg-donation', 'sperm-donation', 'embryo-donation', 'male-infertility', 'female-infertility', 'fertility-preservation', 'endometriosis', 'azoospermia', 'cryopreservation', 'recurrent-miscarriage', 'oligospermia', 'asthenospermia', 'surgical-sperm-retrieval', 'varicocele', 'erectile-dysfunction', 'conceive-naturally', 'prp-infertility', 'pcos', 'ovarian-reserve', 'ovarian-rejuvenation', 'fibroids');
  CREATE TYPE "public"."enum_blogs_location_slugs_slug" AS ENUM('ahmedabad', 'mumbai', 'vadodara', 'surat', 'bhuj', 'bhavnagar', 'anand', 'varanasi');
  CREATE TYPE "public"."enum__blogs_v_version_treatment_slugs_slug" AS ENUM('ivf', 'icsi', 'iui', 'picsi', 'imsi', 'macs', 'spindle-view-icsi', 'blastocyst-transfer', 'laser-hatching', 'ivf-failure', 'egg-donation', 'sperm-donation', 'embryo-donation', 'male-infertility', 'female-infertility', 'fertility-preservation', 'endometriosis', 'azoospermia', 'cryopreservation', 'recurrent-miscarriage', 'oligospermia', 'asthenospermia', 'surgical-sperm-retrieval', 'varicocele', 'erectile-dysfunction', 'conceive-naturally', 'prp-infertility', 'pcos', 'ovarian-reserve', 'ovarian-rejuvenation', 'fibroids');
  CREATE TYPE "public"."enum__blogs_v_version_location_slugs_slug" AS ENUM('ahmedabad', 'mumbai', 'vadodara', 'surat', 'bhuj', 'bhavnagar', 'anand', 'varanasi');
  ALTER TABLE "blogs_treatment_slugs" ALTER COLUMN "slug" SET DATA TYPE "public"."enum_blogs_treatment_slugs_slug" USING "slug"::"public"."enum_blogs_treatment_slugs_slug";
  ALTER TABLE "blogs_location_slugs" ALTER COLUMN "slug" SET DATA TYPE "public"."enum_blogs_location_slugs_slug" USING "slug"::"public"."enum_blogs_location_slugs_slug";
  ALTER TABLE "_blogs_v_version_treatment_slugs" ALTER COLUMN "slug" SET DATA TYPE "public"."enum__blogs_v_version_treatment_slugs_slug" USING "slug"::"public"."enum__blogs_v_version_treatment_slugs_slug";
  ALTER TABLE "_blogs_v_version_location_slugs" ALTER COLUMN "slug" SET DATA TYPE "public"."enum__blogs_v_version_location_slugs_slug" USING "slug"::"public"."enum__blogs_v_version_location_slugs_slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blogs_treatment_slugs" ALTER COLUMN "slug" SET DATA TYPE varchar;
  ALTER TABLE "blogs_location_slugs" ALTER COLUMN "slug" SET DATA TYPE varchar;
  ALTER TABLE "_blogs_v_version_treatment_slugs" ALTER COLUMN "slug" SET DATA TYPE varchar;
  ALTER TABLE "_blogs_v_version_location_slugs" ALTER COLUMN "slug" SET DATA TYPE varchar;
  DROP TYPE "public"."enum_blogs_treatment_slugs_slug";
  DROP TYPE "public"."enum_blogs_location_slugs_slug";
  DROP TYPE "public"."enum__blogs_v_version_treatment_slugs_slug";
  DROP TYPE "public"."enum__blogs_v_version_location_slugs_slug";`)
}
