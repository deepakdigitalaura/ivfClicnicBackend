import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET = "bfi-revalidate-9x7k2";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  if (!tags.length) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 });
  }
  tags.forEach((tag) => revalidateTag(tag));
  return NextResponse.json({ revalidated: tags });
}
