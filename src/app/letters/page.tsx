import { Suspense } from "react";
import { LettersClient } from "./LettersClient";

export default function LettersPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <LettersClient />
    </Suspense>
  );
}
