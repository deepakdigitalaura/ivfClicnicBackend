import type { Metadata } from "next";
import "@/styles.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "BFI Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="admin-root">{children}</body>
    </html>
  );
}
