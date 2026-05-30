"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope } from "@/components/Envelope";
import { Typewriter } from "@/components/Typewriter";
import type { Letter } from "@/data/senpai";
import { getIntroduction } from "@/data/introductions";
import { displayedAge, getUserAge } from "@/lib/displayAge";
import { usePaperRustle } from "@/lib/usePaperRustle";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

function DialogueRequest({ letter }: { letter: Letter }) {
  const [open, setOpen] = useState(false);
  const [situation, setSituation] = useState("");
  const [sent, setSent] = useState(false);
  const [batonReady, setBatonReady] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setBatonReady(true), 2200);
    return () => clearTimeout(t);
  }, [sent]);

  // この方(A)と話したあと、A が「次に話すといい人(B)」を紹介してくれる。
  const intro = getIntroduction(letter.id);
  const batonHref = intro
    ? `/baton?from=${intro.to}&by=${letter.id}&message=${encodeURIComponent(intro.note)}`
    : null;

  if (sent) {
    return (
      <div className="w-full flex flex-col items-center gap-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
          className="text-xs tracking-[0.25em] text-[color:var(--muted)] text-center"
        >
          リクエストが届きました。担当者よりご連絡します。
        </motion.p>

        <AnimatePresence>
          {batonReady && batonHref && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="w-full border-t border-[color:var(--rule)] pt-10 flex flex-col items-center gap-6 text-center"
            >
              <p className="text-xs tracking-[0.35em] text-[color:var(--muted)]">
                お話しできました
              </p>
              <p className="text-[15px] leading-[2.2]">
                {letter.profile.occupation}・{letter.profile.age}歳のこの方から、
                <br />
                次に話すといい方を、
                <br />
                そっと紹介してもらいました。
              </p>
              <Link
                href={batonHref}
                className="group mt-2 text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
              >
                バトンを受け取る
                <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full border-t border-[color:var(--rule)] pt-12 flex flex-col items-center gap-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs tracking-[0.3em] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
        >
          この方と話してみる →
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col gap-6"
        >
          <p className="text-xs tracking-[0.25em] text-[color:var(--muted)]">
            今のあなたの状況を、少しだけ教えてください。
          </p>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={4}
            placeholder="例：転職を考えているが、子どものことも気になっている。"
            className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-sm py-3 resize-none leading-[2]"
          />
          <div className="flex justify-end">
            <button
              disabled={situation.trim().length === 0}
              onClick={() => setSent(true)}
              className="text-xs tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              送る →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

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
  const playRustle = usePaperRustle();

  useEffect(() => {
    setShownAge(displayedAge(letter.id, getUserAge(letter.profile.age - 3)));
  }, [letter.id, letter.profile.age]);

  useEffect(() => {
    if (!opened) return;
    // 封筒の開封 + 便箋スライドアップの演出（約 1.8s）を見せてから便箋画面へ
    const t = setTimeout(() => setRevealLetter(true), 1800);
    return () => clearTimeout(t);
  }, [opened]);

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
            <Envelope
              opened={opened}
              onOpen={() => {
                playRustle();
                setOpened(true);
              }}
            />
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
                  <Link
                    href={`/letters/${nextId}`}
                    className="group text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
                  >
                    次の手紙へ
                    <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">
                      →
                    </span>
                  </Link>

                  <DialogueRequest letter={letter} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )}
      </AnimatePresence>
    </main>
  );
}
