// app/TravelCustomers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Package, Calendar, DollarSign, Hash } from "lucide-react";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type TravelProduct = {
  product_id: string;
  package_name: string;
  categories: any[];
  org_name: string;
  thumbnail: string;
};

type ConsumerProfile = {
  id: string;
  full_name: string;
  email: string;
  booked_travels: any[];
};

type CustomerBooking = {
  consumerId: string;
  fullName: string;
  email: string;
  productId: string;
  packageName: string;
  category: string;
  bookedAt: string;
  paymentStatus: string;
  pricing: {
    inr: number;
    eth: number;
    btc: number;
  };
};

export default function TravelCustomers() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [travelProducts, setTravelProducts] = useState<TravelProduct[]>([]);
  const [consumerProfiles, setConsumerProfiles] = useState<ConsumerProfile[]>([]);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }

      // Get travel products for this user
      const { data: productsData } = await supabase
        .from("travel_products")
        .select("product_id, package_name, categories, org_name, thumbnail")
        .eq("user_id", user.id);

      if (productsData) {
        setTravelProducts(productsData);
        
        // If there are products, select the first one by default
        if (productsData.length > 0) {
          setSelectedProduct(productsData[0].product_id);
        }
      }

      // Get all consumer profiles with name and email
      const { data: consumersData } = await supabase
        .from("consumer_profiles")
        .select("id, full_name, email, booked_travels");

      if (consumersData) {
        setConsumerProfiles(consumersData);
        
        // Process the bookings
        const bookings: CustomerBooking[] = [];
        
        consumersData.forEach(consumer => {
          if (consumer.booked_travels && consumer.booked_travels.length > 0) {
            consumer.booked_travels.forEach((booking: any) => {
              if (booking.product_id) {
                bookings.push({
                  consumerId: consumer.id,
                  fullName: consumer.full_name || "Unknown",
                  email: consumer.email || "Unknown",
                  productId: booking.product_id,
                  packageName: "", // Will be filled later
                  category: booking.category || "Unknown",
                  bookedAt: booking.booked_at || "Unknown date",
                  paymentStatus: booking.payment_status || "Unknown",
                  pricing: booking.pricing || { inr: 0, eth: 0, btc: 0 }
                });
              }
            });
          }
        });
        
        setCustomerBookings(bookings);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Match bookings with product names
  const getBookingsWithProductInfo = () => {
    return customerBookings
      .filter(booking => !selectedProduct || booking.productId === selectedProduct)
      .map(booking => {
        const product = travelProducts.find(p => p.product_id === booking.productId);
        return {
          ...booking,
          packageName: product ? product.package_name : "Unknown Package",
          orgName: product ? product.org_name : "Unknown Organization"
        };
      });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Access Required</h2>
          <p className="text-blue-700 mb-6">You need to be logged in as a business to view this page.</p>
          <button 
            onClick={() => router.push("/auth/login")}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const filteredBookings = getBookingsWithProductInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Travel Customers
          </h1>
          <p className="text-blue-700 mt-2">
            View which customers have purchased your travel products
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Filter Bookings</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-blue-700 mb-1">Select Product</label>
              <select 
                value={selectedProduct || ""}
                onChange={(e) => setSelectedProduct(e.target.value || null)}
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-blue-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-blue-50"
              >
                <option value="">All Products</option>
                {travelProducts.map(product => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.package_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-400 bg-opacity-25 mr-4">
                <Hash className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-80">Total Bookings</p>
                <p className="text-2xl font-bold">{filteredBookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-400 bg-opacity-25 mr-4">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-80">Products Offered</p>
                <p className="text-2xl font-bold">{travelProducts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-400 bg-opacity-25 mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm opacity-80">Unique Customers</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredBookings.map(b => b.consumerId)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-200">
          <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-xl font-semibold text-purple-700">
              {selectedProduct ? "Product Bookings" : "All Bookings"}
            </h2>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-700 mb-2">No bookings found</h3>
              <p className="text-blue-500">
                {selectedProduct 
                  ? "No customers have booked this product yet." 
                  : "No customers have booked any of your products yet."
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Booking Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Price (INR)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredBookings.map((booking, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-blue-900">
                              {booking.fullName}
                            </div>
                            <div className="text-xs text-blue-600">
                              ID: {booking.consumerId.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm text-blue-700">{booking.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-700">{booking.packageName}</div>
                        <div className="text-xs text-blue-600">{booking.orgName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {booking.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        ₹{booking.pricing.inr.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.paymentStatus === "complete" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">About This Data</h3>
          <p className="text-blue-700 mb-2">
            This page shows customers who have booked your travel products. You can filter by specific products
            to see which customers have purchased each offering.
          </p>
          <p className="text-blue-700">
            The data comes from your travel products in the database and customer booking information.
          </p>
        </div>
      </div>
    </div>
  );
}