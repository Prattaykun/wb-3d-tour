import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, IndianRupee, Clock, MapPin, Utensils, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TravelProductCardProps {
  productId: string;
  onDelete?: () => void;
}

export default function TravelProductCard1({ productId, onDelete }: TravelProductCardProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [bookedCategory, setBookedCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductAndRole = async () => {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("travel_products")
        .select("*")
        .eq("product_id", productId)
        .single();

      if (!productError) setProduct(productData);

      // Fetch user + role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role) setRole(profile.role);

        // Fetch consumer booked categories
        const { data: consumer } = await supabase
          .from("consumer_profiles")
          .select("booked_travels")
          .eq("id", user.id)
          .single();

        if (consumer?.booked_travels) {
          const booked = Array.isArray(consumer.booked_travels)
            ? consumer.booked_travels
            : JSON.parse(consumer.booked_travels);

          const match = booked.find((b: any) => b.product_id === productId);
          if (match?.category) setBookedCategory(match.category);
        }
      }

      setLoading(false);
    };

    fetchProductAndRole();
  }, [productId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    const { error } = await supabase.from("travel_products").delete().eq("product_id", productId);

    if (!error && onDelete) onDelete();
  };

  if (loading) return <div className="p-4 bg-gray-100 rounded-xl animate-pulse h-64"></div>;
  if (!product) return <p className="p-4 bg-red-50 text-red-600 rounded-xl">Product not found.</p>;

  // Parse categories
  let categories: any[] = [];
  try {
    categories =
      typeof product.categories === "string"
        ? JSON.parse(product.categories)
        : product.categories || [];
  } catch {
    categories = [];
  }

  // ✅ Only show the booked category
  const filteredCategories = bookedCategory
    ? categories.filter((cat: any) => cat.categoryName === bookedCategory)
    : [];

  const canDelete = role === "business" || role === "admin";

  return (
    <>
      {/* Main Card */}
      <Card className="relative shadow-lg rounded-2xl overflow-hidden border-0 transition-all duration-300 hover:shadow-xl">
        <CardContent onClick={() => setShowOverlay(true)} className="cursor-pointer p-0">
          <div className="relative">
            <Image
              src={product.thumbnail}
              alt={product.package_name}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h2 className="text-xl font-bold">{product.package_name}</h2>
              <p className="text-sm opacity-90">{product.org_name}</p>
            </div>
            {filteredCategories[0] && (
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {filteredCategories[0].days}D/{filteredCategories[0].nights}N
              </div>
            )}
          </div>

          {/* ✅ Pricing only for booked category */}
          <div className="p-4">
            {filteredCategories.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-lg font-semibold">
                  <IndianRupee size={20} /> {filteredCategories[0].pricing.inr}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Image src="/media/icons/bitcoin.png" alt="BTC" width={16} height={16} />{" "}
                  {filteredCategories[0].pricing.btc}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Image src="/media/icons/ethereum.png" alt="ETH" width={16} height={16} />{" "}
                  {filteredCategories[0].pricing.eth}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overlay */}
      {showOverlay && filteredCategories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-h-[90vh] overflow-y-auto w-full max-w-4xl relative">
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative h-64">
              <Image
                src={product.thumbnail}
                alt={product.package_name}
                fill
                className="object-cover rounded-t-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h2 className="text-3xl font-bold">{product.package_name}</h2>
                <p className="text-lg opacity-90">{product.org_name}</p>
              </div>
            </div>

            <div className="p-6">
              {filteredCategories.map((cat: any, i: number) => (
                <div key={i} className="mb-8 last:mb-0 border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{cat.categoryName}</h3>
                    <span className="ml-auto text-gray-500">
                      {cat.days}D / {cat.nights}N
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-lg font-semibold text-gray-800">
                      <IndianRupee size={20} /> {cat.pricing.inr}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Image src="/media/icons/bitcoin.png" alt="BTC" width={16} height={16} /> {cat.pricing.btc}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Image src="/media/icons/ethereum.png" alt="ETH" width={16} height={16} /> {cat.pricing.eth}
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="space-y-6">
                    {cat.itinerary.map((day: any, d: number) => (
                      <div key={d} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Day {day.dayNumber}
                        </h4>

                        {/* Food Section */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <Utensils size={16} />
                            Meals Included
                          </h5>
                          <div className="space-y-3">
                            {Object.entries(day.food).map(([meal, details]: any) => (
                              <div key={meal} className="flex gap-3">
                                <div className="flex-shrink-0 w-20 font-medium capitalize text-gray-600">
                                  {meal}:
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap gap-2">
                                    {details.items.map((item: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm"
                                      >
                                        {item.images[0] && (
                                          <Image
                                            src={item.images[0]}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="rounded object-cover"
                                          />
                                        )}
                                        <span className="text-sm">{item.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sites Section */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <MapPin size={16} />
                            Places to Visit
                          </h5>
                          <div className="space-y-3">
                            {day.sites.map((site: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-3 bg-white p-3 rounded-md shadow-sm"
                              >
                                {site.images[0] && (
                                  <Image
                                    src={site.images[0]}
                                    alt={site.name}
                                    width={60}
                                    height={60}
                                    className="rounded object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{site.name}</p>
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <Clock size={14} />
                                    <span>{site.stayHours} hours</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
