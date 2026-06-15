import { NextResponse, type NextRequest } from "next/server";
import { payloadClient } from "@/lib/payload";

/* =====================================================================
 * Public lead intake  ( POST /inquiry ).
 * ---------------------------------------------------------------------
 * The homepage / contact `<InquiryForm>` posts here. We validate, then write
 * the lead through the Payload LOCAL API with `overrideAccess` so the public
 * never touches the REST create directly (the `inquiries` collection keeps
 * create staff-only). Mounted at /inquiry — NOT under /api/* — to avoid
 * colliding with Payload's /api catch-all (same reason as /preview).
 *
 * Spam: a hidden honeypot field (`company`) — real users leave it empty; bots
 * fill every field. A filled honeypot returns a success-looking response
 * without writing anything, so bots don't learn they were caught.
 * ===================================================================== */

const phoneOk = (v: string) => /^[+\d][\d\s-]{7,}$/.test(v);
const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

/** Trim + cap an incoming string field (defends against oversized payloads). */
const clean = (v: unknown, max = 2000): string =>
  (typeof v === "string" ? v : "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped → pretend it worked, write nothing.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 200);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 200);
  const treatment = clean(body.treatment, 200);
  const location = clean(body.location, 200);
  const message = clean(body.message);
  const source = clean(body.source, 200);

  if (!name)
    return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  if (!phoneOk(phone))
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 422 });
  if (email && !emailOk(email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });

  try {
    const payload = await payloadClient();
    await payload.create({
      collection: "inquiries",
      data: {
        name,
        phone,
        email: email || undefined,
        treatment: treatment || undefined,
        location: location || undefined,
        message: message || undefined,
        source: source || undefined,
        status: "new",
      },
      overrideAccess: true,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please call us on +91 97126 22288." },
      { status: 500 },
    );
  }
}
