"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type SignUpState } from "./actions";
import { IconBike, IconBuilding, IconUser } from "@/components/icons";

const ROLES = [
  {
    value: "DONOR",
    label: "Donor",
    blurb: "Restaurant, hotel, business, or an individual with surplus food.",
    icon: IconUser,
    tone: "accent-2" as const,
  },
  {
    value: "NGO",
    label: "NGO",
    blurb: "Receive and distribute donated food to people who need it.",
    icon: IconBuilding,
    tone: "accent" as const,
  },
  {
    value: "VOLUNTEER",
    label: "Volunteer",
    blurb: "Pick up donations and deliver them to the matched NGO.",
    icon: IconBike,
    tone: "accent-3" as const,
  },
] as const;

const TONE_ACTIVE: Record<string, string> = {
  accent: "border-accent bg-accent/10 text-accent",
  "accent-2": "border-accent-2 bg-accent-2/10 text-accent-2",
  "accent-3": "border-accent-3 bg-accent-3/10 text-accent-3",
};

const initialState: SignUpState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("DONOR");

  return (
    <div className="w-full max-w-md">
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
        Join the rescue
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold text-text">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-dim">
        Already have one?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Account type">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-2xl border px-3 py-3.5 text-center text-sm transition-colors ${
                role === r.value
                  ? TONE_ACTIVE[r.tone]
                  : "border-border bg-surface text-text-dim hover:text-text"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              <r.icon className="mx-auto h-5 w-5" />
              <span className="mt-1.5 block font-medium">{r.label}</span>
            </label>
          ))}
        </div>
        <p className="-mt-3 text-xs text-text-dim">
          {ROLES.find((r) => r.value === role)?.blurb}
        </p>

        <Field label="Full name" name="fullName" type="text" autoComplete="name" required />

        {role === "NGO" && (
          <Field
            label="Organization name"
            name="organizationName"
            type="text"
            autoComplete="organization"
            required
          />
        )}
        {role === "DONOR" && (
          <Field
            label="Organization name (optional)"
            name="organizationName"
            type="text"
            autoComplete="organization"
          />
        )}

        {role === "NGO" && (
          <Field
            label="Address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="Street, area, city"
            hint="Used to find nearby donations — the matching engine needs this to place you on the map."
            required
          />
        )}
        {role === "DONOR" && (
          <Field
            label="Address (optional)"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="Street, area, city"
          />
        )}

        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
        />

        {state.error && (
          <p role="alert" className="rounded-[var(--radius)] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-[var(--radius)] bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-dim">{label}</span>
      <input
        {...props}
        className="rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
      />
      {hint && <span className="text-xs text-text-dim">{hint}</span>}
    </label>
  );
}
