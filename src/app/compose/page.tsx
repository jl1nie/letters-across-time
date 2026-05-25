"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

export default function ComposePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [occupation, setOccupation] = useState<OccCat | null>(null);
  const [event, setEvent] = useState<string | null>(null);
  const [theme, setTheme] = useState("");

  const next = () => setStep((s) => s + 1);

  const submit = () => {
    const payload = {
      age: String(age ?? 33),
      occ: occupation ?? "その他",
      event: event ?? "その他",
      theme,
    };
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
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-16 text-center">
          STEP {step + 1} / 4
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
                type="number"
                min={20}
                max={60}
                value={age ?? ""}
                onChange={(e) => setAge(Number(e.target.value) || null)}
                placeholder="34"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-2xl py-3 text-center tracking-[0.2em]"
              />
              <Forward enabled={!!age && age >= 18} onClick={next} />
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

          {step === 3 && (
            <motion.section
              key="theme"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              <h2 className="text-xl font-light leading-[2] tracking-[0.08em] mb-12">
                いちばん、迷っていることを
                <br />
                ひとことで。
              </h2>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                rows={3}
                placeholder="例：いまの会社に残るか、別の道に進むか。"
                className="w-full bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-base py-3 resize-none leading-[2]"
              />
              <Forward enabled={theme.trim().length > 0} onClick={submit} label="手紙を受け取る" />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
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
