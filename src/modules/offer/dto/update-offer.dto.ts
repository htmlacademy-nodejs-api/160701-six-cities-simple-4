import { OfferV } from '../../../const/validation.js';
import { Cities, TCities } from '../../../types/cities.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { OfferFeatures, OfferVariants, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import {
  IsArray,
  IsString,
  IsInt,
  IsObject,
  IsMongoId,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsOptional,
  IsIn,
  Equals,
  ArrayUnique,
} from 'class-validator';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferV.Title.Min)
  @MaxLength(OfferV.Title.Max)
  public title?: string;

  @IsOptional()
  @MinLength(OfferV.Description.Min)
  @MaxLength(OfferV.Description.Max)
  public description?: string;

  @IsOptional()
  @IsIn(Cities)
  public city?: TCities;

  @IsOptional()
  @IsString()
  public preview?: string;

  @IsOptional()
  @IsArray()
  public images?: string[];

  @IsOptional()
  @IsIn(OfferVariants)
  public type?: TOfferVariants;

  @IsOptional()
  @IsInt()
  @Min(OfferV.Rooms.Min)
  @Max(OfferV.Rooms.Max)
  public rooms?: number;

  @IsOptional()
  @IsInt()
  @Min(OfferV.Guests.Min)
  @Max(OfferV.Guests.Max)
  public guests?: number;

  @IsOptional()
  @IsInt()
  @Min(OfferV.Price.Min)
  @Max(OfferV.Price.Max)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(OfferFeatures, { each: true })
  public features?: TOfferFeatures[];

  @IsOptional()
  @IsMongoId()
  public author?: string;

  @IsOptional()
  @IsObject()
  public coordinates?: Coordinates;

  @IsOptional()
  @Equals(0)
  public rating?: number;

  @IsOptional()
  @Equals(0)
  public commentsCount?: number;
}
