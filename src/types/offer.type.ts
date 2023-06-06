import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';
import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';
import { TCities } from './cities.type.js';
import { CityEntity } from '../modules/city/city.entity.js';

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

export type Offer<T extends User | Ref<UserEntity>, C extends TCities | Ref<CityEntity>> = {
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
