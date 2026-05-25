"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  opened: boolean;
  onOpen?: () => void;
  size?: number;
};

/**
 * 封筒。閉 → 開：
 *  - 上のフラップ（V字を下に向けた三角）が、上辺をヒンジに「scaleY: 1 → -1」で上にめくれる
 *  - 封蝋がフェードアウト
 *  - 中から便箋が上へスッと立ち上がる
 *
 * 3D rotateX は SVG での挙動が不安定なため、純粋な 2D 反転で実現する。
 */
export function Envelope({ opened, onOpen, size = 260 }: Props) {
  const W = size;
  const H = Math.round(size * 0.66);
  const reduced = useReducedMotion();

  const bodyFill = "#efe7d3";
  const bodyStroke = "#b8ae92";
  const flapFill = "#e3d9bf";
  const innerFill = "#cabe9f";
  const paperFill = "#fbf7ec";

  // viewBox は便箋が上に出るぶん上側に余白を取る
  const VB_TOP = -H * 0.9;
  const VB_HEIGHT = H * 1.95;

  return (
    <button
      type="button"
      onClick={() => !opened && onOpen?.()}
      aria-label={opened ? "開封済みの封筒" : "封を開ける"}
      className="relative outline-none rounded-sm focus-visible:ring-1 focus-visible:ring-[color:var(--foreground)]"
      style={{
        width: W,
        height: H * 1.95,
        cursor: opened ? "default" : "pointer",
      }}
    >
      <svg
        viewBox={`0 ${VB_TOP} ${W} ${VB_HEIGHT}`}
        width="100%"
        height="100%"
      >
        {/* 影 */}
        <ellipse
          cx={W / 2}
          cy={H + 8}
          rx={W * 0.42}
          ry={4}
          fill="#2b2823"
          opacity={0.08}
        />

        {/* 便箋（封筒の中から立ち上がる） */}
        <motion.g
          initial={false}
          animate={{
            y: opened ? -H * 0.78 : 0,
            opacity: opened ? 1 : 0,
          }}
          transition={{
            duration: reduced ? 0 : 1.1,
            ease: [0.22, 0.61, 0.36, 1],
            delay: reduced ? 0 : 0.45,
          }}
        >
          <rect
            x={W * 0.12}
            y={H * 0.18}
            width={W * 0.76}
            height={H * 0.82}
            fill={paperFill}
            stroke="#d6cdb4"
            strokeWidth={0.8}
          />
          {[0.32, 0.46, 0.6, 0.74].map((p) => (
            <line
              key={p}
              x1={W * 0.2}
              x2={W * 0.8}
              y1={H * p}
              y2={H * p}
              stroke="#d6cdb4"
              strokeWidth={0.6}
            />
          ))}
        </motion.g>

        {/* 封筒の後ろの面（フラップが開いたとき覗く内側） */}
        <rect
          x={0}
          y={0}
          width={W}
          height={H}
          fill={innerFill}
          stroke={bodyStroke}
          strokeWidth={1}
        />

        {/* 手前の V字フラップ（下辺の折り返し） */}
        <path
          d={`M 0 ${H} L ${W / 2} ${H * 0.42} L ${W} ${H} Z`}
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth={1}
        />
        {/* 左右のサイドフラップ */}
        <path
          d={`M 0 0 L ${W * 0.5} ${H * 0.42} L 0 ${H} Z`}
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth={0.8}
          opacity={0.9}
        />
        <path
          d={`M ${W} 0 L ${W * 0.5} ${H * 0.42} L ${W} ${H} Z`}
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth={0.8}
          opacity={0.9}
        />

        {/* 上フラップ（クリックで開くパーツ） */}
        <motion.g
          initial={false}
          animate={{ scaleY: opened ? -1 : 1 }}
          transition={{
            duration: reduced ? 0 : 0.9,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{
            transformOrigin: `${W / 2}px 0px`,
            transformBox: "view-box",
          }}
        >
          <path
            d={`M 0 0 L ${W} 0 L ${W / 2} ${H * 0.58} Z`}
            fill={flapFill}
            stroke={bodyStroke}
            strokeWidth={1}
          />
          {/* 封蝋（フラップ先端） */}
          <motion.g
            initial={false}
            animate={{ opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <circle
              cx={W / 2}
              cy={H * 0.56}
              r={11}
              fill="#7a8c7f"
              stroke="#5d6e63"
              strokeWidth={0.8}
            />
            <text
              x={W / 2}
              y={H * 0.56 + 4}
              textAnchor="middle"
              fontSize={10}
              fill="#faf8f4"
              letterSpacing="0.1em"
              fontFamily="serif"
            >
              L
            </text>
          </motion.g>
        </motion.g>
      </svg>

      {!opened && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-4 text-xs tracking-[0.3em] text-[color:var(--muted)] whitespace-nowrap">
          封を、ひらく
        </span>
      )}
    </button>
  );
}
