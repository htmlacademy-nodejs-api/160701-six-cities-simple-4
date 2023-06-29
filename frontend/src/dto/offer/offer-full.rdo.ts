import CreatedUserRdo from '../user/created-user.rdo.js';

export default class OfferFullRdo {
  public description!: string;

  public images!: string[];

  public rooms!: number;

  public guests!: number;

  public features!: string[];

  public author!: CreatedUserRdo;

  public coordinates!: {
    latitude: number;
    longitude: number;
  };
}
