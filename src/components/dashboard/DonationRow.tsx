import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { IconPackage } from "@/components/icons";
import type { Urgency } from "@/generated/prisma/enums";

type MetaItem = {
  icon: React.ReactNode;
  text: string;
};

type DonationRowProps = {
  href: string;
  icon?: React.ReactNode;
  foodType: string;
  status: string;
  urgency?: Urgency;
  meta: MetaItem[];
  actions?: React.ReactNode;
};

const URGENCY_LABEL: Partial<Record<Urgency, string>> = {
  HIGH: "High urgency",
  CRITICAL: "Critical",
};

export function DonationRow({ href, icon, foodType, status, urgency, meta, actions }: DonationRowProps) {
  const showUrgency = urgency === "HIGH" || urgency === "CRITICAL";

  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius)] border border-border bg-surface-2 text-text-dim">
          <span className="[&>svg]:h-5 [&>svg]:w-5">{icon ?? <IconPackage />}</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            {actions ? (
              <Link href={href} className="font-display truncate font-semibold hover:text-accent">
                {foodType}
              </Link>
            ) : (
              <span className="font-display truncate font-semibold">{foodType}</span>
            )}
            <StatusBadge status={status} />
            {showUrgency && (
              <span
                className={`font-mono text-[0.68rem] uppercase tracking-wide ${
                  urgency === "CRITICAL" ? "text-accent" : "text-text-dim"
                }`}
              >
                {URGENCY_LABEL[urgency!]}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-col gap-1 text-sm text-text-dim sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
            {meta.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{m.icon}</span>
                {m.text}
              </span>
            ))}
          </div>
        </div>
      </div>
      {actions && <div className="flex flex-none gap-2">{actions}</div>}
    </>
  );

  const rowClass =
    "flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4 transition-colors";

  if (!actions) {
    return (
      <Link href={href} className={`${rowClass} hover:border-accent`}>
        {inner}
      </Link>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}
