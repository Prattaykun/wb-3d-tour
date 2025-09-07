"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Map, User, Briefcase, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  id: string;
  name: string | null;
  role: "consumer" | "business" | null;
};

export default function MenuToggle() {
  const handleBusinessAction = () => {
    window.location.href = "/BusinessLoader";
  };
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id,full_name,role")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            id: data.id,
            name: data.full_name,
            role: data.role,
          });
        }
      }
    };

    getProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthAction = async () => {
    if (profile) {
      await supabase.auth.signOut();
      setProfile(null);
    } else {
      window.location.href = "/auth/login";
    }
  };



  // ✨ Toggle Button CSS
  const buttonClasses =
    "relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer " +
    "bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200";

  return (
    <div
      className="fixed top-26 left-5 z-60" // 📍 Position adjust here
    >
      {/* Toggle Button */}
      <motion.div
        className={buttonClasses}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {open ? (
          <X className="text-gray-600" />
        ) : profile ? (
          <span className="font-bold text-gray-700">
            {profile.name?.[0].toUpperCase() ?? "U"}
          </span>
        ) : (
          <img
            src="/media/icons/toilet.png"
            alt="guest"
            className="w-6 h-6 opacity-70"
          />
        )}
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-3 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden" // 📍 Adjust dropdown width/position here
          >
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">
                {profile?.name ?? "Guest User"}
              </p>
              <p className="text-xs text-gray-500">
                {profile?.role ? profile.role.toUpperCase() : "No Role"}
              </p>
            </div>

            <div className="flex flex-col">
              {/* My Account */}
              <button className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-gray-700">
                <span className="text-sm">My Account</span>
                <User size={18} className="text-blue-500" />
              </button>

              {/* Consumer only */}
              {profile?.role === "consumer" && (
                <button
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-gray-700"
                  onClick={() => window.location.href = "/MyTourPlan"}
                >
                  <span className="text-sm">My Tour Plans</span>
                  <Map size={18} className="text-green-500" />
                </button>
              )}

              {/* Business only */}
              {profile?.role === "business" && (
                <button
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-gray-700"
                  onClick={handleBusinessAction}
                >
                  <span className="text-sm">Business Status</span>
                  <Briefcase size={18} className="text-purple-500" />
                </button>
              )}

              {/* Auth */}
              <button
                onClick={handleAuthAction}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-gray-700"
              >
                <span className="text-sm">
                  {profile ? "Logout" : "Login"}
                </span>
                {profile ? (
                  <LogOut size={18} className="text-red-500" />
                ) : (
                  <LogIn size={18} className="text-red-500" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
