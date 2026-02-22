import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const otpStore = new Map<
  string,
  { hash: string; expiresAt: number }
>();

/**
 * Generate a cryptographically secure OTP using Node's crypto.
 * Uses crypto.randomInt for uniform distribution.
 */
export function generateOtp(): string {
  const max = Math.pow(10, OTP_LENGTH);
  const value = crypto.randomInt(0, max);
  return value.toString().padStart(OTP_LENGTH, "0");
}

/**
 * Hash OTP with SHA-256 for secure storage (we only store hash, not plain OTP).
 */
function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Store OTP for email/phone identifier. Returns the plain OTP to send to user.
 */
export function storeOtp(identifier: string): string {
  const otp = generateOtp();
  const hash = hashOtp(otp);
  otpStore.set(identifier, {
    hash,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });
  return otp;
}

/**
 * Verify OTP for identifier. Uses constant-time comparison to prevent timing attacks.
 */
export function verifyOtp(identifier: string, otp: string): boolean {
  const stored = otpStore.get(identifier);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }
  const hash = hashOtp(otp);
  const valid = crypto.timingSafeEqual(
    Buffer.from(stored.hash, "hex"),
    Buffer.from(hash, "hex")
  );
  if (valid) otpStore.delete(identifier);
  return valid;
}
