import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/nomba";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, causeId, causeTitle, donorName, donorEmail } = body;

  if (!amount || !causeId) {
    return NextResponse.json({ error: "amount and causeId are required" }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const params = new URLSearchParams({ amount: String(amount), donor: donorName ?? "Anonymous" });
    if (donorEmail) params.set("email", donorEmail);
    const callbackUrl = `${origin}/causes/${causeId}/success?${params.toString()}`;

    const checkout = await createCheckout({
      amount,
      causeId,
      causeTitle,
      donorEmail,
      callbackUrl,
    });

    const checkoutUrl = checkout?.data?.checkoutUrl ?? checkout?.checkoutUrl ?? checkout?.data?.url ?? null;

    return NextResponse.json({ checkoutUrl, reference: checkout?.data?.reference ?? checkout?.reference ?? null });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout creation failed" },
      { status: 502 }
    );
  }
}
