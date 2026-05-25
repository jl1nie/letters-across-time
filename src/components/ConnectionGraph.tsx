"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Letter } from "@/data/senpai";

type Ranked = { letter: Letter; score: number };

type Props = {
  ranked: Ranked[];
  userLabel: string;
};

/**
 * ノードを円周上に配置し、ラベルは中心から放射状に外向きへ伸ばす。
 * 角度に応じて text-anchor と縦位置を調整し、隣接ノードのラベル衝突を避ける。
 */
export function ConnectionGraph({ ranked, userLabel }: Props) {
  const W = 600;
  const H = 520;
  const cx = W / 2;
  const cy = H / 2;
  const NODE_COUNT = 5;

  const top = ranked.slice(0, NODE_COUNT);

  const nodes = top.map((r, i) => {
    // -90度から始めて時計回り。等間隔。
    const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
    // 半径は固定気味（似ているほど少しだけ近く）
    const radius = 130 + (1 - r.score) * 40; // 130〜170
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    // ラベルの位置と揃え方を放射方向で決定
    const labelOffset = 22;
    const lx = x + Math.cos(angle) * labelOffset;
    const ly = y + Math.sin(angle) * labelOffset;

    // 角度を 0〜2π で正規化
    let a = angle;
    while (a < 0) a += Math.PI * 2;
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);

    let textAnchor: "start" | "middle" | "end";
    if (cosA > 0.3) textAnchor = "start";
    else if (cosA < -0.3) textAnchor = "end";
    else textAnchor = "middle";

    // 上に行くノードはラベル全体を上に、下に行くノードは下に
    const lineSpacing = 22;
    let firstLineDy: number;
    if (sinA < -0.3) firstLineDy = -8; // 上側: ラベルは上方向
    else if (sinA > 0.3) firstLineDy = 18; // 下側: ラベルは下方向
    else firstLineDy = 5;

    return {
      ...r,
      x,
      y,
      lx,
      ly,
      textAnchor,
      firstLineDy,
      lineSpacing,
    };
  });

  return (
    <div className="w-full overflow-visible">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
      >
        {/* connection lines */}
        {nodes.map((n, i) => (
          <motion.path
            key={`l-${n.letter.id}`}
            d={`M ${cx} ${cy} Q ${(cx + n.x) / 2 + (i % 2 ? 20 : -20)} ${
              (cy + n.y) / 2
            } ${n.x} ${n.y}`}
            fill="none"
            stroke="#bcb39a"
            strokeWidth={1.0 + n.score * 1.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
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
          <circle cx={cx} cy={cy} r={11} fill="#2b2823" />
          <circle
            cx={cx}
            cy={cy}
            r={24}
            fill="none"
            stroke="#2b2823"
            strokeOpacity={0.18}
          />
          <text
            x={cx}
            y={cy + 50}
            textAnchor="middle"
            fontSize={20}
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
                  r={9}
                  fill={
                    n.letter.message.judgment === "good_job"
                      ? "#7a8c7f"
                      : "#b68a6a"
                  }
                />
                {/* タップしやすいよう透明ヒットエリア */}
                <circle cx={n.x} cy={n.y} r={26} fill="transparent" />

                <text
                  x={n.lx}
                  y={n.ly + n.firstLineDy}
                  textAnchor={n.textAnchor}
                  fontSize={18}
                  fill="#3d3a33"
                  letterSpacing="0.08em"
                >
                  {n.letter.profile.age}・
                  {shortenOccupation(n.letter.profile.occupation)}
                </text>
                <text
                  x={n.lx}
                  y={n.ly + n.firstLineDy + n.lineSpacing}
                  textAnchor={n.textAnchor}
                  fontSize={14}
                  fill="#8a8377"
                  letterSpacing="0.2em"
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

function shortenOccupation(name: string): string {
  if (name.length <= 7) return name;
  return name.slice(0, 6) + "…";
}
