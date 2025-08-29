"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/server"
import * as Tabs from "@radix-ui/react-tabs";
import { uploadToCloudinary } from "../../utils/cloudinary/client";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs.Root defaultValue="places">
        <Tabs.List className="flex space-x-4 border-b">
          <Tabs.Trigger value="places" className="px-4 py-2">Places</Tabs.Trigger>
          <Tabs.Trigger value="hotels" className="px-4 py-2">Hotels</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="places">
          <PlacesAdmin />
        </Tabs.Content>
        <Tabs.Content value="hotels">
          <HotelsAdmin />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

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
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { fetchPlaces(); }, []);

  async function fetchPlaces() {
    const { data, error } = await supabase.from("places").select("*");
    if (!error) setPlaces(data);
  }



async function addPlace() {
  let imageUrl = null;

  if (imageFile) {
    try {
      imageUrl = await uploadToCloudinary(imageFile);
      console.log("Upload successful:", imageUrl); // just the URL string
    } catch (error) {
      console.error("Upload failed:", error);
      return;
    }
  }

  const { error } = await supabase.from("places").insert([
    {
      ...newPlace,
      lat: +newPlace.lat,
      lon: +newPlace.lon,
      images: imageUrl ? [imageUrl] : [], // store only the URL array
    },
  ]);

  if (error) {
    console.error("Database insert failed:", error);
  } else {
    setNewPlace({
      name: "",
      category: "Heritage",
      lat: "",
      lon: "",
      city: "",
      google_map_link: "",
      description: "",
    });
    setImageFile(null);
    fetchPlaces();
  }
}




  async function deletePlace(id: string) {
    await supabase.from("places").delete().eq("id", id);
    fetchPlaces();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Places</h2>

      {/* Add Place Form */}
      <div className="border p-4 rounded space-y-2">
        <input className="border p-2 w-full" placeholder="Name" value={newPlace.name} onChange={e => setNewPlace({ ...newPlace, name: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Category" value={newPlace.category} onChange={e => setNewPlace({ ...newPlace, category: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Latitude" value={newPlace.lat} onChange={e => setNewPlace({ ...newPlace, lat: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Longitude" value={newPlace.lon} onChange={e => setNewPlace({ ...newPlace, lon: e.target.value })} />
        <input className="border p-2 w-full" placeholder="City" value={newPlace.city} onChange={e => setNewPlace({ ...newPlace, city: e.target.value })} />
        <input className="border p-2 w-full" placeholder="Google Map Link" value={newPlace.google_map_link} onChange={e => setNewPlace({ ...newPlace, google_map_link: e.target.value })} />
        <textarea className="border p-2 w-full" placeholder="Description" value={newPlace.description} onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}></textarea>
        <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addPlace}>Add Place</button>
      </div>

      {/* List */}
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
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels() {
    const { data, error } = await supabase.from("hotels").select("*");
    if (!error) setHotels(data);
  }


// async function addHotel() {
//   let imageUrl: string | null = null;

//   if (imageFile) {
//     imageUrl = await uploadToCloudinary(imageFile); // ✅ Cloudinary instead of Supabase
//   }

//   const { error } = await supabase.from("hotels").insert([
//     {
//       ...newHotel,
//       lat: +newHotel.lat,
//       lon: +newHotel.lon,
//       rating: +newHotel.rating,
//       images: imageUrl ? [imageUrl] : [], // ✅ store Cloudinary URL
//     },
//   ]);

//   if (!error) {
//     setNewHotel({
//       name: "",
//       lat: "",
//       lon: "",
//       city: "",
//       rating: "",
//       priceBand: "Budget",
//       google_map_link: "",
//     });
//     setImageFile(null);
//     fetchHotels();
//   }
// }
async function addHotel() {
  let imageUrl = null;
  
  if (imageFile) {
    try {
      imageUrl = await uploadToCloudinary(imageFile);
      console.log('Upload successful:', imageUrl); // Debug log
    } catch (error) {
      console.error('Upload failed:', error);
      return; // Stop if upload fails
    }
  }

  const { error } = await supabase.from("hotels").insert([{
    ...newHotel,
    lat: +newHotel.lat,
    lon: +newHotel.lon,
    rating: +newHotel.rating,
    images: imageUrl ? [imageUrl] : [],
  }]);
  
  if (error) {
    console.error('Database insert failed:', error);
  } else {
    // Reset form only on success
    setNewHotel({
      name: "",
      lat: "",
      lon: "",
      city: "",
      rating: "",
      google_map_link: "",
      priceBand: "Budget",
    });
    setImageFile(null);
    fetchHotels();
  }
}

  async function deleteHotel(id: string) {
    await supabase.from("hotels").delete().eq("id", id);
    fetchHotels();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Hotels</h2>

      {/* Add Hotel Form */}
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
        <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={addHotel}>Add Hotel</button>
      </div>

      {/* List */}
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
