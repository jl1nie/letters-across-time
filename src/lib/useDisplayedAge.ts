"use client";

import { useEffect, useState } from "react";
import { displayedAge, getUserAge } from "./displayAge";

// 先輩の「表示用の年齢」（ユーザーより数歳上に見せる擬似年齢）を返す。
// 一覧・詳細・対話・バトンで同じ値を使い、年齢表示がブレないようにする。
// sessionStorage 依存のため、SSR/初回は実年齢を返し、マウント後に確定する。
export function useDisplayedAge(id: string, realAge: number): number {
  // マウント後にのみ sessionStorage 由来の表示年齢を使う（SSR/初回は実年齢）。
  // 同期計算なので id / realAge が変わっても古い値が残らず、ちらつきも最小。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || !id) return realAge;
  return displayedAge(id, getUserAge(realAge - 3));
}
