"use client";
import { Phone, Mail, MessageCircle, Clock, MapPin, Calendar, Navigation, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem, Magnetic } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { InquiryForm, Footer } from "@/components/home-page";
import { SectionHead, Eyebrow, Faq } from "@/components/ivf-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { Editable } from "@/components/editor/Editable";

/* `<Editable>` is inert on the public site (byte-identical) and click-to-edit
 * inside /edit/contact. `path` is the dot-path into the contact `pages` doc
 * SOURCE draft (hero.* + faqs.*). */
const ed = (path: string, value: string, rich = true) => (
  <Editable path={path} rich={rich}>{value}</Editable>
);

/* Icon-name -> component map. The CMS stores a name (string); the template
 * resolves it to a Lucide component. This is the serialisable-icon pattern
 * future collections (Treatments/Services) will reuse. */
const ICONS: Record<string, LucideIcon> = { Phone, MessageCircle, Mail, Clock, MapPin, Calendar };

type Card = { icon: string; t: string; v: string; href?: string | null; note?: string | null };

const DEFAULT_CARDS: Card[] = [
  { icon: "Phone", t: "Call Us", v: "+91 97126 22288", href: "tel:+919712622288", note: "24×7 patient helpline" },
  { icon: "MessageCircle", t: "WhatsApp", v: "Chat with our team", href: "https://wa.me/919712622288", note: "Quick replies, every day" },
  { icon: "Mail", t: "Email", v: "drbavishi@ivfclinic.com", href: "mailto:drbavishi@ivfclinic.com", note: "We reply within 24 hours" },
];

type Centre = { name: string; address: string; phone: string; phoneLabel: string; href?: string };

// Full Bavishi Fertility Institute centre directory — real addresses; unique per-centre phones.
const directory: Centre[] = [
  // Ahmedabad
  { name: "Ahmedabad — Paldi", address: "Opp. Manjulal Municipal Garden, next to Adani CNG & Orion Complex, Paldi Cross Roads, Paldi – 380007", phone: "919712622288", phoneLabel: "+91 97126 22288", href: "/locations/ahmedabad/paldi" },
  { name: "Ahmedabad — Sindhu Bhavan Road", address: "SF-213, Stellar, Sindhu Bhavan Marg, near Pakvan Cross Roads, Bodakdev – 380059", phone: "919712622288", phoneLabel: "+91 97126 22288", href: "/locations/ahmedabad/sindhu-bhavan-road" },
  { name: "Ahmedabad — Nikol", address: "Hill Town Plaza, 501, near Amar Jawan Circle, Nikol – 380049", phone: "919227114040", phoneLabel: "+91 92271 14040", href: "/locations/ahmedabad/nikol" },
  // Mumbai
  { name: "Mumbai — Ghatkopar", address: "2nd Floor, Vallabh Vihar CHS, opp. Kotak Mahindra Bank, M.G. Road, Ghatkopar East – 400077", phone: "919328190146", phoneLabel: "+91 93281 90146", href: "/locations/mumbai/ghatkopar" },
  { name: "Mumbai — Thane", address: "Bapat Urology Center, A.K. Vaidya Marg, near Paramarth Niketan, Panch Pakhdi, Thane West – 400602", phone: "919167204018", phoneLabel: "+91 91672 04018", href: "/locations/mumbai/thane" },
  { name: "Mumbai — Vile Parle", address: "Irla Nursing Home & Polyclinic, 1st Floor, S.V. Road, Navpada, Irla, Vile Parle West – 400056", phone: "919167204019", phoneLabel: "+91 91672 04019", href: "/locations/mumbai/vile-parle" },
  { name: "Mumbai — Borivali", address: "M.M. Medical Center, Ankur, nr. Marry Imm School, L.M. Road, Shivajinagar, Borivali West", phone: "919167204019", phoneLabel: "+91 91672 04019", href: "/locations/mumbai/borivali" },
  { name: "Mumbai — Vashi", address: "Precision Superspeciality Clinic, 52/53, 3rd Floor, Mahavir Centre, Sector 17, Vashi – 400703", phone: "919687004268", phoneLabel: "+91 96870 04268", href: "/locations/mumbai/vashi" },
  // Other cities
  { name: "Vadodara", address: "4th Floor, Trisha Square-2, Sampatrao Colony, Jetalpur Road, Alkapuri – 390007", phone: "917575099898", phoneLabel: "+91 75750 99898", href: "/locations/vadodara/jetalpur-road" },
  { name: "Surat", address: "9th Floor, Param Doctor House, Lal Darwaja, Station Road, Surat", phone: "919879572247", phoneLabel: "+91 98795 72247", href: "/locations/surat/lal-darwaja" },
  { name: "Bhuj", address: "Spandan Maternity Home, 13-28 Shivam Nagar, near Uma Nagar, Mirzapar Highway, Bhuj – 370040", phone: "919687188550", phoneLabel: "+91 96871 88550", href: "/locations/bhuj/mirjapar" },
  { name: "Bhavnagar", address: "Hema Women's Hospital, 203-205 Sai Ganga, Kalubha Road, Bhavnagar – 364001", phone: "917069314040", phoneLabel: "+91 70693 14040", href: "/locations/bhavnagar/kalubha-road" },
  { name: "Anand", address: "Unit 2, IRIS Hospital, Nanikhodiyar, Anand – 388001", phone: "917069034565", phoneLabel: "+91 70690 34565", href: "/locations/anand/nanikhodiyar" },
  { name: "Varanasi", address: "S15/47, Panchkosi Road, behind Thana, Shivpur, Varanasi – 221003", phone: "919506081979", phoneLabel: "+91 95060 81979", href: "/locations/varanasi/shivpur" },
];

