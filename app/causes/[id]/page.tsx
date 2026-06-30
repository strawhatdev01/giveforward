import Link from "next/link";
import { notFound } from "next/navigation";
import { getCause, donations, formatNaira } from "@/lib/data";

export default async function CausePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cause = getCause(id);
  if (!cause) notFound();

  const pct = Math.round((cause.raised / cause.goal) * 100);
  const causeDonations = donations.filter((d) => d.causeId === cause.id);

  return (
    <main className="pb-28">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-sm">
          ←
        </Link>
        <p className="text-base font-medium">Cause details</p>
      </div>

      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 text-6xl">
        {cause.emoji}
        {cause.verified && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] text-white">
            Verified cause
          </span>
        )}
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-lg font-medium leading-snug">{cause.title}</h1>
        <p className="mt-0.5 text-sm text-stone-500">{cause.org}</p>

        <div className="mt-4">
          <p className="text-xl font-medium text-emerald-700">{formatNaira(cause.raised)} raised</p>
          <p className="text-sm text-stone-500">of {formatNaira(cause.goal)} goal · {cause.donorCount} donors</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-stone-50 px-2 py-2.5 text-center">
            <p className="text-sm font-medium">{cause.donorCount}</p>
            <p className="text-[10px] text-stone-500">Donors</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-2 py-2.5 text-center">
            <p className="text-sm font-medium">{pct}%</p>
            <p className="text-[10px] text-stone-500">Funded</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-2 py-2.5 text-center">
            <p className="text-sm font-medium">{cause.daysLeft}d</p>
            <p className="text-[10px] text-stone-500">Left</p>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="mb-1.5 text-sm font-medium">The story</h2>
          <p className="text-sm leading-relaxed text-stone-600">{cause.story}</p>
        </div>

        <div className="mt-5">
          <h2 className="mb-1.5 text-sm font-medium">Recent donations</h2>
          <div className="divide-y divide-stone-100">
            {causeDonations.map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-medium text-emerald-700">
                  {d.donorName === "Anonymous" ? "AN" : d.donorName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{d.donorName}</p>
                  <p className="text-xs text-stone-400">{d.timestamp}</p>
                </div>
                <p className="text-sm font-medium text-emerald-700">{formatNaira(d.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-stone-200 bg-white p-4">
        <Link
          href={`/causes/${cause.id}/donate`}
          className="block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-medium text-white"
        >
          Donate now
        </Link>
      </div>
    </main>
  );
}
