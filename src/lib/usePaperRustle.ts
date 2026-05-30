"use client";

import { useCallback, useEffect, useRef } from "react";

// 「かさかさ」という心地よい紙の摩擦音を Web Audio で合成して鳴らす。
// 音源ファイルを持たず、帯域を絞ったノイズの粒を数粒、ゆっくり重ねることで
// 紙がこすれる質感を表現する。ユーザーのタップ（ジェスチャ）契機で鳴らす想定。

type RustleOptions = {
  // 全体の音量（控えめに）。0〜1
  gain?: number;
  // 粒の数。多いほど長く擦れる感じになる
  grains?: number;
};

export function usePaperRustle() {
  const ctxRef = useRef<AudioContext | null>(null);

  // 後始末
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const play = useCallback((opts: RustleOptions = {}) => {
    if (typeof window === "undefined") return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;

    let ctx = ctxRef.current;
    if (!ctx) {
      try {
        ctx = new AC();
      } catch {
        return;
      }
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const master = ctx.createGain();
    master.gain.value = opts.gain ?? 0.06;
    master.connect(ctx.destination);

    const now = ctx.currentTime;
    const grains = opts.grains ?? 6;

    for (let i = 0; i < grains; i++) {
      const start = now + i * 0.075 + Math.random() * 0.025;
      const dur = 0.05 + Math.random() * 0.05;

      const frames = Math.max(1, Math.ceil(ctx.sampleRate * dur));
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < frames; j++) data[j] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      // 高めの帯域を強調すると「紙」らしい乾いた擦れになる
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1400;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2600 + Math.random() * 2200;
      bp.Q.value = 0.6;

      const g = ctx.createGain();
      const peak = 0.5 + Math.random() * 0.5;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(peak, start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      src.connect(hp);
      hp.connect(bp);
      bp.connect(g);
      g.connect(master);

      src.start(start);
      src.stop(start + dur + 0.02);
    }
  }, []);

  return play;
}
