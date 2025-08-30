// api/embed/route.ts
import { NextResponse } from "next/server";
import { embeddingModel } from "@/lib/gemini";
import { supabase } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json({ error: "Type and data are required" }, { status: 400 });
    }

    // Pick embedding text depending on table
    let embedText = "";
    if (type === "places") {
      embedText = `${data.name}. ${data.description}`;
    } else if (type === "hotels") {
      embedText = `${data.name}. ${data.city}. Rating: ${data.rating}`;
    } else if (type === "events") {
      embedText = `${data.title}. ${data.description}`;
    }

    // Generate embedding from Gemini
    const result = await embeddingModel.embedContent(embedText);
    const embedding = result.embedding?.values;

    if (!embedding) {
      console.error("No embedding returned from Gemini:", result);
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
    }

    // Insert into Supabase with embedding
    const { error } = await supabase.from(type).insert([{ ...data, embedding }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to insert record" }, { status: 500 });
    }

    return NextResponse.json({ message: `${type} added successfully` });
  } catch (err) {
    console.error("Admin submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
