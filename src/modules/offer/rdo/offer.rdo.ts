import { Expose, Transform, Type } from 'class-transformer';
import CityRdo from '../../city/rdo/city.rdo.js';
import { OfferMin, TOfferVariants } from '../../../types/offer.type.js';

export default class OfferRdo implements OfferMin {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id.toString())
  public id!: string;

  @Expose()
  public createdAt!: string;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => CityRdo)
  public city!: CityRdo;

  @Expose()
  public preview!: string;

  @Expose()
  public type!: TOfferVariants;

  @Expose()
  public price!: number;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;
}
