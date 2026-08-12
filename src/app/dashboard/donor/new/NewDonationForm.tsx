"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { IconChevronDown } from "@/components/icons";
import { createDonation, type CreateDonationState } from "./actions";

const initialState: CreateDonationState = {};

const URGENCY_OPTIONS = [
  { value: "LOW", label: "Low — good for a couple of days" },
  { value: "MEDIUM", label: "Medium — best within the day" },
  { value: "HIGH", label: "High — needs pickup within hours" },
  { value: "CRITICAL", label: "Critical — spoiling very soon" },
];

export function NewDonationForm() {
  const [state, formAction, pending] = useActionState(createDonation, initialState);
  const [photoUrl, setPhotoUrl] = useState("");

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
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
        <span className="text-text-dim">Description (optional)</span>
        <textarea
          name="description"
          rows={3}
          className="resize-none rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
        />
      </label>

      <Field label="Pickup address" name="pickupAddress" placeholder="Street, area, city" required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Pickup deadline" name="expiryAt" type="datetime-local" required />
        <Select label="Urgency" name="urgency" required defaultValue="MEDIUM">
          {URGENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <span className="mb-1.5 block text-sm text-text-dim">Photo (optional)</span>
        <ImageUploader
          folder="/donations"
          onUploaded={(url) => setPhotoUrl(url)}
        />
        <input type="hidden" name="photoUrl" value={photoUrl} />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-accent-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
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
        className="rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 text-text outline-none focus-visible:border-accent"
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
          className="w-full appearance-none rounded-[var(--radius)] border border-border bg-surface px-3.5 py-2.5 pr-9 text-text outline-none focus-visible:border-accent"
        >
          {children}
        </select>
        <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-text-dim" />
      </span>
    </label>
  );
}
