// Thin wrapper around the Nomba API.
// Docs: https://developer.nomba.com
// Auth flow: client_id + client_secret + account_id -> access token -> Bearer auth on requests.
// Keys live in .env.local — never commit real credentials.

const NOMBA_BASE_URL = process.env.NOMBA_BASE_URL ?? "https://api.nomba.com/v1";

type NombaTokenResponse = {
  data: {
    access_token: string;
    expires_in: number;
  };
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(`${NOMBA_BASE_URL}/auth/token/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accountId: process.env.NOMBA_ACCOUNT_ID ?? "",
    },
    body: JSON.stringify({
      client_id: process.env.NOMBA_CLIENT_ID,
      client_secret: process.env.NOMBA_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    throw new Error(`Nomba auth failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as NombaTokenResponse;
  cachedToken = {
    token: json.data.access_token,
    expiresAt: Date.now() + json.data.expires_in * 1000 - 60_000,
  };
  return cachedToken.token;
}

export async function createCheckout(params: {
  amount: number;
  causeId: string;
  causeTitle: string;
  donorEmail?: string;
  callbackUrl: string;
}) {
  const token = await getAccessToken();

  const res = await fetch(`${NOMBA_BASE_URL}/checkout/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      accountId: process.env.NOMBA_ACCOUNT_ID ?? "",
    },
    body: JSON.stringify({
      order: {
        orderReference: `${params.causeId}-${Date.now()}`,
        callbackUrl: params.callbackUrl,
        customerEmail: params.donorEmail ?? "donor@giveforward.app",
        amount: params.amount,
        currency: "NGN",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Nomba checkout failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

// Verifies the X-Nomba-Signature header on incoming webhook events.
// Swap in the real HMAC scheme once confirmed against Nomba's webhook docs.
export function verifyWebhookSignature(_payload: string, _signature: string | null): boolean {
  if (!_signature) return false;
  // TODO: implement HMAC-SHA256 verification against NOMBA_WEBHOOK_SECRET
  return true;
}
