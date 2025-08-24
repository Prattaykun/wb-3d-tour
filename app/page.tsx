"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  // MapPin,
  // Compass,
  // Stars,
  Mountain,
  Waves,
  TreePine,
  Camera,
  Calendar,
  Music,
  Menu,
  X,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/BottomNav"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const destinationCategories = [
    {
      title: "Wildlife & Nature",
      icon: <TreePine className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "Sundarbans Mangroves", img: "/media/sundarbans.webp", description: "Royal Bengal Tigers in mangrove forests" },
        { name: "Jaldapara National Park", img: "/media/front/jaldapara-rhino-elephants.png", description: "One-horned rhinoceros and elephants" },
        { name: "Gorumara National Park", img: "/media/front/gorumara-wildlife-elephants.jpg", description: "Dense forests and diverse wildlife" },
        { name: "Buxa Tiger Reserve", img: "/media/front/buxa-tiger-reserve-landscape.png", description: "Tigers in mountainous terrain" },
      ],
    },
    {
      title: "Mountains & Hills",
      icon: <Mountain className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "Darjeeling Hills", img: "/media/front/darjeeling-tea-gardens.png", description: "Tea gardens and Himalayan views" },
        { name: "Kalimpong Hills", img: "/media/front/kalimpong-monasteries.png", description: "Serene hills with monasteries" },
        { name: "Susunia Hill", img: "/media/front/susunia-hill-carvings.png", description: "Ancient rock carvings and trekking" },
        { name: "Ayodhya Hills", img: "/media/front/ayodhya-hills-purulia.png", description: "Red soil hills and tribal culture" },
      ],
    },
    {
      title: "Beaches & Coastal",
      icon: <Waves className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "New Digha Beach", img: "/media/front/new-digha-beach.png", description: "Golden sands of Bay of Bengal" },
        { name: "Mandarmani Beach", img: "/media/front/mandarmani-motorable-beach.png", description: "Longest motorable beach in India" },
        { name: "Tajpur Beach", img: "/media/front/Sunset_in_Tajpur_Beach.jpg", description: "Pristine coastline with red crabs" },
        { name: "Shankarpur Beach", img: "/media/front/sankha.jpg", description: "Fishing village and coastal life" },
      ],
    },
    {
      title: "Heritage & Culture",
      icon: <Camera className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "Bishnupur Terracotta Temples", img: "/media/front/ancient-terracotta-temples.png", description: "Ancient terracotta temple art and Baluchari sarees" },
        { name: "Victoria Memorial", img: "/media/front/victoria-memorial-kolkata.png", description: "Iconic British-era architecture and museum" },
        { name: "Murshidabad Palace", img: "/media/front/nawabi-palace.png", description: "Nawabi heritage, silk weaving, and palaces" },
        { name: "Cooch Behar Palace", img: "/media/front/bengal-royal-palace.png", description: "Royal palace and Rajbongshi culture" },
      ],
    },
    {
      title: "Festivals & Celebrations",
      icon: <Calendar className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "Durga Puja Pandals", img: "/media/front/durga-puja-pandal-kolkata.png", description: "Grand celebrations with artistic pandals and cultural programs" },
        { name: "Kali Puja Night", img: "/media/front/illuminated-kali-temple-night-festival.png", description: "Mystical night celebrations with fireworks and devotion" },
        { name: "Poila Boishakh", img: "/media/front/bengali-new-year.png", description: "Bengali New Year with traditional food and cultural events" },
        { name: "Jagaddhatri Puja", img: "/media/front/jagaddhatri-idol.png", description: "Post-Durga Puja celebration unique to Bengal" },
      ],
    },
    {
      title: "Arts & Traditions",
      icon: <Music className="w-6 h-6 text-teal-600" />,
      destinations: [
        { name: "Baul Folk Music", img: "/media/front/baul-musicians-performing.png", description: "Mystical folk singers and their spiritual music traditions" },
        { name: "Jatra Folk Theatre", img: "/media/front/colorful-jatra-performance.png", description: "Traditional Bengali folk theatre with vibrant performances" },
        { name: "Patachitra Scroll Art", img: "/media/front/bengali-scroll-painting.png", description: "Ancient scroll paintings depicting mythological tales" },
        { name: "Dhokra Metal Craft", img: "/media/front/metal.webp", description: "Ancient lost-wax casting technique creating brass figurines" },
      ],
    },
  ]

  return (
    <><div className="relative min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#ffffff] to-[#b2ebf2] overflow-x-hidden">

      {/* Decorative Glows */}
      <div className="absolute inset-0 bg-radial-premium1 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-premium2 pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-24 left-14 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-36 right-20 w-[28rem] h-[28rem] bg-teal-500/25 rounded-full blur-3xl animate-ping-slow" />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/70 border-b border-white/20 shadow-lg sticky top-0 z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl ring-1 ring-white/30">
            <Globe className="w-7 h-7 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent drop-shadow-lg">WB Tour</h1>
            <p className="text-sm text-gray-600 font-medium">Explore Bengal</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-6 font-semibold text-gray-700">
          <a href="#destinations" className="hover:text-teal-600 transition hover:scale-105 px-3 py-2 rounded-lg">Destinations</a>
          <a href="#how-it-works" className="hover:text-teal-600 transition hover:scale-105 px-3 py-2 rounded-lg">How It Works</a>
          <a href="#contact" className="hover:text-teal-600 transition hover:scale-105 px-3 py-2 rounded-lg">Contact</a>
          <Button
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
            onClick={() => router.push("/tourselect")}
          >
            Book Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-teal-600 rounded-lg transition">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl border-t border-white/20 md:hidden">
            <div className="flex flex-col space-y-4 p-6">
              <a href="#destinations" className="py-3 px-4 rounded-xl hover:bg-teal-50/50 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Destinations</a>
              <a href="#how-it-works" className="py-3 px-4 rounded-xl hover:bg-teal-50/50 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <a href="#contact" className="py-3 px-4 rounded-xl hover:bg-teal-50/50 hover:text-teal-600" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-4 rounded-xl" onClick={() => router.push("/tourselect")}>Book Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-teal-700 via-cyan-500 to-teal-800 bg-clip-text text-transparent drop-shadow-xl mb-6">
            Discover the Beauty of <span className="block">West Bengal</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">Explore terracotta temples, lush forests, majestic mountains, pristine beaches, vibrant culture, and scenic landscapes — all in one journey through Bengal.</p>
        </motion.div>

        <motion.div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6">
          <div className="flex items-center gap-4 flex-1">
            <Search className="w-6 h-6 text-teal-600" />
            <input type="text" placeholder="Search destinations, hotels, or itineraries..." className="flex-1 outline-none border-none bg-transparent text-gray-700 text-lg placeholder-gray-400" />
          </div>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-4 px-8 rounded-xl hover:scale-105 transition" onClick={() => router.push("/map")}>
            Search <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="py-24 px-6 bg-gradient-to-b from-white/70 to-gray-50">
        <motion.h2 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-gray-800 to-teal-700 bg-clip-text text-transparent">Explore West Bengal by Category</motion.h2>
        <div className="space-y-20">
          {destinationCategories.map((category, i) => (
            <motion.div key={i} className="space-y-8">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="p-4 bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 rounded-2xl text-teal-600 shadow-lg">{category.icon}</div>
                <h3 className="text-3xl font-bold text-gray-800">{category.title}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.destinations.map((d, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05, y: -8 }} className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20 group relative">
                    <div className="relative overflow-hidden">
                      <img src={d.img} alt={d.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Heart className="w-4 h-4 text-red-500" /></button>
                        <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Share2 className="w-4 h-4 text-gray-700" /></button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{d.name}</h4>
                      <p className="text-gray-600 mb-4">{d.description}</p>
                      <Button
                        className="w-full rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black shadow-lg transition-all"
                        onClick={() => router.push("/tourselect")}
                      >
                        Explore <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 text-center bg-gradient-to-br from-teal-50/50 to-cyan-50/30">
        <motion.h2 className="text-4xl font-extrabold mb-16 bg-gradient-to-r from-gray-800 to-teal-700 bg-clip-text text-transparent">How It Works</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              step: "1",
              title: "Search",
              desc: "Find destinations, hotels, and itineraries tailored to your preferences and budget.",
              color: "from-blue-700 to-cyan-700",
            },
            {
              step: "2",
              title: "Plan",
              desc: "Organize your journey and discover cultural, natural, and adventure highlights.",
              color: "from-teal-700 to-green-700",
            },
            {
              step: "3",
              title: "Travel",
              desc: "Enjoy your West Bengal trip with seamless bookings and local support.",
              color: "from-purple-700 to-pink-700",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-700 text-white"
            >
              <div className={`text-6xl font-black mb-4 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.step}
              </div>
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-gray-200">{s.desc}</p>
            </motion.div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-footer pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">WB Tour</h3>
                  <p className="text-teal-300 text-sm font-medium">Explore Bengal</p>
                </div>
              </div>
              <p className="text-gray-300">Discover the beauty and heritage of West Bengal with local insights.</p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4 text-teal-300">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition"><Phone className="w-5 h-5" /><span>+91 9983611110</span></div>
                <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition"><Mail className="w-5 h-5" /><span>wbtour@travel.co.pvt</span></div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold mb-4 text-teal-300">Quick Links</h4>
              <div className="space-y-2">
                <a href="#destinations" className="hover:text-teal-300 transition">Destinations</a>
                <a href="#how-it-works" className="hover:text-teal-300 transition">How It Works</a>
                <a href="#contact" className="hover:text-teal-300 transition">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p>© {new Date().getFullYear()} WB Tour | DGPRC.pvt</p>
          </div>
        </div>
      </footer>
    </div><BottomNav /></>
  )
}
