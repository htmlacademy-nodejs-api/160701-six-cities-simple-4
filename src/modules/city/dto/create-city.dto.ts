import { IsIn, IsString } from 'class-validator';
import { Cities } from '../../../types/cities.type.js';
import { Expose } from 'class-transformer';

export default class CreateCityDto {
  @Expose()
  @IsString()
  @IsIn(Cities)
  public name!: string;
}
