import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // keep server-only
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    // Fetch with correct columns
    const [places, hotels, events] = await Promise.all([
      supabase
        .from('places')
        .select('id, name, city, rating, description, images')
        .range(offset, offset + Number(limit) - 1),

      supabase
        .from('hotels')
        .select('id, name, city, rating, description, images')
        .range(offset, offset + Number(limit) - 1),

      supabase
        .from('events')
        .select('id, title, city, rating, description, image_url, created_at')
        .range(offset, offset + Number(limit) - 1)
    ]);

    // Handle any Supabase error
    if (places.error || hotels.error || events.error) {
      throw places.error || hotels.error || events.error;
    }

    // Normalize results:
    //  - use first image from images[] for places/hotels
    //  - rename title → name, image_url → image for events
    const results = [
      ...places.data.map(p => ({
        id: p.id,
        name: p.name,
        city: p.city,
        rating: p.rating,
        description: p.description,
        image: p.images?.[0] ?? null,
        type: 'place',
        created_at: undefined
      })),
      ...hotels.data.map(h => ({
        id: h.id,
        name: h.name,
        city: h.city,
        rating: h.rating,
        description: h.description,
        image: h.images?.[0] ?? null,
        type: 'hotel',
        created_at: undefined
      })),
      ...events.data.map(e => ({
        id: e.id,
        name: e.title,
        city: e.city,
        rating: e.rating,
        description: e.description,
        image: e.image_url,
        type: 'event',
        created_at: e.created_at
      }))
    ];

    // Optional: sort newest events first
    results.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });

    res.status(200).json({ results });
  } catch (err) {
    console.error('Browse API error:', err);
    res.status(500).json({ error: 'Failed to load browse items' });
  }
}
