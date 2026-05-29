import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LP Builder Library",
  description: "Select sections. Generate reusable landing pages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-canvas text-ink">{children}</body>
    </html>
  );
}
