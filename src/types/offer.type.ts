import { Coordinates } from './coordinates.type.js';

export const OfferVariants = ['Apartment', 'House', 'Room', 'Hotel'] as const;
export type TOfferVariants = (typeof OfferVariants)[number];

export const OfferFeatures = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;
export type TOfferFeatures = (typeof OfferFeatures)[number];

export type Offer<T, C> = {
  title: string;
  description: string;
  createdAt?: Date;
  city: C;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite?: boolean;
  rating: number;
  type: TOfferVariants;
  rooms: number;
  guests: number;
  price: number;
  features: TOfferFeatures[];
  author: T;
  commentsCount: number;
  coordinates: Coordinates;
};
