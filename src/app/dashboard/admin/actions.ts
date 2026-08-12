"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function verifyNgo(ngoProfileId: string) {
  await requireRole("ADMIN");

  await prisma.ngoProfile.update({
    where: { profileId: ngoProfileId },
    data: { verified: true },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/ngos");
}

export async function unverifyNgo(ngoProfileId: string) {
  await requireRole("ADMIN");

  await prisma.ngoProfile.update({
    where: { profileId: ngoProfileId },
    data: { verified: false },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/ngos");
}

export async function setUserActive(profileId: string, active: boolean) {
  const admin = await requireRole("ADMIN");

  if (profileId === admin.id) {
    throw new Error("You can't suspend your own account.");
  }

  const target = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!target) throw new Error("Profile not found.");
  if (target.role === "ADMIN") {
    throw new Error("Admins can't be suspended from this screen.");
  }

  await prisma.profile.update({ where: { id: profileId }, data: { active } });

  revalidatePath("/dashboard/admin/donors");
  revalidatePath("/dashboard/admin/ngos");
  revalidatePath("/dashboard/admin/volunteers");
}

export async function cancelDonation(donationId: string) {
  const admin = await requireRole("ADMIN");

  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation) throw new Error("Donation not found.");
  if (["COMPLETED", "CANCELLED", "EXPIRED"].includes(donation.status)) {
    throw new Error("This donation is already in a terminal state.");
  }

  await prisma.$transaction([
    prisma.donation.update({ where: { id: donationId }, data: { status: "CANCELLED" } }),
    prisma.statusHistory.create({
      data: {
        donationId,
        status: "CANCELLED",
        changedById: admin.id,
        note: "Cancelled by admin.",
      },
    }),
  ]);

  revalidatePath("/dashboard/admin/donations");
  revalidatePath(`/dashboard/donations/${donationId}`);
}
