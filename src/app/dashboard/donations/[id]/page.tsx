import { notFound, redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { DonationMap } from "@/components/DonationMap";
import { StatusTimeline } from "@/components/StatusTimeline";
import { LifecycleTracker, type LifecycleStage } from "@/components/LifecycleTracker";
import { MatchScoreBreakdown, type MatchCandidate } from "@/components/MatchScoreBreakdown";
import { IconClock, IconMapPin } from "@/components/icons";

// donation.status skips a literal "DELIVERED" value — markDelivered() in
// volunteer/actions.ts writes a DELIVERED history row but sets the
// donation's own status straight to COMPLETED. Stages here track real
// reachable status values; "Delivered" is just this stage's display label.
const DONATION_LIFECYCLE: LifecycleStage[] = [
  { status: "POSTED", label: "Donated" },
  { status: "MATCHED", label: "Matching" },
  { status: "ACCEPTED_BY_NGO", label: "NGO accepted" },
  { status: "VOLUNTEER_ASSIGNED", label: "Volunteer assigned" },
  { status: "PICKED_UP", label: "Picked up" },
  { status: "COMPLETED", label: "Delivered" },
];

export default async function DonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();

  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      donor: true,
      matchedNgo: { include: { profile: true } },
      assignedVolunteer: { include: { profile: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      matchScores: {
        where: { candidateType: "NGO" },
        orderBy: { score: "desc" },
        include: { ngo: { include: { profile: true } } },
      },
    },
  });

  if (!donation) notFound();

  const canView =
    profile.role === "ADMIN" ||
    profile.id === donation.donorId ||
    profile.id === donation.matchedNgoId ||
    profile.id === donation.assignedVolunteerId;

  if (!canView) redirect("/dashboard");

  const pins = [
    donation.lat != null && donation.lng != null
      ? { lat: donation.lat, lng: donation.lng, label: "Pickup", color: "#e07b39" }
      : null,
    donation.matchedNgo?.profile.lat != null && donation.matchedNgo?.profile.lng != null
      ? {
          lat: donation.matchedNgo.profile.lat,
          lng: donation.matchedNgo.profile.lng,
          label: donation.matchedNgo.organizationName,
          color: "#2f6b45",
        }
      : null,
  ].filter((p): p is { lat: number; lng: number; label: string; color: string } => p !== null);

  const matchCandidates: MatchCandidate[] = donation.matchScores.map((m) => ({
    ngoId: m.ngoId!,
    ngoName: m.ngo!.organizationName,
    score: m.score,
    distanceScore: m.distanceScore,
    urgencyScore: m.urgencyScore,
    quantityScore: m.quantityScore,
    availabilityScore: m.availabilityScore,
    reliabilityScore: m.reliabilityScore,
    isWinner: m.ngoId === donation.matchedNgoId,
  }));

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-2xl font-semibold">{donation.foodType}</span>
        <StatusBadge status={donation.status} />
      </div>
      <p className="mt-1 text-sm text-text-dim">
        {donation.quantity} {donation.unit} · from {donation.donor.fullName}
        {donation.matchedNgo && <> → {donation.matchedNgo.organizationName}</>}
        {donation.assignedVolunteer && (
          <> · volunteer {donation.assignedVolunteer.profile.fullName}</>
        )}
      </p>

      {donation.description && (
        <p className="mt-4 max-w-prose text-sm text-text-dim">{donation.description}</p>
      )}

      <div className="mt-7 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-display text-sm font-semibold text-text-dim">Rescue lifecycle</h2>
        <div className="mt-5">
          <LifecycleTracker stages={DONATION_LIFECYCLE} currentStatus={donation.status} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-sm font-semibold text-text-dim">Pickup</h2>
          <p className="mt-2 flex items-start gap-1.5 text-sm">
            <IconMapPin className="mt-0.5 h-4 w-4 flex-none text-text-dim" />
            {donation.pickupAddress}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-dim">
            <IconClock className="h-4 w-4 flex-none" />
            Deadline:{" "}
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }).format(donation.expiryAt)}
          </p>

          <h2 className="font-display mt-6 text-sm font-semibold text-text-dim">Timeline</h2>
          <div className="mt-3">
            <StatusTimeline entries={donation.statusHistory} />
          </div>
        </div>

        <div>
          <h2 className="font-display mb-2 text-sm font-semibold text-text-dim">Map</h2>
          <DonationMap pins={pins} />
        </div>
      </div>

      {matchCandidates.length > 0 && (
        <div className="mt-8">
          <MatchScoreBreakdown candidates={matchCandidates} />
        </div>
      )}
    </div>
  );
}
