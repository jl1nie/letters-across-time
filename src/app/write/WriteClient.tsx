"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { senpai } from "@/data/senpai";
import { useDisplayedAge } from "@/lib/useDisplayedAge";
import { parseAgeInput } from "@/lib/parseAgeInput";

type OccCat =
  | "デザイン"
  | "エンジニア"
  | "企画・マーケ"
  | "営業"
  | "経営・起業"
  | "研究・教育"
  | "クリエイティブ"
  | "医療・福祉"
  | "その他";

const occOptions: OccCat[] = [
  "デザイン", "エンジニア", "企画・マーケ", "営業",
  "経営・起業", "研究・教育", "クリエイティブ", "医療・福祉", "その他",
];

const eventOptions = ["転職", "結婚", "出産", "独立", "進学", "留学", "その他"];

type GenderChoice = "f" | "m" | "x";
const genderOptions: { value: GenderChoice; label: string }[] = [
  { value: "f", label: "女性" },
  { value: "m", label: "男性" },
  { value: "x", label: "答えない" },
];

const TOTAL_STEPS = 7;

const stepVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function BatonContext() {
  const params = useSearchParams();
  const batonId = params.get("baton");
  const letter = batonId ? senpai.find((l) => l.id === batonId) : null;
  const shownAge = useDisplayedAge(letter?.id ?? "", letter?.profile.age ?? 0);
  if (!letter) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full max-w-md mb-12 border-l-2 border-[color:var(--rule)] pl-6 py-2"
    >
      <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-1">
        バトンを受け取ったあなたへ
      </p>
      <p className="text-sm leading-[2] text-[color:var(--muted)]">
        {letter.profile.occupation}・{shownAge}歳のあの方から。
      </p>
    </motion.div>
  );
}

export function WriteClient() {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [occupation, setOccupation] = useState<OccCat | null>(null);
  const [gender, setGender] = useState<GenderChoice | null>(null);
  const [event, setEvent] = useState<string | null>(null);
  const [chose, setChose] = useState("");
  const [didntChoose, setDidntChoose] = useState("");
  const [afterwards, setAfterwards] = useState("");
  const [body, setBody] = useState("");
  const [done, setDone] = useState(false);

  const next = () => setStep((s) => s + 1);
  const submit = () => setDone(true);

  if (done) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-10"
        >
          <p className="text-xs tracking-[0.4em] text-[color:var(--muted)]">
            ふ、と
          </p>
          <p className="text-xl font-light leading-[2.2] tracking-[0.08em]">
            ありがとうございます。
          </p>
          <p className="text-sm leading-[2.4] text-[color:var(--muted)] max-w-[22em]">
            あなたの経験が、誰かの選択の余白になります。
            <br />
            確認ののち、掲載いたします。
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <Suspense fallback={null}>
        <BatonContext />
      </Suspense>
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-16 text-center">
          STEP {step + 1} / {TOTAL_STEPS}
        </p>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section key="age" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                いま、おいくつですか。
              </h2>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                value={age ?? ""}
                onChange={(e) => setAge(parseAgeInput(e.target.value))}
                placeholder="36"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-2xl py-3 text-center tracking-[0.2em]"
              />
              <Forward enabled={!!age && age >= 20 && age <= 70} onClick={next} />
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="occ" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                どんな分野で、働いていますか。
              </h2>
              <div className="flex flex-wrap gap-3">
                {occOptions.map((o) => (
                  <button key={o} onClick={() => setOccupation(o)}
                    className={`text-sm px-4 py-2 border rounded-sm transition-colors ${occupation === o ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]" : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"}`}>
                    {o}
                  </button>
                ))}
              </div>
              <Forward enabled={!!occupation} onClick={next} />
            </motion.section>
          )}

          {step === 2 && (
            <motion.section key="gender" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-4">
                よろしければ、性別を。
              </h2>
              <p className="text-xs text-[color:var(--muted)] mb-12 leading-[2]">
                似た立場の後輩とのマッチングにのみ使います。
                <br />「答えない」も選べます。
              </p>
              <div className="flex flex-wrap gap-3">
                {genderOptions.map((g) => (
                  <button key={g.value} onClick={() => setGender(g.value)}
                    className={`text-sm px-5 py-2 border rounded-sm transition-colors ${gender === g.value ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]" : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
              <Forward enabled={!!gender} onClick={next} />
            </motion.section>
          )}

          {step === 3 && (
            <motion.section key="event" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                あのとき、どんな選択でしたか。
              </h2>
              <div className="flex flex-wrap gap-3">
                {eventOptions.map((o) => (
                  <button key={o} onClick={() => setEvent(o)}
                    className={`text-sm px-4 py-2 border rounded-sm transition-colors ${event === o ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]" : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"}`}>
                    {o}
                  </button>
                ))}
              </div>
              <Forward enabled={!!event} onClick={next} />
            </motion.section>
          )}

          {step === 4 && (
            <motion.section key="chose" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                選んだ道と、
                <br />選ばなかった道を。
              </h2>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs tracking-[0.25em] text-[color:var(--muted)] mb-3">選んだのは</p>
                  <input
                    type="text" value={chose}
                    onChange={(e) => setChose(e.target.value)}
                    placeholder="例：事業会社への転職"
                    className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-2 tracking-[0.05em]"
                  />
                </div>
                <div>
                  <p className="text-xs tracking-[0.25em] text-[color:var(--muted)] mb-3">選ばなかったのは</p>
                  <input
                    type="text" value={didntChoose}
                    onChange={(e) => setDidntChoose(e.target.value)}
                    placeholder="例：制作会社で昇進する道"
                    className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-2 tracking-[0.05em]"
                  />
                </div>
              </div>
              <Forward enabled={chose.trim().length > 0 && didntChoose.trim().length > 0} onClick={next} />
            </motion.section>
          )}

          {step === 5 && (
            <motion.section key="afterwards" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-4">
                その後、どうなりましたか。
              </h2>
              <p className="text-xs text-[color:var(--muted)] mb-12 leading-[2]">
                1〜2行で。結果だけでなく、感じたことも。
              </p>
              <textarea
                value={afterwards}
                onChange={(e) => setAfterwards(e.target.value)}
                rows={3}
                placeholder="例：転職した先で、自分の作ったものが何万人にも使われる経験ができた。"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-3 resize-none leading-[2]"
              />
              <Forward enabled={afterwards.trim().length > 0} onClick={next} />
            </motion.section>
          )}

          {step === 6 && (
            <motion.section key="body" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1.0, ease: "easeOut" }}>
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-4">
                3年前の自分へ、
                <br />手紙を書いてください。
              </h2>
              <p className="text-xs text-[color:var(--muted)] mb-8 leading-[2]">
                悩んでいた当時のあなたに、いま何を伝えますか。
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="あのとき、眠れずに過ごしていたあなたへ。&#13;&#10;大丈夫、行って良かったよ。"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-3 resize-none leading-[2]"
              />
              <Forward enabled={body.trim().length > 0} onClick={submit} label="送る" />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Forward({ enabled, onClick, label = "つぎへ" }: { enabled: boolean; onClick: () => void; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: enabled ? 1 : 0.25, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-16 flex justify-end"
    >
      <button disabled={!enabled} onClick={onClick}
        className="group text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors disabled:cursor-not-allowed">
        {label}
        <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">→</span>
      </button>
    </motion.div>
  );
}
