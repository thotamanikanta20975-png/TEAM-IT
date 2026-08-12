import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold">
            Food<span className="text-accent">Rescue</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        {children}
      </main>
    </div>
  );
}
