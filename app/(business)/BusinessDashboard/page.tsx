// app/BusinessDashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Mail, Phone, Briefcase, Link as LinkIcon, Pencil, Image as ImageIcon } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type BusinessProfile = {
  id: string;
  org_name: string;
  email: string;
  phone: string;
  business_types: string[];
  links: string[];
  images: string[];
  created_at: string;
  updated_at: string;
};

export default function BusinessDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        // Handle the images field properly
        let images = [];
        if (Array.isArray(data.images)) {
          images = data.images;
        } else if (typeof data.images === 'string') {
          try {
            // Try to parse if it's a JSON string
            images = JSON.parse(data.images);
          } catch (e) {
            console.error("Error parsing images:", e);
            images = [];
          }
        }
        
        setProfile({ ...data, images } as BusinessProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    const confirmEdit = window.confirm(
      "Do you want to edit your business profile?"
    );
    if (confirmEdit) {
      router.push("/BusinessForm");
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading your business dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        No business profile found. <br />
        <button 
          onClick={() => router.push("/BusinessForm")}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-xl overflow-hidden">
        {/* Header with profile image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="absolute -bottom-16 left-8">
            {profile.images && profile.images.length > 0 && profile.images[0] ? (
              <img
                src={profile.images[0]}
                alt="Profile"
                className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* ✏️ Edit Button */}
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 text-sm font-medium text-purple-700 shadow hover:bg-white transition"
          >
            <Pencil size={16} /> Edit Profile
          </button>
        </div>

        {/* Content */}
        <div className="pt-20 px-8 pb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {profile.org_name}
          </h1>
          <p className="text-sm text-gray-500 mb-6">Business Profile Overview</p>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Email */}
            <Card>
              <CardIcon>
                <Mail className="text-purple-600" size={20} />
              </CardIcon>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-800">
                  {profile.email}
                </p>
              </div>
            </Card>

            {/* Phone */}
            <Card>
              <CardIcon>
                <Phone className="text-pink-600" size={20} />
              </CardIcon>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-gray-800">
                  {profile.phone}
                </p>
              </div>
            </Card>

            {/* Business Types */}
            <Card className="sm:col-span-2">
              <CardIcon>
                <Briefcase className="text-indigo-600" size={20} />
              </CardIcon>
              <div>
                <p className="text-sm text-gray-500">Business Types</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile.business_types && profile.business_types.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-sm font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Links */}
            <Card className="sm:col-span-2">
              <CardIcon>
                <LinkIcon className="text-blue-600" size={20} />
              </CardIcon>
              <div>
                <p className="text-sm text-gray-500">Links</p>
                <ul className="mt-2 space-y-2">
                  {profile.links && profile.links.map((l, i) => (
                    <li key={i}>
                      <a
                        href={l}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Images
            {profile.images && profile.images.length > 0 && (
              <Card className="sm:col-span-2">
                <CardIcon>
                  <ImageIcon className="text-green-600" size={20} />
                </CardIcon>
                <div>
                  <p className="text-sm text-gray-500">Uploaded Images</p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={img}
                          alt={`Business image ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <a 
                            href={img} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded"
                          >
                            View Full
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )} */}
          </div>
          
          {/* Travel Products Section */}
          {profile.business_types && profile.business_types.includes("travel agency") && (
            <div className="mt-10 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-purple-800 mb-3">
                Travel Products
              </h2>
              <p className="text-gray-600 mb-6">
                Manage and showcase your travel packages directly from your dashboard.
              </p>
              <button
                onClick={() => router.push("/TravelProductList")}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition"
              >
                Go to Travel Product List →
              </button>
            </div>
          )}
          {profile.business_types && profile.business_types.includes("travel agency") && (
            <div className="mt-10 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-purple-800 mb-3">
                Travel Customers
              </h2>
              <p className="text-gray-600 mb-6">
                Manage your travel customers and their bookings.
              </p>
              <button
                onClick={() => router.push("/TravelCustomers")}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition"
              >
                Go to Travel Customer List →
              </button>
            </div>
          )}
          {profile.business_types && profile.business_types.includes("artisan") && (
            <div className="mt-10 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-pink-50 to-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-purple-800 mb-3">
                Artisan Products
              </h2>
              <p className="text-gray-600 mb-6">
                Manage and showcase Artifacts and Shops directly on our Tour platform.
              </p>
              <button
                onClick={() => router.push("/ArtifactProductList")}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition"
              >
                Go to Artifact Product List →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
}

function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
      {children}
    </div>
  );
}