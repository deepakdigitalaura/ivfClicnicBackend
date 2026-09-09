import { defineType, defineField, defineArrayMember } from "sanity";

const PAGE_KEYS = [
  { title: "Female Infertility", value: "female-infertility" },
  { title: "Male Infertility", value: "male-infertility" },
  { title: "Advanced Fertility Techniques", value: "advanced-fertility-techniques" },
  { title: "Maternity Services", value: "maternity-services" },
  { title: "Suraksha Kavach", value: "suraksha-kavach" },
];

const faqEntry = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "q", title: "Question", type: "string" }),
    defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "q" },
    prepare({ title }) {
      return { title: title || "Untitled question" };
    },
  },
});

const pageEntry = defineArrayMember({
  type: "object",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page",
      type: "string",
      options: { list: PAGE_KEYS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [faqEntry],
    }),
  ],
  preview: {
    select: { title: "pageKey" },
    prepare({ title }) {
      const found = PAGE_KEYS.find((p) => p.value === title);
      return { title: found?.title || title || "Untitled page" };
    },
  },
});

export default defineType({
  name: "pageFaqsConfig",
  title: "Page FAQs",
  type: "document",
  fields: [
    defineField({
      name: "pages",
      title: "Pages",
      description: "FAQ sets for individual category/hub pages. Leave a page's FAQs empty to use the site's default set for that page.",
      type: "array",
      of: [pageEntry],
    }),
  ],
  preview: { prepare: () => ({ title: "Page FAQs" }) },
});
