#!/usr/bin/env node
// One-off: set status="draft" on a single Sanity blog doc by _id.
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const docId = process.argv[2];

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env vars");
  process.exit(1);
}
if (!docId) {
  console.error("Usage: node hide-one-blog.mjs <sanity-doc-id>");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const before = await client.getDocument(docId);
if (!before) {
  console.error(`Doc ${docId} not found`);
  process.exit(1);
}
console.log(`Before: ${before._id} "${before.title}" status=${before.status}`);

const after = await client.patch(docId).set({ status: "draft" }).commit();
console.log(`After:  ${after._id} "${after.title}" status=${after.status}`);
