const STATUS_LABEL: Record<string, string> = {
  POSTED: "Posted",
  MATCHED: "Matched",
  ACCEPTED_BY_NGO: "Accepted by NGO",
  VOLUNTEER_ASSIGNED: "Volunteer assigned",
  PICKED_UP: "Picked up",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

const STATUS_CLASS: Record<string, string> = {
  POSTED: "border-border text-text-dim",
  MATCHED: "border-accent text-accent",
  ACCEPTED_BY_NGO: "border-accent-3 text-accent-3",
  VOLUNTEER_ASSIGNED: "border-accent-3 text-accent-3",
  PICKED_UP: "border-accent-2 text-accent-2",
  DELIVERED: "border-accent-2 text-accent-2",
  COMPLETED: "border-accent-2 bg-accent-2/10 text-accent-2",
  EXPIRED: "border-accent-3 text-accent-3",
  CANCELLED: "border-border text-text-dim",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide ${
        STATUS_CLASS[status] ?? "border-border text-text-dim"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
