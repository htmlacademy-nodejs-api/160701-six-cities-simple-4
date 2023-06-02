import { defaultClasses, modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { Cities, TCities } from '../../types/cities.type.js';
import { OfferFeatures, OfferVariants, TOfferFeatures, TOfferVariants } from '../../types/offer.type.js';
import { UserEntity } from '../user/user.entity.js';
import { Coordinates } from '../../types/coordinates.type.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true, required: true })
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

  @prop({ required: true, min: 1, max: 5 })
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

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
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
  })
  public author!: Ref<UserEntity>;

  @prop({
    default: 0,
  })
  public commentCount!: number;

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
