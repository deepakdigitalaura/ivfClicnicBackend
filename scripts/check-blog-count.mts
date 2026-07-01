import { createClient } from "next-sanity";
const s = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });
const count = await s.fetch<number>('count(*[_type=="blog"])');
const withRaw = await s.fetch<number>('count(*[_type=="blog" && defined(contentRaw)])');
const sample = await s.fetch<{_id:string;slug:string;title:string}>('*[_type=="blog"][0]{_id,slug,title}');
console.log("total blogs:", count);
console.log("with contentRaw:", withRaw);
console.log("sample:", JSON.stringify(sample));
