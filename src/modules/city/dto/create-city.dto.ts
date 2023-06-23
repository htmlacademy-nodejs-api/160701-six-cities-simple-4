import { IsIn, IsString } from 'class-validator';
import { Cities } from '../../../types/cities.type.js';

export default class CreateCityDto {
  @IsString()
  @IsIn(Cities)
  public name!: string;
}
