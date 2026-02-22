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
    const status = isGemini && (e as GeminiError).status ? (e as GeminiError).status : 500;
    const apiMessage = isGemini ? (e as GeminiError).apiMessage : undefined;
    const model = isGemini ? (e as GeminiError).model : undefined;

    // Always log full details in terminal for debugging
    console.error("[POST /api/generate] Error:", {
      name: err.name,
      message: err.message,
      ...(model && { model }),
      ...(apiMessage && { apiMessage }),
      ...(status && { status }),
    });

    const errorMessage = err.message || "Failed to generate message";
    const payload: Record<string, unknown> = {
      error: errorMessage,
    };
    if (isDev) {
      payload.debug = {
        detail: apiMessage ?? errorMessage,
        model: model ?? null,
        hint: "Check GEMINI_API_KEY in .env.local and try setting GEMINI_MODEL=gemini-1.5-flash (or another model from Google AI Studio).",
      };
    }

    return NextResponse.json(payload, { status: status && status >= 400 ? status : 500 });
  }
}
