import { createClient } from "next-sanity";
const s = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });

// Check what status-related fields exist on blogs
const sample = await s.fetch<Record<string, unknown>[]>('*[_type=="blog"][0..4]{_id,slug,status,published,isPublished,isDraft}');
console.log("Sample blog fields:");
for (const b of sample) console.log(JSON.stringify(b));

// Count by status value
const allStatuses = await s.fetch<{status: string; count: number}[]>(
  'array::unique(*[_type=="blog"].status)'
);
console.log("\nUnique status values:", JSON.stringify(allStatuses));
