import { createClient } from "next-sanity";
const sanity = createClient({ projectId: "seh0zjkb", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });
const slugs = [
  "twin-and-multiple-pregnancies-after-ivf-risks-and-care",
  "twin-pregnancy-delivery-options-normal-delivery-vs-c-section",
  "understanding-frozen-embryo-transfer-fet-in-ivf",
  "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "understanding-negative-signs-after-embryo-transfer-when-to-worry",
];
const docs = await sanity.fetch<{_id:string;slug:string;title:string;contentRaw:string}[]>(
  `*[_type=="blog" && slug in $slugs]{_id,slug,title,contentRaw}`, { slugs }
);
for (const d of docs) {
  console.log(`\n=== ${d.slug} (${d._id}) ===`);
  try {
    const root = (JSON.parse(d.contentRaw) as {root:{children:{type:string;tag?:string;fields?:Record<string,unknown>;children?:{text?:string}[]}[]}}).root.children;
    for (let i=0;i<root.length;i++) {
      const n = root[i];
      if (n.type==="block" && n.fields) {
        console.log(`[${i}] BLOCK blockType=${n.fields.blockType} title=${n.fields.title||""}`);
      } else {
        const text = (n.children||[]).map((c)=>c.text||"").join("").trim();
        if (text) console.log(`[${i}] ${n.type}${n.tag?"/"+n.tag:""}: ${text.slice(0,120)}`);
      }
    }
  } catch(e:unknown) { console.log("PARSE ERROR", (e as Error).message); }
}
