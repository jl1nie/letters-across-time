"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// SHA-256("0721")
const PASSWORD_HASH =
  "e4339e761261c995b73b91d0d00cc8137d80a226c730fc72e19a35547a4b91f3";
const STORAGE_KEY = "lat-unlocked";

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
  }, []);

  if (unlocked) {
    return <>{children}</>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(value);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-[color:var(--muted)] text-xs tracking-[0.4em] mb-16 uppercase"
      >
        Letters Across Time
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
        className="mb-12 text-sm leading-[2.2] text-[color:var(--muted)]"
      >
        <span className="inline-block">合言葉を入力してください。</span>
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.9 }}
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-8"
      >
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          aria-label="合言葉"
          className="w-48 bg-transparent border-b border-[color:var(--rule)] focus:border-[color:var(--foreground)] outline-none text-center text-lg tracking-[0.5em] py-2 transition-colors"
        />

        <button
          type="submit"
          className="group inline-flex items-center gap-3 text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
        >
          ひらく
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        <p
          className={`text-xs tracking-[0.2em] text-[color:var(--accent-thought)] transition-opacity ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          合言葉が違うようです。
        </p>
      </motion.form>
    </main>
  );
}
