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
}
