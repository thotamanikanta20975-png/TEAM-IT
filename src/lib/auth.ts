import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      donorProfile: true,
      ngoProfile: true,
      volunteerProfile: true,
    },
  });
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.active) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login?suspended=1");
  }
  return profile;
}

export async function requireRole(role: Role) {
  const profile = await requireProfile();
  if (profile.role !== role) redirect("/dashboard");
  return profile;
}

export function dashboardPathForRole(role: Role) {
  switch (role) {
    case "DONOR":
      return "/dashboard/donor";
    case "NGO":
      return "/dashboard/ngo";
    case "VOLUNTEER":
      return "/dashboard/volunteer";
    case "ADMIN":
      return "/dashboard/admin";
  }
}
