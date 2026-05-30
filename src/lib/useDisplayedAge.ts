"use client";

import { useEffect, useState } from "react";
import { displayedAge, getUserAge } from "./displayAge";

// 先輩の「表示用の年齢」（ユーザーより数歳上に見せる擬似年齢）を返す。
// 一覧・詳細・対話・バトンで同じ値を使い、年齢表示がブレないようにする。
// sessionStorage 依存のため、SSR/初回は実年齢を返し、マウント後に確定する。
export function useDisplayedAge(id: string, realAge: number): number {
  const [age, setAge] = useState(realAge);
  useEffect(() => {
    setAge(displayedAge(id, getUserAge(realAge - 3)));
  }, [id, realAge]);
  return age;
}
