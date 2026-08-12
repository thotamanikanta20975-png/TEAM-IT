import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatTile } from "@/components/dashboard/StatTile";
import { BarStat } from "@/components/dashboard/BarStat";
import {
  IconBuilding,
  IconCheckCircle,
  IconChartBar,
  IconShieldCheck,
  IconTruck,
  IconUsers,
} from "@/components/icons";
import { verifyNgo } from "./actions";

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

export default async function AdminDashboardPage() {
  const profile = await requireRole("ADMIN");

  const [
    donorCount,
    ngoCount,
    volunteerCount,
    completedCount,
    activeCount,
    statusBreakdown,
    completedTotals,
    pendingNgos,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "DONOR" } }),
    prisma.profile.count({ where: { role: "NGO" } }),
    prisma.profile.count({ where: { role: "VOLUNTEER" } }),
    prisma.donation.count({ where: { status: "COMPLETED" } }),
    prisma.donation.count({
      where: { status: { notIn: ["COMPLETED", "CANCELLED", "EXPIRED"] } },
    }),
    prisma.donation.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.donation.groupBy({
      by: ["unit"],
      where: { status: "COMPLETED" },
      _sum: { quantity: true },
    }),
    prisma.ngoProfile.findMany({
      where: { verified: false },
      include: { profile: true },
      orderBy: { profile: { createdAt: "asc" } },
    }),
  ]);

  const maxStatusCount = Math.max(1, ...statusBreakdown.map((r) => r._count._all));

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Admin dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        Welcome, {profile.fullName.split(" ")[0]}
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={<IconUsers className="h-5 w-5" />} label="Donors" value={donorCount} />
        <StatTile icon={<IconBuilding className="h-5 w-5" />} label="NGOs" value={ngoCount} tone="accent-2" />
        <StatTile icon={<IconTruck className="h-5 w-5" />} label="Volunteers" value={volunteerCount} tone="accent-3" />
        <StatTile icon={<IconCheckCircle className="h-5 w-5" />} label="Rescues completed" value={completedCount} tone="accent-2" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-text-dim">
            <IconChartBar className="h-4 w-4" />
            <h2 className="font-display text-sm font-semibold">Donations by status</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {statusBreakdown.length === 0 ? (
              <p className="text-sm text-text-dim">No donations yet.</p>
            ) : (
              statusBreakdown
                .sort((a, b) => b._count._all - a._count._all)
                .map((row) => (
                  <BarStat
                    key={row.status}
                    label={STATUS_LABEL[row.status] ?? row.status}
                    valueLabel={String(row._count._all)}
                    pct={(row._count._all / maxStatusCount) * 100}
                  />
                ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-text-dim">
            <IconCheckCircle className="h-4 w-4" />
            <h2 className="font-display text-sm font-semibold">Rescued so far (completed)</h2>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {completedTotals.length === 0 ? (
              <p className="text-sm text-text-dim">Nothing completed yet.</p>
            ) : (
              completedTotals.map((row) => (
                <div key={row.unit} className="flex items-center justify-between text-sm">
                  <span className="text-text-dim">{row.unit}</span>
                  <span className="font-mono tabular-nums">{row._sum.quantity ?? 0}</span>
                </div>
              ))
            )}
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm">
              <span className="text-text-dim">Active donations right now</span>
              <span className="font-mono tabular-nums">{activeCount}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">
          NGOs pending verification ({pendingNgos.length})
        </h2>
        {pendingNgos.length === 0 ? (
          <EmptyState
            icon={<IconShieldCheck className="h-5 w-5" />}
            title="No pending verifications"
          />
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {pendingNgos.map((ngo) => (
              <div
                key={ngo.profileId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius)] border border-border bg-surface-2 text-text-dim">
                    <IconBuilding className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="font-display font-semibold">{ngo.organizationName}</span>
                    <p className="mt-1 text-sm text-text-dim">
                      {ngo.profile.fullName} · {ngo.profile.address ?? "no address on file"}
                    </p>
                  </div>
                </div>
                <form action={verifyNgo.bind(null, ngo.profileId)}>
                  <button
                    type="submit"
                    className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                  >
                    Verify
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
