"use client";

import { Phone, Mail } from "lucide-react";
import { smoothScrollTo } from "@/lib/scroll";

export default function Footer() {
  const go = (id: string) => smoothScrollTo(id);

  return (
    <footer
      id="contact"
      className="bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 text-white py-16 relative overflow-hidden max-sm:hidden"
    >
      <div className="absolute inset-0 bg-radial-footer pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo + Description (click to top) */}
          <div className="text-center md:text-left">
            <button
              onClick={() => go("top")}
              className="flex items-center justify-center md:justify-start gap-4 mb-6 focus:outline-none"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <img src="/media/flight.png" alt="WB Tour Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-3xl font-black">WB Tour</h3>
                <p className="text-teal-300 text-sm font-medium">Explore Bengal</p>
              </div>
            </button>
            <p className="text-gray-300">Discover the beauty and heritage of West Bengal with local insights.</p>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4 text-teal-300">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition">
                <Phone className="w-5 h-5" />
                <span>+91 99836 11110</span>
              </div>
              <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition">
                <Mail className="w-5 h-5" />
                <span>wbtour@travel.co.pvt</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h4 className="text-xl font-bold mb-4 text-teal-300">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => go("destinations")} className="hover:text-teal-300 transition block mx-auto md:mx-0">
                Destinations
              </button>
              <button onClick={() => go("how-it-works")} className="hover:text-teal-300 transition block mx-auto md:mx-0">
                How It Works
              </button>
              <button onClick={() => go("contact")} className="hover:text-teal-300 transition block mx-auto md:mx-0">
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p>© {new Date().getFullYear()} WB Tour | DGPRC.pvt</p>
        </div>
      </div>
    </footer>
  );
}
