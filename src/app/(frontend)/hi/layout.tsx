import { LocaleProviders } from "@/components/locale-providers";

export default function HiLayout({ children }: { children: React.ReactNode }) {
  return <LocaleProviders locale="hi">{children}</LocaleProviders>;
}
