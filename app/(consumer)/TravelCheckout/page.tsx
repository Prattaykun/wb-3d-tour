// app/(consumer)/TravelCheckout/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import TravelProductCard1 from "@/components/travel/TravelProductCard1";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TravelCheckout() {
  const [cart, setCart] = useState<any[]>([]);
  const [booked, setBooked] = useState<any[]>([]);
  const [currency, setCurrency] = useState<"inr" | "btc" | "eth">("inr");
  const [loading, setLoading] = useState(true);
  const [showBooked, setShowBooked] = useState(false);
  const router = useRouter();
  // add this state at the top with other states
const [expandedBooked, setExpandedBooked] = useState<string | null>(null);

  // Fetch cart and booked
  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("consumer_profiles")
        .select("booked_travels")
        .eq("id", user.id)
        .single();

      if (!error && data?.booked_travels) {
        const allTravels = data.booked_travels;
        setCart(allTravels.filter((item: any) => !item.payment_status));
        setBooked(allTravels.filter((item: any) => item.payment_status === "complete"));
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleRemove = async (product_id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updated = cart.filter((item) => item.product_id !== product_id);
    setCart(updated);

    // also update in DB
    await supabase
      .from("consumer_profiles")
      .update({ booked_travels: [...updated, ...booked] })
      .eq("id", user.id);
  };

  const handleAddTrip = () => {
    router.push("/PlanTrip");
  };

  const handleCheckout = () => {
    if (currency === "inr") {
      router.push("/payment/razorpay");
    } else {
      router.push(`/payment/crypto?currency=${currency}`);
    }
  };

  // Calculate totals
  const totals = cart.reduce(
    (acc, item) => {
      acc.inr += Number(item.pricing?.inr || 0);
      acc.btc += Number(item.pricing?.btc || 0);
      acc.eth += Number(item.pricing?.eth || 0);
      return acc;
    },
    { inr: 0, btc: 0, eth: 0 }
  );

  if (loading) return <p className="p-6">Loading checkout...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
{/* Booked Packages Section */}
<section>
  <Button
    className="mb-4 bg-purple-600 hover:bg-purple-700 transition-all duration-300"
    onClick={() => setShowBooked(!showBooked)}
  >
    {showBooked ? "Hide" : "Show"} Booked Packages
  </Button>

  {showBooked && (
    <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-inner animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4">Your Booked Packages</h2>
      {booked.length === 0 ? (
        <p className="text-gray-600">No completed bookings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {booked
            .filter((item) => item.payment_status === "complete") // ✅ only approved ones
            .map((item, index) => (
              <Card
                key={`booked-${item.product_id}-${index}`}
                className="p-4 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl"
              >
                {/* Show the actual product details */}
                <TravelProductCard1 productId={item.product_id} />

                {/* Payment details */}
                <div className="mt-3 space-y-1">
                  <p className="text-green-700 font-bold text-lg">
                    ₹{item.pricing?.inr?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Booked on {new Date(item.booked_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs mt-1 text-green-600 font-semibold">
                    Status: {item.payment_status}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  )}
</section>

      {/* Cart Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-4">No trips added yet.</p>
            <Button onClick={handleAddTrip}>Plan a Trip</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {cart.map((item, index) => (
              <div key={`cart-${item.product_id}-${index}`} className="relative">
                <TravelProductCard1
                  productId={item.product_id}
                  onDelete={() => handleRemove(item.product_id)}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 bg-red-100 text-red-700 hover:bg-red-200 border-none shadow-sm"
                  onClick={() => handleRemove(item.product_id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6">
          <Button onClick={handleAddTrip} className="bg-blue-600 hover:bg-blue-700">
            + Add Another Trip
          </Button>
        </div>
      </section>

      {/* Currency Tabs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Select Currency</h2>
        <div className="flex gap-4 mb-6">
          <Button
            variant={currency === "inr" ? "default" : "outline"}
            onClick={() => setCurrency("inr")}
          >
            <Image src="/media/icons/inr.png" alt="INR" width={20} height={20} />
            INR
          </Button>
          <Button
            variant={currency === "btc" ? "default" : "outline"}
            onClick={() => setCurrency("btc")}
          >
            <Image src="/media/icons/bitcoin.png" alt="BTC" width={20} height={20} />
            Bitcoin
          </Button>
          <Button
            variant={currency === "eth" ? "default" : "outline"}
            onClick={() => setCurrency("eth")}
          >
            <Image src="/media/icons/ethereum.png" alt="ETH" width={20} height={20} />
            Ethereum
          </Button>
        </div>

        {/* Totals */}
        <Card className="p-6 shadow-xl rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Total Amount</h3>
          <p className="text-2xl font-bold mb-6">
            {currency === "inr" && `₹${totals.inr.toLocaleString()}`}
            {currency === "btc" && `${totals.btc} BTC`}
            {currency === "eth" && `${totals.eth} ETH`}
          </p>
          <Button
            className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 shadow-md rounded-xl transition-all duration-300"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Card>
      </section>
    </div>
  );
}
