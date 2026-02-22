import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

export async function generateMarketingMessage(
  context: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new GeminiError("GEMINI_API_KEY is missing in .env.local");
  }

  const prompt = `You are a marketing copywriter. Generate a short, engaging marketing message (2-4 sentences, suitable for WhatsApp/SMS). Plain text only.

Context: ${context}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Could not generate message."
    );
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new GeminiError(error.message);
  }
}