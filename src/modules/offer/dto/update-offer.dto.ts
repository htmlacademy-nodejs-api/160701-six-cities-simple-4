import { OfferV } from '../../../const/validation.js';
import { TCities } from '../../../types/cities.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { OfferFeatures, OfferVariants, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
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
  IsOptional,
} from 'class-validator';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferV.Title.Min, { message: `Minimum title length must be ${OfferV.Title.Min}` })
  @MaxLength(OfferV.Title.Max, { message: `Maximum title length must be ${OfferV.Title.Max}` })
  public title?: string;

  @IsOptional()
  @MinLength(OfferV.Description.Min, {
    message: `Minimum description length must be ${OfferV.Description.Min}`,
  })
  @MaxLength(OfferV.Description.Max, {
    message: `Maximum description length must be ${OfferV.Description.Max}`,
  })
  public description?: string;

  @IsOptional()
  @IsMongoId({ message: 'city field must be valid an id' })
  public city?: TCities;

  @IsOptional()
  @IsString({ message: 'Field preview must be string' })
  public preview?: string;

  @IsOptional()
  @IsArray({ message: 'Field images must be an array' })
  public images?: string[];

  @IsOptional()
  @IsEnum(OfferVariants, { message: OfferV.Variants.Message })
  public type?: TOfferVariants;

  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(OfferV.Rooms.Min, { message: `Minimum rooms is ${OfferV.Rooms.Min}` })
  @Max(OfferV.Rooms.Max, { message: `Maximum rooms is ${OfferV.Rooms.Max}` })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(OfferV.Guests.Min, { message: `Minimum guests is ${OfferV.Guests.Min}` })
  @Max(OfferV.Guests.Max, { message: `Maximum guests is ${OfferV.Guests.Max}` })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(OfferV.Price.Min, { message: `Minimum price is ${OfferV.Price.Min}` })
  @Max(OfferV.Price.Max, { message: `Maximum price is ${OfferV.Price.Max}` })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'Field features must be an array' })
  @IsEnum(OfferFeatures, { message: OfferV.Features.Message, each: true })
  public features?: TOfferFeatures[];

  @IsOptional()
  @IsMongoId({ message: 'author field must be valid an id' })
  public author?: string;

  @IsOptional()
  @IsObject({ message: 'Field coordinates must be an object' })
  public coordinates?: Coordinates;
}
