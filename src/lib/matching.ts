import "server-only";
import { prisma } from "@/lib/prisma";
import { haversineDistanceKm } from "@/lib/geo";

// Weights match the ones shown in the "AI matching engine" section of the
// landing page — keep the two in sync if these change.
const WEIGHTS = {
  distance: 0.3,
  urgency: 0.25,
  quantity: 0.2,
  availability: 0.15,
  reliability: 0.1,
};

const MAX_MATCH_RADIUS_KM = 25;
const URGENCY_HORIZON_HOURS = 72;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function scoreDistance(donorLat: number | null, donorLng: number | null, ngoLat: number | null, ngoLng: number | null) {
  if (donorLat == null || donorLng == null || ngoLat == null || ngoLng == null) {
    // No coordinates on one side yet (Google Maps geocoding isn't wired in
    // yet) — neither reward nor punish, let the other factors decide.
    return 50;
  }
  const km = haversineDistanceKm(donorLat, donorLng, ngoLat, ngoLng);
  return clamp(100 - (km / MAX_MATCH_RADIUS_KM) * 100, 0, 100);
}

function scoreUrgency(expiryAt: Date) {
  const hoursRemaining = (expiryAt.getTime() - Date.now()) / (1000 * 60 * 60);
  return clamp(100 - (hoursRemaining / URGENCY_HORIZON_HOURS) * 100, 0, 100);
}

function scoreQuantity(quantity: number, capacityKg: number | null) {
  if (capacityKg == null || capacityKg <= 0) return 60;
  const ratio = quantity / capacityKg;
  if (ratio > 1.2) return clamp(100 - (ratio - 1.2) * 150, 0, 40);
  if (ratio < 0.05) return 40;
  // Peaks around a donation that uses roughly half of stated capacity.
  const distanceFromIdeal = Math.abs(ratio - 0.5);
  return clamp(100 - distanceFromIdeal * 120, 0, 100);
}

function scoreAvailability(activeAssignedCount: number) {
  return clamp(100 - activeAssignedCount * 20, 20, 100);
}

function scoreReliability(avgRating: number | null) {
  if (avgRating == null) return 70; // neutral for a new NGO with no history yet
  return clamp((avgRating / 5) * 100, 0, 100);
}

const ACTIVE_STATUSES = [
  "MATCHED",
  "ACCEPTED_BY_NGO",
  "VOLUNTEER_ASSIGNED",
  "PICKED_UP",
] as const;

export async function matchDonation(donationId: string, options?: { excludeNgoIds?: string[] }) {
  const donation = await prisma.donation.findUniqueOrThrow({
    where: { id: donationId },
  });

  const candidates = await prisma.ngoProfile.findMany({
    where: {
      verified: true,
      profileId: options?.excludeNgoIds?.length ? { notIn: options.excludeNgoIds } : undefined,
    },
    include: { profile: true },
  });

  if (candidates.length === 0) {
    await prisma.$transaction([
      prisma.donation.update({
        where: { id: donationId },
        data: { status: "POSTED", matchedNgoId: null },
      }),
      prisma.statusHistory.create({
        data: {
          donationId,
          status: "POSTED",
          note: "No verified NGO available right now — back in the queue.",
        },
      }),
    ]);
    return null;
  }

  const [activeCounts, feedbackAverages] = await Promise.all([
    prisma.donation.groupBy({
      by: ["matchedNgoId"],
      where: { matchedNgoId: { not: null }, status: { in: [...ACTIVE_STATUSES] } },
      _count: { _all: true },
    }),
    prisma.feedback.groupBy({
      by: ["toId"],
      _avg: { rating: true },
    }),
  ]);

  const activeCountByNgo = new Map(
    activeCounts.map((row) => [row.matchedNgoId as string, row._count._all])
  );
  const avgRatingByProfile = new Map(
    feedbackAverages.map((row) => [row.toId, row._avg.rating])
  );

  const scored = candidates.map((ngo) => {
    const distanceScore = scoreDistance(
      donation.lat,
      donation.lng,
      ngo.profile.lat,
      ngo.profile.lng
    );
    const urgencyScore = scoreUrgency(donation.expiryAt);
    const quantityScore = scoreQuantity(donation.quantity, ngo.capacityKg);
    const availabilityScore = scoreAvailability(activeCountByNgo.get(ngo.profileId) ?? 0);
    const reliabilityScore = scoreReliability(avgRatingByProfile.get(ngo.profileId) ?? null);

    const score =
      distanceScore * WEIGHTS.distance +
      urgencyScore * WEIGHTS.urgency +
      quantityScore * WEIGHTS.quantity +
      availabilityScore * WEIGHTS.availability +
      reliabilityScore * WEIGHTS.reliability;

    return {
      ngoId: ngo.profileId,
      score,
      distanceScore,
      urgencyScore,
      quantityScore,
      availabilityScore,
      reliabilityScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  await prisma.$transaction([
    prisma.matchScore.createMany({
      data: scored.map((s) => ({
        donationId,
        candidateType: "NGO" as const,
        ngoId: s.ngoId,
        score: s.score,
        distanceScore: s.distanceScore,
        urgencyScore: s.urgencyScore,
        quantityScore: s.quantityScore,
        availabilityScore: s.availabilityScore,
        reliabilityScore: s.reliabilityScore,
      })),
    }),
    prisma.donation.update({
      where: { id: donationId },
      data: { status: "MATCHED", matchedNgoId: best.ngoId },
    }),
    prisma.statusHistory.create({
      data: {
        donationId,
        status: "MATCHED",
        note: `Matched to NGO by the scoring engine (score ${best.score.toFixed(1)}/100).`,
      },
    }),
  ]);

  return best;
}
