import { createClient, type SanityClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

function makeClient(extra?: Record<string, unknown>): SanityClient | null {
  if (!projectId) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: true, ...extra });
}

export const client = makeClient() as SanityClient;
export const previewClient = makeClient({
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
}) as SanityClient;
