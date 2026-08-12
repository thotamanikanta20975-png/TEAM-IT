import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/dashboard/AdminNav";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { IconUser, IconUsers } from "@/components/icons";
import { setUserActive } from "../actions";

const joinedFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function AdminDonorsPage() {
  await requireRole("ADMIN");

  const donors = await prisma.profile.findMany({
    where: { role: "DONOR" },
    include: {
      donorProfile: true,
      _count: { select: { donationsPosted: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Admin dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">Donors ({donors.length})</h1>
      <AdminNav active="/dashboard/admin/donors" />

      {donors.length === 0 ? (
        <EmptyState icon={<IconUsers className="h-5 w-5" />} title="No donors yet" />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius)] border border-border bg-surface-2 text-text-dim">
                  <IconUser className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold">{donor.fullName}</span>
                    {!donor.active && (
                      <span className="rounded-full border border-accent-3/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent-3">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-dim">
                    {donor.donorProfile?.organizationName || "Individual"} ·{" "}
                    {donor._count.donationsPosted} donation
                    {donor._count.donationsPosted === 1 ? "" : "s"} · joined{" "}
                    {joinedFormatter.format(donor.createdAt)}
                  </p>
                </div>
              </div>
              <form action={setUserActive.bind(null, donor.id, !donor.active)}>
                <button
                  type="submit"
                  className={`rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold ${
                    donor.active
                      ? "border-border text-text hover:border-accent-3"
                      : "border-accent-2 bg-accent-2 text-bg hover:opacity-90"
                  }`}
                >
                  {donor.active ? "Suspend" : "Reactivate"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
