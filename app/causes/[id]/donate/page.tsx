"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { causes, formatNaira } from "@/lib/data";

const presetAmounts = [1000, 2000, 5000, 10000, 20000];

export default function DonatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const cause = causes.find((c) => c.id === params.id);

  const [amount, setAmount] = useState<number>(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cause) return null;

  async function handleDonate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nomba/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, causeId: cause!.id, causeTitle: cause!.title }),
      });
      if (!res.ok) throw new Error("Checkout could not be created");
      // In sandbox without live keys yet, fall through to the local success screen.
      router.push(`/causes/${cause!.id}/success?amount=${amount}`);
    } catch {
      // Sandbox keys aren't wired up yet — still let the demo flow continue.
      router.push(`/causes/${cause!.id}/success?amount=${amount}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pb-28">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/causes/${cause.id}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-sm">
          ←
        </Link>
        <p className="text-base font-medium">Make a donation</p>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-3 rounded-xl bg-stone-50 px-3.5 py-3">
          <span className="text-2xl">{cause.emoji}</span>
          <div>
            <p className="text-sm font-medium leading-tight">{cause.title}</p>
            <p className="text-xs text-stone-500">{cause.org}</p>
          </div>
        </div>

        <p className="mb-2.5 mt-5 text-sm font-medium">Choose an amount</p>
        <div className="grid grid-cols-2 gap-2.5">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`rounded-xl border py-3.5 text-sm font-medium ${
                amount === preset ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-700"
              }`}
            >
              {formatNaira(preset)}
            </button>
          ))}
          <button
            onClick={() => {
              const custom = window.prompt("Enter a custom amount in NGN");
              const parsed = Number(custom);
              if (parsed > 0) setAmount(parsed);
            }}
            className="rounded-xl border border-dashed border-stone-300 py-3.5 text-sm text-stone-500"
          >
            Custom amount
          </button>
        </div>

        <p className="mb-2.5 mt-5 text-sm font-medium">Payment method</p>
        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">N</div>
          <div className="flex-1">
            <p className="text-sm font-medium">Nomba Checkout</p>
            <p className="text-xs text-stone-500">Bank transfer · Card · USSD</p>
          </div>
          <span className="text-emerald-600">✓</span>
        </div>

        <p className="mt-4 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-xs leading-relaxed text-stone-600">
          Payments are secured by Nomba. You&apos;ll get a receipt right after your donation is confirmed via webhook.
        </p>

        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t border-stone-200 bg-white p-4">
        <button
          onClick={handleDonate}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Processing…" : `Complete donation — ${formatNaira(amount)}`}
        </button>
      </div>
    </main>
  );
}
