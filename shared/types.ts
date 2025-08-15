// /shared/types.ts

export type PlaceCategory =
  | 'Heritage'
  | 'Temple'
  | 'Museum'
  | 'Nature'
  | 'Fort'
  | 'Beach'
  | 'Market';

export interface PlaceSpec {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lon: number;
  city?: string;
  images?: string[];
  description?: string;
  tips?: string[];
  entryFeeINR?: number | 'Free';
  hours?: string;
}

export interface Hotel {
  id: string;
  name: string;
  lat: number;
  lon: number;
  rating?: number;
  priceBand?: 'Budget' | 'Mid' | 'Premium';
  nearPlaceId?: string;
}
