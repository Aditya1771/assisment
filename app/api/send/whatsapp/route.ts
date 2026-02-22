import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendWhatsApp } from "@/utils/twilio";
import { connectDB } from "@/lib/mongodb";
import MessageLog from "@/models/MessageLog";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { to, body, context } = await req.json();
    if (!to || !body) {
      return NextResponse.json(
        { error: "Recipient and message body required" },
        { status: 400 }
      );
    }
    const result = await sendWhatsApp(to, body);
    await connectDB();
    await MessageLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      channel: "whatsapp",
      to,
      body,
      context: context ?? undefined,
      status: "sent",
    });
    return NextResponse.json({ success: true, sid: result.sid });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("WhatsApp send error:", e);
    try {
      const b = await req.clone().json();
      await connectDB();
      await MessageLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        channel: "whatsapp",
        to: b.to ?? "",
        body: b.body ?? "",
        status: "failed",
        error: err.message,
      });
    } catch (_) {}
    return NextResponse.json(
      { error: err.message ?? "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
