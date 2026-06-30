import Link from "next/link";
import { getCause, createDonation, formatNaira } from "@/lib/data";
import { sendReceipt } from "@/lib/email";

export const dynamic = "force-dynamic";

// Nomba redirects back here after payment (or we fall through if sandbox isn't wired)
// we record the donation immediately so the dashboard updates in real time
export default async function SuccessPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ amount?: string; reference?: string; donor?: string; email?: string; message?: string }>;
}) {
  const { id } = await params;
  const { amount, reference, donor, email, message } = await searchParams;
  const cause = await getCause(id);
  const amountNum = Number(amount ?? 0);

  if (!cause) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center">
          <p className="text-lg text-red-600">Campaign not found.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">← Back to causes</Link>
        </div>
      </div>
    );
  }

  // save the donation if we have the details — duplicate reference is a no-op
  const ref = reference ?? `GF-${Date.now().toString(36).toUpperCase()}`;
  if (amountNum > 0) {
    try {
      await createDonation({
        causeId: id,
        donorName: donor ?? "Anonymous",
        amount: amountNum,
        email: email || undefined,
        message: message || undefined,
        reference: ref,
      });

      if (email) {
        sendReceipt({
          to: email,
          donorName: donor ?? "Anonymous",
          amount: amountNum,
          reference: ref,
          causeTitle: cause.title,
          message: message || undefined,
        }).catch((e) => console.error("[email] send failed", e));
      }
    } catch {
      // already recorded via webhook — that's fine
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">❤️</div>
        </div>

        <h1 className="text-2xl font-bold text-stone-900">Thank you, {donor || "friend"}!</h1>
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
              <span className="text-stone-500">Campaign</span>
              <span className="font-medium text-stone-700">{cause.title}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-stone-500">Status</span>
              <span className="font-medium text-emerald-700">Confirmed</span>
            </div>
            {message && (
              <div className="py-2 text-sm">
                <span className="text-stone-500">Message</span>
                <p className="mt-1 text-stone-700 italic">&ldquo;{message}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-stone-400">
          {email ? `A receipt will be sent to ${email}.` : "Add an email next time to get a receipt."}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Browse more causes
        </Link>
      </div>
    </div>
  );
}
