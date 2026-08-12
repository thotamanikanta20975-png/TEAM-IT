"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { matchDonation } from "@/lib/matching";
import { geocodeAddress } from "@/lib/geocode";

const schema = z.object({
  foodType: z.string().trim().min(2, "Describe what kind of food this is."),
  quantity: z.coerce.number().positive("Enter a quantity greater than 0."),
  unit: z.enum(["kg", "meals", "servings", "liters"], {
    error: "Choose a unit.",
  }),
  description: z.string().trim().optional(),
  pickupAddress: z.string().trim().min(4, "Enter a pickup address."),
  expiryAt: z.string().refine((v) => new Date(v).getTime() > Date.now(), {
    message: "Pickup deadline needs to be in the future.",
  }),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  photoUrl: z.string().trim().optional(),
});

export type CreateDonationState = { error?: string };

export async function createDonation(
  _prevState: CreateDonationState,
  formData: FormData
): Promise<CreateDonationState> {
  const profile = await requireRole("DONOR");

  const parsed = schema.safeParse({
    foodType: formData.get("foodType"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    description: formData.get("description") || undefined,
    pickupAddress: formData.get("pickupAddress"),
    expiryAt: formData.get("expiryAt"),
    urgency: formData.get("urgency"),
    photoUrl: formData.get("photoUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const geocoded = await geocodeAddress(parsed.data.pickupAddress);

  const donation = await prisma.donation.create({
    data: {
      donorId: profile.id,
      foodType: parsed.data.foodType,
      quantity: parsed.data.quantity,
      unit: parsed.data.unit,
      description: parsed.data.description || null,
      pickupAddress: parsed.data.pickupAddress,
      expiryAt: new Date(parsed.data.expiryAt),
      urgency: parsed.data.urgency,
      photoUrl: parsed.data.photoUrl || null,
      lat: geocoded?.lat ?? profile.lat,
      lng: geocoded?.lng ?? profile.lng,
    },
  });

  await prisma.statusHistory.create({
    data: { donationId: donation.id, status: "POSTED", changedById: profile.id },
  });

  await matchDonation(donation.id);

  redirect("/dashboard/donor");
}
