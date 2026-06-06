import type { CollectionConfig } from "payload";

/** Admin users — the panel's auth collection. Minimal for the POC. */
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  fields: [],
};
