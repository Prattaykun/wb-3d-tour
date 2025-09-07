// app/plantrip/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import TravelProductCard from "@/components/travel/TravelProductCard2";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAGE_SIZE = 12;

export default function PlanTripPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // --- Fetch paginated travel packages (default) ---
  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("travel_products")
      .select("*", { count: "exact" })
      .range(from, to);

    if (!error) {
      setProducts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  // --- Vector Search API Call ---
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      fetchProducts(1);
      setPage(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

   // Step 1: get embedding
const embeddingResponse = await fetch("/api/search-embed", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ input: query }),
});

      const { embedding } = await embeddingResponse.json();

// Step 2: call travel search API
const response = await fetch("/api/travel-search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ embedding, query, limit: 50 }),
});

      const { results } = await response.json();
      setProducts(results || []);
      setTotalCount(results?.length || 0);
      setPage(1);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler (1s delay)
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      searchProducts(q);
    }, 1000),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      fetchProducts(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!isSearching) fetchProducts(page);
  }, [page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder=" Search travel packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-primary/60 shadow-md"
        />
        <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh] text-lg text-muted-foreground animate-pulse">
          Loading travel packages...
        </div>
      ) : products.length > 0 ? (
        <>
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {products
                .slice(
                  (page - 1) * PAGE_SIZE,
                  isSearching ? products.length : page * PAGE_SIZE
                )
                .map((product) => (
                  <motion.div
                    key={product.product_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <TravelProductCard productId={product.product_id} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    page === p
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-lg text-muted-foreground mt-20">
          No packages found. Try another search.
        </p>
      )}
    </div>
  );
}
