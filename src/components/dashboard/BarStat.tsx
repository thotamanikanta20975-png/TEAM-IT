type BarStatProps = {
  label: string;
  valueLabel: string;
  pct: number;
  barClassName?: string;
};

export function BarStat({ label, valueLabel, pct, barClassName }: BarStatProps) {
  const width = Math.max(0, Math.min(100, pct));
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
      <span className="text-sm text-text-dim">{label}</span>
      <span className="font-mono text-sm tabular-nums text-text">{valueLabel}</span>
      <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${barClassName ?? "bg-gradient-to-r from-accent-bright to-accent"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
