import { Expose, Type } from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';
import { Offer, OfferMin, TOfferFeatures } from '../../../types/offer.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import OfferRdo from './offer.rdo.js';
import CityRdo from '../../city/rdo/city.rdo.js';

export default class OfferFullRdo extends OfferRdo implements OfferMin, Offer<UserRdo, CityRdo> {
  @Expose()
  public description!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public features!: TOfferFeatures[];

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public coordinates!: Coordinates;
}
