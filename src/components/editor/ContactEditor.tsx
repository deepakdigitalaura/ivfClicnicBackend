"use client";

/* Wires the inline editor for the Contact page (/edit/contact): holds the
 * editable draft of the contact `pages` doc, resolves its hero + FAQs into the
 * props <ContactPage> renders, and shows the floating toolbar. Save PATCHes the
 * draft back to Payload. The cards + centre directory are code/global-owned and
 * stay non-editable here (they live in other globals). */

import "./editor.css";
import { EditProvider } from "./edit-context";
import { EditorToolbar } from "./EditorToolbar";
import { FloatingToolbar } from "./FloatingToolbar";
import { ContactPage, DEFAULT_HERO, DEFAULT_FAQS } from "@/components/contact-page";

type FaqSource = { question?: string | null; answer?: string | null };
type LabelsSource = { networkEyebrow?: string | null; networkSubtitle?: string | null; faqEyebrow?: string | null } | null;
type ContactSrc = {
  hero?: { eyebrow?: string | null; lead?: string | null; em?: string | null; subtitle?: string | null } | null;
  faqs?: FaqSource[] | null;
  sectionLabels?: LabelsSource;
  [k: string]: unknown;
};

/** Seed a fully-populated draft (hero + FAQs present) so single-field edits
 *  never PATCH a sparse body that fails Payload required-field validation. */
function materialize(src: ContactSrc): ContactSrc {
  const hero = {
    eyebrow: src.hero?.eyebrow ?? DEFAULT_HERO.eyebrow,
    lead: src.hero?.lead ?? DEFAULT_HERO.lead,
    em: src.hero?.em ?? DEFAULT_HERO.em,
    subtitle: src.hero?.subtitle ?? DEFAULT_HERO.subtitle,
  };
  const faqs: FaqSource[] = src.faqs?.length
    ? src.faqs.map((f) => ({ question: f.question ?? "", answer: f.answer ?? "" }))
    : DEFAULT_FAQS.map((f) => ({ question: f.q, answer: f.a }));
  const sectionLabels = {
    networkEyebrow: src.sectionLabels?.networkEyebrow ?? "",
    networkSubtitle: src.sectionLabels?.networkSubtitle ?? "",
    faqEyebrow: src.sectionLabels?.faqEyebrow ?? "",
  };
  return { ...src, hero, faqs, sectionLabels };
}

export function ContactEditor({
  initialSource,
  apiPath,
}: {
  initialSource: ContactSrc;
  apiPath: string;
}) {
  const seeded = materialize(initialSource);

  return (
    <EditProvider<ContactSrc> apiPath={apiPath} method="PATCH" initial={seeded}>
      {(draft) => {
        const hero = {
          eyebrow: draft.hero?.eyebrow ?? "",
          lead: draft.hero?.lead ?? "",
          em: draft.hero?.em ?? "",
          subtitle: draft.hero?.subtitle ?? "",
        };
        const faqs = (draft.faqs ?? []).map((f) => ({ q: f.question ?? "", a: f.answer ?? "" }));
        return (
          <div className="bfi-editing notranslate" translate="no">
            <EditorToolbar pageLabel="Contact Us" />
            <FloatingToolbar />
            <div className="bfi-edit-canvas">
              <ContactPage hero={hero} faqs={faqs} sectionLabels={draft.sectionLabels ?? undefined} />
            </div>
          </div>
        );
      }}
    </EditProvider>
  );
}

export default ContactEditor;
