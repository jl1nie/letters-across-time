"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per char
  pauseAfter?: Record<string, number>;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
};

const DEFAULT_PAUSE: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  m["、"] = 280;
  m["。"] = 520;
  m["\n"] = 380;
  m["?"] = 420;
  m["？"] = 420; // ？
  m["!"] = 420;
  m["！"] = 420; // ！
  return m;
})();

export function Typewriter({
  text,
  speed = 70,
  pauseAfter = DEFAULT_PAUSE,
  startDelay = 0,
  onDone,
  className,
}: Props) {
  const [shown, setShown] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setShown(text);
      onDone?.();
      return;
    }
    let cancelled = false;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        onDone?.();
        return;
      }
      const ch = text[i];
      i += 1;
      setShown(text.slice(0, i));
      const extra = pauseAfter[ch] ?? 0;
      timer = setTimeout(tick, speed + extra);
    };

    const initial = setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(initial);
      clearTimeout(timer!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced]);

  return (
    <span className={className}>
      {shown.split("\n").map((line, idx, arr) => (
        <span key={idx}>
          {line}
          {idx < arr.length - 1 && <br />}
        </span>
      ))}
      {!reduced && shown.length < text.length && (
        <span
          aria-hidden
          className="inline-block w-[1px] h-[1.2em] align-[-0.2em] ml-[2px] bg-[color:var(--foreground)] animate-pulse"
        />
      )}
    </span>
  );
}
