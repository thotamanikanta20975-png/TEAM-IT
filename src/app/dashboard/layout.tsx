import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IconBike, IconBuilding, IconShieldCheck, IconUser } from "@/components/icons";
import type { Role } from "@/generated/prisma/enums";

// Donor = warm orange (the giving color), NGO = deep green (verified/trust),
// Volunteer = gold (in-motion), Admin = neutral charcoal (oversight).
const ROLE_STYLE: Record<Role, { tone: string; icon: React.ReactNode }> = {
  DONOR: { tone: "border-accent-2/40 text-accent-2", icon: <IconUser className="h-3.5 w-3.5" /> },
  NGO: { tone: "border-accent/40 text-accent", icon: <IconBuilding className="h-3.5 w-3.5" /> },
  VOLUNTEER: { tone: "border-accent-3/40 text-accent-3", icon: <IconBike className="h-3.5 w-3.5" /> },
  ADMIN: { tone: "border-border text-text-dim", icon: <IconShieldCheck className="h-3.5 w-3.5" /> },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  const roleStyle = ROLE_STYLE[profile.role];
  const initial = profile.fullName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold whitespace-nowrap">
            Food<span className="text-accent">Rescue</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border bg-surface-2 font-display text-sm font-semibold text-text">
                {initial}
              </span>
              <div className="hidden leading-tight sm:block">
                <div className="text-text">{profile.fullName}</div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide ${roleStyle.tone}`}
                >
                  {roleStyle.icon}
                  {profile.role}
                </span>
              </div>
            </div>
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-[var(--radius)] border border-border px-3 py-1.5 text-text hover:border-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
