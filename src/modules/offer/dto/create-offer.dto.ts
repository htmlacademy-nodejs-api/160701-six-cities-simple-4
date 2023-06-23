import { OfferV } from '../../../const/validation.js';
import { Cities, TCities } from '../../../types/cities.type.js';
import { OfferVariants, OfferFeatures, TOfferFeatures, TOfferVariants } from '../../../types/offer.type.js';
import {
  IsArray,
  IsString,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  ArrayUnique,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  IsIn,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateCoordinateDto {
  @Expose()
  @IsLatitude()
  public latitude!: number;

  @Expose()
  @IsLongitude()
  public longitude!: number;
}

export default class CreateOfferDto {
  @Expose()
  @MinLength(OfferV.Title.Min)
  @MaxLength(OfferV.Title.Max)
  public title!: string;

  @Expose()
  @MinLength(OfferV.Description.Min)
  @MaxLength(OfferV.Description.Max)
  public description!: string;

  @Expose()
  @IsIn(Cities)
  public city!: TCities;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public isPremium!: boolean;

  @Expose()
  @IsIn(OfferVariants)
  public type!: TOfferVariants;

  @Expose()
  @IsInt()
  @Min(OfferV.Rooms.Min)
  @Max(OfferV.Rooms.Max)
  public rooms!: number;

  @Expose()
  @IsInt()
  @Min(OfferV.Guests.Min)
  @Max(OfferV.Guests.Max)
  public guests!: number;

  @Expose()
  @IsInt()
  @Min(OfferV.Price.Min)
  @Max(OfferV.Price.Max)
  public price!: number;

  @Expose()
  @IsArray()
  @ArrayUnique()
  @IsIn(OfferFeatures, { each: true })
  public features!: TOfferFeatures[];

  public author!: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  public coordinates!: CreateCoordinateDto;
}
