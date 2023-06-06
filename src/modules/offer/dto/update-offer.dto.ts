import { TCities } from '../../../types/cities.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';

export default class UpdateOfferDto {
  title?: string;
  description?: string;
  city?: TCities;
  preview?: string;
  images?: string[];
  type?: TOfferVariants;
  rooms?: number;
  guests?: number;
  price?: number;
  features?: TOfferFeatures[];
  author?: string;
  coordinates?: Coordinates;
}
