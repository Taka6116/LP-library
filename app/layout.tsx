import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// AssetSync (SaaS hero) uses Lato. Loaded as a CSS variable so only that
// section opts in via the `font-lato` utility; the rest stays on sofia-pro.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marketer's Studio — マーケ制作資産スタジオ",
  description:
    "LP・PPT・参考URL・コピー・プロンプトを保存し、案件ごとに探して転用・書き出せるマーケ制作の作業スペース。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={lato.variable}>
      <body className="min-h-screen bg-transparent text-ink dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
