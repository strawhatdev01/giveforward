import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/nomba";
import { createDonation } from "@/lib/data";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nomba-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event?.event_type === "payment.success" && event?.data) {
    const { orderReference, amount, customerEmail, meta } = event.data;
    const [causeId] = (orderReference ?? "").split("-");

    if (causeId && amount) {
      try {
        await createDonation({
          causeId,
          donorName: meta?.donorName ?? "Anonymous",
          amount: Math.round(amount),
          email: customerEmail ?? meta?.donorEmail,
          reference: event.data.reference ?? orderReference ?? `wh-${Date.now()}`,
        });
      } catch {
        // duplicate reference is fine
      }
    }
  }

  return NextResponse.json({ received: true });
}
