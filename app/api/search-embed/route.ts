// app/api/search-embed/route.ts
import { NextResponse } from "next/server";
import { embeddingModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input text is required" },
        { status: 400 }
      );
    }

    // Call Gemini embedding
    const result = await embeddingModel.embedContent(input);
    const embedding = result.embedding?.values;

    if (!embedding) {
      console.error("No embedding returned from Gemini:", result);
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 }
      );
    }

    return NextResponse.json({ embedding });
  } catch (err) {
    console.error("Embedding API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
