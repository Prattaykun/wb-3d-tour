"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  MapPin,
  Compass,
  Stars,
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
import { useState } from "react"

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const destinationCategories = [
    {
      title: "Wildlife & Nature",
      icon: <TreePine className="w-6 h-6" />,
      destinations: [
        {
          name: "Sundarbans Mangroves",
          img: "/media/sundarbans.webp",
          description: "Royal Bengal Tigers in mangrove forests",
        },
        {
          name: "Jaldapara National Park",
          img: "/media/front/jaldapara-rhino-elephants.png",
          description: "One-horned rhinoceros and elephants",
        },
        {
          name: "Gorumara National Park",
          img: "/media/front/gorumara-wildlife-elephants.jpg",
          description: "Dense forests and diverse wildlife",
        },
        {
          name: "Buxa Tiger Reserve",
          img: "/media/front/buxa-tiger-reserve-landscape.png",
          description: "Tigers in mountainous terrain",
        },
      ],
    },
    {
      title: "Mountains & Hills",
      icon: <Mountain className="w-6 h-6" />,
      destinations: [
        {
          name: "Darjeeling Hills",
          img: "/media/front/darjeeling-tea-gardens.png",
          description: "Tea gardens and Himalayan views",
        },
        { name: "Kalimpong Hills", img: "/media/front/kalimpong-monasteries.png", description: "Serene hills with monasteries" },
        { name: "Susunia Hill", img: "/media/front/susunia-hill-carvings.png", description: "Ancient rock carvings and trekking" },
        { name: "Ayodhya Hills", img: "/media/front/ayodhya-hills-purulia.png", description: "Red soil hills and tribal culture" },
      ],
    },
    {
      title: "Beaches & Coastal",
      icon: <Waves className="w-6 h-6" />,
      destinations: [
        { name: "New Digha Beach", img: "/media/front/new-digha-beach.png", description: "Golden sands of Bay of Bengal" },
        {
          name: "Mandarmani Beach",
          img: "/media/front/mandarmani-motorable-beach.png",
          description: "Longest motorable beach in India",
        },
        {
          name: "Tajpur Beach",
          img: "/media/front/Sunset_in_Tajpur_Beach.jpg",
          description: "Pristine coastline with red crabs",
        },
        {
          name: "Shankarpur Beach",
          img: "/media/front/sankha.jpg",
          description: "Fishing village and coastal life",
        },
      ],
    },
    {
      title: "Heritage & Culture",
      icon: <Camera className="w-6 h-6" />,
      destinations: [
        {
          name: "Bishnupur Terracotta Temples",
          img: "/media/front/ancient-terracotta-temples.png",
          description: "Ancient terracotta temple art and Baluchari sarees",
        },
        {
          name: "Victoria Memorial",
          img: "/media/front/victoria-memorial-kolkata.png",
          description: "Iconic British-era architecture and museum",
        },
        {
          name: "Murshidabad Palace",
          img: "/media/front/nawabi-palace.png",
          description: "Nawabi heritage, silk weaving, and palaces",
        },
        {
          name: "Cooch Behar Palace",
          img: "/media/front/bengal-royal-palace.png",
          description: "Royal palace and Rajbongshi culture",
        },
      ],
    },
    {
      title: "Festivals & Celebrations",
      icon: <Calendar className="w-6 h-6" />,
      destinations: [
        {
          name: "Durga Puja Pandals",
          img: "/media/front/durga-puja-pandal-kolkata.png",
          description: "Grand celebrations with artistic pandals and cultural programs",
        },
        {
          name: "Kali Puja Night",
          img: "/media/front/illuminated-kali-temple-night-festival.png",
          description: "Mystical night celebrations with fireworks and devotion",
        },
        {
          name: "Poila Boishakh",
          img: "/media/front/bengali-new-year.png",
          description: "Bengali New Year with traditional food and cultural events",
        },
        {
          name: "Jagaddhatri Puja",
          img: "/media/front/jagaddhatri-idol.png",
          description: "Post-Durga Puja celebration unique to Bengal",
        },
      ],
    },
    {
      title: "Arts & Traditions",
      icon: <Music className="w-6 h-6" />,
      destinations: [
        {
          name: "Baul Folk Music",
          img: "/media/front/baul-musicians-performing.png",
          description: "Mystical folk singers and their spiritual music traditions",
        },
        {
          name: "Jatra Folk Theatre",
          img: "/media/front/colorful-jatra-performance.png",
          description: "Traditional Bengali folk theatre with vibrant performances",
        },
        {
          name: "Patachitra Scroll Art",
          img: "/media/front/bengali-scroll-painting.png",
          description: "Ancient scroll paintings depicting mythological tales",
        },
        {
          name: "Dhokra Metal Craft",
          img: "/media/front/metal.webp",
          description: "Ancient lost-wax casting technique creating brass figurines",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-slate-100 to-teal-200 relative overflow-x-hidden">
  {/* Radial glow layers */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.25),transparent_65%)] pointer-events-none" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.22),transparent_70%)] pointer-events-none" />

  {/* Floating blurred orbs */}
  <div className="absolute top-24 left-14 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse" />
  <div className="absolute bottom-36 right-20 w-[28rem] h-[28rem] bg-teal-500/25 rounded-full blur-3xl animate-ping" />
<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 w-2 h-2 bg-teal-400/30 rounded-full animate-pulse" />
      <div
        className="fixed top-40 right-32 w-1 h-1 bg-cyan-500/40 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="fixed top-60 right-20 w-1.5 h-1.5 bg-teal-300/35 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="fixed top-0 right-0 w-40 h-40 opacity-[0.03] pointer-events-none z-0">
        <img
          src="/victoria-memorial-kolkata.png"
          alt="West Bengal Heritage"
          className="w-full h-full object-cover rounded-bl-3xl"
        />
      </div>

      <div className="absolute top-3 right-4 text-xs text-slate-400/60 select-none tracking-[0.2em] z-10 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
        DGPRC.pvt
      </div>

      <nav className="flex justify-between items-center p-4 sm:p-6 lg:px-20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-teal-500/5 border-b border-white/20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25 ring-2 ring-white/20">
            <Globe className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-800 bg-clip-text drop-shadow-sm">
              WB Tour
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Explore Bengal</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8 text-slate-700 font-semibold">
          <a
            href="#destinations"
            className="hover:text-teal-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-teal-50/50 group"
          >
            <MapPin className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
            Destinations
          </a>
          <a
            href="#how-it-works"
            className="hover:text-teal-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-teal-50/50 group"
          >
            <Compass className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
            How It Works
          </a>
          <a
            href="#contact"
            className="hover:text-teal-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-teal-50/50 group"
          >
            <Phone className="w-4 h-4 group-hover:text-teal-500 transition-colors" />
            Contact
          </a>
          <Button className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white rounded-2xl px-8 py-3 shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/30 font-semibold"
          onClick={() => router.push("/tourselect")}>
            Book Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/20 md:hidden"
          >
            <div className="flex flex-col space-y-4 p-6">
              <a
                href="#destinations"
                className="flex items-center gap-3 text-slate-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-xl hover:bg-teal-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="w-5 h-5" />
                Destinations
              </a>
              <a
                href="#how-it-works"
                className="flex items-center gap-3 text-slate-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-xl hover:bg-teal-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Compass className="w-5 h-5" />
                How It Works
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 text-slate-700 hover:text-teal-600 transition-colors py-3 px-4 rounded-xl hover:bg-teal-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                Contact
              </a>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl py-4 shadow-lg mt-4 font-semibold"
              onClick={() => router.push("/tourselect")}>
                Book Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      <section className="text-center py-20 sm:py-24 lg:py-32 px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-700 bg-clip-text text-transparent drop-shadow-2xl px-2">
            Discover the Beauty of
            <span className="block bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
              West Bengal
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-600 max-w-5xl mx-auto px-4 leading-relaxed font-medium"
          >
            Explore terracotta temples, lush forests, majestic mountains, pristine beaches, vibrant culture, and scenic
            landscapes — all in one journey through Bengal.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-4 max-w-3xl mx-auto bg-white/70 backdrop-blur-xl shadow-2xl shadow-teal-500/10 p-4 sm:p-6 rounded-3xl border border-white/30 ring-1 ring-teal-500/10"
        >
          <div className="flex items-center gap-4 w-full sm:flex-1">
            <Search className="text-teal-600 w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, hotels, or itineraries..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 text-lg placeholder:text-slate-400 font-medium"
            />
          </div>
          <Button
            className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white rounded-2xl px-8 py-4 shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl font-semibold text-lg w-full sm:w-auto"
            onClick={() => router.push("/frontpage")}
          >
            Search
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-20 py-20 sm:py-24 text-center">
        {[
          {
            icon: <MapPin className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-teal-600" />,
            title: "Rich Heritage",
            desc: "Bishnupur's terracotta temples, Nawabi palaces, and UNESCO World Heritage sites.",
            gradient: "from-orange-500/10 to-red-500/10",
          },
          {
            icon: <Compass className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-cyan-600" />,
            title: "Nature & Hills",
            desc: "Experience Darjeeling hills, Sundarbans, and diverse landscapes from mountains to beaches.",
            gradient: "from-green-500/10 to-teal-500/10",
          },
          {
            icon: <Stars className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-purple-600" />,
            title: "Festivals & Culture",
            desc: "Experience Durga Puja grandeur, Baul music, Jatra theatre, and authentic Bengali traditions.",
            gradient: "from-purple-500/10 to-pink-500/10",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, y: -10 }}
            className={`bg-gradient-to-br ${f.gradient} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl p-8 sm:p-10 lg:p-12 border border-white/20 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-slate-800">{f.title}</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section
        id="destinations"
        className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-white/50 to-slate-50/30"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-16 sm:mb-20 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent"
        >
          Explore West Bengal by Category
        </motion.h2>

        <div className="space-y-20 sm:space-y-24">
          {destinationCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="space-y-8 sm:space-y-12"
            >
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="p-4 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl text-teal-600 shadow-lg">
                  {category.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {category.destinations.map((destination, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden border border-white/30 group relative"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={destination.img || "/placeholder.svg"}
                        alt={destination.name}
                        className="h-56 sm:h-64 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4 text-red-500" />
                        </button>
                        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                          <Share2 className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                        {destination.name}
                      </h4>
                      <p className="text-sm sm:text-base text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                        {destination.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 text-teal-700 font-semibold py-3 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 bg-transparent"
                      onClick={() => router.push("/tourselect")}>
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-20 text-center bg-gradient-to-br from-teal-50/50 to-cyan-50/30"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black mb-16 sm:mb-20 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {[
            {
              step: "1",
              title: "Search",
              desc: "Find destinations, hotels, and itineraries tailored to your preferences and budget.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              step: "2",
              title: "Plan",
              desc: "Organize your journey and discover cultural, natural, and adventure highlights.",
              color: "from-teal-500 to-green-500",
            },
            {
              step: "3",
              title: "Travel",
              desc: "Enjoy your West Bengal trip with seamless bookings and local support.",
              color: "from-purple-500 to-pink-500",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-white/80 backdrop-blur-sm p-8 sm:p-10 lg:p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 group relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div
                  className={`text-6xl sm:text-7xl font-black mb-6 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}
                >
                  {s.step}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-slate-800">{s.title}</h3>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer
        id="contact"
        className="bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 text-white py-16 sm:py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
        <div className="px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">WB Tour</h3>
                  <p className="text-teal-300 text-sm font-medium">Explore Bengal</p>
                </div>
              </div>
              <p className="text-slate-300 text-base leading-relaxed">
                Discover the incredible beauty and rich heritage of West Bengal with expert guidance and local insights.
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-bold mb-6 text-teal-300">Contact Us</h4>
              <div className="space-y-4 text-base">
                <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span>+91 9983611110</span>
                </div>
                <div className="flex items-center justify-center gap-3 hover:text-teal-300 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>wbtour@travel.co.pvt</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold mb-6 text-teal-300">Quick Links</h4>
              <div className="space-y-3 text-base">
                <a href="#destinations" className="block hover:text-teal-300 transition-colors duration-300">
                  Destinations
                </a>
                <a href="#how-it-works" className="block hover:text-teal-300 transition-colors duration-300">
                  How It Works
                </a>
                <a href="#contact" className="block hover:text-teal-300 transition-colors duration-300">
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-lg font-semibold mb-4">© {new Date().getFullYear()} WB Tour | DGPRC.pvt</p>
            <div className="flex justify-center space-x-8 text-base">
              <a href="#" className="hover:text-teal-300 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-teal-300 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-teal-300 transition-colors duration-300">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
