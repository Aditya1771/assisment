import nodemailer from "nodemailer";

// Use Gmail OAuth or app-specific password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "adityababaromio@gmail.com",
    pass: process.env.SMTP_PASS,
  },
});

// Fallback transporter for custom SMTP settings
const customTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<{ messageId: string }> {
  if (!process.env.SMTP_PASS) {
    console.warn("SMTP password not configured; Email not sent to:", to);
    throw new Error("SMTP credentials not configured");
  }

  const emailTransporter = process.env.SMTP_HOST ? customTransporter : transporter;

  const result = await emailTransporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "adityababaromio@gmail.com",
    to,
    subject,
    text,
    html: html || text,
  });

  return { messageId: result.messageId };
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  if (!process.env.SMTP_PASS) {
    console.warn("SMTP not configured; OTP (email):", otp);
    return;
  }
  await sendEmail(
    to,
    "Your login OTP - Unified Inbox",
    `Your one-time password is: ${otp}. Valid for 10 minutes.`,
    `<p>Your one-time password is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`
  );
}
