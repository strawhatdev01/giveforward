import Link from "next/link";
import { getCauses, getStats, getDonations, formatNaira } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [causes, stats, donations] = await Promise.all([getCauses(), getStats(), getDonations()]);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-stone-500 hover:text-emerald-700">← Home</Link>
            <span className="text-lg font-bold text-stone-900">Admin</span>
          </div>
          <Link href="/admin/create" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            + New cause
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-600 p-5 text-white">
            <p className="text-2xl font-bold">{formatNaira(stats.totalRaised)}</p>
            <p className="text-sm text-emerald-100">Total raised</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-2xl font-bold text-stone-900">{stats.totalDonors}</p>
            <p className="text-sm text-stone-500">Total donors</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-2xl font-bold text-stone-900">{stats.causeCount}</p>
            <p className="text-sm text-stone-500">Active campaigns</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="border-b border-stone-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-stone-900">Campaigns</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {causes.map((cause) => {
              const pct = Math.round((cause.raised / cause.goal) * 100);
              return (
                <div key={cause.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="text-2xl">{cause.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{cause.title}</p>
                    <p className="text-sm text-stone-500">{cause.org} · {cause.donorCount} donors</p>
                    <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-stone-900">{formatNaira(cause.raised)}</p>
                    <p className="text-sm text-stone-500">of {formatNaira(cause.goal)}</p>
                  </div>
                  <Link href={`/causes/${cause.id}`} className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50">
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-stone-900">Recent donations</h2>
            <span className="text-xs text-stone-400">{donations.length} total</span>
          </div>
          <div className="divide-y divide-stone-100">
            {donations.map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-6 py-3 text-sm">
                <p className="w-32 font-medium text-stone-900">{d.donorName}</p>
                <p className="flex-1 truncate text-stone-500">{d.reference}</p>
                <p className="font-medium text-emerald-700">{formatNaira(d.amount)}</p>
              </div>
            ))}
            {donations.length === 0 && (
              <p className="px-6 py-6 text-center text-sm text-stone-400">No donations yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
