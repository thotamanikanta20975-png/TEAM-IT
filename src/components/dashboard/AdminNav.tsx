import Link from "next/link";

const TABS = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/donors", label: "Donors" },
  { href: "/dashboard/admin/ngos", label: "NGOs" },
  { href: "/dashboard/admin/volunteers", label: "Volunteers" },
  { href: "/dashboard/admin/donations", label: "Donations" },
] as const;

export function AdminNav({ active }: { active: (typeof TABS)[number]["href"] }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-5">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-[var(--radius)] px-3.5 py-1.5 text-sm font-medium transition-colors ${
            tab.href === active
              ? "bg-accent text-bg"
              : "border border-border text-text-dim hover:border-accent hover:text-text"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
