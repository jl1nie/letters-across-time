import type { Letter } from "@/data/senpai";

export type UserProfile = {
  age: number;
  occupationCategory: Letter["profile"]["occupationCategory"];
  gender?: Letter["profile"]["gender"];
  decisionTheme?: Letter["decision"]["event"];
  decisionText?: string;
};

export function similarityScore(user: UserProfile, letter: Letter): number {
  const ageDiff = Math.abs(user.age - letter.profile.age);
  const ageScore = Math.max(0, 1 - ageDiff / 10); // 10歳差で 0
  const occupationScore =
    user.occupationCategory === letter.profile.occupationCategory ? 1 : 0.3;
  const genderScore = user.gender && user.gender === letter.profile.gender ? 1 : 0.6;
  const eventScore =
    user.decisionTheme && user.decisionTheme === letter.decision.event ? 1 : 0.5;

  return (
    ageScore * 0.4 +
    occupationScore * 0.25 +
    eventScore * 0.25 +
    genderScore * 0.1
  );
}

export function rankBySimilarity(user: UserProfile, letters: Letter[]) {
  return letters
    .map((l) => ({ letter: l, score: similarityScore(user, l) }))
    .sort((a, b) => b.score - a.score);
}
