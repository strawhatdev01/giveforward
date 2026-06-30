import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/nomba";

// Nomba sends payment confirmation events here.
// Configure this URL in the Nomba dashboard under Developer -> Webhooks.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nomba-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // TODO: persist the confirmed donation to the database and update the
  // cause's raised total once a real DB (e.g. Postgres via Prisma) is wired in.
  console.log("Nomba webhook received:", event?.event_type ?? "unknown", event);

  return NextResponse.json({ received: true });
}
