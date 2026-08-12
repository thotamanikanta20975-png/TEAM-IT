"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { IconChevronDown, IconClock, IconMapPin, IconPackage } from "@/components/icons";
import { createDonation, type CreateDonationState } from "./actions";

const initialState: CreateDonationState = {};

const URGENCY_OPTIONS = [
  { value: "LOW", label: "Low", hint: "Good for a couple of days", tone: "border-border text-text-dim" },
  { value: "MEDIUM", label: "Medium", hint: "Best within the day", tone: "border-accent-3 bg-accent-3/10 text-accent-3" },
  { value: "HIGH", label: "High", hint: "Pickup within hours", tone: "border-accent-2 bg-accent-2/10 text-accent-2" },
  { value: "CRITICAL", label: "Critical", hint: "Spoiling very soon", tone: "border-danger bg-danger/10 text-danger" },
] as const;

export function NewDonationForm() {
  const [state, formAction, pending] = useActionState(createDonation, initialState);
  const [photoUrl, setPhotoUrl] = useState("");
  const [urgency, setUrgency] = useState<(typeof URGENCY_OPTIONS)[number]["value"]>("MEDIUM");

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-2 text-accent-2">
          <IconPackage className="h-4 w-4" />
          <h2 className="font-display text-sm font-semibold text-text-dim">The food</h2>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="What's the food?" name="foodType" placeholder="Prepared meals, produce, bakery…" required />
            <Select label="Unit" name="unit" required defaultValue="kg">
              <option value="kg">kg</option>
              <option value="meals">meals</option>
              <option value="servings">servings</option>
              <option value="liters">liters</option>
            </Select>
          </div>
          <Field label="Quantity" name="quantity" type="number" min="0" step="0.1" required />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-text-dim">Additional notes (optional)</span>
            <textarea
              name="description"
              rows={3}
              placeholder="Anything an NGO or volunteer should know — allergens, packaging, best pickup time…"
              className="resize-none rounded-[var(--radius)] border border-border bg-bg px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
            />
          </label>
          <div>
            <span className="mb-1.5 block text-sm text-text-dim">Photo (optional)</span>
            <ImageUploader folder="/donations" label="Add a food photo" onUploaded={(url) => setPhotoUrl(url)} />
            <input type="hidden" name="photoUrl" value={photoUrl} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center gap-2 text-accent">
          <IconMapPin className="h-4 w-4" />
          <h2 className="font-display text-sm font-semibold text-text-dim">Pickup details</h2>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <Field label="Pickup address" name="pickupAddress" placeholder="Street, area, city" required />
          <Field label="Pickup deadline" name="expiryAt" type="datetime-local" required />

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-text-dim">
              <IconClock className="h-3.5 w-3.5" /> Urgency
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {URGENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-[var(--radius)] border px-3 py-2.5 text-center text-sm transition-colors ${
                    urgency === opt.value ? opt.tone : "border-border bg-bg text-text-dim hover:text-text"
                  }`}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={opt.value}
                    checked={urgency === opt.value}
                    onChange={() => setUrgency(opt.value)}
                    className="sr-only"
                  />
                  <span className="block font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-text-dim">
              {URGENCY_OPTIONS.find((o) => o.value === urgency)?.hint}
            </p>
          </div>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-[var(--radius)] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg shadow-[0_4px_14px_rgba(47,107,69,0.25)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Posting & matching…" : "Post donation"}
      </button>
    </form>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-dim">{label}</span>
      <input
        {...props}
        className="rounded-[var(--radius)] border border-border bg-bg px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
      />
    </label>
  );
}

function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-dim">{label}</span>
      <span className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-[var(--radius)] border border-border bg-bg px-3.5 py-2.5 pr-9 text-text outline-none focus-visible:border-accent"
        >
          {children}
        </select>
        <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-text-dim" />
      </span>
    </label>
  );
}
