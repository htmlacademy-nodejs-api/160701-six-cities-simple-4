import { Cities } from '../../../types/cities.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { OfferFeatures, OfferVariant } from '../../../types/offer.type.js';

export default class CreateOfferDto {
  title!: string;
  description!: string;
  city!: Cities;
  preview!: string;
  images!: string[];
  type!: OfferVariant;
  rooms!: number;
  guests!: number;
  price!: number;
  features!: OfferFeatures[];
  author!: string;
  coordinates!: Coordinates;
}
