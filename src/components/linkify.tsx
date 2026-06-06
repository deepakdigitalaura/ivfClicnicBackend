import { Fragment } from "react";
import { SITE_DESTINATIONS, destinationHref } from "@/lib/internal-links";

/* <Linkify />
 * ---------------------------------------------------------------------
 * Renders a plain string but automatically turns any phrase registered in
 * SITE_DESTINATIONS (e.g. "Suraksha Kavach") into a real internal link.
 *
 * Because the href resolves through destinationHref(), the link follows the
 * registry: it points at the fallback anchor until the destination's page is
 * published, then at the page itself — without touching this component or the
 * source copy. This is how "future destination" CTAs/text stay seamless. */

type Phrase = { phrase: string; key: string };

// All matchable phrases (label + aliases), longest first so the regex prefers
// the most specific match (e.g. "Suraksha Kavach Package" before "Suraksha Kavach").
const PHRASES: Phrase[] = Object.values(SITE_DESTINATIONS)
  .flatMap((d) => [d.label, ...(d.aliases ?? [])].map((phrase) => ({ phrase, key: d.key })))
  .sort((a, b) => b.phrase.length - a.phrase.length);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const PATTERN = PHRASES.length
  ? new RegExp(`(${PHRASES.map((p) => escapeRegExp(p.phrase)).join("|")})`, "g")
  : null;

export function linkifyNodes(text: string): React.ReactNode[] {
  if (!PATTERN) return [text];
  const parts = text.split(PATTERN);
  return parts.map((part, i) => {
    const match = PHRASES.find((p) => p.phrase === part);
    if (match) {
      return (
        <a
          key={i}
          href={destinationHref(match.key)}
          className="font-medium text-[color:var(--rose)] underline decoration-[color:var(--rose)]/40 underline-offset-2 transition-colors hover:decoration-[color:var(--rose)]"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Linkify({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{linkifyNodes(text)}</span>;
}
