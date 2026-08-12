"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function acceptPickup(donationId: string) {
  const profile = await requireRole("VOLUNTEER");

  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation || donation.status !== "ACCEPTED_BY_NGO" || donation.assignedVolunteerId) {
    throw new Error("This pickup is no longer available.");
  }

  await prisma.$transaction([
    prisma.donation.update({
      where: { id: donationId },
      data: { status: "VOLUNTEER_ASSIGNED", assignedVolunteerId: profile.id },
    }),
    prisma.statusHistory.create({
      data: { donationId, status: "VOLUNTEER_ASSIGNED", changedById: profile.id },
    }),
  ]);

  revalidatePath("/dashboard/volunteer");
}

async function loadOwnedPickup(donationId: string, volunteerProfileId: string) {
  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation || donation.assignedVolunteerId !== volunteerProfileId) {
    throw new Error("This pickup isn't assigned to you.");
  }
  return donation;
}

export async function markPickedUp(donationId: string) {
  const profile = await requireRole("VOLUNTEER");
  await loadOwnedPickup(donationId, profile.id);

  await prisma.$transaction([
    prisma.donation.update({ where: { id: donationId }, data: { status: "PICKED_UP" } }),
    prisma.statusHistory.create({
      data: { donationId, status: "PICKED_UP", changedById: profile.id },
    }),
  ]);

  revalidatePath("/dashboard/volunteer");
}

export async function markDelivered(donationId: string) {
  const profile = await requireRole("VOLUNTEER");
  await loadOwnedPickup(donationId, profile.id);

  await prisma.$transaction([
    prisma.donation.update({ where: { id: donationId }, data: { status: "COMPLETED" } }),
    prisma.statusHistory.create({
      data: { donationId, status: "DELIVERED", changedById: profile.id },
    }),
    prisma.statusHistory.create({
      data: {
        donationId,
        status: "COMPLETED",
        changedById: profile.id,
        note: "Delivered to the NGO — donation complete.",
      },
    }),
  ]);

  revalidatePath("/dashboard/volunteer");
}
