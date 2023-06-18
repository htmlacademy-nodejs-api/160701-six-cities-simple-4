import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';
import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';
import { TCities } from './cities.type.js';
import { CityEntity } from '../modules/city/city.entity.js';
import CityRdo from '../modules/city/rdo/city.rdo.js';
import UserRdo from '../modules/user/rdo/user.rdo.js';

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

export type Offer<
  T extends User | Ref<UserEntity> | UserRdo,
  C extends TCities | Ref<CityEntity> | CityRdo,
> = {
  title: string;
  description: string;
  createdAt?: Date | string;
  city: C;
  preview: string;
  images: string[];
  isPremium: boolean;
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

export type OfferMin = Omit<
  Offer<UserRdo, CityRdo>,
  'description' | 'images' | 'rooms' | 'guests' | 'features' | 'author' | 'coordinates'
>;
