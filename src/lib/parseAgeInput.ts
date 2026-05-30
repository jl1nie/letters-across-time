// 年齢入力を堅牢にパースする。
// 全角数字（０-９）を半角化し、数字以外を除去、桁数も制限する。
// 一部端末（モバイルの日本語キーボード等）で全角数字が入ると Number() が
// NaN になり、年齢が確定せず「つぎへ」が有効化されない不具合を防ぐ。
export function parseAgeInput(raw: string): number | null {
  const half = raw.replace(/[０-９]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0xfee0),
  );
  const digits = half.replace(/\D/g, "").slice(0, 3);
  return digits ? Number(digits) : null;
}
