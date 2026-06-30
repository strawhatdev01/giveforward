import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/nomba";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, causeId, causeTitle, donorEmail } = body;

  if (!amount || !causeId) {
    return NextResponse.json({ error: "amount and causeId are required" }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const checkout = await createCheckout({
      amount,
      causeId,
      causeTitle,
      donorEmail,
      callbackUrl: `${origin}/causes/${causeId}/success?amount=${amount}`,
    });
    return NextResponse.json(checkout);
  } catch (err) {
    // Sandbox keys aren't configured yet — surface a clear error to the client.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout creation failed" },
      { status: 502 }
    );
  }
}
