import { Expose, Type } from 'class-transformer';
import { OfferV } from '../../../const/validation.js';
import { Cities, TCities } from '../../../types/cities.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { OfferFeatures, OfferVariants, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import {
  IsArray,
  IsString,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsOptional,
  IsIn,
  ArrayUnique,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { CreateCoordinateDto } from './create-offer.dto.js';

export default class UpdateOfferDto {
  @Expose()
  @IsOptional()
  @MinLength(OfferV.Title.Min)
  @MaxLength(OfferV.Title.Max)
  public title?: string;

  @Expose()
  @IsOptional()
  @MinLength(OfferV.Description.Min)
  @MaxLength(OfferV.Description.Max)
  public description?: string;

  @Expose()
  @IsOptional()
  @IsIn(Cities)
  public city?: TCities;

  @Expose()
  @IsOptional()
  @IsString()
  public preview?: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(OfferV.Images.Min)
  @ArrayMaxSize(OfferV.Images.Max)
  public images?: string[];

  @Expose()
  @IsOptional()
  @IsIn(OfferVariants)
  public type?: TOfferVariants;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(OfferV.Rooms.Min)
  @Max(OfferV.Rooms.Max)
  public rooms?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(OfferV.Guests.Min)
  @Max(OfferV.Guests.Max)
  public guests?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(OfferV.Price.Min)
  @Max(OfferV.Price.Max)
  public price?: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(OfferFeatures, { each: true })
  public features?: TOfferFeatures[];

  public author?: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  public coordinates?: Coordinates;
}
