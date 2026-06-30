import { formatNaira } from "./data";

const FROM = process.env.EMAIL_FROM ?? "GiveForward <onboarding@resend.dev>";

function buildReceiptHtml(opts: {
  donorName: string;
  amount: number;
  reference: string;
  causeTitle: string;
  message?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <tr>
            <td style="background:#059669;padding:32px 24px;text-align:center">
              <div style="display:inline-block;width:48px;height:48px;line-height:48px;border-radius:12px;background:#ffffff;font-size:20px;font-weight:700;color:#059669;margin-bottom:12px">GF</div>
              <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff">Thank you for your donation!</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#d1fae5">Your support makes a difference.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <p style="font-size:16px;color:#1c1917;margin:0 0 16px">Hi <strong>${opts.donorName}</strong>,</p>
              <p style="font-size:14px;color:#57534e;margin:0 0 24px;line-height:1.5">Your donation has been received and the campaign has been updated. Here's your receipt:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e7e5e4">
                <tr><td style="padding:12px 16px;border-bottom:1px solid #e7e5e4"><table width="100%"><tr>
                  <td style="font-size:13px;color:#78716c">Amount</td>
                  <td style="font-size:14px;font-weight:600;color:#1c1917;text-align:right">${formatNaira(opts.amount)}</td>
                </tr></table></td></tr>
                <tr><td style="padding:12px 16px;border-bottom:1px solid #e7e5e4"><table width="100%"><tr>
                  <td style="font-size:13px;color:#78716c">Reference</td>
                  <td style="font-size:13px;color:#1c1917;text-align:right;font-family:monospace">${opts.reference}</td>
                </tr></table></td></tr>
                <tr><td style="padding:12px 16px;border-bottom:1px solid #e7e5e4"><table width="100%"><tr>
                  <td style="font-size:13px;color:#78716c">Campaign</td>
                  <td style="font-size:14px;color:#1c1917;text-align:right;font-weight:500">${opts.causeTitle}</td>
                </tr></table></td></tr>
                <tr><td style="padding:12px 16px"><table width="100%"><tr>
                  <td style="font-size:13px;color:#78716c">Status</td>
                  <td style="font-size:14px;color:#059669;text-align:right;font-weight:600">Confirmed</td>
                </tr></table></td></tr>
                ${opts.message ? `<tr><td style="padding:12px 16px;border-top:1px solid #e7e5e4"><table width="100%"><tr>
                  <td style="font-size:13px;color:#78716c;vertical-align:top">Your message</td>
                  <td style="font-size:14px;color:#44403c;text-align:right;font-style:italic">"${opts.message}"</td>
                </tr></table></td></tr>` : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;text-align:center">
              <a href="https://giveforward.vercel.app" style="display:inline-block;border-radius:12px;background:#059669;padding:12px 32px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none">Browse more causes</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background:#fafaf9;text-align:center">
              <p style="margin:0;font-size:12px;color:#a8a29e">GiveForward &middot; Supporting communities through crowdfunding</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendReceipt(opts: {
  to: string;
  donorName: string;
  amount: number;
  reference: string;
  causeTitle: string;
  message?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping receipt");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `Receipt — ${formatNaira(opts.amount)} donation to ${opts.causeTitle}`,
    html: buildReceiptHtml(opts),
  });

  console.log(`[email] receipt sent to ${opts.to} — ${opts.reference}`);
}
