export class CreateCoordinateDto {
  public latitude!: number;

  public longitude!: number;
}

export default class CreateOfferDto {
  public title!: string;

  public description!: string;

  public city!: string;

  public isPremium!: boolean;

  public type!: string;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: string[];

  public author!: string;

  public coordinates!: CreateCoordinateDto;
}
