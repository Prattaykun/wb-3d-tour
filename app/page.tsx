"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
// import Image from "next/image"
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

/**
 * Notes:
 * - Kept all sections & elements you had, but reduced heavy fixed layers/backdrop-blur.
 * - Minimal framer-motion (hero + small reveals) to avoid scroll jank in Capacitor.
 * - Uses next/image for better performance and lazy-loading on mobile.
 * - Avoids multiple fixed/absolute glowing orbs; uses one lightweight background gradient.
 * - Adds motion-safe utilities & will-change for smoother transforms on low-end devices.
 */

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const destinationCategories = useMemo(
    () => [
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
          {
            name: "Kalimpong Hills",
            img: "/media/front/kalimpong-monasteries.png",
            description: "Serene hills with monasteries",
          },
          {
            name: "Susunia Hill",
            img: "/media/front/susunia-hill-carvings.png",
            description: "Ancient rock carvings and trekking",
          },
          {
            name: "Ayodhya Hills",
            img: "/media/front/ayodhya-hills-purulia.png",
            description: "Red soil hills and tribal culture",
          },
        ],
      },
      {
        title: "Beaches & Coastal",
        icon: <Waves className="w-6 h-6" />,
        destinations: [
          {
            name: "New Digha Beach",
            img: "/media/front/new-digha-beach.png",
            description: "Golden sands of Bay of Bengal",
          },
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
    ],
    []
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-slate-100 to-teal-200 overflow-x-hidden">
      {/* Lightweight background gradient (replaces many fixed orbs) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_70%)]" />

      {/* Top badge (kept) */}
      <div className="absolute top-3 right-4 text-xs text-slate-500/70 select-none tracking-[0.2em] z-10 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40 shadow-sm">
        DGPRC.pvt
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow ring-1 ring-white/40 bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-teal-700 via-cyan-600 to-teal-800 bg-clip-text">
                WB Tour
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Explore Bengal</p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 text-slate-700 font-semibold">
            <a href="#destinations" className="hover:text-teal-600 transition-colors">Destinations</a>
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
            <Button
              className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 text-white rounded-xl px-6 py-2 shadow"
              onClick={() => router.push("/tourselect")}
            >
              Book Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-teal-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu (simple fade, no heavy transforms) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/30 bg-white/95 backdrop-blur-xl animate-[fadeIn_160ms_ease-out] will-change-transform">
            <div className="flex flex-col p-4 gap-2">
              <a href="#destinations" className="px-2 py-3 rounded-lg hover:bg-teal-50" onClick={() => setIsMobileMenuOpen(false)}>
                Destinations
              </a>
              <a href="#how-it-works" className="px-2 py-3 rounded-lg hover:bg-teal-50" onClick={() => setIsMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#contact" className="px-2 py-3 rounded-lg hover:bg-teal-50" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </a>
              <Button
                className="mt-2 bg-teal-600 text-white rounded-xl py-3"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  router.push("/tourselect")
                }}
              >
                Book Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative text-center py-14 sm:py-20 lg:py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
              Discover the Beauty of
            </span>
            <span className="block bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700 bg-clip-text text-transparent">
              West Bengal
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Explore terracotta temples, lush forests, majestic mountains, pristine beaches, vibrant culture, and scenic landscapes — all in one journey through Bengal.
          </p>

          <div className="mt-8 sm:mt-10 mx-auto max-w-3xl bg-white/80 backdrop-blur-xl shadow-lg p-3 sm:p-4 rounded-2xl border border-white/40">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2.5 bg-white/90 flex-1">
                <Search className="text-teal-600 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search destinations, hotels, or itineraries..."
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-base"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 text-white rounded-xl px-6 py-3 shadow transition-colors"
                onClick={() => router.push("/frontpage")}
              >
                Search <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature trio (kept) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 px-4 sm:px-6 lg:px-20 py-14 sm:py-18 text-center">
        {[
          {
            icon: <MapPin className="w-12 h-12 mx-auto text-teal-600" />,
            title: "Rich Heritage",
            desc: "Bishnupur's terracotta temples, Nawabi palaces, and UNESCO World Heritage sites.",
          },
          {
            icon: <Compass className="w-12 h-12 mx-auto text-cyan-600" />,
            title: "Nature & Hills",
            desc: "Experience Darjeeling hills, Sundarbans, and diverse landscapes from mountains to beaches.",
          },
          {
            icon: <Stars className="w-12 h-12 mx-auto text-purple-600" />,
            title: "Festivals & Culture",
            desc: "Experience Durga Puja grandeur, Baul music, Jatra theatre, and authentic Bengali traditions.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white/85 backdrop-blur-sm shadow-lg rounded-3xl p-8 border border-white/30 transition-transform motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01] will-change-transform"
          >
            <div className="mb-5">{f.icon}</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">{f.title}</h3>
            <p className="text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Destination Categories */}
      <section
        id="destinations"
        className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-white/60 to-slate-50/40"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-10 sm:mb-14 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent">
          Explore West Bengal by Category
        </h2>

        <div className="space-y-14 sm:space-y-16">
          {destinationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-7">
              <div className="flex items-center justify-center gap-3">
                <div className="p-3 bg-gradient-to-br from-teal-500/15 to-cyan-500/15 rounded-2xl text-teal-700 shadow">
                  {category.icon}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {category.destinations.map((destination, index) => (
                  <article
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-md rounded-2xl border border-white/40 overflow-hidden transition-transform motion-safe:hover:-translate-y-1 will-change-transform"
                  >
                    <div className="relative h-48 sm:h-56">
                      <img
                        src={destination.img || "/placeholder.svg"}
                        alt={destination.name}
                         className="absolute inset-0 w-full h-full object-cover"
                         loading="lazy"
                         />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button
                          className="w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow"
                          aria-label="Save"
                        >
                          <Heart className="w-4.5 h-4.5 text-red-500" />
                        </button>
                        <button
                          className="w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow"
                          aria-label="Share"
                        >
                          <Share2 className="w-4.5 h-4.5 text-slate-700" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{destination.name}</h4>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{destination.description}</p>
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 font-semibold"
                        onClick={() => router.push("/tourselect")}
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20 text-center bg-gradient-to-br from-teal-50/60 to-cyan-50/50"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-12 sm:mb-16 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/30 transition-transform motion-safe:hover:-translate-y-1 will-change-transform"
            >
              <div className={`text-6xl font-black mb-4 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.step}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">{s.title}</h3>
              <p className="text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 text-white py-14 sm:py-16"
      >
        <div className="px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">WB Tour</h3>
                  <p className="text-teal-300 text-sm font-medium">Explore Bengal</p>
                </div>
              </div>
              <p className="text-slate-300">
                Discover the incredible beauty and rich heritage of West Bengal with expert guidance and local insights.
              </p>
            </div>

            <div className="text-center">
              <h4 className="text-xl font-bold mb-5 text-teal-300">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 hover:text-teal-300">
                  <Phone className="w-5 h-5" />
                  <span>+91 9983611110</span>
                </div>
                <div className="flex items-center justify-center gap-3 hover:text-teal-300">
                  <Mail className="w-5 h-5" />
                  <span>wbtour@travel.co.pvt</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-xl font-bold mb-5 text-teal-300">Quick Links</h4>
              <div className="space-y-2">
                <a href="#destinations" className="block hover:text-teal-300">Destinations</a>
                <a href="#how-it-works" className="block hover:text-teal-300">How It Works</a>
                <a href="#contact" className="block hover:text-teal-300">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-base font-medium mb-3">© {new Date().getFullYear()} WB Tour | DGPRC.pvt</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-teal-300">Privacy Policy</a>
              <a href="#" className="hover:text-teal-300">Terms of Service</a>
              <a href="#" className="hover:text-teal-300">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Simple keyframe for mobile menu */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
