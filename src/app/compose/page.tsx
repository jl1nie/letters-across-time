"use client";

import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
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

const eventOptions = ["転職", "結婚", "出産", "独立", "進学", "留学", "その他"];

type GenderChoice = "f" | "m" | "x"; // x = 答えない（マッチングに使わない）
const genderOptions: { value: GenderChoice; label: string }[] = [
  { value: "f", label: "女性" },
  { value: "m", label: "男性" },
  { value: "x", label: "答えない" },
];

const TOTAL_STEPS = 5;

export default function ComposePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [occupation, setOccupation] = useState<OccCat | null>(null);
  const [gender, setGender] = useState<GenderChoice | null>(null);
  const [event, setEvent] = useState<string | null>(null);
  const [theme, setTheme] = useState("");

  const next = () => setStep((s) => s + 1);

  const submit = () => {
    const payload: Record<string, string> = {
      age: String(age ?? 33),
      occ: occupation ?? "その他",
      event: event ?? "その他",
      theme,
    };
    // 「答えない」を選んだら gender はマッチングに使わないので URL にも載せない
    if (gender === "f" || gender === "m") {
      payload.gender = gender;
    }
    console.debug("[compose] submit", payload);
    const q = new URLSearchParams(payload);
    router.push(`/letters?${q.toString()}`);
  };

  const stepVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

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
            <motion.section
              key="age"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
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
                placeholder="34"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-2xl py-3 text-center tracking-[0.2em]"
              />
              <Forward enabled={!!age && age >= 18 && age <= 60} onClick={next} />
            </motion.section>
          )}

          {step === 1 && (
            <motion.section
              key="occ"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                どんな分野で、働いていますか。
              </h2>
              <div className="flex flex-wrap gap-3">
                {occOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccupation(o)}
                    className={`text-sm px-4 py-2 border rounded-sm transition-colors ${
                      occupation === o
                        ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                        : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <Forward enabled={!!occupation} onClick={next} />
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="gender"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-4">
                よろしければ、性別を。
              </h2>
              <p className="text-xs text-[color:var(--muted)] mb-12 leading-[2]">
                同じ立場の先輩を見つけやすくするためにだけ使います。
                <br />
                「答えない」も選べます。
              </p>
              <div className="flex flex-wrap gap-3">
                {genderOptions.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGender(g.value)}
                    className={`text-sm px-5 py-2 border rounded-sm transition-colors ${
                      gender === g.value
                        ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                        : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <Forward enabled={!!gender} onClick={next} />
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="event"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                いま、どんな選択の前に立っていますか。
              </h2>
              <div className="flex flex-wrap gap-3">
                {eventOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setEvent(o)}
                    className={`text-sm px-4 py-2 border rounded-sm transition-colors ${
                      event === o
                        ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                        : "border-[color:var(--rule)] hover:border-[color:var(--foreground)]"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <Forward enabled={!!event} onClick={next} />
            </motion.section>
          )}

          {step === 4 && (
            <motion.section
              key="theme"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                <span className="inline-block">いちばん、迷っていることを</span>
                <br />
                <span className="inline-block">ひとことで。</span>
              </h2>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                rows={3}
                placeholder="例：いまの会社に残るか、別の道に進むか。"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-3 resize-none leading-[2]"
              />
              <Forward
                enabled={theme.trim().length > 0}
                onClick={submit}
                label="手紙を受け取る"
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

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
      <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-2">
        バトンを受け取ったあなたへ
      </p>
      <p className="text-sm leading-[2] text-[color:var(--muted)]">
        {letter.profile.occupation}・{shownAge}歳のあの方から。
      </p>
    </motion.div>
  );
}

function Forward({
  enabled,
  onClick,
  label = "つぎへ",
}: {
  enabled: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: enabled ? 1 : 0.25, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-16 flex justify-end"
    >
      <button
        disabled={!enabled}
        onClick={onClick}
        className="group text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors disabled:cursor-not-allowed"
      >
        {label}
        <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">
          →
        </span>
      </button>
    </motion.div>
  );
}
