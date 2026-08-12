import type { Urgency } from "@/generated/prisma/enums";

type MatchChipsProps = {
  score: number;
  distanceScore: number;
  quantityScore: number;
  availabilityScore: number;
  urgency: Urgency;
};

export function MatchChips({ score, distanceScore, quantityScore, availabilityScore, urgency }: MatchChipsProps) {
  const chips: string[] = [];
  if (distanceScore >= 70) chips.push("Nearby");
  if (urgency === "CRITICAL") chips.push("Critical urgency");
  else if (urgency === "HIGH") chips.push("High urgency");
  if (quantityScore >= 60) chips.push("Good quantity fit");
  if (availabilityScore >= 80) chips.push("You're available");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
        {Math.round(score)}% match
      </span>
      {chips.map((c) => (
        <span
          key={c}
          className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-dim"
        >
          {c}
        </span>
      ))}
    </div>
  );
}
