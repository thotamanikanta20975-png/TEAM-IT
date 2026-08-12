type Tone = "accent" | "accent-2" | "accent-3";

const TONE_TEXT: Record<Tone, string> = {
  accent: "text-accent",
  "accent-2": "text-accent-2",
  "accent-3": "text-accent-3",
};

const TONE_CHIP: Record<Tone, string> = {
  accent: "bg-accent/10 text-accent",
  "accent-2": "bg-accent-2/10 text-accent-2",
  "accent-3": "bg-accent-3/10 text-accent-3",
};

type StatTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: Tone;
};

export function StatTile({ icon, label, value, tone = "accent" }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(38,34,30,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`font-display text-2xl tabular-nums ${TONE_TEXT[tone]}`}>{value}</div>
        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${TONE_CHIP[tone]}`}>
          {icon}
        </span>
      </div>
      <div className="mt-1 text-xs text-text-dim">{label}</div>
    </div>
  );
}
