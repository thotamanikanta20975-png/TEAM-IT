import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DonationRow } from "@/components/dashboard/DonationRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatTile } from "@/components/dashboard/StatTile";
import { IconBuilding, IconClock, IconInbox, IconPackage } from "@/components/icons";

export default async function DonorDashboardPage() {
  const profile = await requireRole("DONOR");

  const donations = await prisma.donation.findMany({
    where: { donorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { matchedNgo: { include: { profile: true } } },
  });

  const activeCount = donations.filter(
    (d) => !["COMPLETED", "CANCELLED", "EXPIRED"].includes(d.status)
  ).length;
  const completedCount = donations.filter((d) => d.status === "COMPLETED").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
            Donor dashboard
          </span>
          <h1 className="font-display mt-2 text-2xl font-semibold">
            Welcome, {profile.fullName.split(" ")[0]}
          </h1>
        </div>
        <Link
          href="/dashboard/donor/new"
          className="rounded-[var(--radius)] bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
        >
          Post a donation
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile icon={<IconPackage className="h-5 w-5" />} label="Total donations" value={donations.length} />
        <StatTile icon={<IconClock className="h-5 w-5" />} label="In progress" value={activeCount} tone="accent-3" />
        <StatTile icon={<IconBuilding className="h-5 w-5" />} label="Completed rescues" value={completedCount} tone="accent-2" />
      </div>

      <h2 className="font-display mt-10 text-lg font-semibold">Your donations</h2>

      {donations.length === 0 ? (
        <EmptyState
          icon={<IconInbox className="h-5 w-5" />}
          title="Nothing posted yet"
          body="Post your first surplus donation and the matching engine will find the nearest NGO for it."
        />
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {donations.map((d) => (
            <DonationRow
              key={d.id}
              href={`/dashboard/donations/${d.id}`}
              foodType={d.foodType}
              status={d.status}
              urgency={d.urgency}
              meta={[
                { icon: <IconPackage />, text: `${d.quantity} ${d.unit}` },
                {
                  icon: <IconClock />,
                  text: `posted ${new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(d.createdAt)}`,
                },
                ...(d.matchedNgo
                  ? [{ icon: <IconBuilding />, text: `matched to ${d.matchedNgo.organizationName}` }]
                  : []),
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
