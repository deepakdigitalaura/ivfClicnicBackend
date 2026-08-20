import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "testimonial_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"patient_name" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"youtube_id" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "education_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" varchar DEFAULT 'IVF' NOT NULL,
  	"youtube_id" varchar NOT NULL,
  	"description" varchar,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonial_videos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "education_videos_id" integer;
  CREATE INDEX "testimonial_videos_updated_at_idx" ON "testimonial_videos" USING btree ("updated_at");
  CREATE INDEX "testimonial_videos_created_at_idx" ON "testimonial_videos" USING btree ("created_at");
  CREATE INDEX "education_videos_updated_at_idx" ON "education_videos" USING btree ("updated_at");
  CREATE INDEX "education_videos_created_at_idx" ON "education_videos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonial_videos_fk" FOREIGN KEY ("testimonial_videos_id") REFERENCES "public"."testimonial_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_videos_fk" FOREIGN KEY ("education_videos_id") REFERENCES "public"."education_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_testimonial_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonial_videos_id");
  CREATE INDEX "payload_locked_documents_rels_education_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("education_videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonial_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "education_videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "testimonial_videos" CASCADE;
  DROP TABLE "education_videos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonial_videos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_education_videos_fk";
  
  DROP INDEX "payload_locked_documents_rels_testimonial_videos_id_idx";
  DROP INDEX "payload_locked_documents_rels_education_videos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonial_videos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "education_videos_id";`)
}
