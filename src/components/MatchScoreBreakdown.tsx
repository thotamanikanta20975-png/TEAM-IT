import { BarStat } from "@/components/dashboard/BarStat";
import { IconSparkle } from "@/components/icons";

export type MatchCandidate = {
  ngoId: string;
  ngoName: string;
  score: number;
  distanceScore: number;
  urgencyScore: number;
  quantityScore: number;
  availabilityScore: number;
  reliabilityScore: number;
  isWinner: boolean;
};

const FACTORS = [
  { key: "distanceScore", label: "Distance" },
  { key: "urgencyScore", label: "Urgency" },
  { key: "quantityScore", label: "Quantity" },
  { key: "availabilityScore", label: "Availability" },
  { key: "reliabilityScore", label: "Reliability" },
] as const;

export function MatchScoreBreakdown({ candidates }: { candidates: MatchCandidate[] }) {
  if (candidates.length === 0) return null;

  const winner = candidates.find((c) => c.isWinner) ?? candidates[0];
  const others = candidates
    .filter((c) => c.ngoId !== winner.ngoId)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-accent-3">
        <IconSparkle className="h-4 w-4" />
        <h2 className="font-display text-sm font-semibold text-text-dim">Why this match</h2>
      </div>
      <p className="mt-1.5 text-sm text-text-dim">
        <span className="font-semibold text-text">{winner.ngoName}</span> scored{" "}
        <span className="font-mono tabular-nums text-text">{winner.score.toFixed(1)}/100</span>
        {others.length > 0 && (
          <>
            {" "}
            against {others.length} other verified NGO{others.length === 1 ? "" : "s"} nearby.
          </>
        )}
      </p>

      <div className="mt-4 flex flex-col gap-3.5">
        {FACTORS.map((f) => (
          <BarStat key={f.key} label={f.label} valueLabel={winner[f.key].toFixed(0)} pct={winner[f.key]} />
        ))}
      </div>

      {others.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <h3 className="text-xs font-semibold tracking-wide text-text-dim uppercase">
            Other candidates considered
          </h3>
          <div className="mt-2.5 flex flex-col gap-1.5">
            {others.map((c) => (
              <div key={c.ngoId} className="flex items-center justify-between text-sm">
                <span className="text-text-dim">{c.ngoName}</span>
                <span className="font-mono tabular-nums text-text-dim">{c.score.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
