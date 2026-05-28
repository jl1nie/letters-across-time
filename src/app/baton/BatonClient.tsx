"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { senpai } from "@/data/senpai";
import { LetterCard } from "@/components/LetterCard";

const genderLabel: Record<string, string> = { f: "女性", m: "男性", x: "—" };

export function BatonClient() {
  const params = useSearchParams();
  const fromId = params.get("from");
  const message = params.get("message");

  const letter = fromId ? senpai.find((l) => l.id === fromId) : null;

  if (!letter) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <p className="text-sm text-[color:var(--muted)] tracking-[0.2em]">
          バトンが見つかりませんでした。
        </p>
        <Link
          href="/"
          className="mt-10 text-xs tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
        >
          トップへ →
        </Link>
      </main>
    );
  }

  const composeHref = `/write?baton=${letter.id}`;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-20">
      <div className="w-full max-w-[640px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.35em] text-[color:var(--muted)] mb-6">
            バトンが届いています
          </p>
          <h1 className="text-[22px] font-light leading-[2.2] tracking-[0.05em] mb-10">
            {letter.profile.occupation}・{letter.profile.age}歳・
            {genderLabel[letter.profile.gender]}
            <br />
            <span className="text-[color:var(--muted)]">のあの方から。</span>
          </h1>

          {message && (
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="border-l-2 border-[color:var(--rule)] pl-6 py-2 text-[15px] leading-[2.2] italic text-[color:var(--muted)]"
            >
              {message}
            </motion.blockquote>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mb-20"
        >
          <p className="text-xs tracking-[0.3em] text-[color:var(--muted)] mb-8">
            この方の手紙
          </p>
          <LetterCard letter={letter} index={0} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.9 }}
          className="border-t border-[color:var(--rule)] pt-16 flex flex-col items-center gap-6 text-center"
        >
          <p className="text-[15px] leading-[2.4] font-light">
            あの選択の先が、少しずつ見えてきたとき。
            <br />
            その経験を、次の誰かへ。
          </p>
          <p className="text-xs text-[color:var(--muted)] leading-[2]">
            いまでも、数ヶ月後でも、数年後でも。
            <br />
            自分の選択の結果が振り返れるようになったとき、このバトンを渡してください。
          </p>
          <Link
            href={composeHref}
            className="group mt-6 text-sm tracking-[0.3em] border-b border-[color:var(--rule)] pb-1 hover:border-[color:var(--foreground)] transition-colors"
          >
            あなたの経験を残す
            <span className="ml-3 transition-transform group-hover:translate-x-1 inline-block">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
