import { defaultClasses } from '@typegoose/typegoose';
import typegoose, { getModelForClass } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Cities, TCities } from '../../types/cities.type.js';

const { prop, modelOptions } = typegoose;

export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
  },
})
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({
    required: true,
    unique: true,
    type: () => String,
    validate: {
      validator: (item: TCities) => Cities.includes(item),
      message: `Город не входит в список разрешенных: ${Cities.join(', ')}`,
    },
  })
  public name!: TCities;
}

export const CityModel = getModelForClass(CityEntity);