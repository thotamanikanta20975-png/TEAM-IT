type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  body?: string;
};

export function EmptyState({ icon, title, body }: EmptyStateProps) {
  return (
    <div className="mt-5 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-2 text-text-dim">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{title}</p>
        {body && <p className="mt-1 max-w-sm text-sm text-text-dim">{body}</p>}
      </div>
    </div>
  );
}
