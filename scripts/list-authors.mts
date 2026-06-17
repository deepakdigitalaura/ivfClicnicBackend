import { getPayload } from "payload";
import config from "@payload-config";

async function main() {
  const p = await getPayload({ config });
  const r = await p.find({ collection: "authors", limit: 20 });
  console.log(JSON.stringify(r.docs.map((d: any) => ({ id: d.id, name: d.name, bio: (d.bio ?? "").substring(0, 60) })), null, 2));
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