type Faq = { q: string; a: string };
type Hero = { eyebrow?: string | null; lead?: string | null; em?: string | null; subtitle?: string | null };

/* Defaults mirror the original hardcoded copy, so the component still renders
 * correctly if used without props (e.g. before CMS data is available). */
export const DEFAULT_HERO: Hero = {
  eyebrow: "We're here for you",
  lead: "Contact",
  em: "Bavishi Fertility Institute",
  subtitle:
    "Have a question or ready to begin? Reach out — confidentially and without obligation. Our fertility counsellors are here to guide your very first step.",
};

export const DEFAULT_FAQS: Faq[] = [
  { q: "How do I book an appointment at Bavishi Fertility Institute?", a: "Fill in the enquiry form on this page, call us on +91 97126 22288, or message us on WhatsApp. Our team will help you choose the nearest centre and a convenient time." },
  { q: "Can I have an online (video) consultation?", a: "Yes. We offer video consultations for patients across India and abroad, so you can begin your fertility journey from the comfort of home before visiting a centre." },
  { q: "Which Bavishi Fertility Institute centre is nearest to me?", a: "We have 14 centres across 8 cities — Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi. Tell us your city and we'll connect you to the closest one." },
  { q: "Is the first consultation free?", a: "We offer a free initial consultation so you can understand your options with no obligation. Diagnostic tests and treatments are quoted transparently, with EMI options available." },
  { q: "Do you treat international patients?", a: "Yes — 300+ international patients choose Bavishi Fertility Institute every year. We provide end-to-end support including pre-arrival video consultations and treatment planning." },
];

export type ContactSectionLabels = { networkEyebrow?: string | null; networkSubtitle?: string | null; faqEyebrow?: string | null };

