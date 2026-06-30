"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatNaira, type Cause } from "@/lib/data";

const presetAmounts = [1000, 2000, 5000, 10000, 20000];

export default function DonatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [cause, setCause] = useState<Cause | null>(null);
  const [amount, setAmount] = useState<number>(1000);
  const [customInput, setCustomInput] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/causes/${params.id}`).then(r => r.json()).then(setCause);
  }, [params.id]);

  async function handleDonate() {
    if (!donorName.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nomba/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          causeId: cause!.id,
          causeTitle: cause!.title,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/causes/${cause!.id}/success?amount=${amount}&donor=${encodeURIComponent(donorName)}&email=${encodeURIComponent(donorEmail)}`);
      }
    } catch {
      router.push(`/causes/${cause!.id}/success?amount=${amount}&donor=${encodeURIComponent(donorName)}&email=${encodeURIComponent(donorEmail)}`);
    } finally {
      setLoading(false);
    }
  }

  if (!cause) return <div className="p-8 text-center text-stone-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href={`/causes/${cause.id}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-sm hover:bg-stone-50">←</Link>
          <p className="font-medium text-stone-900">Make a donation</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="p-6">
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-stone-50 p-4">
              <span className="text-2xl">{cause.emoji}</span>
              <div>
                <p className="font-medium text-stone-900">{cause.title}</p>
                <p className="text-sm text-stone-500">{cause.org}</p>
              </div>
            </div>

            <div className="mb-5 space-y-3">
              <input
                type="text"
                placeholder="Your name *"
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                placeholder="Email (for receipt)"
                value={donorEmail}
                onChange={e => setDonorEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <label className="mb-3 block text-sm font-medium text-stone-700">Choose an amount</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setAmount(preset); setCustomInput(""); }}
                  className={`rounded-xl border py-3 text-sm font-medium transition ${
                    amount === preset && !customInput ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-700 hover:border-stone-300"
                  }`}
                >
                  {formatNaira(preset)}
                </button>
              ))}
              <div className="col-span-full">
                <input
                  type="number"
                  placeholder="Custom amount (₦)"
                  value={customInput}
                  onChange={(e) => { setCustomInput(e.target.value); setAmount(Number(e.target.value) || 0); }}
                  className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm font-medium text-stone-700">Payment method</label>
              <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">N</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">Nomba Checkout</p>
                  <p className="text-xs text-stone-500">Bank transfer · Card · USSD</p>
                </div>
                <span className="text-emerald-600">✓</span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-8">
              <button
                onClick={handleDonate}
                disabled={loading || amount < 100}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Processing…" : `Donate ${formatNaira(amount)}`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
