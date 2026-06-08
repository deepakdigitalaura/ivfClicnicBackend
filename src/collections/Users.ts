import type { CollectionConfig } from "payload";
import { isAdmin, isAdminField, canAccessPanel } from "@/access/roles";

/** Admin users — the panel's auth collection. RBAC via the `roles` field. */
export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Admin" },
  auth: true,
  access: {
    // Who may use the admin panel at all (admin OR editor).
    admin: canAccessPanel,
    // Managing users (and therefore roles) is admin-only.
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["editor"],
      saveToJWT: true, // exposes roles on req.user for access checks
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      // Anti-privilege-escalation: only an admin can set/change roles.
      access: { create: isAdminField, update: isAdminField },
      admin: {
        description: "Admin = full access (globals, users, structure). Editor = content only.",
      },
    },
  ],
};
