import { OfferV } from '../../../const/validation.js';
import { TCities } from '../../../types/cities.type.js';
import { OfferVariants, OfferFeatures, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import {
  IsArray,
  IsString,
  IsEnum,
  IsInt,
  IsObject,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
  ArrayUnique,
} from 'class-validator';
import { Coordinates } from '../../../types/coordinates.type.js';

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

  @IsEnum(OfferVariants, { message: OfferV.Variants.Message })
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
  @IsEnum(OfferFeatures, { message: OfferV.Features.Message, each: true })
  public features!: TOfferFeatures[];

  @IsMongoId()
  public author!: string;

  @IsObject()
  public coordinates!: Coordinates;
}
