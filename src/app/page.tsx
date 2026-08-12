import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { RescueWindowSignature } from "@/components/marketing/RescueWindowSignature";
import { BarStat } from "@/components/dashboard/BarStat";
import {
  IconBike,
  IconBuilding,
  IconClock,
  IconEye,
  IconHandHeart,
  IconLeaf,
  IconPackage,
  IconShieldCheck,
  IconSparkle,
  IconTarget,
  IconUser,
} from "@/components/icons";

const IMPACT = [
  { num: "12,480", label: "meals rescued" },
  { num: "3,150", label: "food donations posted" },
  { num: "180", label: "NGOs connected" },
  { num: "340", label: "active volunteers" },
  { num: "6.2t", label: "food waste reduced" },
];

const STEPS = [
  {
    icon: IconPackage,
    title: "Donate surplus food",
    body: "Log what's left, how much, and when it needs to move — takes under a minute.",
  },
  {
    icon: IconTarget,
    title: "AI finds the best NGO match",
    body: "A weighted score ranks nearby NGOs by distance, urgency, quantity and reliability, instantly.",
  },
  {
    icon: IconBuilding,
    title: "NGO accepts the donation",
    body: "The matched NGO reviews it against what they can actually use and store right now.",
  },
  {
    icon: IconBike,
    title: "Volunteer picks up the food",
    body: "The nearest available volunteer gets the route and confirms pickup with one tap.",
  },
  {
    icon: IconHandHeart,
    title: "Food reaches people in need",
    body: "Delivered and logged — meals, weight and waste saved roll into real impact numbers.",
  },
];

const FACTORS = [
  { name: "Distance", pct: 30, desc: "Closer NGOs rank higher — pickup time matters more than raw capacity." },
  { name: "Urgency", pct: 25, desc: "Perishables and short windows push a match to the front of the queue." },
  { name: "Quantity", pct: 20, desc: "NGOs are matched to donations they can actually use and store." },
  { name: "Availability", pct: 15, desc: "Only NGOs with open intake right now enter the running." },
  { name: "Reliability", pct: 10, desc: "Pickup and delivery history nudges dependable partners ahead." },
];

const SAMPLE_MATCH = [
  { label: "Distance", value: "2.4 km", pct: 92 },
  { label: "Urgency", value: "High", pct: 88 },
  { label: "Quantity", value: "Excellent fit", pct: 95 },
  { label: "Availability", value: "Open now", pct: 100 },
  { label: "Reliability", value: "95%", pct: 95 },
];

const WHY = [
  { icon: IconLeaf, title: "Reduce food waste", body: "Every rescued donation is food that never reaches a landfill." },
  { icon: IconClock, title: "Faster donation matching", body: "AI scoring finds a suitable NGO in seconds, not hours of phone calls." },
  { icon: IconShieldCheck, title: "Verified NGOs", body: "Every NGO on the platform is admin-verified before it can accept a donation." },
  { icon: IconBike, title: "Volunteer coordination", body: "Pickups route to the nearest available volunteer automatically." },
  { icon: IconEye, title: "Transparent tracking", body: "Every donation has a visible status, from posted to delivered." },
];

const ROLES = [
  {
    title: "Donor",
    tone: "accent-2" as const,
    body: "Post what's left in under a minute, track the pickup live, watch your impact add up.",
    Icon: IconUser,
  },
  {
    title: "NGO",
    tone: "accent" as const,
    body: "Accept matches that fit your capacity, manage intake, coordinate volunteers on the ground.",
    Icon: IconBuilding,
  },
  {
    title: "Volunteer",
    tone: "accent-3" as const,
    body: "Get routed to the nearest pickup, confirm delivery, build a reliability score that earns priority routes.",
    Icon: IconBike,
  },
];

