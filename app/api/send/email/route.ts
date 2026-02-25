import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/utils/email";
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
    const { to, subject, body, context } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Recipient, subject, and message body required" },
        { status: 400 }
      );
    }
    const result = await sendEmail(to, subject, body);
    await connectDB();
    await MessageLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      channel: "email",
      to,
      body,
      context: context ?? undefined,
      status: "sent",
    });
    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (e: unknown) {
    const err = e as { message?: string };
    console.error("Email send error:", e);
    try {
      const b = await req.clone().json();
      await connectDB();
      await MessageLog.create({
        userId: new mongoose.Types.ObjectId(userId),
        channel: "email",
        to: b.to ?? "",
        body: b.body ?? "",
        status: "failed",
        error: err.message,
      });
    } catch (_) {}
    return NextResponse.json(
      { error: err.message ?? "Failed to send email" },
      { status: 500 }
    );
  }
}
