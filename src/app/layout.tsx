import type { Metadata } from "next";
import { Noto_Serif_JP, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// バトン受け取りの儀式演出で使う、丸みのあるやわらかなフォント。
const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ふ、と",
  description: "少し先を歩く誰かの経験と出会い、自分の選択を自分の手に取り戻す。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJp.variable} ${zenMaruGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
