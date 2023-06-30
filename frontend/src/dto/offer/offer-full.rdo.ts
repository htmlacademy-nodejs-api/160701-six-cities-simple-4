import CreatedUserRdo from '../user/created-user.rdo.js';
import OfferRdo from './offer.rdo.js';

export default class OfferFullRdo extends OfferRdo {
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
