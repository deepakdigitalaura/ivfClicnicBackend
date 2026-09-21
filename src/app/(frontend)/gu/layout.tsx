import { LocaleProviders } from "@/components/locale-providers";

export default function GuLayout({ children }: { children: React.ReactNode }) {
  return <LocaleProviders locale="gu">{children}</LocaleProviders>;
}
