import Link from "next/link";
import { causes, formatNaira } from "@/lib/data";

const categoryAccent: Record<string, string> = {
  Water: "bg-emerald-600",
  Education: "bg-violet-600",
  Mosque: "bg-amber-700",
  Church: "bg-rose-600",
  Healthcare: "bg-sky-600",
};

export default function HomePage() {
  const totalRaised = causes.reduce((sum, c) => sum + c.raised, 0);
  const totalDonors = causes.reduce((sum, c) => sum + c.donorCount, 0);

  return (
    <main className="pb-10">
      <header className="bg-emerald-600 px-5 pb-6 pt-8 text-white">
        <p className="text-sm text-emerald-100">Good afternoon</p>
        <h1 className="mt-1 text-xl font-medium">Make an impact today</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/15 px-4 py-3">
            <p className="text-lg font-medium">{formatNaira(totalRaised)}</p>
            <p className="text-xs text-emerald-100">Total raised</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3">
            <p className="text-lg font-medium">{totalDonors.toLocaleString()}</p>
            <p className="text-xs text-emerald-100">Donors so far</p>
          </div>
        </div>
      </header>

      <section className="px-5 pt-5">
        <h2 className="mb-3 text-base font-medium">Featured causes</h2>
        <div className="space-y-4">
          {causes.map((cause) => {
            const pct = Math.round((cause.raised / cause.goal) * 100);
            return (
              <Link
                key={cause.id}
                href={`/causes/${cause.id}`}
                className="block overflow-hidden rounded-2xl border border-stone-200"
              >
                <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 text-5xl">
                  {cause.emoji}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium text-white ${categoryAccent[cause.category]}`}
                  >
                    {cause.category}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium leading-snug">{cause.title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{cause.org}</p>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs">
                    <span className="font-medium text-emerald-700">{formatNaira(cause.raised)} raised</span>
                    <span className="text-stone-500">{pct}% of {formatNaira(cause.goal)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
