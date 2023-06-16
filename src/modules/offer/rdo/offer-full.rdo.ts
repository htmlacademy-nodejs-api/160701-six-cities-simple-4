import { Expose, Type } from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';
import { TOfferFeatures } from '../../../types/offer.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import OfferRdo from './offer.rdo.js';

export default class OfferFullRdo extends OfferRdo {
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
