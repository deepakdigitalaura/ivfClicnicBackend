import { defineType, defineField } from "sanity";

export default defineType({
  name: "adminUser",
  title: "Admin User",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", validation: (R) => R.required() }),
    defineField({ name: "passwordHash", title: "Password Hash", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: { list: [{ title: "Superadmin", value: "superadmin" }, { title: "SEO", value: "seo" }] },
      initialValue: "seo",
      validation: (R) => R.required(),
    }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime" }),
  ],
  preview: {
    select: { title: "email", subtitle: "role" },
  },
});
