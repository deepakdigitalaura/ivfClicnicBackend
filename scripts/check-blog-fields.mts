import { createClient } from "next-sanity";
const s = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });

// Check contentRaw length distribution
const docs = await s.fetch<{_id:string;slug:string;contentRaw:string}[]>(
  '*[_type=="blog"]{_id,slug,contentRaw}[0...20]'
);
for (const d of docs) {
  const len = (d.contentRaw ?? "").length;
  console.log(`${d._id} | len=${len} | slug=${d.slug.slice(0,50)}`);
}
const withContent = await s.fetch<number>('count(*[_type=="blog" && string::length(contentRaw) > 10])');
console.log(`\nBlogs with contentRaw > 10 chars: ${withContent}`);
