import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/dashboard/AdminNav";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { IconTruck } from "@/components/icons";
import { setUserActive } from "../actions";

const joinedFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function AdminVolunteersPage() {
  await requireRole("ADMIN");

  const volunteers = await prisma.profile.findMany({
    where: { role: "VOLUNTEER" },
    include: {
      volunteerProfile: { include: { _count: { select: { assignedDonations: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
        Admin dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        Volunteers ({volunteers.length})
      </h1>
      <AdminNav active="/dashboard/admin/volunteers" />

      {volunteers.length === 0 ? (
        <EmptyState icon={<IconTruck className="h-5 w-5" />} title="No volunteers yet" />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius)] border border-border bg-surface-2 text-text-dim">
                  <IconTruck className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold">{volunteer.fullName}</span>
                    {volunteer.volunteerProfile?.available && (
                      <span className="rounded-full border border-accent-2/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent-2">
                        Available
                      </span>
                    )}
                    {!volunteer.active && (
                      <span className="rounded-full border border-danger/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-danger">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-dim">
                    {volunteer.volunteerProfile?.vehicleType || "No vehicle on file"} ·{" "}
                    {volunteer.volunteerProfile?._count.assignedDonations ?? 0} pickup
                    {(volunteer.volunteerProfile?._count.assignedDonations ?? 0) === 1
                      ? ""
                      : "s"}{" "}
                    · reliability{" "}
                    {Math.round(volunteer.volunteerProfile?.reliabilityScore ?? 0)} · joined{" "}
                    {joinedFormatter.format(volunteer.createdAt)}
                  </p>
                </div>
              </div>
              <form action={setUserActive.bind(null, volunteer.id, !volunteer.active)}>
                <button
                  type="submit"
                  className={`rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold ${
                    volunteer.active
                      ? "border-border text-text hover:border-danger"
                      : "border-accent bg-accent text-bg hover:opacity-90"
                  }`}
                >
                  {volunteer.active ? "Suspend" : "Reactivate"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
