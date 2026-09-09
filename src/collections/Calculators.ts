import type { CollectionConfig } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isAdminField } from "@/access/roles";

export const CALCULATOR_TYPES = [
  { label: "IVF Success Rate Calculator",           value: "ivf-success-rate" },
  { label: "IVF Cost Calculator",                   value: "ivf-cost" },
  { label: "Ovulation Calculator",                  value: "ovulation" },
  { label: "Natural Pregnancy Calculator",          value: "natural-pregnancy" },
  { label: "Fertile Period Calculator",             value: "fertile-period" },
  { label: "AMH Level Interpreter",                 value: "amh-level" },
  { label: "Semen Analysis Calculator",             value: "semen-analysis" },
  { label: "Miscarriage Risk Calculator",           value: "miscarriage-risk" },
] as const;

export type CalculatorTypeValue = (typeof CALCULATOR_TYPES)[number]["value"];

export const Calculators: CollectionConfig = {
  slug: "calculators",
  labels: { singular: "Calculator Page", plural: "Calculator Pages" },
  admin: {
    group: "Tools & Calculators",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Manage the 8 fertility calculator pages — edit titles, descriptions, FAQs and SEO.",
  },
  access: { read: () => true },
  hooks: revalidateCollection("calculators"),
  fields: [
    // ── Identity ────────────────────────────────────────────────────────────
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "select",
          required: true,
          unique: true,
          index: true,
          label: "Calculator",
          options: [...CALCULATOR_TYPES],
          access: { update: isAdminField },
          admin: {
            width: "50%",
            description: "Which calculator this page represents. Set once — do not change.",
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          label: "Page Title",
          admin: {
            width: "50%",
            description: "The main heading shown at the top of the calculator page.",
          },
        },
      ],
    },
    {
      name: "subtitle",
      type: "textarea",
      label: "Subtitle / Intro Text",
      admin: {
        description: "One or two sentences shown below the page title to explain what the calculator does.",
      },
    },
    {
      name: "disclaimer",
      type: "textarea",
      label: "Medical Disclaimer",
      admin: {
        description: "Disclaimer text shown below the calculator results. E.g. 'Results are estimates only…'",
      },
    },

    // ── FAQs ────────────────────────────────────────────────────────────────
    {
      name: "faqs",
      type: "array",
      label: "Frequently Asked Questions",
      labels: { singular: "FAQ", plural: "FAQs" },
      admin: {
        description: "Questions and answers shown in the FAQ section below the calculator.",
      },
      fields: [
        { name: "question", type: "text",     required: true, label: "Question" },
        { name: "answer",   type: "textarea", required: true, label: "Answer" },
      ],
    },

    // ── SEO ─────────────────────────────────────────────────────────────────
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: { description: "Controls how this page appears in Google search results." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "metaTitle",       type: "text",     label: "Meta Title",       admin: { width: "50%", description: "Title shown in Google results (50–60 chars)." } },
            { name: "metaDescription", type: "textarea", label: "Meta Description", admin: { width: "50%", description: "Description shown in Google results (120–160 chars)." } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "ogTitle",       type: "text",     label: "Social Share Title",       admin: { width: "50%" } },
            { name: "ogDescription", type: "textarea", label: "Social Share Description", admin: { width: "50%" } },
          ],
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          label: "Social Share Image",
          admin: { description: "Image shown when sharing this page on WhatsApp, Facebook, etc. (1200×630px ideal)." },
        },
      ],
    },
  ],
};
