"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Letter } from "@/data/senpai";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

export function LetterCard({ letter, index }: { letter: Letter; index: number }) {
  const isGood = letter.message.judgment === "good_job";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
    >
      <Link
        href={`/letters/${letter.id}`}
        className="block border-t border-[color:var(--rule)] py-10 group"
      >
        <div className="flex items-baseline justify-between gap-6 mb-4">
          <p className="text-xs tracking-[0.3em] text-[color:var(--muted)]">
            {letter.profile.age}歳・{letter.profile.occupation}・
            {genderLabel[letter.profile.gender]}
          </p>
          <span
            className="text-[10px] tracking-[0.3em]"
            style={{
              color: isGood ? "var(--accent-good)" : "var(--accent-thought)",
            }}
          >
            {isGood ? "あれでよかった" : "もう少し考えても"}
          </span>
        </div>
        <p className="text-[15px] leading-[2.2]">
          <span className="text-[color:var(--muted)]">選んだのは、</span>
          {letter.decision.chose}。
        </p>
        <p className="mt-3 text-sm text-[color:var(--muted)] italic line-clamp-2">
          {letter.message.afterwards}
        </p>
        <p className="mt-6 text-xs tracking-[0.3em] text-[color:var(--muted)] group-hover:text-[color:var(--foreground)] transition-colors">
          手紙を読む →
        </p>
      </Link>
    </motion.div>
  );
}
