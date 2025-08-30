"use client";

import { useState, useEffect } from "react";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    async function search() {
      setLoading(true);
      try {
        // Step 1: Get embedding from Gemini
       const embedRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "models/text-embedding-004",
      content: { parts: [{ text: query }] },
    }),
  }
);


        const embedJson = await embedRes.json();
console.log("Gemini embed response:", embedJson);

const embedding = embedJson.embedding?.values;
if (!embedding) throw new Error("No embedding generated");



        // Step 2: Query Supabase search_all function
        const supabaseRes = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embedding, query: debouncedQuery }),
        });

        const supabaseJson = await supabaseRes.json();

        if (supabaseJson?.results?.length > 0) {
          setResults(supabaseJson.results);
        } else {
          // Step 3: Fallback → Gemini generates answer
        const genRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: query }] }],
    }),
  }
);


          const genJson = await genRes.json();
          const generatedText =
            genJson.candidates?.[0]?.content?.parts?.[0]?.text ??
            "Sorry, I couldn’t generate an answer.";

          setResults([{ type: "ai", text: generatedText }]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }

    search();
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search events, places, hotels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-base sm:text-lg"
      />

      {/* Results */}
      <div className="mt-4 space-y-3">
        {loading && <p className="text-gray-500">Searching...</p>}
        {!loading && results.length === 0 && query && (
          <p className="text-gray-400">No results yet...</p>
        )}
        {results.map((r, i) =>
          r.type === "ai" ? (
            <div
              key={i}
              className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 shadow-sm"
            >
              {r.text}
            </div>
          ) : (
            <div
              key={i}
              className="p-4 border rounded-2xl shadow-sm bg-white hover:bg-gray-50"
            >
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
              <p className="text-xs text-gray-400">{r.type}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
