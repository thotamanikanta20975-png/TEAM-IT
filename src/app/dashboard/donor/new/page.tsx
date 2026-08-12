import { requireRole } from "@/lib/auth";
import { NewDonationForm } from "./NewDonationForm";

export default async function NewDonationPage() {
  await requireRole("DONOR");

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        New donation
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">Post surplus food</h1>
      <p className="mt-2 max-w-prose text-sm text-text-dim">
        The matching engine scores every verified NGO the moment you post and
        assigns the best one automatically.
      </p>
      <div className="mt-8">
        <NewDonationForm />
      </div>
    </div>
  );
}
