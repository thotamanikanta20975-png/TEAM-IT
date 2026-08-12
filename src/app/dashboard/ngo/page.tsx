import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DonationRow } from "@/components/dashboard/DonationRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { IconCheckCircle, IconClock, IconInbox, IconMapPin, IconTruck } from "@/components/icons";
import { acceptDonation, declineDonation } from "./actions";

export default async function NgoDashboardPage() {
  const profile = await requireRole("NGO");

  const [incoming, inProgress] = await Promise.all([
    prisma.donation.findMany({
      where: { matchedNgoId: profile.id, status: "MATCHED" },
      orderBy: { expiryAt: "asc" },
      include: { donor: true },
    }),
    prisma.donation.findMany({
      where: {
        matchedNgoId: profile.id,
        status: { in: ["ACCEPTED_BY_NGO", "VOLUNTEER_ASSIGNED", "PICKED_UP"] },
      },
      orderBy: { expiryAt: "asc" },
      include: { donor: true, assignedVolunteer: { include: { profile: true } } },
    }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent-2">
            NGO dashboard
          </span>
          <h1 className="font-display mt-2 text-2xl font-semibold">
            Welcome, {profile.fullName.split(" ")[0]}
          </h1>
        </div>
        {profile.ngoProfile && !profile.ngoProfile.verified && (
          <span className="rounded-[var(--radius)] border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent">
            Verification pending
          </span>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">
          Matched to you ({incoming.length})
        </h2>
        <p className="mt-1 text-sm text-text-dim">
          The scoring engine picked you for these. Accept to bring in a
          volunteer, or decline to let it re-match.
        </p>

        {incoming.length === 0 ? (
          <EmptyState
            icon={<IconInbox className="h-5 w-5" />}
            title="Nothing waiting on you right now"
          />
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {incoming.map((d) => (
              <DonationRow
                key={d.id}
                href={`/dashboard/donations/${d.id}`}
                foodType={d.foodType}
                status={d.status}
                urgency={d.urgency}
                meta={[
                  { icon: <IconTruck />, text: `${d.quantity} ${d.unit} from ${d.donor.fullName}` },
                  {
                    icon: <IconClock />,
                    text: `pickup by ${new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(d.expiryAt)}`,
                  },
                  { icon: <IconMapPin />, text: d.pickupAddress },
                ]}
                actions={
                  <>
                    <form action={declineDonation.bind(null, d.id)}>
                      <button
                        type="submit"
                        className="rounded-[var(--radius)] border border-border px-4 py-2 text-sm text-text hover:border-accent-3"
                      >
                        Decline
                      </button>
                    </form>
                    <form action={acceptDonation.bind(null, d.id)}>
                      <button
                        type="submit"
                        className="rounded-[var(--radius)] bg-accent-2 px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                      >
                        Accept
                      </button>
                    </form>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold">
          In progress ({inProgress.length})
        </h2>
        {inProgress.length === 0 ? (
          <EmptyState
            icon={<IconCheckCircle className="h-5 w-5" />}
            title="Nothing accepted yet"
            body="Accepted donations and their volunteers show up here."
          />
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {inProgress.map((d) => (
              <DonationRow
                key={d.id}
                href={`/dashboard/donations/${d.id}`}
                foodType={d.foodType}
                status={d.status}
                urgency={d.urgency}
                meta={[
                  { icon: <IconTruck />, text: `${d.quantity} ${d.unit} from ${d.donor.fullName}` },
                  ...(d.assignedVolunteer
                    ? [{ icon: <IconCheckCircle />, text: `volunteer: ${d.assignedVolunteer.profile.fullName}` }]
                    : []),
                ]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
