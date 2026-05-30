"use client";

import { useCallback } from "react";

// 「かさかさ」という心地よい紙の摩擦音を Web Audio で合成して鳴らす。
// 音源ファイルを持たず、帯域を絞ったノイズの粒を数粒、ゆっくり重ねることで
// 紙がこすれる質感を表現する。ユーザーのタップ（ジェスチャ）契機で鳴らす想定。

type RustleOptions = {
  // 全体の音量（控えめに）。0〜1
  gain?: number;
  // 粒の数。多いほど長く擦れる感じになる
  grains?: number;
  // 粒どうしの間隔（秒）。大きいほどゆっくり擦れる
  gap?: number;
};

// AudioContext・master・ノイズ buffer はページ全体で1つだけ生成して使い回す。
// タップのたびに buffer を作って Math.random() で埋めると、特にモバイルで
// CPU 負荷や GC によるオーディオの瞬断（プチノイズ）の原因になるため。
let sharedCtx: AudioContext | null = null;
let sharedMaster: GainNode | null = null;
let sharedNoise: AudioBuffer | null = null;

const NOISE_SECONDS = 1.0;

export function usePaperRustle() {
  return useCallback(async (opts: RustleOptions = {}) => {
    if (typeof window === "undefined") return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;

    // この呼び出しで実際に使った ctx を catch でも参照できるよう外に出す。
    let usedCtx: AudioContext | null = null;

    // 音は演出の付加要素。ブラウザの自動再生制限やデバイスの不具合などで
    // 失敗しても、呼び出し元の主処理（封筒を開く等）を止めないよう、
    // 例外は内部で握りつぶしてここから外へは投げない。
    try {
      // モバイルのバックグラウンド化やシステム割り込みで ctx が closed に
      // なった場合は、それに紐づく master/noise ごと作り直す（旧 ctx の
      // ノードは新しい ctx では使えないため、3つまとめてリセットする）。
      if (sharedCtx && sharedCtx.state === "closed") {
        sharedCtx = null;
        sharedMaster = null;
        sharedNoise = null;
      }

      if (!sharedCtx) sharedCtx = new AC();
      const ctx = sharedCtx;
      usedCtx = ctx;
      // 一時停止中は resume の完了を待ってからスケジュールする。待たずに
      // 積むと currentTime が 0 のまま全粒を同じ時刻に積み、復帰時に同時に
      // 鳴ってしまうことがあるため（モバイル初回タップなど）。
      if (ctx.state === "suspended") await ctx.resume();

      if (!sharedMaster) {
        sharedMaster = ctx.createGain();
        sharedMaster.connect(ctx.destination);
      }
      const master = sharedMaster;
      master.gain.value = opts.gain ?? 0.06;

      // ノイズ source は使い回す共有 buffer のランダムな位置から再生する
      if (!sharedNoise) {
        const frames = Math.ceil(ctx.sampleRate * NOISE_SECONDS);
        sharedNoise = ctx.createBuffer(1, frames, ctx.sampleRate);
        const data = sharedNoise.getChannelData(0);
        for (let j = 0; j < frames; j++) data[j] = Math.random() * 2 - 1;
      }
      const noise = sharedNoise;

      const now = ctx.currentTime;
      const grains = opts.grains ?? 6;
      const gap = opts.gap ?? 0.17;

      for (let i = 0; i < grains; i++) {
        const start = now + i * gap + Math.random() * 0.04;
        const dur = 0.08 + Math.random() * 0.06;

        const src = ctx.createBufferSource();
        src.buffer = noise;

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

        const offset = Math.random() * (NOISE_SECONDS - dur);
        src.start(start, offset, dur);
      }
    } catch {
      // 演出音の失敗は無視する（呼び出し元の主処理は継続させる）。
      // 失敗したこの ctx を閉じて解放する（インスタンス上限対策）。
      // await 中に別の再生呼び出しが新しい ctx を作っている場合があるため、
      // 共有参照のリセットは「今もこの失敗した ctx を指している」ときだけに
      // 限定し、新しく作られた正常な ctx を取り違えて壊さないようにする。
      if (usedCtx) {
        usedCtx.close().catch(() => {});
        if (sharedCtx === usedCtx) {
          sharedCtx = null;
          sharedMaster = null;
          sharedNoise = null;
        }
      }
    }
  }, []);
}
