/** @type {import('next').NextConfig} */

// GitHub Pages のプロジェクトページ（taka6116.github.io/LP-library/）で
// 配信するための静的書き出し設定。本番ビルド時のみ basePath を付与する。
const repo = "LP-library";
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
  // プレーンな <img src="/sansan/..."> をクライアント側で basePath 付きに
  // 解決するために公開する。
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