export function ContactPage({ hero, faqs, cards, sectionLabels, directory: propDirectory }: { hero?: Hero; faqs?: Faq[]; cards?: Card[]; sectionLabels?: ContactSectionLabels; directory?: Centre[] } = {}) {
  const h = { ...DEFAULT_HERO, ...(hero ?? {}) };
  const faqList = faqs?.length ? faqs : DEFAULT_FAQS;
  const cardList = cards?.length ? cards : DEFAULT_CARDS;
  const sl = sectionLabels ?? {};
  const centreList = propDirectory?.length ? propDirectory : directory;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-[color:var(--ivory)]">
        <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
          <span>/</span>
          <span className="font-medium text-[color:var(--plum)]">Contact Us</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="gradient-warm noise relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-20 h-[30rem] w-[30rem] rounded-full bg-[color:var(--rose)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-[color:var(--plum)]/15 blur-3xl" />
        </div>
        <div className="container-px mx-auto max-w-[1400px] py-16 text-center md:py-20">
          <Reveal><div className="flex justify-center"><Eyebrow>{ed("hero.eyebrow", h.eyebrow ?? "")}</Eyebrow></div></Reveal>
          <Reveal delay={0.05}>
            <h1 className="mx-auto mt-5 text-4xl font-medium leading-[1.05] text-[color:var(--plum)] md:text-5xl lg:text-[3.25rem] lg:whitespace-nowrap xl:text-[3.5rem]">
              {ed("hero.lead", h.lead ?? "")} <em className="font-display italic text-[color:var(--rose)]">{ed("hero.em", h.em ?? "")}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {ed("hero.subtitle", h.subtitle ?? "")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="container-px mx-auto max-w-[1400px] py-10 md:py-16">
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {cardList.map((c) => {
            const Icon = ICONS[c.icon] ?? Phone;
            const inner = (
              <div className="flex h-full flex-col items-start rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]"><Icon className="h-5 w-5" /></div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--rose)]">{c.t}</div>
                <div className="mt-1 text-base font-semibold text-[color:var(--plum)]">{c.v}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.note}</div>
              </div>
            );
            return (
              <StaggerItem key={c.t}>
                {c.href ? <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined} className="block h-full">{inner}</a> : inner}
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Contact form (reused InquiryForm) */}
      <InquiryForm />

      {/* Locations directory */}
      <section className="container-px mx-auto max-w-[1400px] py-8 md:py-14">
        <SectionHead center eyebrow={ed("sectionLabels.networkEyebrow", sl.networkEyebrow || "Our Network")} title={<>Find a Bavishi Fertility Institute <em className="font-display italic text-[color:var(--rose)]">near you</em></>} subtitle={ed("sectionLabels.networkSubtitle", sl.networkSubtitle || "14 fertility centres across 8 Indian cities — world-class care, close to home.")} />

        <Stagger className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {centreList.map((c) => (
            <StaggerItem key={c.name} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--rose)]/40 hover:shadow-lift">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--rose)]/10 text-[color:var(--rose)]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <h3 className="text-[15px] font-semibold leading-snug text-[color:var(--plum)]">{c.name}</h3>
                </div>

                <p className="mt-4 flex-1 text-[13px] leading-relaxed text-muted-foreground">{c.address}</p>

                <a href={`tel:+${c.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--plum)] transition-colors hover:text-[color:var(--rose)]">
                  <Phone className="h-4 w-4 text-[color:var(--rose)]" /> {c.phoneLabel}
                </a>

                <div className="mt-auto flex flex-nowrap items-center gap-1.5 border-t border-border/60 pt-4">
                  <a href={`tel:+${c.phone}`} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[color:var(--rose)] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110">
                    <Phone className="h-3 w-3" /> Call
                  </a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Bavishi Fertility Institute " + c.name.replace(" — ", " "))}`} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[color:var(--plum)]/15 px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--plum)] transition hover:bg-[color:var(--plum)]/5">
                    <Navigation className="h-3 w-3" /> Directions
                  </a>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Section CTA */}
        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/70 bg-[color:var(--rose-soft)]/30 px-8 py-8 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--plum)]">Need help choosing the right centre?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Our counsellors will guide you to the Bavishi Fertility Institute centre nearest you.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="tel:+919712622288" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110">
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a href="/#book" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--plum)]/15 bg-white px-6 py-3 text-sm font-semibold text-[color:var(--plum)] transition hover:border-[color:var(--rose)]/40">
                <Calendar className="h-4 w-4" /> Book Consultation
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-[color:var(--rose-soft)]/40 py-8 md:py-14">
        <div className="container-px mx-auto max-w-3xl">
          <SectionHead center eyebrow={ed("sectionLabels.faqEyebrow", sl.faqEyebrow || "FAQ")} title={<>Getting in touch — <em className="font-display italic text-[color:var(--rose)]">answered</em></>} />
          <div className="mt-9 space-y-3">
            {faqList.map((f, i) => <Faq key={i} q={ed(`faqs.${i}.question`, f.q, false)} a={ed(`faqs.${i}.answer`, f.a, false)} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-[1400px] pb-8 md:pb-14">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-dark px-8 py-16 text-center text-white noise md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-[1.1] md:text-4xl lg:text-5xl text-balance">
              Your journey to parenthood starts with <em className="font-display italic text-[color:var(--rose-soft)]">one message.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic as="a" href="/#book" className="btn-luxury inline-flex items-center gap-2 rounded-full bg-[color:var(--rose)] px-6 py-3.5 text-sm font-semibold text-white shadow-glow"><Calendar className="h-4 w-4" /> Book Free Consultation</Magnetic>
              <Magnetic as="a" href="tel:+919712622288" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><Phone className="h-4 w-4" /> +91 97126 22288</Magnetic>
              <Magnetic as="a" href="https://wa.me/919712622288" target="_blank" rel="noopener noreferrer" className="btn-luxury inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp Us</Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      <MobileBottomBar />
    </div>
  );
}
