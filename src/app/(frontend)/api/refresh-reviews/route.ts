import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { refreshAllReviews } from "@/sanity/lib/admin";

const SECRET = "bfi-revalidate-9x7k2";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await refreshAllReviews();

  revalidatePath("/locations/[city]", "page");
  revalidatePath("/locations/[city]/[center]", "page");
  revalidatePath("/");
  revalidatePath("/admin-panel/reviews");

  return NextResponse.json({ ok: true, results });
}
