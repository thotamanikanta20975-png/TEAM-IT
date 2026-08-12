import { requireRole } from "@/lib/auth";
import { NewDonationForm } from "./NewDonationForm";

export default async function NewDonationPage() {
  await requireRole("DONOR");

  return (
    <div>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-2 before:h-[7px] before:w-[7px] before:rounded-full before:bg-accent-2">
        Create food donation
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">What can you rescue today?</h1>
      <p className="mt-2 max-w-prose text-sm text-text-dim">
        The AI matching engine scores every verified NGO the moment you post
        and assigns the best one automatically — usually in under a minute.
      </p>
      <div className="mt-8">
        <NewDonationForm />
      </div>
    </div>
  );
}
