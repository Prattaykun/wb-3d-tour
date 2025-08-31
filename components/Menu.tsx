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

    // 🔑 also subscribe to auth changes so UI updates correctly
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

  // Gradient animated border
  const borderClasses =
    "relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer " +
    "bg-white shadow-md " +
    "before:absolute before:inset-0 before:rounded-full before:p-[2px] " +
    "before:bg-gradient-to-r before:from-blue-500 before:via-green-500 before:to-purple-500 " +
    "before:animate-[spin_3s_linear_infinite] before:-z-10";

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.div
        className={borderClasses}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {open ? (
          <X className="text-gray-700 animate-spin-slow" />
        ) : profile ? (
          <span className="font-bold text-gray-700">
            {profile.name?.[0].toUpperCase() ?? "U"}
          </span>
        ) : (
          <img
            src="/media/icons/toilet.png"
            alt="guest"
            className="w-6 h-6 opacity-80"
          />
        )}
      </motion.div>

      {/* Menu Options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-14 top-0 flex flex-col gap-3"
          >
            {/* My Account */}
            <motion.div
              whileHover={{ x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium">My Account</span>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
            </motion.div>

            {/* Role specific */}
            {profile?.role === "consumer" && (
              <motion.div
                whileHover={{ x: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-medium">My Tour Plans</span>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Map size={18} className="text-green-600" />
                </div>
              </motion.div>
            )}

            {profile?.role === "business" && (
              <motion.div
                whileHover={{ x: -10 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-medium">Business Status</span>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Briefcase size={18} className="text-purple-600" />
                </div>
              </motion.div>
            )}

            {/* Auth Option */}
            <motion.div
              whileHover={{ x: -10 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleAuthAction}
            >
              <span className="text-sm font-medium">
                {profile ? "Logout" : "Login"}
              </span>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                {profile ? (
                  <LogOut size={18} className="text-red-600" />
                ) : (
                  <LogIn size={18} className="text-red-600" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
