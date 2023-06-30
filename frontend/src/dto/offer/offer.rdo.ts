import { City, Type } from '../../types/types.js';

export default class OfferRdo {
  public id!: string;

  public createdAt!: string;

  public title!: string;

  public city!: City;

  public preview!: string;

  public type!: Type;

  public price!: number;

  public commentsCount!: number;

  public rating!: number;

  public isPremium!: boolean;

  public isFavorite!: boolean;
}
