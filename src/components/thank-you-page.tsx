import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  Calculator,
  BookOpen,
  Stethoscope,
  MapPin,
} from "lucide-react";
import type { ContactValues } from "@/lib/contact";

/* =====================================================================
 * Post-enquiry confirmation page ( /thank-you ).
 * ---------------------------------------------------------------------
 * Where the inquiry form sends the visitor after a successful submit.
 * A distinct URL (rather than the old in-place success state) is what
 * makes the enquiry countable as a conversion in GA4 / Google Ads, and
 * it gives the visitor somewhere useful to go next instead of a dead end.
 *
 * Deliberately noindex — a thank-you page ranking in search would both
 * look odd in results and pollute the conversion count with visitors who
 * never filled the form. See generateMetadata in the route.
 * ===================================================================== */

const NEXT_STEPS = [
  {
    icon: Phone,
    title: "We call you back",
    body: "A fertility counsellor reviews your enquiry and calls you, usually within one working day.",
  },
  {
    icon: Stethoscope,
    title: "We understand your history",
    body: "A short conversation about your journey so far, any reports you have, and what you're hoping for.",
  },
  {
    icon: Clock,
    title: "You get a clear next step",
    body: "Either a consultation slot at the centre that suits you, or guidance on the tests worth doing first.",
  },
];

export function ThankYouPage({ contact }: { contact: ContactValues }) {
  const links = [
    {
      icon: Calculator,
      title: "Fertility calculators",
      body: "Estimate IVF success, cost, your fertile window and more.",
      href: "/calculators",
    },
    {
      icon: BookOpen,
      title: "Fertility guides",
      body: "Plain-English articles reviewed by our specialists.",
      href: "/blogs",
    },
    {
      icon: Stethoscope,
      title: "Treatments we offer",
      body: "IVF, ICSI, IUI, donor programmes and fertility preservation.",
      href: "/treatments",
    },
    {
      icon: MapPin,
      title: "Find your nearest centre",
      body: "Our centres across Ahmedabad, Mumbai, Gujarat and Varanasi.",
      href: "/locations",
    },
  ];

  return (
    <main className="bg-[color:var(--rose-soft)]/30">
      {/* Confirmation */}
      <section className="container-px mx-auto max-w-[1400px] py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-[color:var(--plum)] md:text-4xl">
            Thank you — we&apos;ve received your enquiry
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            One of our fertility counsellors will be in touch shortly. If you&apos;d rather not
            wait, you&apos;re welcome to call or message us directly — we&apos;re happy to answer
            questions before you commit to anything.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${contact.telephone}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--rose)]/90 sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Call {contact.telephoneDisplay}
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:border-[color:var(--rose)] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="container-px mx-auto max-w-[1400px] pb-16 md:pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/60 bg-white p-8 shadow-soft md:p-10">
          <h2 className="text-center text-xl font-semibold text-[color:var(--plum)]">
            What happens next
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="text-center md:text-left">
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--plum)]/5 text-[color:var(--plum)]">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[color:var(--plum)]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Somewhere useful to go next */}
      <section className="container-px mx-auto max-w-[1400px] pb-20 md:pb-28">
        <h2 className="text-center text-xl font-semibold text-[color:var(--plum)]">
          While you wait
        </h2>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-white p-5 transition-colors hover:border-[color:var(--rose)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                <l.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[color:var(--plum)] group-hover:text-[color:var(--rose)]">
                  {l.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {l.body}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
