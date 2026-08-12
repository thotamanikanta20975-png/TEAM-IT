"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { matchDonation } from "@/lib/matching";

async function loadOwnedMatch(donationId: string, ngoProfileId: string) {
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation || donation.matchedNgoId !== ngoProfileId) {
    throw new Error("This donation isn't matched to you.");
  }
  return donation;
}

export async function acceptDonation(donationId: string) {
  const profile = await requireRole("NGO");
  await loadOwnedMatch(donationId, profile.id);

  await prisma.$transaction([
    prisma.donation.update({
      where: { id: donationId },
      data: { status: "ACCEPTED_BY_NGO" },
    }),
    prisma.statusHistory.create({
      data: { donationId, status: "ACCEPTED_BY_NGO", changedById: profile.id },
    }),
  ]);

  revalidatePath("/dashboard/ngo");
}

export async function declineDonation(donationId: string) {
  const profile = await requireRole("NGO");
  await loadOwnedMatch(donationId, profile.id);

  await prisma.statusHistory.create({
    data: {
      donationId,
      status: "POSTED",
      changedById: profile.id,
      note: "Declined by the matched NGO — re-matching.",
    },
  });

  await matchDonation(donationId, { excludeNgoIds: [profile.id] });

  revalidatePath("/dashboard/ngo");
}
