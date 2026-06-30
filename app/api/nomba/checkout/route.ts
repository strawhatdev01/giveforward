import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/nomba";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, causeId, causeTitle, donorName, donorEmail } = body;

  if (!amount || !causeId) {
    return NextResponse.json({ error: "Missing amount or causeId." }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;

    // pass donor info in the callback URL so the success page can
    // record the donation even if the webhook arrives late
    const params = new URLSearchParams({
      amount: String(amount),
      reference: `${causeId}-${Date.now()}`,
      donor: donorName || "Anonymous",
    });
    if (donorEmail) params.set("email", donorEmail);

    const callbackUrl = `${origin}/causes/${causeId}/success?${params.toString()}`;

    const checkout = await createCheckout({
      amount,
      causeId,
      causeTitle,
      donorName,
      donorEmail,
      callbackUrl,
    });

    // Nomba returns the checkout link inside the response — dig it out
    // regardless of which nesting they use
    const checkoutUrl =
      checkout?.data?.checkoutUrl ??
      checkout?.checkoutUrl ??
      checkout?.data?.link ??
      checkout?.data?.url ??
      null;

    const reference = checkout?.data?.orderReference ?? checkout?.data?.reference ?? null;

    return NextResponse.json({ checkoutUrl, reference });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout creation failed";
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
