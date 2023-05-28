import { Cities } from './cities.type.js';
import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';

export type OfferVariant = 'Apartment' | 'House' | 'Room' | 'Hotel';

export type OfferFeatures =
  | 'Breakfast'
  | 'Air conditioning'
  | 'Laptop friendly'
  | 'Workspace'
  | 'Baby seat'
  | 'Washer'
  | 'Towels'
  | 'Fridge';

export type Offer = {
  title: string;
  description: string;
  createdAt: Date;
  city: Cities;
  preview: string;
  images: string[];
  isPremium: boolean;
  rating: number;
  type: OfferVariant;
  rooms: number;
  guests: number;
  price: number;
  features: OfferFeatures[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
};
