import { NextResponse } from "next/server";
import { getSanityDoctors } from "@/sanity/lib/fetch";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await getSanityDoctors();
  return NextResponse.json({
    count: docs.length,
    slugs: docs.map((d) => d.slug),
    deep: docs.find((d) => d.slug === "deep-gajiwala"),
  });
}
