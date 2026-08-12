"use client";

import { useEffect, useRef, useState } from "react";
import { IconBike, IconBuilding, IconHandHeart, IconPackage, IconUser } from "@/components/icons";

const CIRC = 226.2;
const TOTAL_SECONDS = 18 * 60;

const NODES = [
  {
    icon: IconUser,
    tone: "accent-2" as const,
    role: "Donor",
    detail: "Green Leaf Bistro",
  },
  {
    icon: IconPackage,
    tone: "accent-3" as const,
    role: "Posted",
    detail: "42kg of meals",
  },
  {
    icon: IconBuilding,
    tone: "accent" as const,
    role: "NGO",
    detail: "Sunrise Shelter",
  },
  {
    icon: IconBike,
    tone: "accent-3" as const,
    role: "Volunteer",
    detail: "Asha K. · en route",
  },
  {
    icon: IconHandHeart,
    tone: "accent-bright" as const,
    role: "Impact",
    detail: "~80 meals served",
  },
];

const TONE_CLASS: Record<string, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  "accent-2": "border-accent-2/30 bg-accent-2/10 text-accent-2",
  "accent-3": "border-accent-3/30 bg-accent-3/10 text-accent-3",
  "accent-bright": "border-accent-bright/30 bg-accent-bright/10 text-accent-bright",
};

export function RescueWindowSignature() {
  const [elapsed, setElapsed] = useState(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotionRef.current) {
      setElapsed(Math.floor(TOTAL_SECONDS * 0.3));
      return;
    }

    const id = setInterval(() => {
      setElapsed((prev) => (prev + 6) % TOTAL_SECONDS);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(TOTAL_SECONDS - elapsed, 0);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const frac = remaining / TOTAL_SECONDS;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(38,34,30,0.06)] sm:p-7">
      <div
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-bright), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-5">
        <div className="relative h-24 w-24 flex-none">
          <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
            <circle cx="42" cy="42" r="36" fill="none" stroke="var(--surface-2)" strokeWidth="7" />
            <circle
              cx="42"
              cy="42"
              r="36"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - frac)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-base font-semibold tabular-nums text-text">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[0.55rem] uppercase tracking-[0.08em] text-text-dim">
              to pickup
            </span>
          </div>
        </div>
        <div className="text-sm text-text-dim">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Live rescue example
          </span>
          <strong className="mt-1.5 block text-[0.98rem] text-text">
            A donation moving right now
          </strong>
          Prepared meals posted 3 minutes ago — the AI engine already found a
          match, and a volunteer is on the way.
        </div>
      </div>

      <div className="relative mt-7 border-t border-border pt-6">
        <div className="relative">
          <div className="absolute top-6 right-[9%] left-[9%] hidden h-0.5 bg-border sm:block">
            <span className="flow-pulse absolute top-1/2 h-2.5 w-2.5 -mt-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(47,107,69,0.18)]" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-2">
            {NODES.map((node) => (
              <div
                key={node.role}
                className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center"
              >
                <span
                  className={`flex h-12 w-12 flex-none items-center justify-center rounded-full border ${TONE_CLASS[node.tone]}`}
                >
                  <node.icon className="h-5 w-5" />
                </span>
                <div className="sm:mt-0.5">
                  <div className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-text-dim">
                    {node.role}
                  </div>
                  <div className="text-xs font-semibold text-text">{node.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent">
          Matched in 47s by the AI matching engine
        </span>
      </div>
    </div>
  );
}
