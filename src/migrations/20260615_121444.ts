import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'in-progress', 'closed');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blogs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blogs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_process_steps_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_services_why_us_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_services_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_services_schema_type" AS ENUM('MedicalProcedure', 'MedicalTest', 'MedicalTherapy');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_process_steps_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__services_v_version_why_us_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__services_v_version_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__services_v_version_schema_type" AS ENUM('MedicalProcedure', 'MedicalTest', 'MedicalTherapy');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_doctors_nav_role" AS ENUM('senior-specialist', 'specialist');
  CREATE TYPE "public"."enum_doctors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__doctors_v_version_nav_role" AS ENUM('senior-specialist', 'specialist');
  CREATE TYPE "public"."enum__doctors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_treatments_types_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_treatments_process_steps_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_treatments_technology_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_treatments_why_us_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_treatments_nav_category" AS ENUM('advanced-ivf', 'donor-services', 'male-infertility', 'female-infertility', 'fertility-preservation', 'maternity-services');
  CREATE TYPE "public"."enum_treatments_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__treatments_v_version_types_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__treatments_v_version_process_steps_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__treatments_v_version_technology_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__treatments_v_version_why_us_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum__treatments_v_version_nav_category" AS ENUM('advanced-ivf', 'donor-services', 'male-infertility', 'female-infertility', 'fertility-preservation', 'maternity-services');
  CREATE TYPE "public"."enum__treatments_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_centres_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__centres_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_contact_info_cards_icon" AS ENUM('Phone', 'MessageCircle', 'Mail', 'Clock', 'MapPin', 'Calendar');
  CREATE TYPE "public"."enum_contact_info_cards_channel" AS ENUM('none', 'phone', 'email', 'whatsapp');
  CREATE TYPE "public"."enum_footer_nav_groups_links_channel" AS ENUM('none', 'phone', 'email', 'whatsapp');
  CREATE TYPE "public"."enum_footer_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'linkedin', 'twitter');
  CREATE TYPE "public"."enum_header_cta_style_variant" AS ENUM('primary');
  CREATE TYPE "public"."enum_homepage_layout_section" AS ENUM('hero', 'stats', 'whyBavishi', 'suraksha', 'treatments', 'successStories', 'videoHub', 'about', 'doctors', 'whyChoose', 'awards', 'media', 'testimonials', 'events', 'blogs', 'locations', 'faq', 'calculators', 'inquiry', 'finalCta');
  CREATE TYPE "public"."enum_homepage_why_bavishi_cards_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_homepage_treatments_items_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TYPE "public"."enum_about_page_trust_pillars_icon" AS ENUM('ScanLine', 'Feather', 'Baby', 'Stethoscope', 'ShieldCheck', 'Users', 'HeartPulse', 'Activity', 'ClipboardList', 'CalendarCheck', 'Eye', 'Clock', 'Microscope', 'Sparkles', 'Hand', 'FlaskConical', 'Filter', 'Magnet', 'Layers', 'Zap', 'Egg', 'Droplets', 'Snowflake', 'Dna', 'Beaker', 'Target', 'Leaf', 'ListChecks', 'ClipboardCheck', 'Syringe', 'Award');
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"treatment" varchar,
  	"location" varchar,
  	"message" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"source" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"quote" varchar NOT NULL,
  	"role" varchar,
  	"published" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_eyebrow" varchar,
  	"hero_lead" varchar,
  	"hero_em" varchar,
  	"hero_subtitle" varchar,
  	"section_labels_network_eyebrow" varchar,
  	"section_labels_network_subtitle" varchar,
  	"section_labels_faq_eyebrow" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_lead" varchar,
  	"version_hero_em" varchar,
  	"version_hero_subtitle" varchar,
  	"version_section_labels_network_eyebrow" varchar,
  	"version_section_labels_network_subtitle" varchar,
  	"version_section_labels_faq_eyebrow" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "blogs_treatment_slugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"author_id" integer,
  	"reviewed_by_id" integer,
  	"category_id" integer,
  	"read_mins" numeric,
  	"published_at" timestamp(3) with time zone,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blogs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blogs_v_version_treatment_slugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_reviewed_by_id" integer,
  	"version_category_id" integer,
  	"version_read_mins" numeric,
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blogs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "authors_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar,
  	"credentials" varchar,
  	"avatar_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge" varchar
  );
  
  CREATE TABLE "services_overview_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_who_for_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_services_process_steps_icon",
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "services_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_services_why_us_items_icon",
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "services_info_note_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "services_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"desc" varchar,
  	"icon" "enum_services_icon",
  	"href" varchar,
  	"published" boolean,
  	"fallback" varchar,
  	"schema_type" "enum_services_schema_type" DEFAULT 'MedicalProcedure',
  	"short_name" varchar,
  	"breadcrumb_name" varchar,
  	"reviewer_slug" varchar,
  	"last_reviewed" varchar,
  	"hero_eyebrow" varchar,
  	"hero_h1" varchar,
  	"hero_h1_em" varchar,
  	"hero_tagline" varchar,
  	"hero_image" varchar,
  	"hero_image_alt" varchar,
  	"hero_hero_photo_id" integer,
  	"overview_heading_lead" varchar,
  	"overview_heading_em" varchar,
  	"overview_aside_title" varchar,
  	"overview_aside_body" varchar,
  	"benefits_heading_lead" varchar,
  	"benefits_heading_em" varchar,
  	"benefits_subtitle" varchar,
  	"who_for_heading_lead" varchar,
  	"who_for_heading_em" varchar,
  	"who_for_subtitle" varchar,
  	"process_heading_lead" varchar,
  	"process_heading_em" varchar,
  	"process_subtitle" varchar,
  	"process_note" varchar,
  	"why_us_heading_lead" varchar,
  	"why_us_heading_em" varchar,
  	"info_note_heading_lead" varchar,
  	"info_note_heading_em" varchar,
  	"section_labels_benefits_eyebrow" varchar,
  	"section_labels_who_for_eyebrow" varchar,
  	"section_labels_process_eyebrow" varchar,
  	"section_labels_why_us_eyebrow" varchar,
  	"section_labels_info_note_eyebrow" varchar,
  	"section_labels_faq_eyebrow" varchar,
  	"section_labels_related_eyebrow" varchar,
  	"section_labels_visit_eyebrow" varchar,
  	"section_labels_faq_title" varchar,
  	"section_labels_related_title" varchar,
  	"section_labels_visit_title" varchar,
  	"section_labels_cta_title" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v_version_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_overview_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_who_for_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__services_v_version_process_steps_icon",
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__services_v_version_why_us_items_icon",
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_info_note_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_desc" varchar,
  	"version_icon" "enum__services_v_version_icon",
  	"version_href" varchar,
  	"version_published" boolean,
  	"version_fallback" varchar,
  	"version_schema_type" "enum__services_v_version_schema_type" DEFAULT 'MedicalProcedure',
  	"version_short_name" varchar,
  	"version_breadcrumb_name" varchar,
  	"version_reviewer_slug" varchar,
  	"version_last_reviewed" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_h1" varchar,
  	"version_hero_h1_em" varchar,
  	"version_hero_tagline" varchar,
  	"version_hero_image" varchar,
  	"version_hero_image_alt" varchar,
  	"version_hero_hero_photo_id" integer,
  	"version_overview_heading_lead" varchar,
  	"version_overview_heading_em" varchar,
  	"version_overview_aside_title" varchar,
  	"version_overview_aside_body" varchar,
  	"version_benefits_heading_lead" varchar,
  	"version_benefits_heading_em" varchar,
  	"version_benefits_subtitle" varchar,
  	"version_who_for_heading_lead" varchar,
  	"version_who_for_heading_em" varchar,
  	"version_who_for_subtitle" varchar,
  	"version_process_heading_lead" varchar,
  	"version_process_heading_em" varchar,
  	"version_process_subtitle" varchar,
  	"version_process_note" varchar,
  	"version_why_us_heading_lead" varchar,
  	"version_why_us_heading_em" varchar,
  	"version_info_note_heading_lead" varchar,
  	"version_info_note_heading_em" varchar,
  	"version_section_labels_benefits_eyebrow" varchar,
  	"version_section_labels_who_for_eyebrow" varchar,
  	"version_section_labels_process_eyebrow" varchar,
  	"version_section_labels_why_us_eyebrow" varchar,
  	"version_section_labels_info_note_eyebrow" varchar,
  	"version_section_labels_faq_eyebrow" varchar,
  	"version_section_labels_related_eyebrow" varchar,
  	"version_section_labels_visit_eyebrow" varchar,
  	"version_section_labels_faq_title" varchar,
  	"version_section_labels_related_title" varchar,
  	"version_section_labels_visit_title" varchar,
  	"version_section_labels_cta_title" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "doctors_medical_specialty" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_treatments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_alumni_of" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_member_of" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_training" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "doctors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"credentials" varchar,
  	"specialty" varchar,
  	"role" varchar,
  	"image" varchar,
  	"photo_id" integer,
  	"experience_label" varchar,
  	"experience_years" numeric,
  	"short_bio" varchar,
  	"verified" boolean DEFAULT false,
  	"visits_all_centres" boolean DEFAULT false,
  	"nav_role" "enum_doctors_nav_role",
  	"nav_order" numeric,
  	"profile_labels_about_eyebrow" varchar,
  	"profile_labels_treatments_eyebrow" varchar,
  	"profile_labels_consults_eyebrow" varchar,
  	"profile_labels_consults_subtitle" varchar,
  	"profile_labels_visits_heading" varchar,
  	"profile_labels_visits_paragraph" varchar,
  	"profile_labels_doctor_speak_eyebrow" varchar,
  	"profile_labels_doctor_speak_subtitle" varchar,
  	"profile_labels_stories_eyebrow" varchar,
  	"profile_labels_stories_subtitle" varchar,
  	"profile_labels_cta_heading" varchar,
  	"profile_labels_about_title" varchar,
  	"profile_labels_treatments_title" varchar,
  	"profile_labels_stories_title" varchar,
  	"profile_labels_consults_title" varchar,
  	"profile_labels_doctor_speak_title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_doctors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_doctors_v_version_medical_specialty" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_treatments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_alumni_of" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_member_of" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_training" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_credentials" varchar,
  	"version_specialty" varchar,
  	"version_role" varchar,
  	"version_image" varchar,
  	"version_photo_id" integer,
  	"version_experience_label" varchar,
  	"version_experience_years" numeric,
  	"version_short_bio" varchar,
  	"version_verified" boolean DEFAULT false,
  	"version_visits_all_centres" boolean DEFAULT false,
  	"version_nav_role" "enum__doctors_v_version_nav_role",
  	"version_nav_order" numeric,
  	"version_profile_labels_about_eyebrow" varchar,
  	"version_profile_labels_treatments_eyebrow" varchar,
  	"version_profile_labels_consults_eyebrow" varchar,
  	"version_profile_labels_consults_subtitle" varchar,
  	"version_profile_labels_visits_heading" varchar,
  	"version_profile_labels_visits_paragraph" varchar,
  	"version_profile_labels_doctor_speak_eyebrow" varchar,
  	"version_profile_labels_doctor_speak_subtitle" varchar,
  	"version_profile_labels_stories_eyebrow" varchar,
  	"version_profile_labels_stories_subtitle" varchar,
  	"version_profile_labels_cta_heading" varchar,
  	"version_profile_labels_about_title" varchar,
  	"version_profile_labels_treatments_title" varchar,
  	"version_profile_labels_stories_title" varchar,
  	"version_profile_labels_consults_title" varchar,
  	"version_profile_labels_doctor_speak_title" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__doctors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "treatments_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_what_is_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "treatments_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_types_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_treatments_types_items_icon",
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "treatments_who_needs_it_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_treatments_process_steps_icon",
  	"n" varchar,
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "treatments_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "treatments_timeline_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_technology_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_treatments_technology_items_icon",
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "treatments_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_treatments_why_us_items_icon",
  	"t" varchar,
  	"d" varchar
  );
  
  CREATE TABLE "treatments_success_factors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_cost_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_risks_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"t" varchar,
  	"d" varchar,
  	"help" varchar
  );
  
  CREATE TABLE "treatments_preparation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "treatments_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "treatments_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar
  );
  
  CREATE TABLE "treatments_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"you_tube_id" varchar,
  	"name" varchar,
  	"quote" varchar,
  	"location" varchar
  );
  
  CREATE TABLE "treatments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"href" varchar,
  	"name" varchar,
  	"short_name" varchar,
  	"alternate_name" varchar,
  	"breadcrumb_name" varchar,
  	"reviewer_slug" varchar,
  	"last_reviewed" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_og_image" varchar,
  	"nav_category" "enum_treatments_nav_category",
  	"nav_order" numeric,
  	"procedure_procedure_type" varchar,
  	"procedure_body_location" varchar,
  	"procedure_how_performed" varchar,
  	"procedure_followup" varchar,
  	"hero_eyebrow" varchar,
  	"hero_h1" varchar,
  	"hero_h1_em" varchar,
  	"hero_tagline" varchar,
  	"hero_image" varchar,
  	"hero_image_alt" varchar,
  	"hero_hero_photo_id" integer,
  	"what_is_heading_lead" varchar,
  	"what_is_heading_em" varchar,
  	"what_is_aside_title" varchar,
  	"what_is_aside_body" varchar,
  	"benefits_heading_lead" varchar,
  	"benefits_heading_em" varchar,
  	"benefits_subtitle" varchar,
  	"types_heading_lead" varchar,
  	"types_heading_em" varchar,
  	"types_subtitle" varchar,
  	"who_needs_it_heading_lead" varchar,
  	"who_needs_it_heading_em" varchar,
  	"who_needs_it_subtitle" varchar,
  	"process_heading_lead" varchar,
  	"process_heading_em" varchar,
  	"process_subtitle" varchar,
  	"process_note" varchar,
  	"timeline_heading_lead" varchar,
  	"timeline_heading_em" varchar,
  	"timeline_subtitle" varchar,
  	"timeline_chips_note" varchar,
  	"video_eyebrow" varchar,
  	"video_title" varchar,
  	"video_description" varchar,
  	"video_heading_lead" varchar,
  	"video_heading_em" varchar,
  	"technology_heading_lead" varchar,
  	"technology_heading_em" varchar,
  	"technology_eyebrow" varchar,
  	"technology_subtitle" varchar,
  	"why_us_heading_lead" varchar,
  	"why_us_heading_em" varchar,
  	"success_heading" varchar,
  	"success_description" varchar,
  	"success_callout" varchar,
  	"success_note" varchar,
  	"cost_heading" varchar,
  	"cost_description" varchar,
  	"risks_heading_lead" varchar,
  	"risks_heading_em" varchar,
  	"risks_subtitle" varchar,
  	"preparation_heading_lead" varchar,
  	"preparation_heading_em" varchar,
  	"preparation_subtitle" varchar,
  	"cta_heading" varchar,
  	"cta_heading_em" varchar,
  	"cta_subtitle" varchar,
  	"labels_what_is" varchar,
  	"labels_benefits" varchar,
  	"labels_types" varchar,
  	"labels_who_needs_it" varchar,
  	"labels_process" varchar,
  	"labels_timeline" varchar,
  	"labels_why_us" varchar,
  	"labels_success_card" varchar,
  	"labels_cost_card" varchar,
  	"labels_success_factors" varchar,
  	"labels_risks" varchar,
  	"labels_preparation" varchar,
  	"labels_patient_stories" varchar,
  	"labels_specialists" varchar,
  	"labels_faq" varchar,
  	"labels_explore_more" varchar,
  	"labels_blog" varchar,
  	"patient_stories_heading_lead" varchar,
  	"patient_stories_heading_em" varchar,
  	"patient_stories_subtitle" varchar,
  	"specialists_heading_lead" varchar,
  	"specialists_heading_em" varchar,
  	"specialists_subtitle" varchar,
  	"faqs_section_lead" varchar,
  	"faqs_section_em" varchar,
  	"related_section_lead" varchar,
  	"related_section_em" varchar,
  	"blog_section_heading_lead" varchar,
  	"blog_section_heading_em" varchar,
  	"blog_section_subtitle" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_treatments_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_treatments_v_version_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_what_is_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_types_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__treatments_v_version_types_items_icon",
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_who_needs_it_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__treatments_v_version_process_steps_icon",
  	"n" varchar,
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_timeline_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_technology_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__treatments_v_version_technology_items_icon",
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__treatments_v_version_why_us_items_icon",
  	"t" varchar,
  	"d" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_success_factors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_cost_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_risks_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"t" varchar,
  	"d" varchar,
  	"help" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_preparation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v_version_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"you_tube_id" varchar,
  	"name" varchar,
  	"quote" varchar,
  	"location" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_treatments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_href" varchar,
  	"version_name" varchar,
  	"version_short_name" varchar,
  	"version_alternate_name" varchar,
  	"version_breadcrumb_name" varchar,
  	"version_reviewer_slug" varchar,
  	"version_last_reviewed" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_og_image" varchar,
  	"version_nav_category" "enum__treatments_v_version_nav_category",
  	"version_nav_order" numeric,
  	"version_procedure_procedure_type" varchar,
  	"version_procedure_body_location" varchar,
  	"version_procedure_how_performed" varchar,
  	"version_procedure_followup" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_h1" varchar,
  	"version_hero_h1_em" varchar,
  	"version_hero_tagline" varchar,
  	"version_hero_image" varchar,
  	"version_hero_image_alt" varchar,
  	"version_hero_hero_photo_id" integer,
  	"version_what_is_heading_lead" varchar,
  	"version_what_is_heading_em" varchar,
  	"version_what_is_aside_title" varchar,
  	"version_what_is_aside_body" varchar,
  	"version_benefits_heading_lead" varchar,
  	"version_benefits_heading_em" varchar,
  	"version_benefits_subtitle" varchar,
  	"version_types_heading_lead" varchar,
  	"version_types_heading_em" varchar,
  	"version_types_subtitle" varchar,
  	"version_who_needs_it_heading_lead" varchar,
  	"version_who_needs_it_heading_em" varchar,
  	"version_who_needs_it_subtitle" varchar,
  	"version_process_heading_lead" varchar,
  	"version_process_heading_em" varchar,
  	"version_process_subtitle" varchar,
  	"version_process_note" varchar,
  	"version_timeline_heading_lead" varchar,
  	"version_timeline_heading_em" varchar,
  	"version_timeline_subtitle" varchar,
  	"version_timeline_chips_note" varchar,
  	"version_video_eyebrow" varchar,
  	"version_video_title" varchar,
  	"version_video_description" varchar,
  	"version_video_heading_lead" varchar,
  	"version_video_heading_em" varchar,
  	"version_technology_heading_lead" varchar,
  	"version_technology_heading_em" varchar,
  	"version_technology_eyebrow" varchar,
  	"version_technology_subtitle" varchar,
  	"version_why_us_heading_lead" varchar,
  	"version_why_us_heading_em" varchar,
  	"version_success_heading" varchar,
  	"version_success_description" varchar,
  	"version_success_callout" varchar,
  	"version_success_note" varchar,
  	"version_cost_heading" varchar,
  	"version_cost_description" varchar,
  	"version_risks_heading_lead" varchar,
  	"version_risks_heading_em" varchar,
  	"version_risks_subtitle" varchar,
  	"version_preparation_heading_lead" varchar,
  	"version_preparation_heading_em" varchar,
  	"version_preparation_subtitle" varchar,
  	"version_cta_heading" varchar,
  	"version_cta_heading_em" varchar,
  	"version_cta_subtitle" varchar,
  	"version_labels_what_is" varchar,
  	"version_labels_benefits" varchar,
  	"version_labels_types" varchar,
  	"version_labels_who_needs_it" varchar,
  	"version_labels_process" varchar,
  	"version_labels_timeline" varchar,
  	"version_labels_why_us" varchar,
  	"version_labels_success_card" varchar,
  	"version_labels_cost_card" varchar,
  	"version_labels_success_factors" varchar,
  	"version_labels_risks" varchar,
  	"version_labels_preparation" varchar,
  	"version_labels_patient_stories" varchar,
  	"version_labels_specialists" varchar,
  	"version_labels_faq" varchar,
  	"version_labels_explore_more" varchar,
  	"version_labels_blog" varchar,
  	"version_patient_stories_heading_lead" varchar,
  	"version_patient_stories_heading_em" varchar,
  	"version_patient_stories_subtitle" varchar,
  	"version_specialists_heading_lead" varchar,
  	"version_specialists_heading_em" varchar,
  	"version_specialists_subtitle" varchar,
  	"version_faqs_section_lead" varchar,
  	"version_faqs_section_em" varchar,
  	"version_related_section_lead" varchar,
  	"version_related_section_em" varchar,
  	"version_blog_section_heading_lead" varchar,
  	"version_blog_section_heading_em" varchar,
  	"version_blog_section_subtitle" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__treatments_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "cities_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cities_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "cities_womens_health" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name" varchar,
  	"region" varchar,
  	"country" varchar,
  	"helpline" varchar,
  	"helpline_label" varchar,
  	"whatsapp" varchar,
  	"hero_image" varchar,
  	"hero360_url" varchar,
  	"section_labels_overview_eyebrow" varchar,
  	"section_labels_centres_eyebrow" varchar,
  	"section_labels_landmarks_eyebrow" varchar,
  	"section_labels_areas_eyebrow" varchar,
  	"section_labels_reach_eyebrow" varchar,
  	"section_labels_treatments_eyebrow" varchar,
  	"section_labels_womens_health_eyebrow" varchar,
  	"section_labels_facilities_eyebrow" varchar,
  	"section_labels_doctors_eyebrow" varchar,
  	"section_labels_doctors_subtitle" varchar,
  	"section_labels_testimonials_eyebrow" varchar,
  	"section_labels_testimonials_subtitle" varchar,
  	"section_labels_gallery_subtitle" varchar,
  	"section_labels_why_eyebrow" varchar,
  	"section_labels_map_eyebrow" varchar,
  	"section_labels_contact_subtitle" varchar,
  	"section_labels_faq_eyebrow" varchar,
  	"section_labels_hero_title" varchar,
  	"section_labels_overview_title" varchar,
  	"section_labels_centres_title" varchar,
  	"section_labels_landmarks_title" varchar,
  	"section_labels_areas_title" varchar,
  	"section_labels_reach_title" varchar,
  	"section_labels_treatments_title" varchar,
  	"section_labels_womens_health_title" varchar,
  	"section_labels_facilities_title" varchar,
  	"section_labels_doctors_title" varchar,
  	"section_labels_testimonials_title" varchar,
  	"section_labels_reviews_title" varchar,
  	"section_labels_gallery_title" varchar,
  	"section_labels_why_title" varchar,
  	"section_labels_map_title" varchar,
  	"section_labels_contact_title" varchar,
  	"section_labels_faq_title" varchar,
  	"section_labels_cta_title" varchar,
  	"built" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_cities_v_version_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v_version_womens_health" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name" varchar,
  	"version_region" varchar,
  	"version_country" varchar,
  	"version_helpline" varchar,
  	"version_helpline_label" varchar,
  	"version_whatsapp" varchar,
  	"version_hero_image" varchar,
  	"version_hero360_url" varchar,
  	"version_section_labels_overview_eyebrow" varchar,
  	"version_section_labels_centres_eyebrow" varchar,
  	"version_section_labels_landmarks_eyebrow" varchar,
  	"version_section_labels_areas_eyebrow" varchar,
  	"version_section_labels_reach_eyebrow" varchar,
  	"version_section_labels_treatments_eyebrow" varchar,
  	"version_section_labels_womens_health_eyebrow" varchar,
  	"version_section_labels_facilities_eyebrow" varchar,
  	"version_section_labels_doctors_eyebrow" varchar,
  	"version_section_labels_doctors_subtitle" varchar,
  	"version_section_labels_testimonials_eyebrow" varchar,
  	"version_section_labels_testimonials_subtitle" varchar,
  	"version_section_labels_gallery_subtitle" varchar,
  	"version_section_labels_why_eyebrow" varchar,
  	"version_section_labels_map_eyebrow" varchar,
  	"version_section_labels_contact_subtitle" varchar,
  	"version_section_labels_faq_eyebrow" varchar,
  	"version_section_labels_hero_title" varchar,
  	"version_section_labels_overview_title" varchar,
  	"version_section_labels_centres_title" varchar,
  	"version_section_labels_landmarks_title" varchar,
  	"version_section_labels_areas_title" varchar,
  	"version_section_labels_reach_title" varchar,
  	"version_section_labels_treatments_title" varchar,
  	"version_section_labels_womens_health_title" varchar,
  	"version_section_labels_facilities_title" varchar,
  	"version_section_labels_doctors_title" varchar,
  	"version_section_labels_testimonials_title" varchar,
  	"version_section_labels_reviews_title" varchar,
  	"version_section_labels_gallery_title" varchar,
  	"version_section_labels_why_title" varchar,
  	"version_section_labels_map_title" varchar,
  	"version_section_labels_contact_title" varchar,
  	"version_section_labels_faq_title" varchar,
  	"version_section_labels_cta_title" varchar,
  	"version_built" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "centres_opening_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_landmarks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_how_to_reach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_doctors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_treatments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_womens_health" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar
  );
  
  CREATE TABLE "centres_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "centres_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "centres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"city_slug" varchar,
  	"name" varchar,
  	"full_name" varchar,
  	"is_head_office" boolean,
  	"area" varchar,
  	"pin" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"phone_label" varchar,
  	"hours" varchar,
  	"opening_opens" varchar,
  	"opening_closes" varchar,
  	"geo_lat" numeric,
  	"geo_lng" numeric,
  	"map_query" varchar,
  	"image" varchar,
  	"hero360_url" varchar,
  	"intro" varchar,
  	"section_labels_overview_eyebrow" varchar,
  	"section_labels_centres_eyebrow" varchar,
  	"section_labels_landmarks_eyebrow" varchar,
  	"section_labels_areas_eyebrow" varchar,
  	"section_labels_reach_eyebrow" varchar,
  	"section_labels_treatments_eyebrow" varchar,
  	"section_labels_womens_health_eyebrow" varchar,
  	"section_labels_facilities_eyebrow" varchar,
  	"section_labels_doctors_eyebrow" varchar,
  	"section_labels_doctors_subtitle" varchar,
  	"section_labels_testimonials_eyebrow" varchar,
  	"section_labels_testimonials_subtitle" varchar,
  	"section_labels_gallery_subtitle" varchar,
  	"section_labels_why_eyebrow" varchar,
  	"section_labels_map_eyebrow" varchar,
  	"section_labels_contact_subtitle" varchar,
  	"section_labels_faq_eyebrow" varchar,
  	"section_labels_hero_title" varchar,
  	"section_labels_overview_title" varchar,
  	"section_labels_centres_title" varchar,
  	"section_labels_landmarks_title" varchar,
  	"section_labels_areas_title" varchar,
  	"section_labels_reach_title" varchar,
  	"section_labels_treatments_title" varchar,
  	"section_labels_womens_health_title" varchar,
  	"section_labels_facilities_title" varchar,
  	"section_labels_doctors_title" varchar,
  	"section_labels_testimonials_title" varchar,
  	"section_labels_reviews_title" varchar,
  	"section_labels_gallery_title" varchar,
  	"section_labels_why_title" varchar,
  	"section_labels_map_title" varchar,
  	"section_labels_contact_title" varchar,
  	"section_labels_faq_title" varchar,
  	"section_labels_cta_title" varchar,
  	"reviews_key" varchar,
  	"built" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_centres_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_centres_v_version_opening_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_landmarks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_how_to_reach" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_doctors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_treatments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_womens_health" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"q" varchar,
  	"a" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"src" varchar,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v_version_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_centres_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_city_slug" varchar,
  	"version_name" varchar,
  	"version_full_name" varchar,
  	"version_is_head_office" boolean,
  	"version_area" varchar,
  	"version_pin" varchar,
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_phone_label" varchar,
  	"version_hours" varchar,
  	"version_opening_opens" varchar,
  	"version_opening_closes" varchar,
  	"version_geo_lat" numeric,
  	"version_geo_lng" numeric,
  	"version_map_query" varchar,
  	"version_image" varchar,
  	"version_hero360_url" varchar,
  	"version_intro" varchar,
  	"version_section_labels_overview_eyebrow" varchar,
  	"version_section_labels_centres_eyebrow" varchar,
  	"version_section_labels_landmarks_eyebrow" varchar,
  	"version_section_labels_areas_eyebrow" varchar,
  	"version_section_labels_reach_eyebrow" varchar,
  	"version_section_labels_treatments_eyebrow" varchar,
  	"version_section_labels_womens_health_eyebrow" varchar,
  	"version_section_labels_facilities_eyebrow" varchar,
  	"version_section_labels_doctors_eyebrow" varchar,
  	"version_section_labels_doctors_subtitle" varchar,
  	"version_section_labels_testimonials_eyebrow" varchar,
  	"version_section_labels_testimonials_subtitle" varchar,
  	"version_section_labels_gallery_subtitle" varchar,
  	"version_section_labels_why_eyebrow" varchar,
  	"version_section_labels_map_eyebrow" varchar,
  	"version_section_labels_contact_subtitle" varchar,
  	"version_section_labels_faq_eyebrow" varchar,
  	"version_section_labels_hero_title" varchar,
  	"version_section_labels_overview_title" varchar,
  	"version_section_labels_centres_title" varchar,
  	"version_section_labels_landmarks_title" varchar,
  	"version_section_labels_areas_title" varchar,
  	"version_section_labels_reach_title" varchar,
  	"version_section_labels_treatments_title" varchar,
  	"version_section_labels_womens_health_title" varchar,
  	"version_section_labels_facilities_title" varchar,
  	"version_section_labels_doctors_title" varchar,
  	"version_section_labels_testimonials_title" varchar,
  	"version_section_labels_reviews_title" varchar,
  	"version_section_labels_gallery_title" varchar,
  	"version_section_labels_why_title" varchar,
  	"version_section_labels_map_title" varchar,
  	"version_section_labels_contact_title" varchar,
  	"version_section_labels_faq_title" varchar,
  	"version_section_labels_cta_title" varchar,
  	"version_reviews_key" varchar,
  	"version_built" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__centres_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "enum_redirects_type" DEFAULT '301' NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"inquiries_id" integer,
  	"testimonials_id" integer,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"authors_id" integer,
  	"categories_id" integer,
  	"services_id" integer,
  	"doctors_id" integer,
  	"treatments_id" integer,
  	"cities_id" integer,
  	"centres_id" integer,
  	"redirects_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar NOT NULL,
  	"alternate_name" varchar,
  	"legal_name" varchar,
  	"logo_url" varchar,
  	"founding_date" varchar,
  	"telephone" varchar,
  	"telephone_display" varchar,
  	"email" varchar,
  	"whatsapp" varchar,
  	"address_street_address" varchar,
  	"address_address_locality" varchar,
  	"address_address_region" varchar,
  	"address_postal_code" varchar,
  	"address_address_country" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_info_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_contact_info_cards_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"channel" "enum_contact_info_cards_channel" DEFAULT 'none',
  	"value" varchar,
  	"href" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog_hub" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"intro" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_nav_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"hidden" boolean,
  	"channel" "enum_footer_nav_groups_links_channel" DEFAULT 'none',
  	"url" varchar,
  	"external" boolean
  );
  
  CREATE TABLE "footer_nav_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"hidden" boolean
  );
  
  CREATE TABLE "footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar,
  	"hidden" boolean,
  	"external" boolean
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"branding_logo_url" varchar,
  	"branding_description" varchar,
  	"copyright_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_nav_items_columns_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "header_nav_items_columns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar,
  	"hidden" boolean,
  	"desc" varchar
  );
  
  CREATE TABLE "header_nav_items_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"heading_href" varchar,
  	"hidden" boolean
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar,
  	"hidden" boolean,
  	"open_in_new_tab" boolean,
  	"doctors" boolean,
  	"mega_cols" numeric
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"branding_logo_url" varchar,
  	"branding_logo_alt" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"cta_style_variant" "enum_header_cta_style_variant" DEFAULT 'primary',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section" "enum_homepage_layout_section" NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "homepage_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_bavishi_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_why_bavishi_cards_icon",
  	"t" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_choose_blocks_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"h" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_why_choose_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"alt" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar
  );
  
  CREATE TABLE "homepage_suraksha_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_about_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"k" varchar NOT NULL,
  	"v" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_treatments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_treatments_items_icon",
  	"t" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_awards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"img" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar
  );
  
  CREATE TABLE "homepage_events_posters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL,
  	"alt" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_videos_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"n" varchar NOT NULL,
  	"q" varchar NOT NULL,
  	"r" numeric DEFAULT 5
  );
  
  CREATE TABLE "homepage_videos_edu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"t" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_videos_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"c" varchar NOT NULL,
  	"t" varchar NOT NULL,
  	"date" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_media_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL,
  	"alt" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_locations_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"c" varchar NOT NULL,
  	"n" numeric DEFAULT 1 NOT NULL,
  	"s" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_calculators_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_inquiry_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"h" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_final_cta_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"v" numeric NOT NULL,
  	"s" varchar,
  	"l" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_headline_italic" varchar,
  	"hero_paragraph" varchar,
  	"hero_floating_badge" varchar,
  	"hero_image" varchar,
  	"why_bavishi_eyebrow" varchar,
  	"why_bavishi_heading_lead" varchar,
  	"why_bavishi_heading_em" varchar,
  	"why_bavishi_subtitle" varchar,
  	"why_choose_eyebrow" varchar,
  	"why_choose_heading_lead" varchar,
  	"why_choose_heading_em" varchar,
  	"why_choose_subtitle" varchar,
  	"suraksha_badge" varchar,
  	"suraksha_heading_lead" varchar,
  	"suraksha_heading_em" varchar,
  	"suraksha_paragraph" varchar,
  	"suraksha_primary_cta_label" varchar,
  	"suraksha_primary_cta_href" varchar,
  	"suraksha_secondary_cta_label" varchar,
  	"suraksha_secondary_cta_href" varchar,
  	"suraksha_image" varchar,
  	"suraksha_image_alt" varchar,
  	"about_eyebrow" varchar,
  	"about_heading_lead" varchar,
  	"about_heading_em" varchar,
  	"about_subtitle" varchar,
  	"about_primary_cta" varchar,
  	"about_secondary_cta" varchar,
  	"about_since_value" varchar,
  	"about_since_label" varchar,
  	"about_image" varchar,
  	"about_image_alt" varchar,
  	"treatments_eyebrow" varchar,
  	"treatments_heading_lead" varchar,
  	"treatments_heading_em" varchar,
  	"treatments_subtitle" varchar,
  	"treatments_cta_label" varchar,
  	"awards_eyebrow" varchar,
  	"awards_heading_lead" varchar,
  	"awards_heading_em" varchar,
  	"awards_subtitle" varchar,
  	"events_eyebrow" varchar,
  	"events_heading_lead" varchar,
  	"events_heading_em" varchar,
  	"success_stories_eyebrow" varchar,
  	"success_stories_heading_lead" varchar,
  	"success_stories_heading_em" varchar,
  	"success_stories_subtitle" varchar,
  	"success_stories_cta_label" varchar,
  	"video_hub_eyebrow" varchar,
  	"video_hub_heading_lead" varchar,
  	"video_hub_heading_em" varchar,
  	"video_hub_subtitle" varchar,
  	"video_hub_cta_label" varchar,
  	"doctors_eyebrow" varchar,
  	"doctors_heading_lead" varchar,
  	"doctors_heading_em" varchar,
  	"doctors_subtitle" varchar,
  	"doctors_cta_label" varchar,
  	"blogs_eyebrow" varchar,
  	"blogs_heading_lead" varchar,
  	"blogs_heading_em" varchar,
  	"blogs_cta_label" varchar,
  	"testimonials_eyebrow" varchar,
  	"testimonials_heading_lead" varchar,
  	"testimonials_heading_em" varchar,
  	"media_eyebrow" varchar,
  	"media_heading_lead" varchar,
  	"media_heading_em" varchar,
  	"locations_eyebrow" varchar,
  	"locations_heading_lead" varchar,
  	"locations_heading_em" varchar,
  	"locations_subtitle" varchar,
  	"calculators_eyebrow" varchar,
  	"calculators_heading_lead" varchar,
  	"calculators_heading_em" varchar,
  	"calculators_subtitle" varchar,
  	"inquiry_eyebrow" varchar,
  	"inquiry_heading_lead" varchar,
  	"inquiry_heading_em" varchar,
  	"inquiry_subtitle" varchar,
  	"faq_eyebrow" varchar,
  	"faq_heading_lead" varchar,
  	"faq_heading_em" varchar,
  	"final_cta_eyebrow" varchar,
  	"final_cta_heading_lead" varchar,
  	"final_cta_heading_em" varchar,
  	"final_cta_paragraph" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_at_a_glance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"y" varchar NOT NULL,
  	"t" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_trust_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_trust_pillars_icon",
  	"t" varchar NOT NULL,
  	"d" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_patient_first_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_patient_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_network_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"c" varchar NOT NULL,
  	"n" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_headline_italic" varchar,
  	"hero_paragraph" varchar,
  	"hero_image" varchar,
  	"story_eyebrow" varchar,
  	"story_heading_lead" varchar,
  	"story_heading_em" varchar,
  	"legacy_eyebrow" varchar,
  	"legacy_heading_lead" varchar,
  	"legacy_heading_em" varchar,
  	"trust_eyebrow" varchar,
  	"trust_heading_lead" varchar,
  	"trust_heading_em" varchar,
  	"patient_first_eyebrow" varchar,
  	"patient_first_heading_lead" varchar,
  	"patient_first_heading_em" varchar,
  	"meet_specialists_eyebrow" varchar,
  	"meet_specialists_heading_lead" varchar,
  	"meet_specialists_heading_em" varchar,
  	"meet_specialists_subtitle" varchar,
  	"network_eyebrow" varchar,
  	"network_heading_lead" varchar,
  	"network_heading_em" varchar,
  	"network_subtitle" varchar,
  	"final_cta_heading_lead" varchar,
  	"final_cta_heading_em" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings_disallow_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"discourage_search_engines" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_faqs" ADD CONSTRAINT "pages_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_faqs" ADD CONSTRAINT "_pages_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_treatment_slugs" ADD CONSTRAINT "blogs_treatment_slugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_reviewed_by_id_authors_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_version_treatment_slugs" ADD CONSTRAINT "_blogs_v_version_treatment_slugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_parent_id_blogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_author_id_authors_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_reviewed_by_id_authors_id_fk" FOREIGN KEY ("version_reviewed_by_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_same_as" ADD CONSTRAINT "authors_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_hero_badges" ADD CONSTRAINT "services_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_overview_paragraphs" ADD CONSTRAINT "services_overview_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits_items" ADD CONSTRAINT "services_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_who_for_items" ADD CONSTRAINT "services_who_for_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process_steps" ADD CONSTRAINT "services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_why_us_items" ADD CONSTRAINT "services_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_info_note_paragraphs" ADD CONSTRAINT "services_info_note_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_related" ADD CONSTRAINT "services_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_hero_badges" ADD CONSTRAINT "_services_v_version_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_overview_paragraphs" ADD CONSTRAINT "_services_v_version_overview_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_benefits_items" ADD CONSTRAINT "_services_v_version_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_who_for_items" ADD CONSTRAINT "_services_v_version_who_for_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process_steps" ADD CONSTRAINT "_services_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_why_us_items" ADD CONSTRAINT "_services_v_version_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_info_note_paragraphs" ADD CONSTRAINT "_services_v_version_info_note_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faqs" ADD CONSTRAINT "_services_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_related" ADD CONSTRAINT "_services_v_version_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_hero_photo_id_media_id_fk" FOREIGN KEY ("version_hero_hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors_medical_specialty" ADD CONSTRAINT "doctors_medical_specialty_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_cities" ADD CONSTRAINT "doctors_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_locations" ADD CONSTRAINT "doctors_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_treatments" ADD CONSTRAINT "doctors_treatments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_bio" ADD CONSTRAINT "doctors_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_knows_about" ADD CONSTRAINT "doctors_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_alumni_of" ADD CONSTRAINT "doctors_alumni_of_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_member_of" ADD CONSTRAINT "doctors_member_of_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_awards" ADD CONSTRAINT "doctors_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_training" ADD CONSTRAINT "doctors_training_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_publications" ADD CONSTRAINT "doctors_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_languages" ADD CONSTRAINT "doctors_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_same_as" ADD CONSTRAINT "doctors_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_medical_specialty" ADD CONSTRAINT "_doctors_v_version_medical_specialty_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_cities" ADD CONSTRAINT "_doctors_v_version_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_locations" ADD CONSTRAINT "_doctors_v_version_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_treatments" ADD CONSTRAINT "_doctors_v_version_treatments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_bio" ADD CONSTRAINT "_doctors_v_version_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_knows_about" ADD CONSTRAINT "_doctors_v_version_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_alumni_of" ADD CONSTRAINT "_doctors_v_version_alumni_of_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_member_of" ADD CONSTRAINT "_doctors_v_version_member_of_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_awards" ADD CONSTRAINT "_doctors_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_training" ADD CONSTRAINT "_doctors_v_version_training_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_publications" ADD CONSTRAINT "_doctors_v_version_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_languages" ADD CONSTRAINT "_doctors_v_version_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_same_as" ADD CONSTRAINT "_doctors_v_version_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_parent_id_doctors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments_hero_badges" ADD CONSTRAINT "treatments_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_what_is_paragraphs" ADD CONSTRAINT "treatments_what_is_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_benefits_items" ADD CONSTRAINT "treatments_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_types_items" ADD CONSTRAINT "treatments_types_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_who_needs_it_items" ADD CONSTRAINT "treatments_who_needs_it_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_process_steps" ADD CONSTRAINT "treatments_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_timeline_items" ADD CONSTRAINT "treatments_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_timeline_chips" ADD CONSTRAINT "treatments_timeline_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_technology_items" ADD CONSTRAINT "treatments_technology_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_why_us_items" ADD CONSTRAINT "treatments_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_success_factors" ADD CONSTRAINT "treatments_success_factors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_cost_includes" ADD CONSTRAINT "treatments_cost_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_risks_items" ADD CONSTRAINT "treatments_risks_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_preparation_items" ADD CONSTRAINT "treatments_preparation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_faqs" ADD CONSTRAINT "treatments_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_related" ADD CONSTRAINT "treatments_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_testimonials" ADD CONSTRAINT "treatments_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments" ADD CONSTRAINT "treatments_hero_hero_photo_id_media_id_fk" FOREIGN KEY ("hero_hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_hero_badges" ADD CONSTRAINT "_treatments_v_version_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_what_is_paragraphs" ADD CONSTRAINT "_treatments_v_version_what_is_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_benefits_items" ADD CONSTRAINT "_treatments_v_version_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_types_items" ADD CONSTRAINT "_treatments_v_version_types_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_who_needs_it_items" ADD CONSTRAINT "_treatments_v_version_who_needs_it_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_process_steps" ADD CONSTRAINT "_treatments_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_timeline_items" ADD CONSTRAINT "_treatments_v_version_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_timeline_chips" ADD CONSTRAINT "_treatments_v_version_timeline_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_technology_items" ADD CONSTRAINT "_treatments_v_version_technology_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_why_us_items" ADD CONSTRAINT "_treatments_v_version_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_success_factors" ADD CONSTRAINT "_treatments_v_version_success_factors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_cost_includes" ADD CONSTRAINT "_treatments_v_version_cost_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_risks_items" ADD CONSTRAINT "_treatments_v_version_risks_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_preparation_items" ADD CONSTRAINT "_treatments_v_version_preparation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_faqs" ADD CONSTRAINT "_treatments_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_related" ADD CONSTRAINT "_treatments_v_version_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v_version_testimonials" ADD CONSTRAINT "_treatments_v_version_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_treatments_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_parent_id_treatments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_treatments_v" ADD CONSTRAINT "_treatments_v_version_hero_hero_photo_id_media_id_fk" FOREIGN KEY ("version_hero_hero_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities_intro" ADD CONSTRAINT "cities_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_faqs" ADD CONSTRAINT "cities_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_womens_health" ADD CONSTRAINT "cities_womens_health_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_intro" ADD CONSTRAINT "_cities_v_version_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_faqs" ADD CONSTRAINT "_cities_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v_version_womens_health" ADD CONSTRAINT "_cities_v_version_womens_health_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cities_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cities_v" ADD CONSTRAINT "_cities_v_parent_id_cities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "centres_opening_days" ADD CONSTRAINT "centres_opening_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_nearby" ADD CONSTRAINT "centres_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_landmarks" ADD CONSTRAINT "centres_landmarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_how_to_reach" ADD CONSTRAINT "centres_how_to_reach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_facilities" ADD CONSTRAINT "centres_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_doctors" ADD CONSTRAINT "centres_doctors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_treatments" ADD CONSTRAINT "centres_treatments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_womens_health" ADD CONSTRAINT "centres_womens_health_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_faqs" ADD CONSTRAINT "centres_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_gallery" ADD CONSTRAINT "centres_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "centres_same_as" ADD CONSTRAINT "centres_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_opening_days" ADD CONSTRAINT "_centres_v_version_opening_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_nearby" ADD CONSTRAINT "_centres_v_version_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_landmarks" ADD CONSTRAINT "_centres_v_version_landmarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_how_to_reach" ADD CONSTRAINT "_centres_v_version_how_to_reach_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_facilities" ADD CONSTRAINT "_centres_v_version_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_doctors" ADD CONSTRAINT "_centres_v_version_doctors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_treatments" ADD CONSTRAINT "_centres_v_version_treatments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_womens_health" ADD CONSTRAINT "_centres_v_version_womens_health_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_faqs" ADD CONSTRAINT "_centres_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_gallery" ADD CONSTRAINT "_centres_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v_version_same_as" ADD CONSTRAINT "_centres_v_version_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_centres_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_centres_v" ADD CONSTRAINT "_centres_v_parent_id_centres_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."centres"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_centres_fk" FOREIGN KEY ("centres_id") REFERENCES "public"."centres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_awards" ADD CONSTRAINT "site_settings_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_knows_about" ADD CONSTRAINT "site_settings_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_cards" ADD CONSTRAINT "contact_info_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_hub" ADD CONSTRAINT "blog_hub_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_nav_groups_links" ADD CONSTRAINT "footer_nav_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_groups" ADD CONSTRAINT "footer_nav_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social" ADD CONSTRAINT "footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_items_children" ADD CONSTRAINT "header_nav_items_columns_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_items" ADD CONSTRAINT "header_nav_items_columns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns" ADD CONSTRAINT "header_nav_items_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_layout" ADD CONSTRAINT "homepage_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_badges" ADD CONSTRAINT "homepage_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stats" ADD CONSTRAINT "homepage_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_bavishi_cards" ADD CONSTRAINT "homepage_why_bavishi_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_choose_blocks_points" ADD CONSTRAINT "homepage_why_choose_blocks_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_why_choose_blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_why_choose_blocks" ADD CONSTRAINT "homepage_why_choose_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_suraksha_features" ADD CONSTRAINT "homepage_suraksha_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_about_stats" ADD CONSTRAINT "homepage_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_treatments_items" ADD CONSTRAINT "homepage_treatments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_awards_items" ADD CONSTRAINT "homepage_awards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_events_posters" ADD CONSTRAINT "homepage_events_posters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_videos_stories" ADD CONSTRAINT "homepage_videos_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_videos_edu" ADD CONSTRAINT "homepage_videos_edu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_videos_resources" ADD CONSTRAINT "homepage_videos_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_media_logos" ADD CONSTRAINT "homepage_media_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_locations_cities" ADD CONSTRAINT "homepage_locations_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_calculators_items" ADD CONSTRAINT "homepage_calculators_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_inquiry_contacts" ADD CONSTRAINT "homepage_inquiry_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faq_items" ADD CONSTRAINT "homepage_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_final_cta_stats" ADD CONSTRAINT "homepage_final_cta_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_story_paragraphs" ADD CONSTRAINT "about_page_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_at_a_glance" ADD CONSTRAINT "about_page_at_a_glance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_milestones" ADD CONSTRAINT "about_page_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_trust_pillars" ADD CONSTRAINT "about_page_trust_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_patient_first_paragraphs" ADD CONSTRAINT "about_page_patient_first_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_patient_stats" ADD CONSTRAINT "about_page_patient_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_network_cities" ADD CONSTRAINT "about_page_network_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_settings_disallow_paths" ADD CONSTRAINT "seo_settings_disallow_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "pages_faqs_order_idx" ON "pages_faqs" USING btree ("_order");
  CREATE INDEX "pages_faqs_parent_id_idx" ON "pages_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_faqs_order_idx" ON "_pages_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_faqs_parent_id_idx" ON "_pages_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "blogs_treatment_slugs_order_idx" ON "blogs_treatment_slugs" USING btree ("_order");
  CREATE INDEX "blogs_treatment_slugs_parent_id_idx" ON "blogs_treatment_slugs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX "blogs_hero_image_idx" ON "blogs" USING btree ("hero_image_id");
  CREATE INDEX "blogs_author_idx" ON "blogs" USING btree ("author_id");
  CREATE INDEX "blogs_reviewed_by_idx" ON "blogs" USING btree ("reviewed_by_id");
  CREATE INDEX "blogs_category_idx" ON "blogs" USING btree ("category_id");
  CREATE INDEX "blogs_seo_seo_og_image_idx" ON "blogs" USING btree ("seo_og_image_id");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "blogs__status_idx" ON "blogs" USING btree ("_status");
  CREATE INDEX "_blogs_v_version_treatment_slugs_order_idx" ON "_blogs_v_version_treatment_slugs" USING btree ("_order");
  CREATE INDEX "_blogs_v_version_treatment_slugs_parent_id_idx" ON "_blogs_v_version_treatment_slugs" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_parent_idx" ON "_blogs_v" USING btree ("parent_id");
  CREATE INDEX "_blogs_v_version_version_slug_idx" ON "_blogs_v" USING btree ("version_slug");
  CREATE INDEX "_blogs_v_version_version_hero_image_idx" ON "_blogs_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_blogs_v_version_version_author_idx" ON "_blogs_v" USING btree ("version_author_id");
  CREATE INDEX "_blogs_v_version_version_reviewed_by_idx" ON "_blogs_v" USING btree ("version_reviewed_by_id");
  CREATE INDEX "_blogs_v_version_version_category_idx" ON "_blogs_v" USING btree ("version_category_id");
  CREATE INDEX "_blogs_v_version_seo_version_seo_og_image_idx" ON "_blogs_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_blogs_v_version_version_updated_at_idx" ON "_blogs_v" USING btree ("version_updated_at");
  CREATE INDEX "_blogs_v_version_version_created_at_idx" ON "_blogs_v" USING btree ("version_created_at");
  CREATE INDEX "_blogs_v_version_version__status_idx" ON "_blogs_v" USING btree ("version__status");
  CREATE INDEX "_blogs_v_created_at_idx" ON "_blogs_v" USING btree ("created_at");
  CREATE INDEX "_blogs_v_updated_at_idx" ON "_blogs_v" USING btree ("updated_at");
  CREATE INDEX "_blogs_v_latest_idx" ON "_blogs_v" USING btree ("latest");
  CREATE INDEX "authors_same_as_order_idx" ON "authors_same_as" USING btree ("_order");
  CREATE INDEX "authors_same_as_parent_id_idx" ON "authors_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "services_hero_badges_order_idx" ON "services_hero_badges" USING btree ("_order");
  CREATE INDEX "services_hero_badges_parent_id_idx" ON "services_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "services_overview_paragraphs_order_idx" ON "services_overview_paragraphs" USING btree ("_order");
  CREATE INDEX "services_overview_paragraphs_parent_id_idx" ON "services_overview_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "services_benefits_items_order_idx" ON "services_benefits_items" USING btree ("_order");
  CREATE INDEX "services_benefits_items_parent_id_idx" ON "services_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "services_who_for_items_order_idx" ON "services_who_for_items" USING btree ("_order");
  CREATE INDEX "services_who_for_items_parent_id_idx" ON "services_who_for_items" USING btree ("_parent_id");
  CREATE INDEX "services_process_steps_order_idx" ON "services_process_steps" USING btree ("_order");
  CREATE INDEX "services_process_steps_parent_id_idx" ON "services_process_steps" USING btree ("_parent_id");
  CREATE INDEX "services_why_us_items_order_idx" ON "services_why_us_items" USING btree ("_order");
  CREATE INDEX "services_why_us_items_parent_id_idx" ON "services_why_us_items" USING btree ("_parent_id");
  CREATE INDEX "services_info_note_paragraphs_order_idx" ON "services_info_note_paragraphs" USING btree ("_order");
  CREATE INDEX "services_info_note_paragraphs_parent_id_idx" ON "services_info_note_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE INDEX "services_related_order_idx" ON "services_related" USING btree ("_order");
  CREATE INDEX "services_related_parent_id_idx" ON "services_related" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_hero_hero_photo_idx" ON "services" USING btree ("hero_hero_photo_id");
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_hero_badges_order_idx" ON "_services_v_version_hero_badges" USING btree ("_order");
  CREATE INDEX "_services_v_version_hero_badges_parent_id_idx" ON "_services_v_version_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_overview_paragraphs_order_idx" ON "_services_v_version_overview_paragraphs" USING btree ("_order");
  CREATE INDEX "_services_v_version_overview_paragraphs_parent_id_idx" ON "_services_v_version_overview_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_benefits_items_order_idx" ON "_services_v_version_benefits_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_benefits_items_parent_id_idx" ON "_services_v_version_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_who_for_items_order_idx" ON "_services_v_version_who_for_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_who_for_items_parent_id_idx" ON "_services_v_version_who_for_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_process_steps_order_idx" ON "_services_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_services_v_version_process_steps_parent_id_idx" ON "_services_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_why_us_items_order_idx" ON "_services_v_version_why_us_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_why_us_items_parent_id_idx" ON "_services_v_version_why_us_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_info_note_paragraphs_order_idx" ON "_services_v_version_info_note_paragraphs" USING btree ("_order");
  CREATE INDEX "_services_v_version_info_note_paragraphs_parent_id_idx" ON "_services_v_version_info_note_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_faqs_order_idx" ON "_services_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_faqs_parent_id_idx" ON "_services_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_related_order_idx" ON "_services_v_version_related" USING btree ("_order");
  CREATE INDEX "_services_v_version_related_parent_id_idx" ON "_services_v_version_related" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_hero_version_hero_hero_photo_idx" ON "_services_v" USING btree ("version_hero_hero_photo_id");
  CREATE INDEX "_services_v_version_seo_version_seo_og_image_idx" ON "_services_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "doctors_medical_specialty_order_idx" ON "doctors_medical_specialty" USING btree ("_order");
  CREATE INDEX "doctors_medical_specialty_parent_id_idx" ON "doctors_medical_specialty" USING btree ("_parent_id");
  CREATE INDEX "doctors_cities_order_idx" ON "doctors_cities" USING btree ("_order");
  CREATE INDEX "doctors_cities_parent_id_idx" ON "doctors_cities" USING btree ("_parent_id");
  CREATE INDEX "doctors_locations_order_idx" ON "doctors_locations" USING btree ("_order");
  CREATE INDEX "doctors_locations_parent_id_idx" ON "doctors_locations" USING btree ("_parent_id");
  CREATE INDEX "doctors_treatments_order_idx" ON "doctors_treatments" USING btree ("_order");
  CREATE INDEX "doctors_treatments_parent_id_idx" ON "doctors_treatments" USING btree ("_parent_id");
  CREATE INDEX "doctors_bio_order_idx" ON "doctors_bio" USING btree ("_order");
  CREATE INDEX "doctors_bio_parent_id_idx" ON "doctors_bio" USING btree ("_parent_id");
  CREATE INDEX "doctors_knows_about_order_idx" ON "doctors_knows_about" USING btree ("_order");
  CREATE INDEX "doctors_knows_about_parent_id_idx" ON "doctors_knows_about" USING btree ("_parent_id");
  CREATE INDEX "doctors_alumni_of_order_idx" ON "doctors_alumni_of" USING btree ("_order");
  CREATE INDEX "doctors_alumni_of_parent_id_idx" ON "doctors_alumni_of" USING btree ("_parent_id");
  CREATE INDEX "doctors_member_of_order_idx" ON "doctors_member_of" USING btree ("_order");
  CREATE INDEX "doctors_member_of_parent_id_idx" ON "doctors_member_of" USING btree ("_parent_id");
  CREATE INDEX "doctors_awards_order_idx" ON "doctors_awards" USING btree ("_order");
  CREATE INDEX "doctors_awards_parent_id_idx" ON "doctors_awards" USING btree ("_parent_id");
  CREATE INDEX "doctors_training_order_idx" ON "doctors_training" USING btree ("_order");
  CREATE INDEX "doctors_training_parent_id_idx" ON "doctors_training" USING btree ("_parent_id");
  CREATE INDEX "doctors_publications_order_idx" ON "doctors_publications" USING btree ("_order");
  CREATE INDEX "doctors_publications_parent_id_idx" ON "doctors_publications" USING btree ("_parent_id");
  CREATE INDEX "doctors_languages_order_idx" ON "doctors_languages" USING btree ("_order");
  CREATE INDEX "doctors_languages_parent_id_idx" ON "doctors_languages" USING btree ("_parent_id");
  CREATE INDEX "doctors_same_as_order_idx" ON "doctors_same_as" USING btree ("_order");
  CREATE INDEX "doctors_same_as_parent_id_idx" ON "doctors_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_slug_idx" ON "doctors" USING btree ("slug");
  CREATE INDEX "doctors_photo_idx" ON "doctors" USING btree ("photo_id");
  CREATE INDEX "doctors_updated_at_idx" ON "doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "doctors" USING btree ("created_at");
  CREATE INDEX "doctors__status_idx" ON "doctors" USING btree ("_status");
  CREATE INDEX "_doctors_v_version_medical_specialty_order_idx" ON "_doctors_v_version_medical_specialty" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_medical_specialty_parent_id_idx" ON "_doctors_v_version_medical_specialty" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_cities_order_idx" ON "_doctors_v_version_cities" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_cities_parent_id_idx" ON "_doctors_v_version_cities" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_locations_order_idx" ON "_doctors_v_version_locations" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_locations_parent_id_idx" ON "_doctors_v_version_locations" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_treatments_order_idx" ON "_doctors_v_version_treatments" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_treatments_parent_id_idx" ON "_doctors_v_version_treatments" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_bio_order_idx" ON "_doctors_v_version_bio" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_bio_parent_id_idx" ON "_doctors_v_version_bio" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_knows_about_order_idx" ON "_doctors_v_version_knows_about" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_knows_about_parent_id_idx" ON "_doctors_v_version_knows_about" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_alumni_of_order_idx" ON "_doctors_v_version_alumni_of" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_alumni_of_parent_id_idx" ON "_doctors_v_version_alumni_of" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_member_of_order_idx" ON "_doctors_v_version_member_of" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_member_of_parent_id_idx" ON "_doctors_v_version_member_of" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_awards_order_idx" ON "_doctors_v_version_awards" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_awards_parent_id_idx" ON "_doctors_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_training_order_idx" ON "_doctors_v_version_training" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_training_parent_id_idx" ON "_doctors_v_version_training" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_publications_order_idx" ON "_doctors_v_version_publications" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_publications_parent_id_idx" ON "_doctors_v_version_publications" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_languages_order_idx" ON "_doctors_v_version_languages" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_languages_parent_id_idx" ON "_doctors_v_version_languages" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_same_as_order_idx" ON "_doctors_v_version_same_as" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_same_as_parent_id_idx" ON "_doctors_v_version_same_as" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_parent_idx" ON "_doctors_v" USING btree ("parent_id");
  CREATE INDEX "_doctors_v_version_version_slug_idx" ON "_doctors_v" USING btree ("version_slug");
  CREATE INDEX "_doctors_v_version_version_photo_idx" ON "_doctors_v" USING btree ("version_photo_id");
  CREATE INDEX "_doctors_v_version_version_updated_at_idx" ON "_doctors_v" USING btree ("version_updated_at");
  CREATE INDEX "_doctors_v_version_version_created_at_idx" ON "_doctors_v" USING btree ("version_created_at");
  CREATE INDEX "_doctors_v_version_version__status_idx" ON "_doctors_v" USING btree ("version__status");
  CREATE INDEX "_doctors_v_created_at_idx" ON "_doctors_v" USING btree ("created_at");
  CREATE INDEX "_doctors_v_updated_at_idx" ON "_doctors_v" USING btree ("updated_at");
  CREATE INDEX "_doctors_v_latest_idx" ON "_doctors_v" USING btree ("latest");
  CREATE INDEX "treatments_hero_badges_order_idx" ON "treatments_hero_badges" USING btree ("_order");
  CREATE INDEX "treatments_hero_badges_parent_id_idx" ON "treatments_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "treatments_what_is_paragraphs_order_idx" ON "treatments_what_is_paragraphs" USING btree ("_order");
  CREATE INDEX "treatments_what_is_paragraphs_parent_id_idx" ON "treatments_what_is_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "treatments_benefits_items_order_idx" ON "treatments_benefits_items" USING btree ("_order");
  CREATE INDEX "treatments_benefits_items_parent_id_idx" ON "treatments_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_types_items_order_idx" ON "treatments_types_items" USING btree ("_order");
  CREATE INDEX "treatments_types_items_parent_id_idx" ON "treatments_types_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_who_needs_it_items_order_idx" ON "treatments_who_needs_it_items" USING btree ("_order");
  CREATE INDEX "treatments_who_needs_it_items_parent_id_idx" ON "treatments_who_needs_it_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_process_steps_order_idx" ON "treatments_process_steps" USING btree ("_order");
  CREATE INDEX "treatments_process_steps_parent_id_idx" ON "treatments_process_steps" USING btree ("_parent_id");
  CREATE INDEX "treatments_timeline_items_order_idx" ON "treatments_timeline_items" USING btree ("_order");
  CREATE INDEX "treatments_timeline_items_parent_id_idx" ON "treatments_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_timeline_chips_order_idx" ON "treatments_timeline_chips" USING btree ("_order");
  CREATE INDEX "treatments_timeline_chips_parent_id_idx" ON "treatments_timeline_chips" USING btree ("_parent_id");
  CREATE INDEX "treatments_technology_items_order_idx" ON "treatments_technology_items" USING btree ("_order");
  CREATE INDEX "treatments_technology_items_parent_id_idx" ON "treatments_technology_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_why_us_items_order_idx" ON "treatments_why_us_items" USING btree ("_order");
  CREATE INDEX "treatments_why_us_items_parent_id_idx" ON "treatments_why_us_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_success_factors_order_idx" ON "treatments_success_factors" USING btree ("_order");
  CREATE INDEX "treatments_success_factors_parent_id_idx" ON "treatments_success_factors" USING btree ("_parent_id");
  CREATE INDEX "treatments_cost_includes_order_idx" ON "treatments_cost_includes" USING btree ("_order");
  CREATE INDEX "treatments_cost_includes_parent_id_idx" ON "treatments_cost_includes" USING btree ("_parent_id");
  CREATE INDEX "treatments_risks_items_order_idx" ON "treatments_risks_items" USING btree ("_order");
  CREATE INDEX "treatments_risks_items_parent_id_idx" ON "treatments_risks_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_preparation_items_order_idx" ON "treatments_preparation_items" USING btree ("_order");
  CREATE INDEX "treatments_preparation_items_parent_id_idx" ON "treatments_preparation_items" USING btree ("_parent_id");
  CREATE INDEX "treatments_faqs_order_idx" ON "treatments_faqs" USING btree ("_order");
  CREATE INDEX "treatments_faqs_parent_id_idx" ON "treatments_faqs" USING btree ("_parent_id");
  CREATE INDEX "treatments_related_order_idx" ON "treatments_related" USING btree ("_order");
  CREATE INDEX "treatments_related_parent_id_idx" ON "treatments_related" USING btree ("_parent_id");
  CREATE INDEX "treatments_testimonials_order_idx" ON "treatments_testimonials" USING btree ("_order");
  CREATE INDEX "treatments_testimonials_parent_id_idx" ON "treatments_testimonials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "treatments_slug_idx" ON "treatments" USING btree ("slug");
  CREATE INDEX "treatments_hero_hero_hero_photo_idx" ON "treatments" USING btree ("hero_hero_photo_id");
  CREATE INDEX "treatments_updated_at_idx" ON "treatments" USING btree ("updated_at");
  CREATE INDEX "treatments_created_at_idx" ON "treatments" USING btree ("created_at");
  CREATE INDEX "treatments__status_idx" ON "treatments" USING btree ("_status");
  CREATE INDEX "_treatments_v_version_hero_badges_order_idx" ON "_treatments_v_version_hero_badges" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_hero_badges_parent_id_idx" ON "_treatments_v_version_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_what_is_paragraphs_order_idx" ON "_treatments_v_version_what_is_paragraphs" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_what_is_paragraphs_parent_id_idx" ON "_treatments_v_version_what_is_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_benefits_items_order_idx" ON "_treatments_v_version_benefits_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_benefits_items_parent_id_idx" ON "_treatments_v_version_benefits_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_types_items_order_idx" ON "_treatments_v_version_types_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_types_items_parent_id_idx" ON "_treatments_v_version_types_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_who_needs_it_items_order_idx" ON "_treatments_v_version_who_needs_it_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_who_needs_it_items_parent_id_idx" ON "_treatments_v_version_who_needs_it_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_process_steps_order_idx" ON "_treatments_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_process_steps_parent_id_idx" ON "_treatments_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_timeline_items_order_idx" ON "_treatments_v_version_timeline_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_timeline_items_parent_id_idx" ON "_treatments_v_version_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_timeline_chips_order_idx" ON "_treatments_v_version_timeline_chips" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_timeline_chips_parent_id_idx" ON "_treatments_v_version_timeline_chips" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_technology_items_order_idx" ON "_treatments_v_version_technology_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_technology_items_parent_id_idx" ON "_treatments_v_version_technology_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_why_us_items_order_idx" ON "_treatments_v_version_why_us_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_why_us_items_parent_id_idx" ON "_treatments_v_version_why_us_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_success_factors_order_idx" ON "_treatments_v_version_success_factors" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_success_factors_parent_id_idx" ON "_treatments_v_version_success_factors" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_cost_includes_order_idx" ON "_treatments_v_version_cost_includes" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_cost_includes_parent_id_idx" ON "_treatments_v_version_cost_includes" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_risks_items_order_idx" ON "_treatments_v_version_risks_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_risks_items_parent_id_idx" ON "_treatments_v_version_risks_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_preparation_items_order_idx" ON "_treatments_v_version_preparation_items" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_preparation_items_parent_id_idx" ON "_treatments_v_version_preparation_items" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_faqs_order_idx" ON "_treatments_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_faqs_parent_id_idx" ON "_treatments_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_related_order_idx" ON "_treatments_v_version_related" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_related_parent_id_idx" ON "_treatments_v_version_related" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_version_testimonials_order_idx" ON "_treatments_v_version_testimonials" USING btree ("_order");
  CREATE INDEX "_treatments_v_version_testimonials_parent_id_idx" ON "_treatments_v_version_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_treatments_v_parent_idx" ON "_treatments_v" USING btree ("parent_id");
  CREATE INDEX "_treatments_v_version_version_slug_idx" ON "_treatments_v" USING btree ("version_slug");
  CREATE INDEX "_treatments_v_version_hero_version_hero_hero_photo_idx" ON "_treatments_v" USING btree ("version_hero_hero_photo_id");
  CREATE INDEX "_treatments_v_version_version_updated_at_idx" ON "_treatments_v" USING btree ("version_updated_at");
  CREATE INDEX "_treatments_v_version_version_created_at_idx" ON "_treatments_v" USING btree ("version_created_at");
  CREATE INDEX "_treatments_v_version_version__status_idx" ON "_treatments_v" USING btree ("version__status");
  CREATE INDEX "_treatments_v_created_at_idx" ON "_treatments_v" USING btree ("created_at");
  CREATE INDEX "_treatments_v_updated_at_idx" ON "_treatments_v" USING btree ("updated_at");
  CREATE INDEX "_treatments_v_latest_idx" ON "_treatments_v" USING btree ("latest");
  CREATE INDEX "cities_intro_order_idx" ON "cities_intro" USING btree ("_order");
  CREATE INDEX "cities_intro_parent_id_idx" ON "cities_intro" USING btree ("_parent_id");
  CREATE INDEX "cities_faqs_order_idx" ON "cities_faqs" USING btree ("_order");
  CREATE INDEX "cities_faqs_parent_id_idx" ON "cities_faqs" USING btree ("_parent_id");
  CREATE INDEX "cities_womens_health_order_idx" ON "cities_womens_health" USING btree ("_order");
  CREATE INDEX "cities_womens_health_parent_id_idx" ON "cities_womens_health" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cities_slug_idx" ON "cities" USING btree ("slug");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "cities__status_idx" ON "cities" USING btree ("_status");
  CREATE INDEX "_cities_v_version_intro_order_idx" ON "_cities_v_version_intro" USING btree ("_order");
  CREATE INDEX "_cities_v_version_intro_parent_id_idx" ON "_cities_v_version_intro" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_version_faqs_order_idx" ON "_cities_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_cities_v_version_faqs_parent_id_idx" ON "_cities_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_version_womens_health_order_idx" ON "_cities_v_version_womens_health" USING btree ("_order");
  CREATE INDEX "_cities_v_version_womens_health_parent_id_idx" ON "_cities_v_version_womens_health" USING btree ("_parent_id");
  CREATE INDEX "_cities_v_parent_idx" ON "_cities_v" USING btree ("parent_id");
  CREATE INDEX "_cities_v_version_version_slug_idx" ON "_cities_v" USING btree ("version_slug");
  CREATE INDEX "_cities_v_version_version_updated_at_idx" ON "_cities_v" USING btree ("version_updated_at");
  CREATE INDEX "_cities_v_version_version_created_at_idx" ON "_cities_v" USING btree ("version_created_at");
  CREATE INDEX "_cities_v_version_version__status_idx" ON "_cities_v" USING btree ("version__status");
  CREATE INDEX "_cities_v_created_at_idx" ON "_cities_v" USING btree ("created_at");
  CREATE INDEX "_cities_v_updated_at_idx" ON "_cities_v" USING btree ("updated_at");
  CREATE INDEX "_cities_v_latest_idx" ON "_cities_v" USING btree ("latest");
  CREATE INDEX "centres_opening_days_order_idx" ON "centres_opening_days" USING btree ("_order");
  CREATE INDEX "centres_opening_days_parent_id_idx" ON "centres_opening_days" USING btree ("_parent_id");
  CREATE INDEX "centres_nearby_order_idx" ON "centres_nearby" USING btree ("_order");
  CREATE INDEX "centres_nearby_parent_id_idx" ON "centres_nearby" USING btree ("_parent_id");
  CREATE INDEX "centres_landmarks_order_idx" ON "centres_landmarks" USING btree ("_order");
  CREATE INDEX "centres_landmarks_parent_id_idx" ON "centres_landmarks" USING btree ("_parent_id");
  CREATE INDEX "centres_how_to_reach_order_idx" ON "centres_how_to_reach" USING btree ("_order");
  CREATE INDEX "centres_how_to_reach_parent_id_idx" ON "centres_how_to_reach" USING btree ("_parent_id");
  CREATE INDEX "centres_facilities_order_idx" ON "centres_facilities" USING btree ("_order");
  CREATE INDEX "centres_facilities_parent_id_idx" ON "centres_facilities" USING btree ("_parent_id");
  CREATE INDEX "centres_doctors_order_idx" ON "centres_doctors" USING btree ("_order");
  CREATE INDEX "centres_doctors_parent_id_idx" ON "centres_doctors" USING btree ("_parent_id");
  CREATE INDEX "centres_treatments_order_idx" ON "centres_treatments" USING btree ("_order");
  CREATE INDEX "centres_treatments_parent_id_idx" ON "centres_treatments" USING btree ("_parent_id");
  CREATE INDEX "centres_womens_health_order_idx" ON "centres_womens_health" USING btree ("_order");
  CREATE INDEX "centres_womens_health_parent_id_idx" ON "centres_womens_health" USING btree ("_parent_id");
  CREATE INDEX "centres_faqs_order_idx" ON "centres_faqs" USING btree ("_order");
  CREATE INDEX "centres_faqs_parent_id_idx" ON "centres_faqs" USING btree ("_parent_id");
  CREATE INDEX "centres_gallery_order_idx" ON "centres_gallery" USING btree ("_order");
  CREATE INDEX "centres_gallery_parent_id_idx" ON "centres_gallery" USING btree ("_parent_id");
  CREATE INDEX "centres_same_as_order_idx" ON "centres_same_as" USING btree ("_order");
  CREATE INDEX "centres_same_as_parent_id_idx" ON "centres_same_as" USING btree ("_parent_id");
  CREATE INDEX "centres_slug_idx" ON "centres" USING btree ("slug");
  CREATE INDEX "centres_city_slug_idx" ON "centres" USING btree ("city_slug");
  CREATE INDEX "centres_updated_at_idx" ON "centres" USING btree ("updated_at");
  CREATE INDEX "centres_created_at_idx" ON "centres" USING btree ("created_at");
  CREATE INDEX "centres__status_idx" ON "centres" USING btree ("_status");
  CREATE INDEX "_centres_v_version_opening_days_order_idx" ON "_centres_v_version_opening_days" USING btree ("_order");
  CREATE INDEX "_centres_v_version_opening_days_parent_id_idx" ON "_centres_v_version_opening_days" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_nearby_order_idx" ON "_centres_v_version_nearby" USING btree ("_order");
  CREATE INDEX "_centres_v_version_nearby_parent_id_idx" ON "_centres_v_version_nearby" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_landmarks_order_idx" ON "_centres_v_version_landmarks" USING btree ("_order");
  CREATE INDEX "_centres_v_version_landmarks_parent_id_idx" ON "_centres_v_version_landmarks" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_how_to_reach_order_idx" ON "_centres_v_version_how_to_reach" USING btree ("_order");
  CREATE INDEX "_centres_v_version_how_to_reach_parent_id_idx" ON "_centres_v_version_how_to_reach" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_facilities_order_idx" ON "_centres_v_version_facilities" USING btree ("_order");
  CREATE INDEX "_centres_v_version_facilities_parent_id_idx" ON "_centres_v_version_facilities" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_doctors_order_idx" ON "_centres_v_version_doctors" USING btree ("_order");
  CREATE INDEX "_centres_v_version_doctors_parent_id_idx" ON "_centres_v_version_doctors" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_treatments_order_idx" ON "_centres_v_version_treatments" USING btree ("_order");
  CREATE INDEX "_centres_v_version_treatments_parent_id_idx" ON "_centres_v_version_treatments" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_womens_health_order_idx" ON "_centres_v_version_womens_health" USING btree ("_order");
  CREATE INDEX "_centres_v_version_womens_health_parent_id_idx" ON "_centres_v_version_womens_health" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_faqs_order_idx" ON "_centres_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_centres_v_version_faqs_parent_id_idx" ON "_centres_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_gallery_order_idx" ON "_centres_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_centres_v_version_gallery_parent_id_idx" ON "_centres_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_version_same_as_order_idx" ON "_centres_v_version_same_as" USING btree ("_order");
  CREATE INDEX "_centres_v_version_same_as_parent_id_idx" ON "_centres_v_version_same_as" USING btree ("_parent_id");
  CREATE INDEX "_centres_v_parent_idx" ON "_centres_v" USING btree ("parent_id");
  CREATE INDEX "_centres_v_version_version_slug_idx" ON "_centres_v" USING btree ("version_slug");
  CREATE INDEX "_centres_v_version_version_city_slug_idx" ON "_centres_v" USING btree ("version_city_slug");
  CREATE INDEX "_centres_v_version_version_updated_at_idx" ON "_centres_v" USING btree ("version_updated_at");
  CREATE INDEX "_centres_v_version_version_created_at_idx" ON "_centres_v" USING btree ("version_created_at");
  CREATE INDEX "_centres_v_version_version__status_idx" ON "_centres_v" USING btree ("version__status");
  CREATE INDEX "_centres_v_created_at_idx" ON "_centres_v" USING btree ("created_at");
  CREATE INDEX "_centres_v_updated_at_idx" ON "_centres_v" USING btree ("updated_at");
  CREATE INDEX "_centres_v_latest_idx" ON "_centres_v" USING btree ("latest");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_treatments_id_idx" ON "payload_locked_documents_rels" USING btree ("treatments_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_centres_id_idx" ON "payload_locked_documents_rels" USING btree ("centres_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_awards_order_idx" ON "site_settings_awards" USING btree ("_order");
  CREATE INDEX "site_settings_awards_parent_id_idx" ON "site_settings_awards" USING btree ("_parent_id");
  CREATE INDEX "site_settings_knows_about_order_idx" ON "site_settings_knows_about" USING btree ("_order");
  CREATE INDEX "site_settings_knows_about_parent_id_idx" ON "site_settings_knows_about" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "contact_info_cards_order_idx" ON "contact_info_cards" USING btree ("_order");
  CREATE INDEX "contact_info_cards_parent_id_idx" ON "contact_info_cards" USING btree ("_parent_id");
  CREATE INDEX "blog_hub_seo_seo_og_image_idx" ON "blog_hub" USING btree ("seo_og_image_id");
  CREATE INDEX "footer_nav_groups_links_order_idx" ON "footer_nav_groups_links" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_links_parent_id_idx" ON "footer_nav_groups_links" USING btree ("_parent_id");
  CREATE INDEX "footer_nav_groups_order_idx" ON "footer_nav_groups" USING btree ("_order");
  CREATE INDEX "footer_nav_groups_parent_id_idx" ON "footer_nav_groups" USING btree ("_parent_id");
  CREATE INDEX "footer_social_order_idx" ON "footer_social" USING btree ("_order");
  CREATE INDEX "footer_social_parent_id_idx" ON "footer_social" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_items_children_order_idx" ON "header_nav_items_columns_items_children" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_items_children_parent_id_idx" ON "header_nav_items_columns_items_children" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_items_order_idx" ON "header_nav_items_columns_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_items_parent_id_idx" ON "header_nav_items_columns_items" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_order_idx" ON "header_nav_items_columns" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_parent_id_idx" ON "header_nav_items_columns" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_layout_order_idx" ON "homepage_layout" USING btree ("_order");
  CREATE INDEX "homepage_layout_parent_id_idx" ON "homepage_layout" USING btree ("_parent_id");
  CREATE INDEX "homepage_hero_badges_order_idx" ON "homepage_hero_badges" USING btree ("_order");
  CREATE INDEX "homepage_hero_badges_parent_id_idx" ON "homepage_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "homepage_stats_order_idx" ON "homepage_stats" USING btree ("_order");
  CREATE INDEX "homepage_stats_parent_id_idx" ON "homepage_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_bavishi_cards_order_idx" ON "homepage_why_bavishi_cards" USING btree ("_order");
  CREATE INDEX "homepage_why_bavishi_cards_parent_id_idx" ON "homepage_why_bavishi_cards" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_choose_blocks_points_order_idx" ON "homepage_why_choose_blocks_points" USING btree ("_order");
  CREATE INDEX "homepage_why_choose_blocks_points_parent_id_idx" ON "homepage_why_choose_blocks_points" USING btree ("_parent_id");
  CREATE INDEX "homepage_why_choose_blocks_order_idx" ON "homepage_why_choose_blocks" USING btree ("_order");
  CREATE INDEX "homepage_why_choose_blocks_parent_id_idx" ON "homepage_why_choose_blocks" USING btree ("_parent_id");
  CREATE INDEX "homepage_suraksha_features_order_idx" ON "homepage_suraksha_features" USING btree ("_order");
  CREATE INDEX "homepage_suraksha_features_parent_id_idx" ON "homepage_suraksha_features" USING btree ("_parent_id");
  CREATE INDEX "homepage_about_stats_order_idx" ON "homepage_about_stats" USING btree ("_order");
  CREATE INDEX "homepage_about_stats_parent_id_idx" ON "homepage_about_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_treatments_items_order_idx" ON "homepage_treatments_items" USING btree ("_order");
  CREATE INDEX "homepage_treatments_items_parent_id_idx" ON "homepage_treatments_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_awards_items_order_idx" ON "homepage_awards_items" USING btree ("_order");
  CREATE INDEX "homepage_awards_items_parent_id_idx" ON "homepage_awards_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_events_posters_order_idx" ON "homepage_events_posters" USING btree ("_order");
  CREATE INDEX "homepage_events_posters_parent_id_idx" ON "homepage_events_posters" USING btree ("_parent_id");
  CREATE INDEX "homepage_videos_stories_order_idx" ON "homepage_videos_stories" USING btree ("_order");
  CREATE INDEX "homepage_videos_stories_parent_id_idx" ON "homepage_videos_stories" USING btree ("_parent_id");
  CREATE INDEX "homepage_videos_edu_order_idx" ON "homepage_videos_edu" USING btree ("_order");
  CREATE INDEX "homepage_videos_edu_parent_id_idx" ON "homepage_videos_edu" USING btree ("_parent_id");
  CREATE INDEX "homepage_videos_resources_order_idx" ON "homepage_videos_resources" USING btree ("_order");
  CREATE INDEX "homepage_videos_resources_parent_id_idx" ON "homepage_videos_resources" USING btree ("_parent_id");
  CREATE INDEX "homepage_media_logos_order_idx" ON "homepage_media_logos" USING btree ("_order");
  CREATE INDEX "homepage_media_logos_parent_id_idx" ON "homepage_media_logos" USING btree ("_parent_id");
  CREATE INDEX "homepage_locations_cities_order_idx" ON "homepage_locations_cities" USING btree ("_order");
  CREATE INDEX "homepage_locations_cities_parent_id_idx" ON "homepage_locations_cities" USING btree ("_parent_id");
  CREATE INDEX "homepage_calculators_items_order_idx" ON "homepage_calculators_items" USING btree ("_order");
  CREATE INDEX "homepage_calculators_items_parent_id_idx" ON "homepage_calculators_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_inquiry_contacts_order_idx" ON "homepage_inquiry_contacts" USING btree ("_order");
  CREATE INDEX "homepage_inquiry_contacts_parent_id_idx" ON "homepage_inquiry_contacts" USING btree ("_parent_id");
  CREATE INDEX "homepage_faq_items_order_idx" ON "homepage_faq_items" USING btree ("_order");
  CREATE INDEX "homepage_faq_items_parent_id_idx" ON "homepage_faq_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_final_cta_stats_order_idx" ON "homepage_final_cta_stats" USING btree ("_order");
  CREATE INDEX "homepage_final_cta_stats_parent_id_idx" ON "homepage_final_cta_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_seo_seo_og_image_idx" ON "homepage" USING btree ("seo_og_image_id");
  CREATE INDEX "about_page_story_paragraphs_order_idx" ON "about_page_story_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_story_paragraphs_parent_id_idx" ON "about_page_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_at_a_glance_order_idx" ON "about_page_at_a_glance" USING btree ("_order");
  CREATE INDEX "about_page_at_a_glance_parent_id_idx" ON "about_page_at_a_glance" USING btree ("_parent_id");
  CREATE INDEX "about_page_milestones_order_idx" ON "about_page_milestones" USING btree ("_order");
  CREATE INDEX "about_page_milestones_parent_id_idx" ON "about_page_milestones" USING btree ("_parent_id");
  CREATE INDEX "about_page_trust_pillars_order_idx" ON "about_page_trust_pillars" USING btree ("_order");
  CREATE INDEX "about_page_trust_pillars_parent_id_idx" ON "about_page_trust_pillars" USING btree ("_parent_id");
  CREATE INDEX "about_page_patient_first_paragraphs_order_idx" ON "about_page_patient_first_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_patient_first_paragraphs_parent_id_idx" ON "about_page_patient_first_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_patient_stats_order_idx" ON "about_page_patient_stats" USING btree ("_order");
  CREATE INDEX "about_page_patient_stats_parent_id_idx" ON "about_page_patient_stats" USING btree ("_parent_id");
  CREATE INDEX "about_page_network_cities_order_idx" ON "about_page_network_cities" USING btree ("_order");
  CREATE INDEX "about_page_network_cities_parent_id_idx" ON "about_page_network_cities" USING btree ("_parent_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE INDEX "seo_settings_disallow_paths_order_idx" ON "seo_settings_disallow_paths" USING btree ("_order");
  CREATE INDEX "seo_settings_disallow_paths_parent_id_idx" ON "seo_settings_disallow_paths" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "inquiries" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "pages_faqs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_version_faqs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "blogs_treatment_slugs" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "_blogs_v_version_treatment_slugs" CASCADE;
  DROP TABLE "_blogs_v" CASCADE;
  DROP TABLE "authors_same_as" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "services_hero_badges" CASCADE;
  DROP TABLE "services_overview_paragraphs" CASCADE;
  DROP TABLE "services_benefits_items" CASCADE;
  DROP TABLE "services_who_for_items" CASCADE;
  DROP TABLE "services_process_steps" CASCADE;
  DROP TABLE "services_why_us_items" CASCADE;
  DROP TABLE "services_info_note_paragraphs" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services_related" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_hero_badges" CASCADE;
  DROP TABLE "_services_v_version_overview_paragraphs" CASCADE;
  DROP TABLE "_services_v_version_benefits_items" CASCADE;
  DROP TABLE "_services_v_version_who_for_items" CASCADE;
  DROP TABLE "_services_v_version_process_steps" CASCADE;
  DROP TABLE "_services_v_version_why_us_items" CASCADE;
  DROP TABLE "_services_v_version_info_note_paragraphs" CASCADE;
  DROP TABLE "_services_v_version_faqs" CASCADE;
  DROP TABLE "_services_v_version_related" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "doctors_medical_specialty" CASCADE;
  DROP TABLE "doctors_cities" CASCADE;
  DROP TABLE "doctors_locations" CASCADE;
  DROP TABLE "doctors_treatments" CASCADE;
  DROP TABLE "doctors_bio" CASCADE;
  DROP TABLE "doctors_knows_about" CASCADE;
  DROP TABLE "doctors_alumni_of" CASCADE;
  DROP TABLE "doctors_member_of" CASCADE;
  DROP TABLE "doctors_awards" CASCADE;
  DROP TABLE "doctors_training" CASCADE;
  DROP TABLE "doctors_publications" CASCADE;
  DROP TABLE "doctors_languages" CASCADE;
  DROP TABLE "doctors_same_as" CASCADE;
  DROP TABLE "doctors" CASCADE;
  DROP TABLE "_doctors_v_version_medical_specialty" CASCADE;
  DROP TABLE "_doctors_v_version_cities" CASCADE;
  DROP TABLE "_doctors_v_version_locations" CASCADE;
  DROP TABLE "_doctors_v_version_treatments" CASCADE;
  DROP TABLE "_doctors_v_version_bio" CASCADE;
  DROP TABLE "_doctors_v_version_knows_about" CASCADE;
  DROP TABLE "_doctors_v_version_alumni_of" CASCADE;
  DROP TABLE "_doctors_v_version_member_of" CASCADE;
  DROP TABLE "_doctors_v_version_awards" CASCADE;
  DROP TABLE "_doctors_v_version_training" CASCADE;
  DROP TABLE "_doctors_v_version_publications" CASCADE;
  DROP TABLE "_doctors_v_version_languages" CASCADE;
  DROP TABLE "_doctors_v_version_same_as" CASCADE;
  DROP TABLE "_doctors_v" CASCADE;
  DROP TABLE "treatments_hero_badges" CASCADE;
  DROP TABLE "treatments_what_is_paragraphs" CASCADE;
  DROP TABLE "treatments_benefits_items" CASCADE;
  DROP TABLE "treatments_types_items" CASCADE;
  DROP TABLE "treatments_who_needs_it_items" CASCADE;
  DROP TABLE "treatments_process_steps" CASCADE;
  DROP TABLE "treatments_timeline_items" CASCADE;
  DROP TABLE "treatments_timeline_chips" CASCADE;
  DROP TABLE "treatments_technology_items" CASCADE;
  DROP TABLE "treatments_why_us_items" CASCADE;
  DROP TABLE "treatments_success_factors" CASCADE;
  DROP TABLE "treatments_cost_includes" CASCADE;
  DROP TABLE "treatments_risks_items" CASCADE;
  DROP TABLE "treatments_preparation_items" CASCADE;
  DROP TABLE "treatments_faqs" CASCADE;
  DROP TABLE "treatments_related" CASCADE;
  DROP TABLE "treatments_testimonials" CASCADE;
  DROP TABLE "treatments" CASCADE;
  DROP TABLE "_treatments_v_version_hero_badges" CASCADE;
  DROP TABLE "_treatments_v_version_what_is_paragraphs" CASCADE;
  DROP TABLE "_treatments_v_version_benefits_items" CASCADE;
  DROP TABLE "_treatments_v_version_types_items" CASCADE;
  DROP TABLE "_treatments_v_version_who_needs_it_items" CASCADE;
  DROP TABLE "_treatments_v_version_process_steps" CASCADE;
  DROP TABLE "_treatments_v_version_timeline_items" CASCADE;
  DROP TABLE "_treatments_v_version_timeline_chips" CASCADE;
  DROP TABLE "_treatments_v_version_technology_items" CASCADE;
  DROP TABLE "_treatments_v_version_why_us_items" CASCADE;
  DROP TABLE "_treatments_v_version_success_factors" CASCADE;
  DROP TABLE "_treatments_v_version_cost_includes" CASCADE;
  DROP TABLE "_treatments_v_version_risks_items" CASCADE;
  DROP TABLE "_treatments_v_version_preparation_items" CASCADE;
  DROP TABLE "_treatments_v_version_faqs" CASCADE;
  DROP TABLE "_treatments_v_version_related" CASCADE;
  DROP TABLE "_treatments_v_version_testimonials" CASCADE;
  DROP TABLE "_treatments_v" CASCADE;
  DROP TABLE "cities_intro" CASCADE;
  DROP TABLE "cities_faqs" CASCADE;
  DROP TABLE "cities_womens_health" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "_cities_v_version_intro" CASCADE;
  DROP TABLE "_cities_v_version_faqs" CASCADE;
  DROP TABLE "_cities_v_version_womens_health" CASCADE;
  DROP TABLE "_cities_v" CASCADE;
  DROP TABLE "centres_opening_days" CASCADE;
  DROP TABLE "centres_nearby" CASCADE;
  DROP TABLE "centres_landmarks" CASCADE;
  DROP TABLE "centres_how_to_reach" CASCADE;
  DROP TABLE "centres_facilities" CASCADE;
  DROP TABLE "centres_doctors" CASCADE;
  DROP TABLE "centres_treatments" CASCADE;
  DROP TABLE "centres_womens_health" CASCADE;
  DROP TABLE "centres_faqs" CASCADE;
  DROP TABLE "centres_gallery" CASCADE;
  DROP TABLE "centres_same_as" CASCADE;
  DROP TABLE "centres" CASCADE;
  DROP TABLE "_centres_v_version_opening_days" CASCADE;
  DROP TABLE "_centres_v_version_nearby" CASCADE;
  DROP TABLE "_centres_v_version_landmarks" CASCADE;
  DROP TABLE "_centres_v_version_how_to_reach" CASCADE;
  DROP TABLE "_centres_v_version_facilities" CASCADE;
  DROP TABLE "_centres_v_version_doctors" CASCADE;
  DROP TABLE "_centres_v_version_treatments" CASCADE;
  DROP TABLE "_centres_v_version_womens_health" CASCADE;
  DROP TABLE "_centres_v_version_faqs" CASCADE;
  DROP TABLE "_centres_v_version_gallery" CASCADE;
  DROP TABLE "_centres_v_version_same_as" CASCADE;
  DROP TABLE "_centres_v" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_awards" CASCADE;
  DROP TABLE "site_settings_knows_about" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "contact_info_cards" CASCADE;
  DROP TABLE "contact_info" CASCADE;
  DROP TABLE "blog_hub" CASCADE;
  DROP TABLE "footer_nav_groups_links" CASCADE;
  DROP TABLE "footer_nav_groups" CASCADE;
  DROP TABLE "footer_social" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "header_nav_items_columns_items_children" CASCADE;
  DROP TABLE "header_nav_items_columns_items" CASCADE;
  DROP TABLE "header_nav_items_columns" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "homepage_layout" CASCADE;
  DROP TABLE "homepage_hero_badges" CASCADE;
  DROP TABLE "homepage_stats" CASCADE;
  DROP TABLE "homepage_why_bavishi_cards" CASCADE;
  DROP TABLE "homepage_why_choose_blocks_points" CASCADE;
  DROP TABLE "homepage_why_choose_blocks" CASCADE;
  DROP TABLE "homepage_suraksha_features" CASCADE;
  DROP TABLE "homepage_about_stats" CASCADE;
  DROP TABLE "homepage_treatments_items" CASCADE;
  DROP TABLE "homepage_awards_items" CASCADE;
  DROP TABLE "homepage_events_posters" CASCADE;
  DROP TABLE "homepage_videos_stories" CASCADE;
  DROP TABLE "homepage_videos_edu" CASCADE;
  DROP TABLE "homepage_videos_resources" CASCADE;
  DROP TABLE "homepage_media_logos" CASCADE;
  DROP TABLE "homepage_locations_cities" CASCADE;
  DROP TABLE "homepage_calculators_items" CASCADE;
  DROP TABLE "homepage_inquiry_contacts" CASCADE;
  DROP TABLE "homepage_faq_items" CASCADE;
  DROP TABLE "homepage_final_cta_stats" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "about_page_story_paragraphs" CASCADE;
  DROP TABLE "about_page_at_a_glance" CASCADE;
  DROP TABLE "about_page_milestones" CASCADE;
  DROP TABLE "about_page_trust_pillars" CASCADE;
  DROP TABLE "about_page_patient_first_paragraphs" CASCADE;
  DROP TABLE "about_page_patient_stats" CASCADE;
  DROP TABLE "about_page_network_cities" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "seo_settings_disallow_paths" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_blogs_status";
  DROP TYPE "public"."enum__blogs_v_version_status";
  DROP TYPE "public"."enum_services_process_steps_icon";
  DROP TYPE "public"."enum_services_why_us_items_icon";
  DROP TYPE "public"."enum_services_icon";
  DROP TYPE "public"."enum_services_schema_type";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_process_steps_icon";
  DROP TYPE "public"."enum__services_v_version_why_us_items_icon";
  DROP TYPE "public"."enum__services_v_version_icon";
  DROP TYPE "public"."enum__services_v_version_schema_type";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_doctors_nav_role";
  DROP TYPE "public"."enum_doctors_status";
  DROP TYPE "public"."enum__doctors_v_version_nav_role";
  DROP TYPE "public"."enum__doctors_v_version_status";
  DROP TYPE "public"."enum_treatments_types_items_icon";
  DROP TYPE "public"."enum_treatments_process_steps_icon";
  DROP TYPE "public"."enum_treatments_technology_items_icon";
  DROP TYPE "public"."enum_treatments_why_us_items_icon";
  DROP TYPE "public"."enum_treatments_nav_category";
  DROP TYPE "public"."enum_treatments_status";
  DROP TYPE "public"."enum__treatments_v_version_types_items_icon";
  DROP TYPE "public"."enum__treatments_v_version_process_steps_icon";
  DROP TYPE "public"."enum__treatments_v_version_technology_items_icon";
  DROP TYPE "public"."enum__treatments_v_version_why_us_items_icon";
  DROP TYPE "public"."enum__treatments_v_version_nav_category";
  DROP TYPE "public"."enum__treatments_v_version_status";
  DROP TYPE "public"."enum_cities_status";
  DROP TYPE "public"."enum__cities_v_version_status";
  DROP TYPE "public"."enum_centres_status";
  DROP TYPE "public"."enum__centres_v_version_status";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_contact_info_cards_icon";
  DROP TYPE "public"."enum_contact_info_cards_channel";
  DROP TYPE "public"."enum_footer_nav_groups_links_channel";
  DROP TYPE "public"."enum_footer_social_platform";
  DROP TYPE "public"."enum_header_cta_style_variant";
  DROP TYPE "public"."enum_homepage_layout_section";
  DROP TYPE "public"."enum_homepage_why_bavishi_cards_icon";
  DROP TYPE "public"."enum_homepage_treatments_items_icon";
  DROP TYPE "public"."enum_about_page_trust_pillars_icon";`)
}
