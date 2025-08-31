import { NextResponse } from "next/server";
import { textModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await textModel.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "⚠️ Error connecting to Gemini." },
      { status: 500 }
    );
  }
}
