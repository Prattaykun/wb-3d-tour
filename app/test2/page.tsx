//app/payment/razorpay/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/server";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RazorpayPage() {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("consumer_profiles")
        .select("booked_travels")
        .eq("id", user.id)
        .single();

      if (!error && data?.booked_travels) {
        const cartItems = data.booked_travels.filter(
          (item: any) => !item.payment_status
        );

        const totalInr = cartItems.reduce(
          (acc: number, item: any) => acc + (item.pricing?.inr || 0),
          0
        );

        setTotal(totalInr);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  // Function to update consumer profile with full name and email
  const updateConsumerProfile = async (userId: string) => {
    // Fetch user details from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return;
    }

    // Update consumer_profiles with full_name and email
    const { error: updateError } = await supabase
      .from("consumer_profiles")
      .update({
        full_name: profileData.full_name,
        email: profileData.email
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating consumer profile:", updateError);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Update consumer profile with full name and email
    await updateConsumerProfile(user.id);

    // Fetch current booked travels
    const { data, error } = await supabase
      .from("consumer_profiles")
      .select("booked_travels")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Update with payment_status = complete
    const updatedTravels = data.booked_travels.map((item: any) => ({
      ...item,
      payment_status: "complete",
    }));

    await supabase
      .from("consumer_profiles")
      .update({ booked_travels: updatedTravels })
      .eq("id", user.id);

    setLoading(false);
    router.push("/TravelCheckout");
  };

  if (loading) {
    return <p className="p-6 text-lg">Processing...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <Card className="p-10 max-w-md text-center shadow-2xl rounded-2xl bg-white">
        <h1 className="text-3xl font-bold mb-6">Razorpay Payment</h1>
        <p className="text-lg mb-4">Amount to Pay:</p>
        <p className="text-4xl font-extrabold text-green-600 mb-6">
          ₹{total.toLocaleString()}
        </p>
        <Button
          onClick={handlePayment}
          className="w-full py-3 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg rounded-xl transition-all duration-300"
        >
          Pay Now
        </Button>
      </Card>
    </div>
  );
}