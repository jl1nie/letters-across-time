import { Suspense } from "react";
import { BatonClient } from "./BatonClient";

export default function BatonPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <BatonClient />
    </Suspense>
  );
}
