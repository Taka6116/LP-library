/** @type {import('next').NextConfig} */

// このプロジェクトは2通りの配信先を想定している:
//   1. Vercel        … Next.js をネイティブ実行。ルート(/)配信なので basePath 不要。
//   2. GitHub Pages  … 静的書き出し + /LP-library サブパス配信。
//
// GitHub Pages 用ビルドのときだけ環境変数 GITHUB_PAGES=true を立てて
// 静的書き出し + basePath を有効化する。Vercel ではこの変数が無いので
// 通常の Next.js アプリとしてルート配信される。
const repo = "LP-library";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? `/${repo}` : "";

const nextConfig = isGithubPages
  ? {
      output: "export",
      basePath,
      assetPrefix: `/${repo}/`,
      images: { unoptimized: true },
      trailingSlash: true,
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
    }
  : {
      // Vercel など通常配信向け。basePath なし。
      env: { NEXT_PUBLIC_BASE_PATH: "" },
    };

export default nextConfig;
