"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/map" && pathname !== "/MyTourPlan" && <Navbar />}
      {pathname !== "/map" && pathname !== "/MyTourPlan" && <Menu />}

      {children}

      {pathname !== "/map" && pathname !== "/MyTourPlan" && <BottomNav />}

      {pathname !== "/map" && pathname !== "/MyTourPlan" && <Footer />}
    </>
  );
}
