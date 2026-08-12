import Link from "next/link";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#matching", label: "AI matching" },
  { href: "#roles", label: "Roles" },
  { href: "#map", label: "Live tracking" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold whitespace-nowrap">
          Food<span className="text-accent">Rescue</span>
        </Link>
        <ul className="hidden gap-7 text-sm text-text-dim md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-text">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-[var(--radius)] border border-border px-4 py-2 text-sm text-text hover:border-accent sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
