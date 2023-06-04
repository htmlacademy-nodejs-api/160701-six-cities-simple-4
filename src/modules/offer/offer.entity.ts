import { defaultClasses, modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { Cities, TCities } from '../../types/cities.type.js';
import {
  Offer,
  OfferFeatures,
  OfferVariants,
  TOfferFeatures,
  TOfferVariants,
} from '../../types/offer.type.js';
import { UserEntity } from '../user/user.entity.js';
import { Coordinates } from '../../types/coordinates.type.js';
import {
  OfferDescription,
  OfferGuests,
  OfferPrice,
  OfferRating,
  OfferRooms,
  OfferTitle,
} from '../../const/validation.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps implements Offer<Ref<UserEntity>> {
  @prop({ trim: true, required: true, minlength: OfferTitle.Min, maxlength: OfferTitle.Max })
  public title!: string;

  @prop({ trim: true, required: true, minlength: OfferDescription.Min, maxlength: OfferDescription.Max })
  public description!: string;

  @prop({
    required: true,
    unique: true,
    type: () => String,
    validate: {
      validator: (item: TCities) => Cities.includes(item),
      message: `Город не входит в список разрешенных: ${Cities.join(', ')}`,
    },
  })
  public city!: TCities;

  @prop({ required: true })
  public preview!: string;

  @prop({ required: true, type: () => [String] })
  public images!: string[];

  @prop({ required: true, default: false })
  public isPremium!: boolean;

  @prop({ required: true, default: false })
  public isFavorite!: boolean;

  @prop({ required: true, min: OfferRating.Min, max: OfferRating.Max })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    validate: {
      validator: (item: TOfferVariants) => OfferVariants.includes(item),
      message: `Тип жилья не входит в список разрешенных: ${OfferVariants.join(', ')}`,
    },
  })
  public type!: TOfferVariants;

  @prop({ required: true, min: OfferRooms.Min, max: OfferRooms.Max })
  public rooms!: number;

  @prop({ required: true, min: OfferGuests.Min, max: OfferGuests.Max })
  public guests!: number;

  @prop({ required: true, min: OfferPrice.Min, max: OfferPrice.Max })
  public price!: number;

  @prop({
    required: true,
    type: () => String,
    validate: {
      validator: (item: TOfferFeatures[]) => item.every((el) => OfferFeatures.includes(el)),
      message: `Удобства не входят в список разрешенных: ${OfferFeatures.join(', ')}`,
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
    validate: {
      validator: (item: Coordinates) => {
        const values = Object.values(item);

        return values.every((el) => !Number.isNaN(Number(el)));
      },
      message: 'Координаты должны быть заданы числом',
    },
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
