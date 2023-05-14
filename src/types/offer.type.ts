import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';

export enum OfferVariant {
  'Apartment' = 'apartment',
  'House' = 'house',
  'Room' = 'room',
  'Hotel' = 'hotel',
}

export enum OfferFeatures {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendly = 'Laptop friendly',
  Workspace = 'Workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export type Offer = {
  title: string;
  description: string;
  createdAt: Date;
  city: string;
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
