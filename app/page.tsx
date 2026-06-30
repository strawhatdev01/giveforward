import Link from "next/link";
import { getCauses, getStats, formatNaira } from "@/lib/data";
import Header from "@/components/header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [causes, stats] = await Promise.all([getCauses(), getStats()]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-emerald-600 p-5 text-white">
            <p className="text-2xl font-bold">{formatNaira(stats.totalRaised)}</p>
            <p className="text-sm text-emerald-100">Total raised</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-2xl font-bold text-stone-900">{stats.totalDonors.toLocaleString()}</p>
            <p className="text-sm text-stone-500">Donors so far</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <p className="text-2xl font-bold text-stone-900">{stats.causeCount}</p>
            <p className="text-sm text-stone-500">Active causes</p>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-stone-900">Featured causes</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((cause) => {
              const pct = Math.round((cause.raised / cause.goal) * 100);
              return (
                <Link
                  key={cause.id}
                  href={`/causes/${cause.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-5xl">
                    {cause.emoji}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-stone-900 group-hover:text-emerald-700">{cause.title}</p>
                    <p className="mt-0.5 text-sm text-stone-500">{cause.org}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="font-medium text-emerald-700">{formatNaira(cause.raised)}</span>
                      <span className="text-stone-500">{pct}% of {formatNaira(cause.goal)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
