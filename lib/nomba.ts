// Nomba API wrapper
// uses sandbox.nomba.com for testing, api.nomba.com for production
// base URL is configured via NOMBA_BASE_URL env var

const NOMBA_BASE_URL = process.env.NOMBA_BASE_URL ?? "https://sandbox.nomba.com/v1";

type NombaTokenResponse = {
  data: {
    access_token: string;
    expires_in: number;
  };
};

// cache the access token in memory so we don't hammer the auth endpoint
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const accountId = process.env.NOMBA_ACCOUNT_ID;
  const clientId = process.env.NOMBA_CLIENT_ID;
  const clientSecret = process.env.NOMBA_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Nomba credentials not configured. Set NOMBA_ACCOUNT_ID, NOMBA_CLIENT_ID, and NOMBA_CLIENT_SECRET.");
  }

  const res = await fetch(`${NOMBA_BASE_URL}/auth/token/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accountId,
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`Nomba auth failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as NombaTokenResponse;
  cachedToken = {
    token: json.data.access_token,
    // refresh 60s before it actually expires, just to be safe
    expiresAt: Date.now() + json.data.expires_in * 1000 - 60_000,
  };
  return cachedToken.token;
}

export async function createCheckout(params: {
  amount: number;
  causeId: string;
  causeTitle: string;
  donorName?: string;
  donorEmail?: string;
  callbackUrl: string;
}) {
  const token = await getAccessToken();

  const orderRef = `${params.causeId}-${Date.now()}`;

  const subAccountId = process.env.NOMBA_SUB_ACCOUNT_ID;

  const order: Record<string, unknown> = {
    orderReference: orderRef,
    callbackUrl: params.callbackUrl,
    customerEmail: params.donorEmail || "donor@giveforward.app",
    customerName: params.donorName || "Anonymous",
    amount: params.amount.toString(),
    currency: "NGN",
  };

  if (subAccountId) order.accountId = subAccountId;

  const res = await fetch(`${NOMBA_BASE_URL}/checkout/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      accountId: process.env.NOMBA_ACCOUNT_ID ?? "",
    },
    body: JSON.stringify({
      order,
      // attach donor info so we can reference it on the success page
      meta: {
        donorName: params.donorName || "Anonymous",
        causeTitle: params.causeTitle,
        causeId: params.causeId,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`Nomba checkout failed (${res.status}): ${text}`);
  }

  return res.json();
}

// Nomba sends a signature header on webhooks so we can verify
// the payload actually came from them. for production you'd compute
// the HMAC with your webhook secret and compare it.
export function verifyWebhookSignature(_payload: string, _signature: string | null): boolean {
  if (!_signature) return false;
  // TODO: implement HMAC verification when we have the webhook secret configured
  return true;
}
