export default class UpdateOfferDto {
  public title?: string;

  public description?: string;

  public city?: TCities;

  public preview?: string;

  public images?: string[];

  public type?: string;

  public rooms?: number;

  public guests?: number;

  public price?: number;

  public features?: string[];

  public author?: string;

  public coordinates?: {
    latitude: number;
    longitude: number;
  };
}
