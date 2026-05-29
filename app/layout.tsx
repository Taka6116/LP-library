import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

// AssetSync (SaaS hero) uses Lato. Loaded as a CSS variable so only that
// section opts in via the `font-lato` utility; the rest stays on sofia-pro.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

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
    <html lang="ja" className={lato.variable}>
      <body className="min-h-screen bg-canvas text-ink">{children}</body>
    </html>
  );
}
