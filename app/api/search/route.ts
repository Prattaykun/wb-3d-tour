// app/api/search/route.ts
import { NextResponse } from 'next/server';
import { embeddingModel } from '@/lib/gemini';
import { supabase } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { query, limit = 12 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Generate embedding from query using Gemini
    const result = await embeddingModel.embedContent(query);
    const embedding = result.embedding?.values;

    if (!embedding) {
      console.error("No embedding returned from Gemini:", result);
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 }
      );
    }

    // Search across all tables using the RPC function
  const { data, error } = await supabase.rpc("search_all", {
  query_embedding: embedding,
  match_threshold: 0.45,
  match_count: limit,
});

if (error) {
  console.error("Supabase search error details:", error);
  return NextResponse.json(
    { 
      error: "Failed to search in Supabase",
      // Include details only in development
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    },
    { status: 500 }
  );
}

    // Format the results with consistent structure
    const formattedResults = data.map((item: any) => {
      const baseResult = {
        id: item.id,
        name: item.name || item.title,
        description: item.description || null,
        image: item.images?.[0] || item.image_url || null,
      };

      // Add type-specific fields
      if (item.table_name === 'places') {
        return {
          ...baseResult,
          type: 'place',
          rating: item.rating || null,
          location: item.city || null,
          category: item.category || null,
        };
      } else if (item.table_name === 'hotels') {
        return {
          ...baseResult,
          type: 'hotel',
          rating: item.rating || null,
          location: item.city || null,
          priceBand: item.priceBand || null,
        };
      } else if (item.table_name === 'events') {
        return {
          ...baseResult,
          type: 'event',
          location: item.city || item.venue || null,
          date: item.start_date || null,
          category: item.category || null,
        };
      }

      return baseResult;
    });

    return NextResponse.json({ results: formattedResults });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}