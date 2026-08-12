import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IconHandHeart, IconLeaf, IconSparkle } from "@/components/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-accent p-12 text-bg lg:flex">
        <div
          className="pointer-events-none absolute -top-20 -left-20 -z-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent-bright), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold">
            FoodRescue
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative">
          <IconLeaf className="h-9 w-9 opacity-90" />
          <p className="font-display mt-5 max-w-[26ch] text-2xl leading-snug font-medium text-balance">
            &ldquo;Your kitchen&rsquo;s surplus is somebody&rsquo;s dinner.&rdquo;
          </p>
          <p className="mt-4 max-w-[38ch] text-sm text-bg/80">
            FoodRescue matches surplus food with verified NGOs and volunteers
            in minutes, so nothing edible goes to waste.
          </p>
        </div>

        <div className="relative flex gap-8 border-t border-bg/20 pt-6">
          <div>
            <div className="font-display text-xl font-semibold">12,480</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-bg/75">
              <IconHandHeart className="h-3.5 w-3.5" /> meals rescued
            </div>
          </div>
          <div>
            <div className="font-display text-xl font-semibold">180</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-bg/75">
              <IconSparkle className="h-3.5 w-3.5" /> NGOs connected
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-bg text-text">
        <header className="border-b border-border lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-lg font-semibold">
              Food<span className="text-accent">Rescue</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
