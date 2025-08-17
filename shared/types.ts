// /shared/types.ts

export type PlaceCategory =
  | 'Heritage'
  | 'Temple'
  | 'Museum'
  | 'Nature'
  | 'Fort'
  | 'Beach'
  | 'Market'
  | 'Park'
  | 'Transport'
  |'Wildlife'
  |'National Park'
  |'Village'
  |'Town'
  |'Viewpoint'
  |'Cultural Site'
  |'Pilgrimage';

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
  entryFeeINR?: number | 'Free'|string;
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
  city?:string;
}