import { Expose, Type } from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';
import CityRdo from '../../city/rdo/city.rdo.js';
import { TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public createdAt!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public preview!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public type!: TOfferVariants;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public features!: TOfferFeatures[];

  @Expose()
  public commentCount!: number;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public coordinates!: Coordinates;
}
