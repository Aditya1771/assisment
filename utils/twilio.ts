import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

const whatsappSandboxFrom = process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER ?? "whatsapp:+14155238886";
const smsFrom = process.env.TWILIO_PHONE_NUMBER!;

export async function sendWhatsApp(to: string, body: string): Promise<{ sid: string }> {
  const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const fromNumber = whatsappSandboxFrom.startsWith("whatsapp:") ? whatsappSandboxFrom : `whatsapp:${whatsappSandboxFrom}`;
  const message = await client.messages.create({
    body,
    from: fromNumber,
    to: toNumber,
  });
  return { sid: message.sid };
}

export async function sendSms(to: string, body: string): Promise<{ sid: string }> {
  const message = await client.messages.create({
    body,
    from: smsFrom,
    to: to.replace(/\D/g, "").length >= 10 ? (to.startsWith("+") ? to : `+${to}`) : to,
  });
  return { sid: message.sid };
}
