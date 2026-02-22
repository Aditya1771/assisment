import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendOtpSms(to: string, otp: string): Promise<void> {
  if (!client || !fromNumber) {
    console.warn("Twilio not configured for SMS OTP; OTP:", otp);
    return;
  }
  const toNum = to.replace(/\D/g, "").length >= 10 ? (to.startsWith("+") ? to : `+${to}`) : to;
  await client.messages.create({
    body: `Your Unified Inbox login OTP is: ${otp}. Valid for 10 minutes.`,
    from: fromNumber,
    to: toNum,
  });
}