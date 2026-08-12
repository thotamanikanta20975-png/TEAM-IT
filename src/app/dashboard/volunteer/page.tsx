import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DonationRow } from "@/components/dashboard/DonationRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LifecycleTracker, type LifecycleStage } from "@/components/LifecycleTracker";
import { IconInbox, IconMapPin, IconPackage, IconBike } from "@/components/icons";
import { acceptPickup, markPickedUp, markDelivered } from "./actions";

// donation.status jumps straight to COMPLETED on delivery (see
// volunteer/actions.ts markDelivered) — "Delivered" is this stage's label,
// not a status value the donation ever literally holds.
const PICKUP_STAGES: LifecycleStage[] = [
  { status: "VOLUNTEER_ASSIGNED", label: "Assigned", activeLabel: "On the way" },
  { status: "PICKED_UP", label: "Picked up" },
  { status: "COMPLETED", label: "Delivered" },
];

export default async function VolunteerDashboardPage() {
  const profile = await requireRole("VOLUNTEER");

  const [available, mine] = await Promise.all([
    prisma.donation.findMany({
      where: { status: "ACCEPTED_BY_NGO", assignedVolunteerId: null },
      orderBy: { expiryAt: "asc" },
      include: { donor: true, matchedNgo: { include: { profile: true } } },
    }),
    prisma.donation.findMany({
      where: { assignedVolunteerId: profile.id, status: { in: ["VOLUNTEER_ASSIGNED", "PICKED_UP"] } },
      orderBy: { expiryAt: "asc" },
      include: { donor: true, matchedNgo: { include: { profile: true } } },
    }),
  ]);

  return (
    <div>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-3 before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent-3">
        Volunteer dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        Welcome, {profile.fullName.split(" ")[0]}
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">
          Your pickups ({mine.length})
        </h2>
        {mine.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title="Nothing assigned yet"
            body="Accept an available pickup below."
          />
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {mine.map((d) => (
              <DonationRow
                key={d.id}
                href={`/dashboard/donations/${d.id}`}
                foodType={d.foodType}
                status={d.status}
                urgency={d.urgency}
                meta={[
                  {
                    icon: <IconPackage />,
                    text: `${d.quantity} ${d.unit} · ${d.donor.fullName} → ${d.matchedNgo?.organizationName}`,
                  },
                  { icon: <IconMapPin />, text: `Pickup: ${d.pickupAddress}` },
                ]}
                footer={
                  <div className="max-w-xs">
                    <LifecycleTracker stages={PICKUP_STAGES} currentStatus={d.status} />
                  </div>
                }
                actions={
                  <>
                    {d.status === "VOLUNTEER_ASSIGNED" && (
                      <form action={markPickedUp.bind(null, d.id)}>
                        <button
                          type="submit"
                          className="rounded-[var(--radius)] bg-accent-3 px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                        >
                          Mark picked up
                        </button>
                      </form>
                    )}
                    {d.status === "PICKED_UP" && (
                      <form action={markDelivered.bind(null, d.id)}>
                        <button
                          type="submit"
                          className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                        >
                          Mark delivered
                        </button>
                      </form>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold">
          Available pickups ({available.length})
        </h2>
        {available.length === 0 ? (
          <EmptyState icon={<IconBike className="h-5 w-5" />} title="Nothing waiting for a volunteer right now" />
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {available.map((d) => (
              <DonationRow
                key={d.id}
                href={`/dashboard/donations/${d.id}`}
                foodType={d.foodType}
                status={d.status}
                urgency={d.urgency}
                meta={[
                  {
                    icon: <IconPackage />,
                    text: `${d.quantity} ${d.unit} · ${d.donor.fullName} → ${d.matchedNgo?.organizationName}`,
                  },
                  { icon: <IconMapPin />, text: d.pickupAddress },
                ]}
                actions={
                  <form action={acceptPickup.bind(null, d.id)}>
                    <button
                      type="submit"
                      className="rounded-[var(--radius)] bg-accent-3 px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                    >
                      Accept pickup
                    </button>
                  </form>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
