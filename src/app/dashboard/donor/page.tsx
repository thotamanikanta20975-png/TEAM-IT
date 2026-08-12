import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { estimateMeals } from "@/lib/impact";
import { DonationRow } from "@/components/dashboard/DonationRow";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatTile } from "@/components/dashboard/StatTile";
import { IconBike, IconBuilding, IconClock, IconHandHeart, IconInbox, IconPackage } from "@/components/icons";

export default async function DonorDashboardPage() {
  const profile = await requireRole("DONOR");

  const donations = await prisma.donation.findMany({
    where: { donorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      matchedNgo: { include: { profile: true } },
      assignedVolunteer: { include: { profile: true } },
    },
  });

  const activeCount = donations.filter(
    (d) => !["COMPLETED", "CANCELLED", "EXPIRED"].includes(d.status)
  ).length;
  const completed = donations.filter((d) => d.status === "COMPLETED");
  const mealsRescued = completed.reduce(
    (sum, d) => sum + estimateMeals(d.quantity, d.unit),
    0
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-2 before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent-2">
            Donor dashboard
          </span>
          <h1 className="font-display mt-2 text-2xl font-semibold">
            Welcome, {profile.fullName.split(" ")[0]}
          </h1>
        </div>
        <Link
          href="/dashboard/donor/new"
          className="rounded-[var(--radius)] bg-accent px-5 py-2.5 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] hover:opacity-90"
        >
          Create donation
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={<IconPackage className="h-5 w-5" />} label="Total donations" value={donations.length} tone="accent-2" />
        <StatTile icon={<IconClock className="h-5 w-5" />} label="Active donations" value={activeCount} tone="accent-3" />
        <StatTile icon={<IconBuilding className="h-5 w-5" />} label="Donations completed" value={completed.length} tone="accent" />
        <StatTile
          icon={<IconHandHeart className="h-5 w-5" />}
          label="Meals rescued (est.)"
          value={`~${mealsRescued}`}
          tone="accent"
        />
      </div>

      <h2 className="font-display mt-10 text-lg font-semibold">Your donations</h2>

      {donations.length === 0 ? (
        <EmptyState
          icon={<IconInbox className="h-5 w-5" />}
          title="Nothing posted yet"
          body="Create your first surplus donation and the AI matching engine will find the nearest NGO for it."
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
                ...(d.assignedVolunteer
                  ? [{ icon: <IconBike />, text: `pickup: ${d.assignedVolunteer.profile.fullName}` }]
                  : []),
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
