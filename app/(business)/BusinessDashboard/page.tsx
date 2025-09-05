"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Mail, Phone, Briefcase, Link as LinkIcon, Pencil } from "lucide-react";

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
};

export default function BusinessDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        setProfile(data as BusinessProfile);
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
        No business profile found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-xl overflow-hidden">
        {/* Header with profile image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="absolute -bottom-16 left-8">
            <img
              src={profile.images?.[0] || "/media/icons/business.png"}
              alt="Profile"
              className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
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
                  {profile.business_types.map((t, i) => (
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
                  {profile.links.map((l, i) => (
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
          </div>
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
