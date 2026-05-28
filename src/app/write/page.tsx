import { Suspense } from "react";
import { WriteClient } from "./WriteClient";

export default function WritePage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <WriteClient />
    </Suspense>
  );
}
