import { defineType, defineField } from "sanity";

const stringList = (name: string, title: string, group: string, description?: string) =>
  defineField({ name, title, description, group, type: "array", of: [{ type: "string" }] });

export default defineType({
  name: "doctor",
  title: "Doctor",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "profile", title: "Profile & Bio" },
    { name: "credentials", title: "Credentials (EEAT)" },
    { name: "nav", title: "Navigation" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Slug (URL)",
      description: "URL id, e.g. dr-himanshu-bavishi. Must match the code slug to override an existing doctor.",
      type: "string",
      group: "main",
      validation: (R) => R.required(),
    }),
    defineField({ name: "name", title: "Full Name", type: "string", group: "main", validation: (R) => R.required() }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true }, group: "main" }),
    defineField({ name: "imageUrl", title: "Photo URL (alternative)", description: "Use if you have an image URL instead of uploading.", type: "string", group: "main" }),
    defineField({ name: "credentials", title: "Credentials", description: "e.g. M.D., D.G.O.", type: "string", group: "main" }),
    defineField({ name: "specialty", title: "Specialty Line", description: "Shown on cards, e.g. Fertility Specialist & Gynaecologist", type: "string", group: "main" }),
    defineField({ name: "role", title: "Role", description: "e.g. Director & Chief IVF Specialist", type: "string", group: "main" }),
    defineField({ name: "experienceLabel", title: "Experience Label", description: 'e.g. "35+ yrs"', type: "string", group: "main" }),
    defineField({ name: "experienceYears", title: "Experience (years, number)", type: "number", group: "main" }),
    stringList("cities", "Cities", "main", "City labels the doctor consults in"),

    defineField({ name: "shortBio", title: "Short Bio", description: "One-line summary for cards & meta description.", type: "text", rows: 2, group: "profile" }),
    stringList("bio", "Bio Paragraphs", "profile", "Full bio — one paragraph per row."),
    stringList("treatments", "Treatment Slugs", "profile", "Treatment slugs this doctor practises (e.g. ivf, icsi, iui)."),
    stringList("locations", "Location Slugs", "profile", "City/area slugs for internal links."),
    stringList("languages", "Languages", "profile"),

    stringList("knowsAbout", "Knows About", "credentials", "Topics of expertise (schema knowsAbout)."),
    stringList("alumniOf", "Alumni Of", "credentials", "Institutions / degrees."),
    stringList("memberOf", "Member Of", "credentials", "Professional bodies."),
    stringList("awards", "Awards", "credentials"),
    stringList("training", "Advanced Training / Fellowships", "credentials"),
    stringList("publications", "Publications / Books", "credentials"),
    stringList("sameAs", "Profile URLs (sameAs)", "credentials", "LinkedIn, ResearchGate, etc."),
    defineField({
      name: "verified",
      title: "Verified",
      description: "Turn ON only when degrees/experience are confirmed. Gates use as a medical reviewer.",
      type: "boolean",
      initialValue: false,
      group: "credentials",
    }),

    defineField({ name: "visitsAllCentres", title: "Visits all centres", description: "Senior specialist who rotates across cities.", type: "boolean", initialValue: false, group: "nav" }),
    defineField({
      name: "navRole",
      title: "Header/Footer Role",
      description: "Set to show this doctor in the site navigation menus.",
      type: "string",
      options: { list: [{ title: "Senior Specialist", value: "senior-specialist" }, { title: "Specialist", value: "specialist" }] },
      group: "nav",
    }),
    defineField({ name: "navOrder", title: "Nav / List Order", type: "number", initialValue: 0, group: "nav" }),
  ],
  preview: {
    select: { title: "name", subtitle: "specialty", media: "photo" },
  },
});
