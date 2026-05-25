// 表示用に「ユーザーの3歳前後年上」を擬似的に出すための小さなヘルパー。
// id をハッシュして +2〜+5 のオフセットを決定。

const STORAGE_KEY = "lat-user-age";

export function setUserAge(age: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, String(age));
}

export function getUserAge(fallback = 33): number {
  if (typeof window === "undefined") return fallback;
  const v = Number(sessionStorage.getItem(STORAGE_KEY));
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export function ageOffset(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  // 2,3,4,5 のいずれか
  return 2 + (Math.abs(h) % 4);
}

export function displayedAge(id: string, userAge: number): number {
  return userAge + ageOffset(id);
}
