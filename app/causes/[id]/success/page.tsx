import Link from "next/link";
import { getCause, formatNaira } from "@/lib/data";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ amount?: string }>;
}) {
  const { id } = await params;
  const { amount } = await searchParams;
  const cause = getCause(id);
  const amountNum = Number(amount ?? 0);
  const reference = `GF-2026-${Math.floor(10000 + Math.random() * 89999)}`;

  if (!cause) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
        ❤️
      </div>
      <h1 className="text-xl font-medium">Thank you for making an impact</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        Your donation moves <strong className="font-medium text-stone-700">{cause.title}</strong> closer to its goal.
      </p>

      <div className="mt-6 w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left">
        <p className="mb-2.5 text-sm font-medium">Donation receipt</p>
        <Row label="Amount" value={formatNaira(amountNum)} />
        <Row label="Reference" value={reference} />
        <Row label="Cause" value={cause.title} />
        <Row label="Status" value="Confirmed" valueClass="text-emerald-700" />
      </div>

      <Link href="/" className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-medium text-white">
        Back to causes
      </Link>
    </main>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between py-1 text-xs">
      <span className="text-stone-500">{label}</span>
      <span className={`font-medium text-stone-700 ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
