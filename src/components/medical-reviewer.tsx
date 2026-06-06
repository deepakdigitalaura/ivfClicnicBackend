import { ShieldCheck, BadgeCheck, MapPin } from "lucide-react";
import type { Doctor } from "@/lib/doctors";
import { doctorUrl } from "@/lib/doctors";

/* <MedicalReviewer />
 * ---------------------------------------------------------------------
 * Visible medical-review attribution for YMYL pages. Google's medical
 * content guidelines expect a named, credentialed reviewer and a review
 * date; this renders both and links to the reviewer's profile (entity),
 * mirroring the reviewedBy: Physician node in the page schema.
 *
 * Scales: every treatment page passes its reviewer Doctor + lastReviewed
 * date — no page hand-writes a disclaimer. */
// Deterministic formatting (no toLocaleDateString — its output differs between
// the Node server and the browser, which causes React hydration error #418).
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function formatDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mm, dd] = m;
  return `${Number(dd)} ${MONTHS[Number(mm) - 1]} ${y}`;
}

export function MedicalReviewer({
  reviewer,
  reviewedOn,
  className = "",
}: {
  reviewer: Doctor;
  reviewedOn: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center ${className}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={reviewer.image}
          alt={reviewer.name}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover object-top ring-2 ring-[color:var(--rose)]/20"
        />
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--rose)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Medically Reviewed
          </div>
          <a
            href={doctorUrl(reviewer.slug)}
            className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-[color:var(--plum)] hover:text-[color:var(--rose)]"
          >
            {reviewer.name}, {reviewer.credentials}
            <BadgeCheck className="h-4 w-4 text-[color:var(--rose)]" />
          </a>
          <p className="text-[13px] text-muted-foreground">{reviewer.role} · {reviewer.specialty}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-[color:var(--rose)]">
            <MapPin className="h-3 w-3" /> {reviewer.cities[0] ?? "India"} | Bavishi Fertility Institute
          </p>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground sm:ml-auto sm:max-w-xs sm:text-right">
        Last medically reviewed on{" "}
        <time dateTime={reviewedOn} className="font-medium text-[color:var(--plum)]">
          {formatDate(reviewedOn)}
        </time>
        . This page is educational and is not a substitute for personalised medical advice.
      </p>
    </div>
  );
}
