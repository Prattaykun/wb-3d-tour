"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Compass, Stars, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white relative overflow-x-hidden">
      {/* Watermark */}
      <div className="absolute top-2 right-4 text-xs text-gray-400 select-none tracking-widest">
        DGPRC.pvt
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 md:px-20 backdrop-blur-md bg-white/60 sticky top-0 z-50 shadow-sm">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"
        >
          WB Tour
        </motion.h1>
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#destinations" className="hover:text-rose-600 transition">Destinations</a>
          <a href="#how-it-works" className="hover:text-rose-600 transition">How It Works</a>
          <a href="#contact" className="hover:text-rose-600 transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Discover the Beauty of West Bengal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
        >
          Explore terracotta temples, lush forests, vibrant culture, and scenic landscapes — all in one journey through Bengal.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-3 max-w-xl mx-auto bg-white/80 backdrop-blur-md shadow-xl p-4 rounded-2xl border border-rose-100"
        >
          <Search className="text-rose-500 w-6 h-6" />
          <input
            type="text"
            placeholder="Search destinations, hotels, or itineraries..."
            className="flex-1 bg-transparent border-none outline-none text-gray-800 text-sm sm:text-base"
          />
          <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl px-6 shadow-md transition">
            Search
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-20 py-20 text-center">
        {[
          { icon: <MapPin className="w-10 h-10 mx-auto text-rose-500" />, title: "Rich Heritage", desc: "Bishnupur’s terracotta temples, Bankura’s traditional art, and cultural landmarks." },
          { icon: <Compass className="w-10 h-10 mx-auto text-rose-500" />, title: "Nature & Hills", desc: "Experience Susunia Hill, Joypur Forest, Jhilimili, and Garh Panchkot’s scenic beauty." },
          { icon: <Stars className="w-10 h-10 mx-auto text-rose-500" />, title: "Local Culture", desc: "Immerse yourself in folk art, music, cuisine, and warm hospitality." },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg hover:shadow-2xl transition rounded-3xl p-10 border border-gray-100"
          >
            {f.icon}
            <h3 className="text-xl md:text-2xl font-bold mt-4 text-gray-800">{f.title}</h3>
            <p className="text-gray-600 mt-3 text-sm md:text-base">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Destinations */}
      <section id="destinations" className="py-24 px-6 md:px-20 bg-gradient-to-b from-rose-50 to-pink-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-rose-600">
          Top Destinations in West Bengal
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { name: "Bishnupur Terracotta Temples", img: "/media/Bankura/bishnupur-terracotta.jpg" },
            { name: "Sundarbans Mangroves", img: "/media/sundarbans.webp" },
            { name: "Raimatang", img: "/media/Alipurduar District/raim.jpg" },
            { name: "Jaldapara National Park", img: "/media/Alipurduar District/jaldapara-wildlife.jpg" },
            { name: "New Digha Beach", img: "/media/digha/digha-beach-bay-of-bengal.png" },
            { name: "Victoria Memorial", img: "/media/victoria-memorial-kolkata.png" },
          ].map((d, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md hover:shadow-xl transition rounded-3xl overflow-hidden border border-gray-100"
            >
              <img src={d.img} alt={d.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{d.name}</h3>
                <Button variant="outline" className="mt-4 w-full rounded-xl border-rose-300 hover:bg-rose-50">
                  Explore
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-14 text-rose-600">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { step: "1", title: "Search", desc: "Find destinations, hotels, and itineraries tailored to your trip." },
            { step: "2", title: "Plan", desc: "Organize your journey and discover cultural & natural highlights." },
            { step: "3", title: "Travel", desc: "Enjoy your West Bengal trip with a smooth experience." },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition border border-gray-100"
            >
              <div className="text-rose-500 text-5xl font-extrabold">{s.step}</div>
              <h3 className="text-xl md:text-2xl font-semibold mt-4 text-gray-800">{s.title}</h3>
              <p className="text-gray-600 mt-3 text-sm md:text-base">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-r from-rose-600 to-pink-700 text-white py-10 text-center">
        <p className="text-lg font-medium">© {new Date().getFullYear()} WB Tour | DGPRC.pvt</p>
        <p className="text-sm mt-2 opacity-80">Contact: 9983611110 | wbtour@travel.co.pvt</p>
      </footer>
    </div>
  );
}
