import { createClient } from "next-sanity";
const client = createClient({ projectId: "seh0zjkb", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN! });
const doc = await client.fetch<{ _id: string; contentRaw: string }>(`*[_type=="blog" && slug=="the-essential-dos-and-donts-after-iui-treatment-a-complete-guide"][0]{_id,contentRaw}`);
const children = (JSON.parse(doc.contentRaw) as {root:{children:{type:string;fields?:Record<string,unknown>}[]}}).root.children;
for (const n of children) {
  if (n.type === "block" && n.fields?.blockType === "infographic") {
    console.log("title:", JSON.stringify(n.fields.title));
  }
}