const ROLE_ICON_CLASS: Record<string, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  "accent-2": "border-accent-2/30 bg-accent-2/10 text-accent-2",
  "accent-3": "border-accent-3/30 bg-accent-3/10 text-accent-3",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Nav />

      <main className="mx-auto w-full max-w-6xl px-6">
        <section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Donor <ChainArrow /> NGO <ChainArrow /> Volunteer <ChainArrow /> Community
            </span>
            <h1 className="font-display mt-4 text-[2.5rem] leading-[1.08] font-semibold text-balance md:text-[3.6rem]">
              Turn surplus food into someone&rsquo;s next meal.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1.1rem] text-text-dim">
              FoodRescue connects food donors with verified NGOs and
              volunteers to rescue surplus food before it goes to waste —
              matched by AI, tracked end to end.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link
                href="/signup"
                className="rounded-[var(--radius)] bg-accent px-6 py-3.5 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] transition-opacity hover:opacity-90"
              >
                Donate food
              </Link>
              <Link
                href="/signup"
                className="rounded-[var(--radius)] border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-text transition-colors hover:border-accent"
              >
                Find food rescue
              </Link>
            </div>
            <p className="mt-5 text-xs text-text-dim">
              Free to join as a donor, NGO, or volunteer — no cost, ever.
            </p>
          </div>

          <RescueWindowSignature />
        </section>
      </main>

      <section className="border-y border-border bg-surface-2/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-9 sm:grid-cols-5">
          {IMPACT.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl text-accent tabular-nums md:text-[2rem]">{s.num}</div>
              <div className="mt-1 text-[0.78rem] text-text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHead
          eyebrow="The rescue, step by step"
          title="How FoodRescue works"
          body="Every donation moves through the same five handoffs — each one designed to happen fast, before the food spoils."
        />
        <div className="relative">
          <div className="absolute top-6 right-[8%] left-[8%] hidden h-0.5 bg-border lg:block" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-text-dim">Step {i + 1}</span>
                </div>
                <h3 className="font-display mt-3.5 text-[1.05rem] font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-text-dim">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="matching" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <SectionHead
            eyebrow="Under the hood"
            title="Smart matching for faster food rescue"
            body="The moment a donation is posted, the engine scores every nearby verified NGO on five weighted factors and picks the best fit — no manual phone calls."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
            <div className="flex flex-col gap-5">
              {FACTORS.map((f) => (
                <div key={f.name} className="grid grid-cols-[1fr_44px] items-center gap-x-4 gap-y-1 sm:grid-cols-[140px_1fr_44px]">
                  <span className="text-sm font-semibold sm:order-1">{f.name}</span>
                  <div className="order-3 col-span-2 h-2 overflow-hidden rounded-full bg-surface-2 sm:order-2 sm:col-span-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-bright to-accent"
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-text-dim sm:order-3 text-right">{f.pct}%</span>
                  <p className="order-4 col-span-2 text-xs text-text-dim sm:col-span-3">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-bg p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-accent-3">
                  <IconSparkle className="h-4 w-4" />
                  <span className="font-display text-sm font-semibold text-text-dim">Best NGO match</span>
                </div>
                <span className="font-display text-2xl font-bold text-accent">92%</span>
              </div>
              <p className="mt-1.5 text-sm">
                <span className="font-semibold text-text">Sunrise Shelter</span>
                <span className="text-text-dim"> — matched for this donation</span>
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {SAMPLE_MATCH.map((row) => (
                  <BarStat key={row.label} label={row.label} valueLabel={row.value} pct={row.pct} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHead
          eyebrow="Why it works"
          title="Why FoodRescue?"
          body="Built around one job: get surplus food to people who need it, before it's too late."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <w.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-3.5 text-[1rem] font-semibold">{w.title}</h3>
              <p className="mt-1.5 text-sm text-text-dim">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="roles" className="border-y border-border bg-surface-2/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <SectionHead
            eyebrow="Three people, one handoff"
            title="Built for whoever's moving the food"
            body="Each role sees only what it needs to act fast."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {ROLES.map((role) => (
              <div key={role.title} className="rounded-2xl border border-border bg-surface p-6">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full border ${ROLE_ICON_CLASS[role.tone]}`}>
                  <role.Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display mt-4 text-lg font-semibold">{role.title}</h3>
                <p className="mt-2 text-sm text-text-dim">{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="map" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-border bg-surface p-6 md:grid-cols-2 md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Live logistics
            </span>
            <h2 className="font-display mt-3 text-[1.7rem] font-semibold md:text-[1.9rem] text-balance">
              Every rescue, mapped in real time
            </h2>
            <p className="mt-3 max-w-[42ch] text-text-dim">
              Google Maps tracks the donor, NGO and volunteer from post to
              delivery, so no one&rsquo;s waiting on a phone call to know
              where the food is.
            </p>
          </div>
          <div className="relative h-56">
            <svg viewBox="0 0 320 220" aria-hidden="true" className="h-full w-full">
              <path
                d="M30 170 C 90 60, 150 190, 200 70 S 290 40, 300 30"
                fill="none"
                stroke="var(--accent-3)"
                strokeWidth="2.5"
                strokeDasharray="1 9"
                strokeLinecap="round"
              />
              <circle cx="30" cy="170" r="7" fill="var(--accent-2)" />
              <circle cx="200" cy="70" r="7" fill="var(--accent)" />
              <circle cx="300" cy="30" r="7" fill="var(--accent-3)" />
              <text x="18" y="192" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                Donor
              </text>
              <text x="178" y="58" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                NGO
              </text>
              <text x="262" y="24" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-mono)">
                Volunteer
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 text-center md:py-24">
        <h2 className="font-display text-[1.9rem] font-semibold text-balance md:text-[2.7rem]">
          Have surplus food?
          <br />
          Don&rsquo;t waste it. Rescue it.
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-[var(--radius)] bg-accent px-7 py-3.5 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] transition-opacity hover:opacity-90"
        >
          Start a donation
        </Link>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-11">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <div className="font-display text-lg font-semibold">
                Food<span className="text-accent">Rescue</span>
              </div>
              <p className="mt-2.5 max-w-[30ch] text-sm text-text-dim">
                Surplus food, rescued. AI-matched donors, NGOs and volunteers
                closing the gap between waste and someone&rsquo;s next meal.
              </p>
            </div>
            <FooterCol
              title="Platform"
              links={[
                { href: "#how", label: "How it works" },
                { href: "#matching", label: "AI matching" },
                { href: "#map", label: "Live tracking" },
              ]}
            />
            <FooterCol
              title="For"
              links={[
                { href: "#roles", label: "Donors" },
                { href: "#roles", label: "NGOs" },
                { href: "#roles", label: "Volunteers" },
              ]}
            />
          </div>
          <div className="mt-9 flex flex-wrap justify-between gap-2.5 border-t border-border pt-5 text-xs text-text-dim">
            <span>&copy; 2026 FoodRescue</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChainArrow() {
  return <span aria-hidden="true">&rarr;</span>;
}

function SectionHead({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-10 max-w-[62ch] md:mb-13">
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
        {eyebrow}
      </span>
      <h2 className="font-display mt-2.5 text-[1.7rem] font-semibold text-balance md:text-[2.3rem]">
        {title}
      </h2>
      <p className="mt-3 text-[1.02rem] text-text-dim">{body}</p>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-text-dim">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="hover:text-accent">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
