import { OfferV } from '../../../const/validation.js';
import { TCities } from '../../../types/cities.type.js';
import { OfferVariants, OfferFeatures, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import {
  IsArray,
  IsString,
  IsInt,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
  ArrayUnique,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateCoordinateDto {
  @IsLatitude()
  public latitude!: number;

  @IsLongitude()
  public longitude!: number;
}
export default class CreateOfferDto {
  @MinLength(OfferV.Title.Min)
  @MaxLength(OfferV.Title.Max)
  public title!: string;

  @MinLength(OfferV.Description.Min)
  @MaxLength(OfferV.Description.Max)
  public description!: string;

  @IsMongoId()
  public city!: TCities;

  @IsString()
  public preview!: string;

  @IsArray()
  public images!: string[];

  @IsIn(OfferVariants)
  public type!: TOfferVariants;

  @IsInt()
  @Min(OfferV.Rooms.Min)
  @Max(OfferV.Rooms.Max)
  public rooms!: number;

  @IsInt()
  @Min(OfferV.Guests.Min)
  @Max(OfferV.Guests.Max)
  public guests!: number;

  @IsInt()
  @Min(OfferV.Price.Min)
  @Max(OfferV.Price.Max)
  public price!: number;

  @IsArray()
  @ArrayUnique()
  @IsIn(OfferFeatures, { each: true })
  public features!: TOfferFeatures[];

  @IsMongoId()
  public author!: string;

  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  public coordinates!: CreateCoordinateDto;
}
