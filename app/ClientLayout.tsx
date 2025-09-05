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
      {pathname !== "/map" && <Navbar />}
      {pathname !== "/map" && <Menu />}
     
      {children}
      
      {pathname !== "/map" && <BottomNav />}
      
      {pathname !== "/map" && <Footer />}
    </>
  );
}
