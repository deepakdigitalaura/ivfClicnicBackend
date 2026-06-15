import type { CollectionConfig, Field } from "payload";
import { isAdmin, isEditor } from "@/access/roles";

/**
 * Inquiries (leads) — Phase B.1. Every contact / "Request a Callback" form
 * submission lands here so staff can work them from one admin list instead of
 * email. The public site never POSTs to the REST API directly; the homepage /
 * contact `<InquiryForm>` posts to the dedicated, validated route handler
 * `src/app/(frontend)/inquiry/route.ts`, which writes through the Payload local
 * API with `overrideAccess` — so the collection's `create` stays staff-only and
 * the raw REST create is never exposed to spam.
 *
 * The submitted fields (name/phone/email/…) are `admin.readOnly` — a record of
 * what the patient sent, not something staff should rewrite. Only the workflow
 * fields (`status`, internal `notes`) are editable. Leads are PII, so reads are
 * staff-only. No revalidate hook: inquiries never render on a public page.
 */

/** A submitted text field: shown in the panel but locked (UI-only) so the record
 *  of what the patient actually sent stays intact. Still writable via the API. */
const submitted = (name: string, label: string, width?: string): Field => ({
  name,
  type: "text",
  label,
  admin: { readOnly: true, ...(width ? { width } : {}) },
});

/** Same as `submitted`, for a multi-line message. */
const submittedArea = (name: string, label: string): Field => ({
  name,
  type: "textarea",
  label,
  admin: { readOnly: true },
});

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "Inquiry", plural: "Inquiries" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "treatment", "status", "createdAt"],
    group: "Inquiries",
    description:
      "Callback requests and contact-form messages from the website. Open one to call the patient back, then update its status.",
  },
  access: {
    // Leads contain personal details — only staff (editor or admin) may read.
    read: isEditor,
    // Public submissions come through the /inquiry route (overrideAccess); this
    // gate is for the panel, where staff may log a phone-in lead by hand.
    create: isEditor,
    update: isEditor,
    delete: isAdmin,
  },
  fields: [
    {
      type: "row",
      fields: [submitted("name", "Full Name", "50%"), submitted("phone", "Phone", "50%")],
    },
    submitted("email", "Email"),
    {
      type: "row",
      fields: [
        submitted("treatment", "Treatment of Interest", "50%"),
        submitted("location", "Preferred Centre", "50%"),
      ],
    },
    submittedArea("message", "Message"),
    {
      name: "status",
      type: "select",
      label: "Status",
      defaultValue: "new",
      required: true,
      index: true,
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "In progress", value: "in-progress" },
        { label: "Closed", value: "closed" },
      ],
      admin: { description: "Where this lead is in your follow-up. Defaults to New." },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Internal Notes",
      admin: { description: "Private staff notes (call outcome, next step). Never shown on the website." },
    },
    submitted("source", "Submitted From"),
  ],
  // createdAt / updatedAt are added automatically (timestamps) and drive the
  // default newest-first sort in the list view.
};
