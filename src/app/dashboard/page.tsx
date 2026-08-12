import { redirect } from "next/navigation";
import { requireProfile, dashboardPathForRole } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const profile = await requireProfile();
  redirect(dashboardPathForRole(profile.role));
}
