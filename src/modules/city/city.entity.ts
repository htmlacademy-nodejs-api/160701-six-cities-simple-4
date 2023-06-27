import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Cities, TCities } from '../../types/cities.type.js';
import { CityV } from '../../const/validation.js';

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
      message: CityV.Name.Message,
    },
  })
  public name!: TCities;

  @prop({ required: true, trim: true, default: '' })
  public cityImage!: string;
}

export const CityModel = getModelForClass(CityEntity);
