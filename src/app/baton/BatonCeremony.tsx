"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Letter } from "@/data/senpai";
import { usePaperRustle } from "@/lib/usePaperRustle";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

type Phase = "wrapped" | "opening" | "letter";

/**
 * 「人生のバトンを丁寧に受け取る」儀式のような受け取り体験。
 *
 * - スマホを手に持って操作する前提（手のひらサイズの幅に収める）
 * - 包まれたバトンをタップすると、中からふわっと手紙が立ち上がる
 * - タップ時に「かさかさ」という紙の摩擦音
 * - オフホワイトの柔らかな色味・丸みのあるフォント・ゆっくりした動き
 */
export function BatonCeremony({
  letter,
  message,
  introducer,
}: {
  letter: Letter;
  message: string | null;
  introducer: Letter | null;
}) {
  const reduced = useReducedMotion();
  const playRustle = usePaperRustle();
  const [phase, setPhase] = useState<Phase>("wrapped");

  // 包みが開いたら、少し間をおいて手紙の内容を見せる（焦らせない）
  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => setPhase("letter"), reduced ? 200 : 2600);
    return () => clearTimeout(t);
  }, [phase, reduced]);

  const open = () => {
    if (phase !== "wrapped") return;
    playRustle();
    setPhase("opening");
  };

  const opened = phase !== "wrapped";

  return (
    <main className="baton-ceremony flex flex-1 flex-col items-center px-6 py-14">
      <div className="w-full max-w-[26rem] flex flex-1 flex-col items-center">
        {/* 導入のことば */}
        <AnimatePresence mode="wait">
          {phase === "wrapped" ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <p className="text-sm tracking-[0.3em] text-[color:var(--c-muted)]">
                あなたに、
              </p>
              <p className="mt-4 text-[19px] tracking-[0.12em] leading-[2.2]">
                人生のバトンが
                <br />
                届きました。
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="received"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0, ease: "easeOut", delay: 0.2 }}
              className="text-center mb-10"
            >
              <p className="text-sm tracking-[0.28em] text-[color:var(--c-muted)] leading-[2.2]">
                そっと、手のひらに。
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 受け取りの舞台 */}
        <div className="relative flex w-full flex-1 items-center justify-center">
          {/* 中から立ち上がる手紙 */}
          <AnimatePresence>
            {opened && (
              <motion.div
                key="rising-letter"
                initial={{ opacity: 0, y: 120, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: reduced ? 0.2 : 2.0,
                  ease: [0.22, 0.61, 0.36, 1],
                  delay: reduced ? 0 : 0.5,
                }}
                className="relative z-10 w-[19rem]"
              >
                <Card>
                  {introducer && (
                    <p className="text-center text-xs tracking-[0.18em] text-[color:var(--c-muted)] leading-[2.2]">
                      {introducer.profile.occupation}・
                      {introducer.profile.age}歳の方が、
                      <br />
                      この方を紹介してくれました。
                    </p>
                  )}

                  <div className={`text-center ${introducer ? "mt-6" : ""}`}>
                    <p className="text-xs tracking-[0.3em] text-[color:var(--c-muted)]">
                      この方と、
                    </p>
                    <p className="mt-3 text-[17px] tracking-[0.1em] leading-[2.2]">
                      話してみませんか。
                    </p>
                  </div>

                  <p className="mt-7 text-center text-sm tracking-[0.18em] text-[color:var(--c-muted)] leading-[2.2]">
                    {letter.profile.occupation}・{letter.profile.age}歳・
                    {genderLabel[letter.profile.gender]}
                  </p>

                  {message && (
                    <p className="mt-7 rounded-2xl bg-[color:var(--c-paper-2)] px-5 py-5 text-[14px] leading-[2.2] text-[color:var(--c-ink)]">
                      {message}
                    </p>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1.4,
                      delay: phase === "letter" ? 0.6 : 0,
                    }}
                    className="mt-9 flex flex-col items-center gap-5"
                  >
                    <Link
                      href={`/letters/${letter.id}`}
                      className="rounded-full bg-[color:var(--c-ink)] px-9 py-3 text-sm tracking-[0.22em] text-[color:var(--c-paper)] transition-transform active:scale-[0.97]"
                    >
                      この方と話してみる
                    </Link>
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 包まれたバトン */}
          <AnimatePresence>
            {!opened && (
              <motion.button
                key="parcel"
                type="button"
                onClick={open}
                aria-label="バトンを受け取る"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={
                  reduced
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: 1,
                        scale: [1, 1.035, 1],
                        y: [0, -6, 0],
                      }
                }
                exit={{ opacity: 0, scale: 1.04 }}
                transition={
                  reduced
                    ? { duration: 0.3 }
                    : {
                        duration: 4.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                }
                className="absolute z-0 outline-none"
              >
                <Parcel />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 受け取りを促すヒント */}
        <AnimatePresence>
          {phase === "wrapped" && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: 1.4 }}
              className="mt-10 text-xs tracking-[0.3em] text-[color:var(--c-muted)]"
            >
              そっと、手にとってください
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// 丸みのある柔らかな手紙カード
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-[color:var(--c-paper)] px-7 py-9 shadow-[0_18px_50px_-28px_rgba(80,70,55,0.55)]">
      {children}
    </div>
  );
}

// 包まれたバトン（ひもで結ばれた手のひらサイズの包み）
function Parcel() {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      aria-hidden
    >
      {/* やわらかい影 */}
      <ellipse cx="75" cy="134" rx="46" ry="6" fill="#5a503f" opacity="0.10" />
      {/* 包み本体（丸い角） */}
      <rect
        x="27"
        y="34"
        width="96"
        height="96"
        rx="26"
        fill="var(--c-parcel)"
        stroke="var(--c-parcel-edge)"
        strokeWidth="1.5"
      />
      {/* 上面のふくらみ */}
      <path
        d="M27 60 Q75 44 123 60"
        stroke="var(--c-parcel-edge)"
        strokeWidth="1.2"
        opacity="0.6"
        fill="none"
      />
      {/* 十字のひも */}
      <rect x="69" y="34" width="12" height="96" rx="6" fill="var(--c-ribbon)" />
      <rect x="27" y="76" width="96" height="12" rx="6" fill="var(--c-ribbon)" />
      {/* 結び目 */}
      <circle cx="75" cy="82" r="9" fill="var(--c-ribbon)" />
      <circle cx="75" cy="82" r="4" fill="var(--c-paper)" opacity="0.7" />
      {/* ちらりと覗く手紙のはし */}
      <rect
        x="58"
        y="26"
        width="34"
        height="14"
        rx="4"
        fill="var(--c-paper)"
        stroke="var(--c-parcel-edge)"
        strokeWidth="1"
      />
    </svg>
  );
}
