import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/dashboard/AdminNav";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { IconBuilding, IconShieldCheck } from "@/components/icons";
import { verifyNgo, unverifyNgo, setUserActive } from "../actions";

const joinedFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function AdminNgosPage() {
  await requireRole("ADMIN");

  const ngos = await prisma.profile.findMany({
    where: { role: "NGO" },
    include: {
      ngoProfile: { include: { _count: { select: { matchedDonations: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        Admin dashboard
      </span>
      <h1 className="font-display mt-2 text-2xl font-semibold">NGOs ({ngos.length})</h1>
      <AdminNav active="/dashboard/admin/ngos" />

      {ngos.length === 0 ? (
        <EmptyState icon={<IconBuilding className="h-5 w-5" />} title="No NGOs yet" />
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[var(--radius)] border border-border bg-surface-2 text-text-dim">
                  <IconBuilding className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold">
                      {ngo.ngoProfile?.organizationName ?? ngo.fullName}
                    </span>
                    {ngo.ngoProfile?.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-2/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent-2">
                        <IconShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent">
                        Unverified
                      </span>
                    )}
                    {!ngo.active && (
                      <span className="rounded-full border border-accent-3/40 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent-3">
                        Suspended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-dim">
                    {ngo.fullName} · {ngo.ngoProfile?._count.matchedDonations ?? 0} matched
                    donation{(ngo.ngoProfile?._count.matchedDonations ?? 0) === 1 ? "" : "s"} ·{" "}
                    {ngo.ngoProfile?.capacityKg
                      ? `${ngo.ngoProfile.capacityKg}kg capacity`
                      : "capacity not set"}{" "}
                    · joined {joinedFormatter.format(ngo.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-none flex-wrap gap-2">
                {ngo.ngoProfile &&
                  (ngo.ngoProfile.verified ? (
                    <form action={unverifyNgo.bind(null, ngo.ngoProfile.profileId)}>
                      <button
                        type="submit"
                        className="rounded-[var(--radius)] border border-border px-4 py-2 text-sm text-text hover:border-accent"
                      >
                        Unverify
                      </button>
                    </form>
                  ) : (
                    <form action={verifyNgo.bind(null, ngo.ngoProfile.profileId)}>
                      <button
                        type="submit"
                        className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-semibold text-bg hover:opacity-90"
                      >
                        Verify
                      </button>
                    </form>
                  ))}
                <form action={setUserActive.bind(null, ngo.id, !ngo.active)}>
                  <button
                    type="submit"
                    className={`rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold ${
                      ngo.active
                        ? "border-border text-text hover:border-accent-3"
                        : "border-accent-2 bg-accent-2 text-bg hover:opacity-90"
                    }`}
                  >
                    {ngo.active ? "Suspend" : "Reactivate"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
