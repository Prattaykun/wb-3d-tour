"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar, Map, User, Search } from "lucide-react";
import { createPageUrl } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Discover", path: createPageUrl("Discover"), icon: Compass },
    { name: "Events", path: createPageUrl("Events"), icon: Calendar },
    { name: "Map", path: createPageUrl("Map"), icon: Map },
    { name: "Profile", path: createPageUrl("Profile"), icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden"> {/* 👈 hidden on tablets/desktops */}
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-white/20 text-white transform scale-110 shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mb-1 ${active ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-white" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button className="w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300">
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
