"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, type SignInState } from "./actions";

const initialState: SignInState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("confirmEmail") === "1";

  return (
    <div className="w-full max-w-md">
      <span className="eyebrow font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Welcome back
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold text-text">Sign in</h1>
      <p className="mt-2 text-sm text-text-dim">
        New to FoodRescue?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>

      {justSignedUp && (
        <p className="mt-6 rounded-[var(--radius)] border border-accent-2 bg-surface px-4 py-3 text-sm text-accent-2">
          Check your email to confirm your account, then sign in below.
        </p>
      )}

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-dim">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-dim">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
          />
        </label>

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
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
