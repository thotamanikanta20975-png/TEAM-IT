"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type SignUpState } from "./actions";

const ROLES = [
  {
    value: "DONOR",
    label: "Donor",
    blurb: "Restaurant, hotel, business, or an individual with surplus food.",
  },
  {
    value: "NGO",
    label: "NGO",
    blurb: "Receive and distribute donated food to people who need it.",
  },
  {
    value: "VOLUNTEER",
    label: "Volunteer",
    blurb: "Pick up donations and deliver them to the matched NGO.",
  },
] as const;

const initialState: SignUpState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("DONOR");

  return (
    <div className="w-full max-w-md">
      <span className="eyebrow font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Join the rescue
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold text-text">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-text-dim">
        Already have one?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Account type">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-[var(--radius)] border px-3 py-3 text-center text-sm transition-colors ${
                role === r.value
                  ? "border-accent bg-surface-2 text-text"
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
              {r.label}
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
          <p role="alert" className="text-sm text-accent-3">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-[var(--radius)] bg-accent px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
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
