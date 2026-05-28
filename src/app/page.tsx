"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  return (
    <PasswordGate>
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-24 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        className="text-[color:var(--muted)] text-xl tracking-[0.4em] mb-16"
      >
        ふ、と
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, ease: "easeOut", delay: 0.9 }}
        className="text-2xl sm:text-4xl font-light leading-[2.2] tracking-[0.1em] max-w-[16em]"
      >
        <span className="inline-block">3年前のあなたから届く、</span>
        <br className="hidden sm:inline" />
        <span className="inline-block">人生のバトン。</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.0, ease: "easeOut", delay: 2.4 }}
        className="mt-16 max-w-[20em] text-sm leading-[2.2] text-[color:var(--muted)] px-2"
      >
        <span className="inline-block">少し先を歩く誰かの、</span>
        <span className="inline-block">選んだ道と選ばなかった道。</span>
        <br />
        <span className="inline-block">答えではなく、</span>
        <span className="inline-block">余白に出会う場所。</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 3.6 }}
        className="mt-24"
      >
        <Link
          href="/compose"
          className="group inline-flex items-center gap-3 text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
        >
          はじめる
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </main>
    </PasswordGate>
  );
}
