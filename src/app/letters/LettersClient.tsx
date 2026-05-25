"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { senpai, type Letter } from "@/data/senpai";
import { rankBySimilarity, type UserProfile } from "@/lib/similarity";
import { ConnectionGraph } from "@/components/ConnectionGraph";
import { LetterCard } from "@/components/LetterCard";
import { displayedAge, setUserAge } from "@/lib/displayAge";

const validOcc: UserProfile["occupationCategory"][] = [
  "デザイン",
  "エンジニア",
  "企画・マーケ",
  "営業",
  "経営・起業",
  "研究・教育",
  "クリエイティブ",
  "医療・福祉",
  "その他",
];

const validEvent: Letter["decision"]["event"][] = [
  "転職",
  "結婚",
  "出産",
  "独立",
  "進学",
  "留学",
  "その他",
];

export function LettersClient() {
  const sp = useSearchParams();
  const age = Number(sp.get("age") ?? 33) || 33;
  const occRaw = sp.get("occ");
  const evRaw = sp.get("event");
  const theme = sp.get("theme") ?? "";
  const genderRaw = sp.get("gender");
  const gender: "f" | "m" | undefined =
    genderRaw === "f" || genderRaw === "m" ? genderRaw : undefined;

  if (typeof window !== "undefined") {
    console.debug("[letters] params", { age, occRaw, evRaw, theme, gender });
  }

  const occ: UserProfile["occupationCategory"] =
    occRaw && (validOcc as string[]).includes(occRaw)
      ? (occRaw as UserProfile["occupationCategory"])
      : "その他";
  const ev: Letter["decision"]["event"] =
    evRaw && (validEvent as string[]).includes(evRaw)
      ? (evRaw as Letter["decision"]["event"])
      : "その他";

  const user: UserProfile = {
    age,
    occupationCategory: occ,
    decisionTheme: ev,
    decisionText: theme,
    gender,
  };

  const ranked = rankBySimilarity(user, senpai).map(({ letter, score }) => ({
    letter: {
      ...letter,
      profile: { ...letter.profile, age: displayedAge(letter.id, age) },
    },
    score,
  }));

  useEffect(() => {
    setUserAge(age);
  }, [age]);

  return (
    <main className="flex flex-1 flex-col px-6 py-20">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="max-w-3xl mx-auto w-full text-center mb-10"
      >
        <p className="text-xs tracking-[0.4em] text-[color:var(--muted)] mb-8">
          YOUR LETTERS
        </p>
        <h1 className="text-xl sm:text-2xl font-light leading-[2] tracking-[0.08em]">
          {age}歳・{occ}のあなたへ、
          <br />
          似た夜を過ごした先輩から。
        </h1>
        {theme && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            className="mt-10 text-sm text-[color:var(--muted)] italic"
          >
            「{theme}」
          </motion.p>
        )}
      </motion.section>

      <section className="max-w-3xl mx-auto w-full">
        <ConnectionGraph
          ranked={ranked}
          userLabel={`${age}・${occ}`}
        />
      </section>

      <section className="max-w-2xl mx-auto w-full mt-24">
        <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-2 text-center">
          一通ずつ、ゆっくり開いてみてください。
        </p>
        <div className="mt-12">
          {ranked.map((r, i) => (
            <LetterCard key={r.letter.id} letter={r.letter} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
