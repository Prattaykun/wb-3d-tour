// app/(business)/(travel)/TravelProductList/page.tsx

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TravelProductCard from "@/components/travel/TravelProductCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TravelProductListPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("travel_products")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setProducts(data || []);
      setLoading(false);
    };

    fetchUserAndProducts();
  }, []);

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.product_id !== productId));
  };

  const filteredProducts = products.filter((p) =>
    p.package_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg text-muted-foreground animate-pulse">
        Loading your travel packages...
      </div>
    );

  if (!userId)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-semibold text-muted-foreground">
        Please log in to view your packages.
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary drop-shadow-sm">
          ✈️ My Travel Packages
        </h1>
        <Button
          onClick={() => router.push("/TravelProductsForm")}
          className="flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
        >
          + New Package
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <Input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-primary/60 shadow-md"
        />
        <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.product_id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <TravelProductCard
                  productId={product.product_id}
                  onDelete={() => handleDelete(product.product_id)}
                //   className="rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.01] bg-white border border-gray-100 overflow-hidden"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-center text-lg text-muted-foreground mt-20">
          No packages found. Try a different search or {" "}
          <span
            onClick={() => router.push("/TravelProductsForm")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            create a new one
          </span>
          .
        </p>
      )}
    </div>
  );
}
