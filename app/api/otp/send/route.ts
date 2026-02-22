import { NextRequest, NextResponse } from "next/server";
import { storeOtp } from "@/utils/otp";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendOtpEmail } from "@/utils/email";
import { sendOtpSms } from "@/utils/sms";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const { emailOrPhone } = await req.json();
    if (!emailOrPhone || typeof emailOrPhone !== "string") {
      return NextResponse.json(
        { error: "Email or phone number required" },
        { status: 400 }
      );
    }
    const identifier = emailOrPhone.trim();
    await connectDB();
    let user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      user = await User.create({
        email: isEmail(identifier) ? identifier : undefined,
        phone: !isEmail(identifier) ? identifier : undefined,
        name: identifier,
      });
    }
    const otp = storeOtp(identifier);
    if (isEmail(identifier)) {
      await sendOtpEmail(identifier, otp);
    } else {
      await sendOtpSms(identifier, otp);
    }
    return NextResponse.json({
      success: true,
      message: isEmail(identifier)
        ? "OTP sent to your email"
        : "OTP sent to your phone",
    });
  } catch (e) {
    console.error("OTP send error:", e);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
