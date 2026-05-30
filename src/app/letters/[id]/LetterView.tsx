"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Envelope } from "@/components/Envelope";
import { Typewriter } from "@/components/Typewriter";
import type { Letter } from "@/data/senpai";
import { getIntroduction } from "@/data/introductions";
import { useDisplayedAge } from "@/lib/useDisplayedAge";
import { usePaperRustle } from "@/lib/usePaperRustle";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

function Bubble({
  from,
  children,
}: {
  from: "me" | "senpai";
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className={
        from === "me"
          ? "self-end max-w-[80%] text-[14px] leading-[2] whitespace-pre-wrap px-4 py-3 rounded-2xl border border-[color:var(--rule)]"
          : "self-start max-w-[85%] text-[14px] leading-[2] whitespace-pre-wrap px-4 py-3 rounded-2xl bg-[#efe9da]"
      }
    >
      {children}
    </motion.div>
  );
}

type Step = "idle" | "form" | "talking" | "done";

function DialogueRequest({
  letter,
  shownAge,
}: {
  letter: Letter;
  shownAge: number;
}) {
  const [step, setStep] = useState<Step>("idle");
  const [situation, setSituation] = useState("");
  const [reply, setReply] = useState("");
  const [replied, setReplied] = useState(false);
  const [revealed, setRevealed] = useState(0);

  // この方(A)と話したあと、A が「次に話すといい人(B)」を紹介してくれる。
  const intro = getIntroduction(letter.id);
  const batonHref = intro
    ? `/baton?from=${intro.to}&by=${letter.id}&message=${encodeURIComponent(intro.note)}`
    : null;

  // 先輩の返事。手紙の判断や「その後」を踏まえた語りで、対話している感を出す。
  const senpaiLines = useMemo(
    () => [
      "こんにちは。あなたのお話、受け取りました。",
      letter.message.judgment === "good_job"
        ? "わたしも同じところで、ずいぶん長く迷いました。だからこそ、声をかけたくなって。"
        : "わたしの選択が正解だったとは、正直まだ言い切れません。それでも、回り道の話でよければ。",
      `あのあと、${letter.message.afterwards}`,
    ],
    [letter.message.judgment, letter.message.afterwards],
  );

  // 対話に入ったら、先輩の返事を一つずつゆっくり表示する。
  useEffect(() => {
    if (step !== "talking" || revealed >= senpaiLines.length) return;
    const t = setTimeout(
      () => setRevealed((r) => r + 1),
      revealed === 0 ? 900 : 1700,
    );
    return () => clearTimeout(t);
  }, [step, revealed, senpaiLines]);

  const conversationDone = revealed >= senpaiLines.length;

  if (step === "done") {
    return (
      <div className="w-full border-t border-[color:var(--rule)] pt-10 flex flex-col items-center gap-6 text-center">
        <p className="text-xs tracking-[0.35em] text-[color:var(--muted)]">
          お話しできました
        </p>
        {batonHref ? (
          <>
            <p className="text-[15px] leading-[2.2]">
              {letter.profile.occupation}・{shownAge}歳のこの方から、
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
          </>
        ) : (
          <p className="text-[15px] leading-[2.2] text-[color:var(--muted)]">
            話してくれて、ありがとう。
          </p>
        )}
      </div>
    );
  }

  if (step === "talking") {
    return (
      <div className="w-full border-t border-[color:var(--rule)] pt-12 flex flex-col gap-4">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)] text-center mb-2">
          {letter.profile.occupation}さんと話しています
        </p>

        <Bubble from="me">{situation}</Bubble>

        {senpaiLines.slice(0, revealed).map((line, i) => (
          <Bubble key={i} from="senpai">
            {line}
          </Bubble>
        ))}

        {conversationDone && (
          <AnimatePresence mode="wait">
            {!replied ? (
              <motion.div
                key="reply-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, delay: 0.4 }}
                className="mt-4 flex flex-col gap-4"
              >
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    // IME変換確定のEnterで誤送信しないよう isComposing を見る
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      if (reply.trim().length > 0) setReplied(true);
                    }
                  }}
                  rows={2}
                  maxLength={100}
                  aria-label="先輩への返信"
                  placeholder="返したいことがあれば、ひとことだけ。"
                  className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-sm py-2 resize-none leading-[2]"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep("done")}
                    className="text-xs tracking-[0.25em] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
                  >
                    対話を終える →
                  </button>
                  <button
                    disabled={reply.trim().length === 0}
                    onClick={() => setReplied(true)}
                    className="text-xs tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    返す →
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reply-sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0 }}
                className="flex flex-col gap-4"
              >
                <Bubble from="me">{reply}</Bubble>
                <Bubble from="senpai">
                  話せてよかった。ひとつ、あなたに会ってほしい人がいます。
                </Bubble>
                <button
                  onClick={() => setStep("done")}
                  className="self-center mt-4 text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
                >
                  対話を終える →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  }

  return (
    <div className="w-full border-t border-[color:var(--rule)] pt-12 flex flex-col items-center gap-6">
      {step === "idle" ? (
        <button
          onClick={() => setStep("form")}
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
              onClick={() => setStep("talking")}
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
  const shownAge = useDisplayedAge(letter.id, letter.profile.age);
  const playRustle = usePaperRustle();

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
                void playRustle();
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

                  {/* letter.id ごとに作り直し、対話状態が次の手紙へ残らないようにする */}
                  <DialogueRequest
                    key={letter.id}
                    letter={letter}
                    shownAge={shownAge}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )}
      </AnimatePresence>
    </main>
  );
}
