type Tone = "accent" | "accent-2" | "accent-3";

const TONE_TEXT: Record<Tone, string> = {
  accent: "text-accent",
  "accent-2": "text-accent-2",
  "accent-3": "text-accent-3",
};

type StatTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: Tone;
};

export function StatTile({ icon, label, value, tone = "accent" }: StatTileProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={`font-display text-2xl tabular-nums ${TONE_TEXT[tone]}`}>{value}</div>
        <span className={`opacity-80 ${TONE_TEXT[tone]}`}>{icon}</span>
      </div>
      <div className="mt-1 text-xs text-text-dim">{label}</div>
    </div>
  );
}
