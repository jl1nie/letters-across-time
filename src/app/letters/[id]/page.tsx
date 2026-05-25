import { senpai } from "@/data/senpai";
import { notFound } from "next/navigation";
import { LetterView } from "./LetterView";

export function generateStaticParams() {
  return senpai.map((l) => ({ id: l.id }));
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const letter = senpai.find((l) => l.id === id);
  if (!letter) notFound();
  const idx = senpai.findIndex((l) => l.id === id);
  const next = senpai[(idx + 1) % senpai.length];
  return <LetterView letter={letter} nextId={next.id} />;
}
