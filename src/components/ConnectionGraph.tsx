"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Letter } from "@/data/senpai";

type Ranked = { letter: Letter; score: number };

type Props = {
  ranked: Ranked[];
  userLabel: string;
};

export function ConnectionGraph({ ranked, userLabel }: Props) {
  // viewBox は小さめにして、SVG 内のテキスト/ノードを相対的に大きくする
  const W = 480;
  const H = 380;
  const cx = W / 2;
  const cy = H / 2;

  const top = ranked.slice(0, 7);
  const nodes = top.map((r, i) => {
    const angle = (i / top.length) * Math.PI * 2 - Math.PI / 2;
    // モバイルでもラベルが衝突しにくいよう半径を広めに
    const radius = 80 + (1 - r.score) * 95;
    return {
      ...r,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* connection lines */}
        {nodes.map((n, i) => (
          <motion.path
            key={`l-${n.letter.id}`}
            d={`M ${cx} ${cy} Q ${(cx + n.x) / 2 + (i % 2 ? 18 : -18)} ${
              (cy + n.y) / 2
            } ${n.x} ${n.y}`}
            fill="none"
            stroke="#bcb39a"
            strokeWidth={0.8 + n.score * 1.4}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.75 }}
            transition={{
              duration: 1.6,
              delay: 0.6 + i * 0.18,
              ease: "easeOut",
            }}
          />
        ))}

        {/* user center node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <circle cx={cx} cy={cy} r={9} fill="#2b2823" />
          <circle
            cx={cx}
            cy={cy}
            r={20}
            fill="none"
            stroke="#2b2823"
            strokeOpacity={0.2}
          />
          <text
            x={cx}
            y={cy + 42}
            textAnchor="middle"
            fontSize={17}
            fill="#2b2823"
            letterSpacing="0.15em"
          >
            {userLabel}
          </text>
        </motion.g>

        {/* senpai nodes */}
        {nodes.map((n, i) => (
          <motion.g
            key={n.letter.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 1.0 + i * 0.18 }}
          >
            <Link href={`/letters/${n.letter.id}`} className="cursor-pointer">
              <g>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={7}
                  fill={
                    n.letter.message.judgment === "good_job"
                      ? "#7a8c7f"
                      : "#b68a6a"
                  }
                />
                {/* タップしやすいよう透明ヒットエリア */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={22}
                  fill="transparent"
                />
                <text
                  x={n.x}
                  y={n.y - 18}
                  textAnchor="middle"
                  fontSize={16}
                  fill="#5a564e"
                  letterSpacing="0.08em"
                >
                  {n.letter.profile.age}・{shortenOccupation(n.letter.profile.occupation)}
                </text>
                <text
                  x={n.x}
                  y={n.y + 28}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#8a8377"
                  letterSpacing="0.15em"
                >
                  {n.letter.decision.event}
                </text>
              </g>
            </Link>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// 長い職業名は省略してラベルの見やすさを保つ
function shortenOccupation(name: string): string {
  if (name.length <= 8) return name;
  return name.slice(0, 7) + "…";
}
