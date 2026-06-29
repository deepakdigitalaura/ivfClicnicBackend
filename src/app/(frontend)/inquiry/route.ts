import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
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

function buildEmailHtml(fields: {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  location: string;
  message: string;
  source: string;
}) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:8px 12px;font-weight:600;white-space:nowrap;color:#555;border-bottom:1px solid #f0f0f0">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${value}</td></tr>`
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr><td style="background:#1a6b3f;padding:24px 32px">
          <h1 style="margin:0;color:#fff;font-size:20px">New Inquiry — BFI IVF Clinic</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,.8);font-size:14px">Submitted via website contact form</p>
        </td></tr>
        <tr><td style="padding:24px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#333">
            ${row("Name", fields.name)}
            ${row("Phone", fields.phone)}
            ${row("Email", fields.email)}
            ${row("Treatment", fields.treatment)}
            ${row("Preferred Centre", fields.location)}
            ${row("Message", fields.message.replace(/\n/g, "<br/>"))}
            ${row("Source page", fields.source)}
          </table>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:16px 32px;font-size:13px;color:#888;border-top:1px solid #eee">
          View all inquiries in the <a href="https://ivf-clicnic-backend-weld.vercel.app/admin/collections/inquiries" style="color:#1a6b3f">admin panel</a>.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendNotificationEmail(fields: {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  location: string;
  message: string;
  source: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[inquiry] RESEND_API_KEY is not set — email skipped");
    return;
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: "BFI IVF Clinic <onboarding@resend.dev>",
    to: "deepak.digitalaura@gmail.com",
    subject: `New Inquiry from ${fields.name} — BFI IVF Clinic`,
    html: buildEmailHtml(fields),
  });

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
  console.log("[inquiry] email sent, id:", result.data?.id);
}

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

    // Send email notification — awaited so the runtime doesn't kill it before it completes.
    // A failed send is logged but never surfaces to the user.
    try {
      await sendNotificationEmail({ name, phone, email, treatment, location, message, source });
    } catch (err) {
      console.error("[inquiry] email notification failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please call us on +91 97126 22288." },
      { status: 500 },
    );
  }
}
