"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import path from "path";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  return (
      <SessionContextProvider supabaseClient={supabase}>
      {pathname !== "/map" && pathname !== "/MyTourPlan" && pathname !== "/test" && <Navbar />}
      {pathname !== "/map" && pathname !== "/MyTourPlan" && <Menu />}

      {children}

      {pathname !== "/map" && pathname !== "/MyTourPlan" && <BottomNav />}
      {pathname !== "/map" && pathname !== "/MyTourPlan" && pathname !== "/test" && pathname !== "/ArtisanProductForm" && <Footer />}
    </SessionContextProvider>
  );
}
