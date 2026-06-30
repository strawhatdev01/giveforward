import Link from "next/link";
import { notFound } from "next/navigation";
import { getCause, getDonations, formatNaira } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CausePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cause = await getCause(id);
  if (!cause) notFound();

  const pct = Math.round((cause.raised / cause.goal) * 100);
  const recentDonations = await getDonations(cause.id);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
            ←
          </Link>
          <p className="font-medium text-stone-900">Cause details</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-50 text-7xl">
            {cause.emoji}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-stone-900">{cause.title}</h1>
                <p className="mt-1 text-stone-500">{cause.org}</p>
              </div>
              {cause.verified && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Verified</span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-700">{formatNaira(cause.raised)}</p>
                <p className="text-xs text-stone-500">Raised</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <p className="text-lg font-bold text-stone-900">{pct}%</p>
                <p className="text-xs text-stone-500">Funded</p>
              </div>
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <p className="text-lg font-bold text-stone-900">{cause.daysLeft}d</p>
                <p className="text-xs text-stone-500">Left</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-stone-900">The story</h2>
              <p className="leading-relaxed text-stone-600">{cause.story}</p>
            </div>

            {recentDonations.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-3 font-semibold text-stone-900">Recent donations</h2>
                <div className="divide-y divide-stone-100 rounded-xl border border-stone-200">
                  {recentDonations.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-medium text-emerald-700">
                        {d.donorName === "Anonymous" ? "AN" : d.donorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-900">{d.donorName}</p>
                        <p className="text-xs text-stone-400">{d.timestamp}</p>
                      </div>
                      <p className="text-sm font-bold text-emerald-700">{formatNaira(d.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <Link
                href={`/causes/${cause.id}/donate`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto"
              >
                Donate now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
