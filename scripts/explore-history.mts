import { createClient } from "next-sanity";
const client = createClient({
  projectId: "seh0zjkb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

const res = await client.request({ url: `/data/history/production/documents/blog-pg-213?time=2026-07-03T06:16:00Z` });
const str = JSON.stringify(res, null, 2);
console.log("TOP KEYS:", Object.keys(res as object));
console.log(str.slice(0, 4000));
