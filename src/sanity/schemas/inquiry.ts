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

    // Where the visit came from, captured on the landing page. See
    // src/lib/attribution.ts for how a channel is decided.
    defineField({ name: "channel", title: "Lead Channel", type: "string" }),
    defineField({ name: "channelLabel", title: "Channel Label", type: "string" }),
    defineField({ name: "channelDetail", title: "Channel Detail", type: "string" }),
    defineField({ name: "referrer", title: "Referrer URL", type: "string" }),
    defineField({ name: "landingPage", title: "Landing Page", type: "string" }),
    defineField({ name: "utmSource", title: "UTM Source", type: "string" }),
    defineField({ name: "utmMedium", title: "UTM Medium", type: "string" }),
    defineField({ name: "utmCampaign", title: "UTM Campaign", type: "string" }),
    defineField({ name: "gclid", title: "Google Ads Click ID", type: "string" }),
    defineField({ name: "firstTouchChannel", title: "First Touch Channel", type: "string" }),
    defineField({ name: "firstTouchLabel", title: "First Touch Label", type: "string" }),
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
