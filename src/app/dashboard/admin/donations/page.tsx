import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/dashboard/AdminNav";
import { DonationRow } from "@/components/dashboard/DonationRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { IconBuilding, IconClock, IconInbox, IconPackage, IconTruck } from "@/components/icons";
import { cancelDonation } from "../actions";
import type { DonationStatus } from "@/generated/prisma/enums";

const TERMINAL: DonationStatus[] = ["COMPLETED", "CANCELLED", "EXPIRED"];

const postedFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminDonationsPage() {
  await requireRole("ADMIN");

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      donor: true,
      matchedNgo: { include: { profile: true } },
      assignedVolunteer: { include: { profile: true } },
    },
  });

  return (
    <div>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
        Admin dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">
        Donations ({donations.length})
      </h1>
      <AdminNav active="/dashboard/admin/donations" />

      {donations.length === 0 ? (
        <EmptyState icon={<IconInbox className="h-5 w-5" />} title="No donations yet" />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {donations.map((donation) => (
            <DonationRow
              key={donation.id}
              href={`/dashboard/donations/${donation.id}`}
              foodType={donation.foodType}
              status={donation.status}
              urgency={donation.urgency}
              meta={[
                {
                  icon: <IconPackage />,
                  text: `${donation.quantity} ${donation.unit} · ${donation.donor.fullName}`,
                },
                ...(donation.matchedNgo
                  ? [{ icon: <IconBuilding />, text: donation.matchedNgo.organizationName }]
                  : []),
                ...(donation.assignedVolunteer
                  ? [{ icon: <IconTruck />, text: donation.assignedVolunteer.profile.fullName }]
                  : []),
                { icon: <IconClock />, text: `posted ${postedFormatter.format(donation.createdAt)}` },
              ]}
              actions={
                TERMINAL.includes(donation.status) ? undefined : (
                  <form action={cancelDonation.bind(null, donation.id)}>
                    <button
                      type="submit"
                      className="rounded-[var(--radius)] border border-border px-4 py-2 text-sm text-text hover:border-danger"
                    >
                      Cancel
                    </button>
                  </form>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
