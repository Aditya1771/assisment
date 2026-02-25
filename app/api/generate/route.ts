import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateMarketingMessage, GeminiError } from "@/utils/gemini";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const context = body?.context;
    if (!context || typeof context !== "string") {
      return NextResponse.json(
        { error: "Context is required", debug: { received: typeof body?.context } },
        { status: 400 }
      );
    }
    const message = await generateMarketingMessage(context.trim());
    return NextResponse.json({ message });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const isGemini = e instanceof GeminiError;
    const status = 500;

    // Always log full details in terminal for debugging
    console.error("[POST /api/generate] Error:", {
      name: err.name,
      message: err.message,
      isGemini,
      status,
    });

    const errorMessage = err.message || "Failed to generate message";
    const payload: Record<string, unknown> = {
      error: errorMessage,
    };
    if (isDev) {
      payload.debug = {
        detail: errorMessage,
        hint: "Check GEMINI_API_KEY in .env.local and ensure the API key is valid.",
      };
    }

    return NextResponse.json(payload, { status: status && status >= 400 ? status : 500 });
  }
}
