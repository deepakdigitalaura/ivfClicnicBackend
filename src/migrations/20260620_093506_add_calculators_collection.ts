import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_calculators_slug" AS ENUM('ivf-success-rate', 'ivf-cost', 'ovulation', 'natural-pregnancy', 'fertile-period', 'amh-level', 'semen-analysis', 'miscarriage-risk');
  CREATE TABLE "calculators_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "calculators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_calculators_slug" NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"disclaimer" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "calculators_id" integer;
  ALTER TABLE "calculators_faqs" ADD CONSTRAINT "calculators_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calculators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calculators" ADD CONSTRAINT "calculators_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "calculators_faqs_order_idx" ON "calculators_faqs" USING btree ("_order");
  CREATE INDEX "calculators_faqs_parent_id_idx" ON "calculators_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "calculators_slug_idx" ON "calculators" USING btree ("slug");
  CREATE INDEX "calculators_seo_seo_og_image_idx" ON "calculators" USING btree ("seo_og_image_id");
  CREATE INDEX "calculators_updated_at_idx" ON "calculators" USING btree ("updated_at");
  CREATE INDEX "calculators_created_at_idx" ON "calculators" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calculators_fk" FOREIGN KEY ("calculators_id") REFERENCES "public"."calculators"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_calculators_id_idx" ON "payload_locked_documents_rels" USING btree ("calculators_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calculators_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calculators" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "calculators_faqs" CASCADE;
  DROP TABLE "calculators" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_calculators_fk";
  
  DROP INDEX "payload_locked_documents_rels_calculators_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "calculators_id";
  DROP TYPE "public"."enum_calculators_slug";`)
}
