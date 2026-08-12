import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { RescueWindowSignature } from "@/components/marketing/RescueWindowSignature";

const STEPS = [
  {
    n: "01",
    title: "Donor posts surplus",
    body: "Restaurants, hotels and households log what's left, how much, and when it needs to move.",
  },
  {
    n: "02",
    title: "Engine matches the NGO",
    body: "A weighted score ranks nearby NGOs by distance, urgency, quantity and reliability, live.",
  },
  {
    n: "03",
    title: "Volunteer accepts pickup",
    body: "The nearest available volunteer gets the route and confirms with one tap.",
  },
  {
    n: "04",
    title: "Delivered, impact logged",
    body: "Meals, weight and CO2 saved roll straight into the donor's and NGO's impact stats.",
  },
];

const FACTORS = [
  {
    name: "Distance",
    pct: 30,
    desc: "Closer NGOs rank higher — pickup time matters more than raw capacity.",
  },
  {
    name: "Urgency",
    pct: 25,
    desc: "Perishables and short windows push a match to the front of the queue.",
  },
  {
    name: "Quantity",
    pct: 20,
    desc: "NGOs are matched to donations they can actually use and store.",
  },
  {
    name: "Availability",
    pct: 15,
    desc: "Only NGOs with open intake right now enter the running.",
  },
  {
    name: "Reliability",
    pct: 10,
    desc: "Pickup and delivery history nudges dependable partners ahead.",
  },
];

const ROLES = [
  {
    title: "Donor",
    body: "Post what's left in under a minute, track the pickup live, watch your impact add up.",
    icon: (
      <path d="M3 8l9-5 9 5-9 5-9-5Z M3 8v8l9 5 9-5V8 M12 13v8" />
    ),
  },
  {
    title: "NGO",
    body: "Accept matches that fit your capacity, manage intake, coordinate volunteers on the ground.",
    icon: <path d="M3 21V10l9-6 9 6v11 M9 21v-7h6v7" />,
  },
  {
    title: "Volunteer",
    body: "Get routed to the nearest pickup, confirm delivery, build a reliability score that earns priority routes.",
    icon: (
      <>
        <circle cx="12" cy="9" r="3" />
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Nav />

      <main className="mx-auto w-full max-w-6xl px-6">
        <section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-24">
          <div className="fade-up" style={{ animationDelay: ".05s" }}>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
              AI-matched food rescue, end to end
            </span>
            <h1 className="font-display mt-4 text-[2.4rem] leading-[1.05] font-bold text-balance md:text-[3.4rem]">
              Surplus food has a rescue window.
              <br />
              We close it before it shuts.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1.08rem] text-text-dim">
              FoodRescue&rsquo;s matching engine reads distance, quantity,
              urgency and reliability the moment a donor posts — and puts the
              right NGO and volunteer on it in under two minutes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3.5">
              <Link
                href="/signup"
                className="rounded-[var(--radius)] bg-accent px-6 py-3.5 text-sm font-semibold text-bg hover:opacity-90"
              >
                Post a donation
              </Link>
              <a
                href="#matching"
                className="rounded-[var(--radius)] border border-border px-6 py-3.5 text-sm text-text hover:border-accent"
              >
                See the matching engine
              </a>
            </div>
          </div>

          <RescueWindowSignature />
        </section>
      </main>

      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          <Stat num="12,480" label="meals rescued" />
          <Stat num="6.2t" label="food saved from landfill" />
          <Stat num="90s" label="average match time" />
          <Stat num="340" label="active volunteers" />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHead
          eyebrow="The rescue, step by step"
          title="Four steps, one continuous handoff"
          body="Each donation moves through the same sequence — the order is what keeps food moving before it spoils."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-lg border border-border bg-surface p-5">
              <div className="font-mono text-sm tracking-wide text-accent">{step.n}</div>
              <h3 className="font-display mt-3.5 text-[1.05rem] font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-dim">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="matching" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <SectionHead
            eyebrow="Under the hood"
            title="The matching engine, in plain terms"
            body="Every donation gets scored against every nearby NGO the moment it's posted. Five weighted factors decide who gets the call."
          />
          <div className="flex flex-col gap-5">
            {FACTORS.map((f) => (
              <div key={f.name} className="grid grid-cols-[1fr_44px] items-center gap-x-4 gap-y-1 sm:grid-cols-[140px_1fr_44px]">
                <span className="text-sm font-semibold sm:order-1">{f.name}</span>
                <div className="order-3 col-span-2 h-2 overflow-hidden rounded-full bg-surface-2 sm:order-2 sm:col-span-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent"
                    style={{ width: `${f.pct}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-text-dim sm:order-3 text-right">{f.pct}%</span>
                <p className="order-4 col-span-2 text-xs text-text-dim sm:col-span-3">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <SectionHead
          eyebrow="Three people, one handoff"
          title="Built for whoever's moving the food"
          body="Each role sees only what it needs to act fast."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ROLES.map((role) => (
            <div key={role.title} className="rounded-lg border border-border bg-surface p-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="mb-4 h-8 w-8 text-accent"
              >
                {role.icon}
              </svg>
              <h3 className="font-display text-lg font-semibold">{role.title}</h3>
              <p className="mt-2 text-sm text-text-dim">{role.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="map" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-8 rounded-lg border border-border bg-surface p-6 md:grid-cols-2 md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
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
              <circle cx="30" cy="170" r="7" fill="var(--accent-3)" />
              <circle cx="200" cy="70" r="7" fill="var(--accent-2)" />
              <circle cx="300" cy="30" r="7" fill="var(--accent)" />
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
        <h2 className="font-display text-[1.8rem] font-semibold text-balance md:text-[2.6rem]">
          Your kitchen&rsquo;s surplus is
          <br />
          somebody&rsquo;s dinner.
        </h2>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-[var(--radius)] bg-accent px-7 py-3.5 text-sm font-semibold text-bg hover:opacity-90"
        >
          Start rescuing food
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
                Every rescue window, closed. A matching engine for surplus
                food, built for donors, NGOs and volunteers.
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

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-accent tabular-nums md:text-[2.1rem]">{num}</div>
      <div className="mt-1 text-[0.8rem] text-text-dim">{label}</div>
    </div>
  );
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
