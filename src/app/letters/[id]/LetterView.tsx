"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope } from "@/components/Envelope";
import { Typewriter } from "@/components/Typewriter";
import type { Letter } from "@/data/senpai";
import { displayedAge, getUserAge } from "@/lib/displayAge";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

export function LetterView({
  letter,
  nextId,
}: {
  letter: Letter;
  nextId: string;
}) {
  const [opened, setOpened] = useState(false);
  const [revealLetter, setRevealLetter] = useState(false);
  const [bodyDone, setBodyDone] = useState(false);
  const [shownAge, setShownAge] = useState<number>(letter.profile.age);

  useEffect(() => {
    setShownAge(displayedAge(letter.id, getUserAge(letter.profile.age - 3)));
  }, [letter.id, letter.profile.age]);

  useEffect(() => {
    if (!opened) return;
    // 封筒の開封 + 便箋スライドアップの演出（約 1.8s）を見せてから便箋画面へ
    const t = setTimeout(() => setRevealLetter(true), 1800);
    return () => clearTimeout(t);
  }, [opened]);

  const isGood = letter.message.judgment === "good_job";

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-20">
      <Link
        href="/letters"
        className="self-start text-xs tracking-[0.3em] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors mb-12"
      >
        ← 一覧へ
      </Link>

      <AnimatePresence mode="wait">
        {!revealLetter ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center mt-16 gap-12"
          >
            <p className="text-xs tracking-[0.3em] text-[color:var(--muted)]">
              {shownAge}歳・{letter.profile.occupation}・
              {genderLabel[letter.profile.gender]}
            </p>
            <Envelope opened={opened} onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-[640px] mt-10"
          >
            <header className="border-b border-[color:var(--rule)] pb-6 mb-10">
              <p className="text-xs tracking-[0.3em] text-[color:var(--muted)]">
                3年前のわたしへ
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {shownAge}歳・{letter.profile.occupation}・
                {genderLabel[letter.profile.gender]}
              </p>
              <p className="mt-6 text-[15px] leading-[2.2]">
                <span className="text-[color:var(--muted)]">あのとき選んだのは、</span>
                <br />
                {letter.decision.chose}。
                <br />
                <span className="text-[color:var(--muted)]">選ばなかったのは、</span>
                <br />
                {letter.decision.didntChoose}。
              </p>
            </header>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.6 }}
              className="text-sm text-[color:var(--muted)] mb-8 italic"
            >
              {letter.message.afterwards}
            </motion.p>

            <div className="text-[17px] leading-[2.2] whitespace-pre-wrap min-h-[10rem]">
              <Typewriter
                text={letter.message.body}
                startDelay={1400}
                speed={75}
                onDone={() => setBodyDone(true)}
              />
            </div>

            <AnimatePresence>
              {bodyDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                  className="mt-16 flex flex-col items-center gap-12"
                >
                  <span
                    className="inline-block text-xs tracking-[0.4em] px-6 py-3 border"
                    style={{
                      color: isGood
                        ? "var(--accent-good)"
                        : "var(--accent-thought)",
                      borderColor: isGood
                        ? "var(--accent-good)"
                        : "var(--accent-thought)",
                    }}
                  >
                    {isGood ? "あれでよかった" : "もう少し考えても"}
                  </span>

                  <Link
                    href={`/letters/${nextId}`}
                    className="group text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
                  >
                    次の手紙へ
                    <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">
                      →
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )}
      </AnimatePresence>
    </main>
  );
}
