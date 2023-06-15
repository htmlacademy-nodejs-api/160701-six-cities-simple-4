import { IsEnum } from 'class-validator';
import { Cities } from '../../../types/cities.type.js';
import { CityV } from '../../../const/validation.js';

export default class CreateCityDto {
  @IsEnum(Cities, { message: CityV.Name.Message })
  public name!: string;
}
