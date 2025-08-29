"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type EventItem = {
  id: string;
  title: string;
  category: string;
  start_date: string;
  end_date?: string;
  venue: string;
  city: string;
  description: string;
  image_url?: string;
  ticket_price?: string;
  contact_info?: string;
  featured?: boolean;
};

function getEventStatus(event: EventItem) {
  const now = new Date();
  const start = new Date(event.start_date);
  const end = event.end_date ? new Date(event.end_date) : start;

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Ongoing";
  return "Completed";
}


export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showOngoingOnly, setShowOngoingOnly] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const handleShare = () => {
  const shareData = {
    title: selectedEvent?.title,
    text: selectedEvent?.description,
    url: window.location.href + `?event=${selectedEvent?.id}`, // optional deep link
  };

  if (navigator.share) {
    navigator.share(shareData).catch(console.error);
  } else {
    navigator.clipboard.writeText(shareData.url);
    alert("Event link copied to clipboard 📋");
  }
};
const handleAddToCalendar = () => {
  if (!selectedEvent) return;

  const start = new Date(selectedEvent.start_date)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";
  const end = new Date(selectedEvent.end_date || selectedEvent.start_date)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${selectedEvent.title}
DESCRIPTION:${selectedEvent.description}
LOCATION:${selectedEvent.venue}, ${selectedEvent.city}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${selectedEvent.title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleBookTickets = () => {
  if (selectedEvent?.contact_info) {
    window.location.href = `mailto:${selectedEvent.contact_info}?subject=Booking Enquiry: ${selectedEvent.title}`;
  } else {
    alert("Booking info not available yet.");
  }
};



  const categories = ["Festivals", "Music", "Dance", "Theater", "Art"];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        console.error("❌ Error fetching events:", error.message);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

const filtered = useMemo(() => {
  // Deduplicate by event id
  const uniqueEvents = Array.from(new Map(events.map(ev => [ev.id, ev])).values());

  return uniqueEvents.filter((ev) => {
    if (activeCategory && ev.category !== activeCategory) return false;
    if (showOngoingOnly && getEventStatus(ev) !== "Ongoing") return false;
    if (query) {
      const q = query.toLowerCase();
      if (
        !ev.title.toLowerCase().includes(q) &&
        !ev.city.toLowerCase().includes(q) &&
        !ev.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}, [query, activeCategory, showOngoingOnly, events]);


  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-10 px-4">
      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">
              Explore West Bengal
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
              Discover festivals, concerts, exhibitions, and more across the state
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <input
              aria-label="Search events"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, city or description"
              className="w-64 md:w-80 pl-4 pr-10 py-2 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 placeholder-gray-500"
/>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showOngoingOnly}
                onChange={() => setShowOngoingOnly((s) => !s)}
                className="w-4 h-4 rounded"
              />
              Ongoing only
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              activeCategory === null
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-700 border border-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory((c) => (c === cat ? null : cat))}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <p className="text-center text-slate-500">Loading events...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            <p className="text-lg">No events found</p>
            <p className="text-sm mt-2">
              Try adjusting filters or search for something else
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ev) => {
              const status = getEventStatus(ev);
              return (
                <article
                  key={ev.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div className="h-44 w-full relative bg-gray-100">
                    {ev.image_url ? (
                      <img
                        src={ev.image_url}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                      {ev.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">
                      {ev.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 flex-1 line-clamp-3">
                      {ev.description}
                    </p>

                    <div className="mt-3 text-sm text-slate-500">
                      📍 {ev.city} • {ev.venue}
                    </div>

                    <div className="mt-2 text-sm text-slate-500">
                      🗓 {new Date(ev.start_date).toLocaleDateString()}{" "}
                      {ev.end_date
                        ? `– ${new Date(ev.end_date).toLocaleDateString()}`
                        : ""}
                    </div>

                    {ev.ticket_price && (
                      <div className="mt-1 text-sm text-slate-700">
                        🎟 Ticket: {ev.ticket_price}
                      </div>
                    )}

                    {ev.contact_info && (
                      <div className="mt-1 text-sm text-slate-700">
                        📞 Contact: {ev.contact_info}
                      </div>
                    )}

                    <div
                      className={`mt-3 text-xs font-medium ${
                        status === "Ongoing"
                          ? "text-emerald-600"
                          : status === "Upcoming"
                          ? "text-blue-600"
                          : "text-slate-500"
                      }`}
                    >
                      {status}
                    </div>

                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

     {/* Modal for Event Details */}
{selectedEvent && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-48 sm:h-64 w-full">
        {selectedEvent.image_url ? (
          <img
            src={selectedEvent.image_url}
            alt={selectedEvent.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-t-2xl">
            No image
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-3 sm:p-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white drop-shadow">
            {selectedEvent.title}
          </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-2 right-2 z-50 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm sm:w-10 sm:h-10 sm:text-lg hover:bg-black/90"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Event Info */}
        <div className="space-y-4">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {selectedEvent.description}
          </p>

          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
            <p>📍 <strong>Venue:</strong> {selectedEvent.venue}, {selectedEvent.city}</p>
            <p>
              🗓 <strong>Dates:</strong>{" "}
              {new Date(selectedEvent.start_date).toLocaleDateString()}{" "}
              {selectedEvent.end_date &&
                `– ${new Date(selectedEvent.end_date).toLocaleDateString()}`}
            </p>
            {selectedEvent.ticket_price && (
              <p>🎟 <strong>Ticket:</strong> {selectedEvent.ticket_price}</p>
            )}
            {selectedEvent.contact_info && (
              <p>📞 <strong>Contact:</strong> {selectedEvent.contact_info}</p>
            )}
          </div>

          {/* Status */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              getEventStatus(selectedEvent) === "Ongoing"
                ? "bg-emerald-100 text-emerald-700"
                : getEventStatus(selectedEvent) === "Upcoming"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {getEventStatus(selectedEvent)}
          </div>
        </div>

        {/* Right: Extra Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
              Highlights
            </h3>
            <ul className="mt-2 list-disc list-inside text-slate-600 text-xs sm:text-sm space-y-1">
              <li>Traditional performances & rituals</li>
              <li>Local cuisine & handicraft stalls</li>
              <li>Workshops & cultural interactions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
              Organizers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Organized by <strong>West Bengal Cultural Board</strong> with local community partners.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800">
              Location
            </h3>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedEvent.venue + " " + selectedEvent.city
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs sm:text-sm"
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      
      <div className="p-4 sm:p-6 border-t flex flex-wrap gap-2 sm:gap-3 justify-end">
       <button 
  onClick={handleShare} 
  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 text-sm"
>
  Share 📤
</button>

        <button 
  onClick={handleAddToCalendar} 
  className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 text-sm"
>
  Add to Calendar 📅
</button>

        <button
    onClick={handleBookTickets}
    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 text-sm"
  >
    Book Tickets 🎟
  </button>
      </div>
    </div>
  </div>
)}


    </main>
  );
}
