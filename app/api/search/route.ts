//api/search/route.ts

import { NextResponse } from 'next/server';
// import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/utils/supabase/server';
// app/api/search/route.ts

// POST /api/search
export async function POST(req: Request) {
  try {
    const { embedding, query, limit = 5 } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: "Embedding is required" },
        { status: 400 }
      );
    }

    // Call your SQL function search_all (instead of match_documents)
    const { data, error } = await supabase.rpc("search_all", {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: limit,
    });

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json(
        { error: "Failed to search in Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
