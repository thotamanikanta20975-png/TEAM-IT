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
  const suspended = searchParams.get("suspended") === "1";

  return (
    <div className="w-full max-w-md">
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent">
        Welcome back
      </span>
      <h1 className="font-display mt-3 text-3xl font-semibold text-text">Sign in</h1>
      <p className="mt-2 text-sm text-text-dim">
        New to FoodRescue?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>

      {justSignedUp && (
        <p className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Check your email to confirm your account, then sign in below.
        </p>
      )}

      {suspended && (
        <p className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          This account has been suspended. Contact an administrator.
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
          <p role="alert" className="rounded-[var(--radius)] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-[var(--radius)] bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
