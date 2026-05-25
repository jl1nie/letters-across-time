"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.replace(`${base}/`);
  }, []);

  return (
    <main className="flex flex-1 items-center justify-center px-8 py-24 text-center">
      <p className="text-xs tracking-[0.4em] text-[color:var(--muted)] uppercase">
        Redirecting…
      </p>
    </main>
  );
}
