import { StatusBadge } from "@/components/StatusBadge";

type TimelineEntry = {
  id: string;
  status: string;
  note?: string | null;
  createdAt: Date;
};

export function StatusTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="flex flex-col">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1;
        const isCurrent = isLast;
        return (
          <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="flex flex-none flex-col items-center">
              <span
                className={`mt-1 h-3 w-3 flex-none rounded-full border-2 bg-bg ${
                  isCurrent ? "border-accent shadow-[0_0_0_4px_rgba(242,169,60,0.2)]" : "border-accent-2"
                }`}
              />
              {!isLast && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={entry.status} />
                <span className="font-mono text-xs text-text-dim">
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(entry.createdAt)}
                </span>
              </div>
              {entry.note && <p className="mt-1.5 text-sm text-text-dim">{entry.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
