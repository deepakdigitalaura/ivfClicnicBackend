import { defineType, defineField } from "sanity";

export default defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "treatment", title: "Treatment Interest", type: "string" }),
    defineField({ name: "location", title: "Preferred Centre", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "source", title: "Source Page", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["new", "contacted", "closed"] },
      initialValue: "new",
    }),
    defineField({ name: "createdAt", title: "Received At", type: "datetime" }),
  ],
  orderings: [
    { title: "Newest first", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "treatment", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title: title || "Unnamed", subtitle: `${status ?? "new"} · ${subtitle ?? ""}` };
    },
  },
});
