import type { NextConfig } from "next";

// GitHub Pages 用に静的書き出し（next export）。
// リポジトリ名は environment 変数 NEXT_PUBLIC_BASE_PATH で上書き可能。
// 例: project pages (https://<user>.github.io/letters-across-time/) なら
//     NEXT_PUBLIC_BASE_PATH=/letters-across-time
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true, // GitHub Pages が /letters/k01/index.html を解決できるように
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
