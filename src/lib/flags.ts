// バトン受け取りの「演出」を切り替えるためのフラグ。
//
// - classic  : これまでの静かな手紙ベースの受け取り画面
// - ceremony : 「人生のバトンを丁寧に受け取る」儀式のような受け取り体験
//              （スマホ前提・手で受け取る感覚・紙のかさかさ音・丸みのある色とフォント）
//
// 既定値はビルド時の環境変数 NEXT_PUBLIC_BATON_EXPERIENCE で上書きでき、
// さらに URL の ?experience=classic|ceremony で実行時に切り替えられる。

export type BatonExperience = "classic" | "ceremony";

const ENV_VALUE = process.env.NEXT_PUBLIC_BATON_EXPERIENCE;

export const DEFAULT_BATON_EXPERIENCE: BatonExperience =
  ENV_VALUE === "classic" || ENV_VALUE === "ceremony" ? ENV_VALUE : "ceremony";

export function resolveBatonExperience(
  override?: string | null,
): BatonExperience {
  if (override === "classic" || override === "ceremony") return override;
  return DEFAULT_BATON_EXPERIENCE;
}
