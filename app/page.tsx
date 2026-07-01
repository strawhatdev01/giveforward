import { getCauses, getStats, formatNaira } from "@/lib/data";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CausesGrid from "@/components/causes-grid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [causes, stats] = await Promise.all([getCauses(), getStats()]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Give with{" "}
            <span className="text-amber-300">transparency</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100 sm:mt-6 sm:text-xl">
            Support verified causes across Nigeria. Track every donation in real time.
            Every naira reaches those who need it most.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#causes"
              className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-amber-50"
            >
              Browse causes
            </a>
            <a
              href="#about"
              className="rounded-xl border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative z-10 -mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-stone-200 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-700">{formatNaira(stats.totalRaised)}</p>
              <p className="text-sm text-stone-500">Total raised</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900">{stats.totalDonors.toLocaleString()}</p>
              <p className="text-sm text-stone-500">Donors so far</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-stone-900">{stats.causeCount}</p>
              <p className="text-sm text-stone-500">Active causes</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* About */}
        <section id="about" className="mb-16 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">How GiveForward works</h2>
            <p className="mt-3 text-stone-500 max-w-2xl mx-auto">
              We connect donors directly with verified community causes — no middlemen, full transparency.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Browse causes", desc: "Explore verified campaigns across Education, Health, Community, and more." },
              { step: "2", title: "Donate securely", desc: "Pay via card, bank transfer, or USSD through Nomba's secure checkout." },
              { step: "3", title: "Track impact", desc: "Get a receipt, watch progress bars update, and see exactly where your money goes." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Causes */}
        <section id="causes" className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">Featured causes</h2>
            <p className="mt-1 text-stone-500">Find a cause you care about and make a difference today.</p>
          </div>
          <CausesGrid causes={causes} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
