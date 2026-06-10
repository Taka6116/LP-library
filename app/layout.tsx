import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrandProvider } from "@/components/BrandProvider";
import { ToastProvider } from "@/components/ui";
import { CommandPalette } from "@/components/CommandPalette";

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

// ダーク設定を描画前に適用（ライト→ダークのフラッシュ防止）
const darkInit =
  'try{var s=localStorage.getItem("lp-dark-mode");var d=s!==null?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={lato.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkInit }} />
      </head>
      <body className="min-h-screen bg-transparent text-ink dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <BrandProvider>
            <ToastProvider>
              {children}
              <CommandPalette />
            </ToastProvider>
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
