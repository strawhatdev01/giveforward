import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/nomba";
import { createDonation, getCause } from "@/lib/data";
import { sendReceipt } from "@/lib/email";

// Nomba sends payment_success events here after a customer completes checkout.
// We persist the donation to the database so the dashboard updates in real time.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nomba-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Nomba sends payment_success when checkout is completed
  if (event?.event_type !== "payment_success") {
    return NextResponse.json({ received: true });
  }

  const d = event.data;

  // the order reference is what we passed when creating the checkout — causeId-timestamp
  const orderReference = d?.order?.orderReference ?? "";
  const [causeId] = orderReference.split("-");

  const amount = d?.order?.amount ?? d?.transaction?.transactionAmount ?? 0;
  const reference = orderReference || d?.order?.orderId || `wh-${Date.now()}`;

  // meta is the custom object we attached during checkout creation
  const meta = d?.meta ?? {};
  const donorName = meta?.donorName || d?.customer?.name || "Anonymous";
  const donorEmail = d?.order?.customerEmail || meta?.donorEmail;
  const donorMessage = meta?.message || undefined;

  if (!causeId || !amount) {
    console.warn("[webhook] missing causeId or amount — skipping", event);
    return NextResponse.json({ received: true });
  }

  try {
    await createDonation({
      causeId,
      donorName,
      amount: Math.round(amount),
      email: donorEmail,
      message: donorMessage,
      reference,
    });
    console.log(`[webhook] recorded donation: ${donorName} — ₦${amount} — ${reference}`);

    if (donorEmail && causeId) {
      const cause = await getCause(causeId);
      if (cause) {
        sendReceipt({
          to: donorEmail,
          donorName,
          amount: Math.round(amount),
          reference,
          causeTitle: cause.title,
          message: donorMessage,
        }).catch(() => {});
      }
    }
  } catch {
    // duplicate reference — already recorded via the success page callback
  }

  return NextResponse.json({ received: true });
}
