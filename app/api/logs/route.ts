import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MessageLog from "@/models/MessageLog";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const logs = await MessageLog.find({
      userId: new mongoose.Types.ObjectId((session.user as { id?: string }).id),
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ logs });
  } catch (e) {
    console.error("Logs error:", e);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
