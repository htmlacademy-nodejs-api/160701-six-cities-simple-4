import { OfferV } from '../../../const/validation.js';
import { Cities, TCities } from '../../../types/cities.type.js';
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
  IsOptional,
  IsBoolean,
  IsInstance,
  Equals,
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

  @IsIn(Cities)
  public city!: TCities;

  @IsString()
  public preview!: string;

  @IsArray()
  public images!: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium!: boolean;

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

  /* TODO пропускает невалидные координаты
  "coordinates":{
    "latitude": 50,
    "longitude": 0,
    "btbtb":111
  }
  */
  @ValidateNested()
  @Type(() => CreateCoordinateDto)
  @IsInstance(CreateCoordinateDto)
  public coordinates!: CreateCoordinateDto;

  @IsOptional()
  @Equals(0)
  public rating!: number;

  @IsOptional()
  @Equals(0)
  public commentsCount!: number;
}
