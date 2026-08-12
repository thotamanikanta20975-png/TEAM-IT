import { StatusBadge } from "@/components/StatusBadge";
import { IconCheckCircle } from "@/components/icons";

export type LifecycleStage = {
  status: string;
  label: string;
  /** Shown instead of `label` only while this stage is the current one. */
  activeLabel?: string;
};

const TERMINAL_FAILURE = new Set(["CANCELLED", "EXPIRED"]);

export function LifecycleTracker({
  stages,
  currentStatus,
}: {
  stages: LifecycleStage[];
  currentStatus: string;
}) {
  if (TERMINAL_FAILURE.has(currentStatus)) {
    return (
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-sm text-danger">
        <StatusBadge status={currentStatus} />
        <span>
          {currentStatus === "CANCELLED"
            ? "This donation was cancelled."
            : "This donation's pickup window expired before it could be rescued."}
        </span>
      </div>
    );
  }

  const currentIndex = stages.findIndex((s) => s.status === currentStatus);

  return (
    <div className="relative">
      <div
        className="absolute top-4 right-[6%] left-[6%] hidden h-0.5 bg-border sm:block"
        aria-hidden="true"
      >
        <div
          className="h-full bg-accent transition-[width] duration-500"
          style={{
            width: currentIndex <= 0 ? "0%" : `${(currentIndex / (stages.length - 1)) * 100}%`,
          }}
        />
      </div>
      <ol
        className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(var(--stage-count),1fr)]"
        style={{ "--stage-count": stages.length } as React.CSSProperties}
      >
        {stages.map((stage, i) => {
          const isDone = currentIndex >= 0 && i < currentIndex;
          const isCurrent = i === currentIndex;
          const label = isCurrent && stage.activeLabel ? stage.activeLabel : stage.label;

          return (
            <li
              key={stage.status}
              className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center"
            >
              <span
                className={`relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 bg-bg text-xs font-semibold ${
                  isDone
                    ? "border-accent bg-accent text-bg"
                    : isCurrent
                      ? "border-accent text-accent shadow-[0_0_0_4px_rgba(47,107,69,0.15)]"
                      : "border-border text-text-dim"
                }`}
              >
                {isDone ? <IconCheckCircle className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`text-xs font-medium ${isCurrent || isDone ? "text-text" : "text-text-dim"}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
