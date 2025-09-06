// app/api/travel-search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { embedding, query, limit = 12 } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: "Embedding is required" },
        { status: 400 }
      );
    }

    // Call pgvector similarity search on travel_products
    const { data, error } = await supabase.rpc("match_travel_products", {
      query_embedding: embedding,
      match_threshold: 0.4,
      match_count: limit,
    });

    if (error) {
      console.error("Supabase travel search error:", error);
      return NextResponse.json(
        { error: "Failed to search travel products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (err) {
    console.error("Travel Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
