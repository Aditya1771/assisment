import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendSms } from "@/utils/twilio";
import { connectDB } from "@/lib/mongodb";
import MessageLog from "@/models/MessageLog";
import mongoose from "mongoose";

// Send an SMS invite with a wa.me link so the user can tap to join the Twilio WhatsApp sandbox.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phone, keyword } = await req.json();
    if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

    const sandboxFrom = process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER ?? "whatsapp:+14155238886";
    const waNumber = sandboxFrom.replace(/^whatsapp:/i, "").replace(/\D/g, "");
    const joinKeyword = (keyword || "join").trim();
    const text = encodeURIComponent(`join ${joinKeyword}`);
    const link = `https://wa.me/${waNumber}?text=${text}`;
    const body = `Tap to join WhatsApp sandbox and receive messages: ${link}`;

    const result = await sendSms(phone, body);

    try {
      await connectDB();
      await MessageLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        channel: "sms",
        to: phone,
        body,
        status: "sent",
      });
    } catch (_) {}

    return NextResponse.json({ success: true, sid: result.sid, link });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("invite send error:", e);
    return NextResponse.json({ error: err.message ?? "Failed to send invite" }, { status: 500 });
  }
}
