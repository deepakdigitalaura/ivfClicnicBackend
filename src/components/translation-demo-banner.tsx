import Link from "next/link";

const LABELS = {
  en: { note: "Preview — this language demo is not live yet.", switch: "View in:" },
  hi: { note: "प्रीव्यू — यह भाषा डेमो अभी लाइव नहीं है।", switch: "भाषा चुनें:" },
  gu: { note: "પ્રીવ્યૂ — આ ભાષા ડેમો હજુ લાઇવ નથી.", switch: "ભાષા પસંદ કરો:" },
} as const;

export function TranslationDemoBanner({
  locale,
  path,
}: {
  locale: "en" | "hi" | "gu";
  path: string;
}) {
  const t = LABELS[locale];
  const links = [
    { code: "en" as const, label: "English", href: path },
    { code: "hi" as const, label: "हिंदी", href: `/hi-preview${path}` },
    { code: "gu" as const, label: "ગુજરાતી", href: `/gu-preview${path}` },
  ];
  return (
    <div className="w-full bg-amber-100 border-b border-amber-300 text-amber-900 text-sm px-4 py-2 flex flex-wrap items-center justify-center gap-3 text-center">
      <span>{t.note}</span>
      <span className="flex items-center gap-2">
        {t.switch}
        {links.map((l) => (
          <Link
            key={l.code}
            href={l.code === "en" ? l.href : l.href}
            className={`underline underline-offset-2 ${l.code === locale ? "font-bold" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </span>
    </div>
  );
}
