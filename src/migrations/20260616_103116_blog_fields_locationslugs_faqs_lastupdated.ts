import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "blogs_location_slugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar
  );
  
  CREATE TABLE "blogs_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "_blogs_v_version_location_slugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "blogs" ADD COLUMN "last_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_blogs_v" ADD COLUMN "version_last_updated_at" timestamp(3) with time zone;
  ALTER TABLE "blogs_location_slugs" ADD CONSTRAINT "blogs_location_slugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_faqs" ADD CONSTRAINT "blogs_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_version_location_slugs" ADD CONSTRAINT "_blogs_v_version_location_slugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_version_faqs" ADD CONSTRAINT "_blogs_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blogs_location_slugs_order_idx" ON "blogs_location_slugs" USING btree ("_order");
  CREATE INDEX "blogs_location_slugs_parent_id_idx" ON "blogs_location_slugs" USING btree ("_parent_id");
  CREATE INDEX "blogs_faqs_order_idx" ON "blogs_faqs" USING btree ("_order");
  CREATE INDEX "blogs_faqs_parent_id_idx" ON "blogs_faqs" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_version_location_slugs_order_idx" ON "_blogs_v_version_location_slugs" USING btree ("_order");
  CREATE INDEX "_blogs_v_version_location_slugs_parent_id_idx" ON "_blogs_v_version_location_slugs" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_version_faqs_order_idx" ON "_blogs_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_blogs_v_version_faqs_parent_id_idx" ON "_blogs_v_version_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "blogs_location_slugs" CASCADE;
  DROP TABLE "blogs_faqs" CASCADE;
  DROP TABLE "_blogs_v_version_location_slugs" CASCADE;
  DROP TABLE "_blogs_v_version_faqs" CASCADE;
  ALTER TABLE "blogs" DROP COLUMN "last_updated_at";
  ALTER TABLE "_blogs_v" DROP COLUMN "version_last_updated_at";`)
}
