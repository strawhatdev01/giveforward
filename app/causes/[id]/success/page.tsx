import Link from "next/link";
import { getCause, createDonation, formatNaira } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ amount?: string; reference?: string; donor?: string; email?: string }>;
}) {
  const { id } = await params;
  const { amount, reference, donor, email } = await searchParams;
  const cause = await getCause(id);
  const amountNum = Number(amount ?? 0);
  const ref = reference ?? `GF-${Date.now().toString(36).toUpperCase()}`;

  if (cause && amountNum > 0) {
    try {
      await createDonation({
        causeId: id,
        donorName: donor ?? "Anonymous",
        amount: amountNum,
        email: email || undefined,
        reference: ref,
      });
    } catch {
      // duplicate reference — donation already recorded via webhook
    }
  }

  if (!cause) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">❤️</div>
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Thank you!</h1>
        <p className="mt-2 text-stone-500">
          Your donation moves <strong className="text-stone-700">{cause.title}</strong> closer to its goal.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-stone-200">
          <p className="mb-3 text-sm font-semibold text-stone-900">Donation receipt</p>
          <div className="divide-y divide-stone-100">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-stone-500">Amount</span>
              <span className="font-medium text-stone-900">{formatNaira(amountNum)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-stone-500">Reference</span>
              <span className="font-mono text-xs text-stone-700">{ref}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-stone-500">Cause</span>
              <span className="font-medium text-stone-700">{cause.title}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-stone-500">Status</span>
              <span className="font-medium text-emerald-700">Confirmed</span>
            </div>
          </div>
        </div>

        <Link href="/" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-700">
          Browse more causes
        </Link>
      </div>
    </div>
  );
}
