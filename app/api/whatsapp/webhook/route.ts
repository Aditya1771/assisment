import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Twilio will POST form-encoded data for inbound messages. This webhook
// marks a user as `whatsapp_joined` when they send a join keyword.
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const from = String(form.get("From") || "");
    const body = String(form.get("Body") || "");

    if (!from) {
      return new NextResponse("<Response></Response>", {
        headers: { "Content-Type": "application/xml" },
      });
    }

    const normalized = from.replace(/^whatsapp:/i, "").replace(/\s+/g, "");

    // Quick heuristic: treat messages containing the word "join" as opt-in.
    if (body && /\bjoin\b/i.test(body)) {
      await connectDB();
      // store phone as provided (no plus); keep it consistent with how you store phones elsewhere
      await User.findOneAndUpdate(
        { phone: normalized },
        { $set: { whatsapp_joined: true } },
        { upsert: true }
      );
    }

    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
