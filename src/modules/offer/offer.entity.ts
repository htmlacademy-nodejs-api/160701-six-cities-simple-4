import { defaultClasses, modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose';
import {
  Offer,
  OfferFeatures,
  OfferVariants,
  TOfferFeatures,
  TOfferVariants,
} from '../../types/offer.type.js';
import { UserEntity } from '../user/user.entity.js';
import { Coordinates } from '../../types/coordinates.type.js';
import { OfferV } from '../../const/validation.js';
import { CityEntity } from '../city/city.entity.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity
  extends defaultClasses.TimeStamps
  implements Offer<Ref<UserEntity>, Ref<CityEntity>> {
  @prop({
    trim: true,
    required: true,
    minlength: OfferV.Title.Min,
    maxlength: OfferV.Title.Max,
  })
  public title!: string;

  @prop({ trim: true, required: true, minlength: OfferV.Description.Min, maxlength: OfferV.Description.Max })
  public description!: string;

  @prop({
    required: true,
    ref: CityEntity,
    _id: false,
  })
  public city!: Ref<CityEntity>;

  @prop({ default: '' })
  public preview!: string;

  @prop({ type: () => [String], default: [] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({
    required: true,
    default: 0,
    type: () => Number,
    validate: {
      validator: (rating: number) =>
        rating === OfferV.Rating.Default || (rating >= OfferV.Rating.Min && rating <= OfferV.Rating.Max),
      message: `Min rating is ${OfferV.Rating.Min} and max rating is ${OfferV.Rating.Max}`,
    },
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    validate: {
      validator: (item: TOfferVariants) => OfferVariants.includes(item),
      message: OfferV.Variants.Message,
    },
  })
  public type!: TOfferVariants;

  @prop({ required: true, min: OfferV.Rooms.Min, max: OfferV.Rooms.Max })
  public rooms!: number;

  @prop({ required: true, min: OfferV.Guests.Min, max: OfferV.Guests.Max })
  public guests!: number;

  @prop({ required: true, min: OfferV.Price.Min, max: OfferV.Price.Max })
  public price!: number;

  @prop({
    set: (value: TOfferFeatures[]) => Array.from(new Set([...value])),
    required: true,
    type: () => String,
    validate: {
      validator: (item: TOfferFeatures[]) => item.every((el) => OfferFeatures.includes(el)),
      message: OfferV.Features.Message,
    },
  })
  public features!: TOfferFeatures[];

  @prop({
    ref: UserEntity,
    required: true,
    _id: false,
  })
  public author!: Ref<UserEntity>;

  @prop({
    default: 0,
  })
  public commentsCount!: number;

  @prop({
    required: true,
    validate: [
      {
        validator: (item: Coordinates) => {
          const values = Object.values(item);

          return values.every((el) => !Number.isNaN(Number(el)));
        },
        message: OfferV.Coordinates.Message.isNumber,
      },
      {
        validator: (item: Coordinates) => {
          const values = Object.values(item);
          const isValidLength = values.length === 2;
          const isValidKeys = Object.keys(item).every((key) => key === 'latitude' || key === 'longitude');

          return isValidLength && isValidKeys;
        },
        message: OfferV.Coordinates.Message.isValid,
      },
    ],
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
