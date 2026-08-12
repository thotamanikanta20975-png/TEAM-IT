"use client";

import { useEffect, useRef, useState } from "react";

const CIRC = 326.7;
const TOTAL_SECONDS = 18 * 60;

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
    <div className="fade-up rounded-lg border border-border bg-surface p-6" style={{ animationDelay: ".15s" }}>
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32 flex-none">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--surface-2)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - frac)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-semibold tabular-nums text-text">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.08em] text-text-dim">
              left to pickup
            </span>
          </div>
        </div>
        <div className="text-sm text-text-dim">
          <strong className="mb-1 block text-[0.95rem] text-text">
            Rescue window: Green Leaf Bistro
          </strong>
          42 kg of prepared meals, posted 3 minutes ago. The engine already
          picked a match — a volunteer is en route.
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="relative my-7 mx-1 h-0.5 bg-border">
          <span className="absolute -top-1.5 left-0 h-3.5 w-3.5 rounded-full border-2 border-accent-3 bg-bg" />
          <span className="absolute -top-1.5 left-[46%] h-3.5 w-3.5 rounded-full border-2 border-accent-2 bg-bg" />
          <span className="absolute -top-1.5 left-full h-3.5 w-3.5 -translate-x-full rounded-full border-2 border-accent bg-bg" />
          <span className="route-pulse absolute top-1/2 h-2.5 w-2.5 -mt-1.5 rounded-full bg-accent-2 shadow-[0_0_0_4px_rgba(63,206,154,0.25)]" />
        </div>
        <ul className="flex list-none justify-between p-0 text-xs text-text-dim">
          <li className="max-w-[33%]">
            <span className="block text-[0.82rem] font-semibold text-text">
              Green Leaf Bistro
            </span>
            Donor · posted
          </li>
          <li className="max-w-[33%] text-center">
            <span className="block text-[0.82rem] font-semibold text-text">
              Sunrise Shelter
            </span>
            NGO · accepted
          </li>
          <li className="max-w-[33%] text-right">
            <span className="block text-[0.82rem] font-semibold text-text">
              Asha K.
            </span>
            Volunteer · en route
          </li>
        </ul>
        <span className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius)] border border-accent-2/40 bg-accent-2/10 px-2.5 py-1.5 font-mono text-xs text-accent-2">
          Matched in 47s by the scoring engine
        </span>
      </div>
    </div>
  );
}
