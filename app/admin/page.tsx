"use client";

import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { uploadToCloudinary } from "../../utils/cloudinary/client";
import { supabase } from "../../utils/supabase/server";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs.Root defaultValue="places">
        <Tabs.List className="flex space-x-4 border-b">
          <Tabs.Trigger value="places" className="px-4 py-2">Places</Tabs.Trigger>
          <Tabs.Trigger value="hotels" className="px-4 py-2">Hotels</Tabs.Trigger>
          <Tabs.Trigger value="events" className="px-4 py-2">Events</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="places"><PlacesAdmin /></Tabs.Content>
        <Tabs.Content value="hotels"><HotelsAdmin /></Tabs.Content>
        <Tabs.Content value="events"><EventsAdmin /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

/* ---------- Places ---------- */
function PlacesAdmin() {
  const [places, setPlaces] = useState<any[]>([]);
  const [newPlace, setNewPlace] = useState({
    name: "",
    category: "Heritage",
    lat: "",
    lon: "",
    city: "",
    google_map_link: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => { fetchPlaces(); }, []);

  async function fetchPlaces() {
    const { data } = await supabase.from("places").select("*");
    if (data) setPlaces(data);
  }

  async function uploadImages(files: File[]) {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }
    return urls;
  }

  async function addPlace() {
    const imageUrls = await uploadImages(imageFiles);

    await fetch("/api/embed", {
      method: "POST",
      body: JSON.stringify({
        type: "places",
        data: {
          ...newPlace,
          lat: +newPlace.lat,
          lon: +newPlace.lon,
          images: imageUrls,
        },
      }),
    });

    setNewPlace({
      name: "",
      category: "Heritage",
      lat: "",
      lon: "",
      city: "",
      google_map_link: "",
      description: "",
    });
    setImageFiles([]);
    fetchPlaces();
  }

  async function deletePlace(id: string) {
    await supabase.from("places").delete().eq("id", id);
    fetchPlaces();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Places</h2>
      <div className="border p-4 rounded space-y-2">
        <input className="border p-2 w-full" placeholder="Name" value={newPlace.name} onChange={e => setNewPlace({ ...newPlace, name: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Category" value={newPlace.category} onChange={e => setNewPlace({ ...newPlace, category: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Latitude" value={newPlace.lat} onChange={e => setNewPlace({ ...newPlace, lat: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Longitude" value={newPlace.lon} onChange={e => setNewPlace({ ...newPlace, lon: e.target.value })} />
        <input className="border p-2 w-full" placeholder="City" value={newPlace.city} onChange={e => setNewPlace({ ...newPlace, city: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Google Map Link" value={newPlace.google_map_link} onChange={e => setNewPlace({ ...newPlace, google_map_link: e.target.value })} />
        <textarea className="border p-2 w-full" placeholder="Description" value={newPlace.description} onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}></textarea>
        <input type="file" multiple onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addPlace}>Add Place</button>
      </div>
      <ul>
        {places.map(p => (
          <li key={p.id} className="flex justify-between border-b py-2">
            <span>{p.name} ({p.city})</span>
            <button className="bg-red-500 text-white px-2 rounded" onClick={() => deletePlace(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Hotels ---------- */
function HotelsAdmin() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [newHotel, setNewHotel] = useState({
    name: "",
    lat: "",
    lon: "",
    city: "",
    rating: "",
    priceBand: "Budget",
    google_map_link: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels() {
    const { data } = await supabase.from("hotels").select("*");
    if (data) setHotels(data);
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }
    return urls;
  }

  async function addHotel() {
    const imageUrls = await uploadImages(imageFiles);

    await fetch("/api/embed", {
      method: "POST",
      body: JSON.stringify({
        type: "hotels",
        data: {
          ...newHotel,
          lat: +newHotel.lat,
          lon: +newHotel.lon,
          rating: +newHotel.rating,
          images: imageUrls,
        },
      }),
    });

    setNewHotel({
      name: "",
      lat: "",
      lon: "",
      city: "",
      rating: "",
      google_map_link: "",
      priceBand: "Budget",
    });
    setImageFiles([]);
    fetchHotels();
  }

  async function deleteHotel(id: string) {
    await supabase.from("hotels").delete().eq("id", id);
    fetchHotels();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Hotels</h2>
      <div className="border p-4 rounded space-y-2">
        <input className="border p-2 w-full" placeholder="Name" value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Latitude" value={newHotel.lat} onChange={e => setNewHotel({ ...newHotel, lat: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Longitude" value={newHotel.lon} onChange={e => setNewHotel({ ...newHotel, lon: e.target.value })} />
        <input className="border p-2 w-full" placeholder="City" value={newHotel.city} onChange={e => setNewHotel({ ...newHotel, city: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Rating" value={newHotel.rating} onChange={e => setNewHotel({ ...newHotel, rating: e.target.value })} />
        <select className="border p-2 w-full" value={newHotel.priceBand} onChange={e => setNewHotel({ ...newHotel, priceBand: e.target.value })}>
          <option>Budget</option>
          <option>Mid</option>
          <option>Premium</option>
        </select>
        <input className="border p-2 w-full" placeholder="Google Map Link" value={newHotel.google_map_link} onChange={e => setNewHotel({ ...newHotel, google_map_link: e.target.value })} />
        <input type="file" multiple onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addHotel}>Add Hotel</button>
      </div>
      <ul>
        {hotels.map(h => (
          <li key={h.id} className="flex justify-between border-b py-2">
            <span>{h.name} ({h.city})</span>
            <button className="bg-red-500 text-white px-2 rounded" onClick={() => deleteHotel(h.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Events ---------- */
function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "",
    start_date: "",
    end_date: "",
    venue: "",
    city: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    const { data } = await supabase.from("events").select("*");
    if (data) setEvents(data);
  }

  async function uploadImages(files: File[]) {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }
    return urls;
  }

  async function addEvent() {
    // Generate a UUID for id
    const id = crypto.randomUUID();
    // Use only the first image URL
    const imageUrls = await uploadImages(imageFiles);
    const image_url = imageUrls[0] || "";
    // Get current timestamp for created_at
    const created_at = new Date().toISOString();

    await fetch("/api/embed", {
      method: "POST",
      body: JSON.stringify({
        type: "events",
        data: {
          id,
          title: newEvent.title,
          category: newEvent.category,
          start_date: newEvent.start_date,
          end_date: newEvent.end_date,
          venue: newEvent.venue,
          city: newEvent.city,
          description: newEvent.description,
          image_url,
          created_at,
        },
      }),
    });
    console.log("Event added:", { id, title: newEvent.title });

    setNewEvent({
      title: "",
      category: "",
      start_date: "",
      end_date: "",
      venue: "",
      city: "",
      description: "",
    });
    setImageFiles([]);
    fetchEvents();
  }

  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Events</h2>
      <div className="border p-4 rounded space-y-2">
        <input className="border p-2 w-full" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Category" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Start Date (YYYY-MM-DD)" value={newEvent.start_date} onChange={e => setNewEvent({ ...newEvent, start_date: e.target.value })} />
        <input className="border p-2 w-full" placeholder="End Date (YYYY-MM-DD)" value={newEvent.end_date} onChange={e => setNewEvent({ ...newEvent, end_date: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Venue" value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} />
        <input className="border p-2 w-full" placeholder="City" value={newEvent.city} onChange={e => setNewEvent({ ...newEvent, city: e.target.value })} />
        <textarea className="border p-2 w-full" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
        <input type="file" onChange={e => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addEvent}>Add Event</button>
      </div>
      <ul>
        {events.map(ev => (
          <li key={ev.id} className="flex justify-between border-b py-2">
            <span>{ev.title} ({ev.date})</span>
            <button className="bg-red-500 text-white px-2 rounded" onClick={() => deleteEvent(ev.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
