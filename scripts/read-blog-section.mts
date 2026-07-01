/* Dump text content from a blog's contentRaw for infographic data sourcing */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("env vars required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const slug = (process.argv.find(a => a.startsWith("--slug="))?.split("=")[1])
  ?? process.argv[process.argv.indexOf("--slug") + 1];
if (!slug) throw new Error("--slug required");

type Node = Record<string, unknown>;
function getText(n: Node): string {
  if (n.type === "text") return String(n.text ?? "");
  return ((n.children as Node[] | undefined) ?? []).map(getText).join("");
}

async function main() {
  const doc = await sanity.fetch<{ contentRaw: string }>(
    `*[_type=="blog"&&slug=="${slug}"][0]{contentRaw}`
  );
  const children = (JSON.parse(doc.contentRaw) as { root: { children: Node[] } }).root.children;
  for (let i = 0; i < children.length; i++) {
    const n = children[i];
    const bt = (n.fields as Record<string,unknown>)?.blockType as string | undefined;
    if (n.type === "heading") {
      console.log(`\n[${i}] H${(n as Record<string,unknown>).tag}: ${getText(n)}`);
    } else if (n.type === "paragraph") {
      const t = getText(n).trim();
      if (t) console.log(`[${i}] P: ${t.slice(0, 200)}`);
    } else if (n.type === "list") {
      const items = ((n.children as Node[]) ?? []).map(li => "  • " + getText(li).slice(0, 120));
      console.log(`[${i}] LIST:\n${items.join("\n")}`);
    } else if (bt) {
      console.log(`[${i}] BLOCK:${bt}${bt==="infographic"?" title="+((n.fields as Record<string,unknown>).title):""}${bt==="externalImage"?" [PHOTO]":""}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });
