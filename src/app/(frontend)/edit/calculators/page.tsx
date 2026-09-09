import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Edit Calculators", robots: { index: false, follow: false } };

export default function EditCalculatorsHubPage() {
  redirect("/admin-panel");
}
