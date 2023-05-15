import { generateRandomValue, getRandomItem, getRandomItems } from '../../core/helpers/index.js';
import { MockData } from '../../types/mock-data.type.js';
import { OfferVariant } from '../../types/offer.type.js';
import { UserRole, userRoles } from '../../types/user.type.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import dayjs from 'dayjs';

const OfferValidation = {
  MIN_PRICE: 100,
  MAX_PRICE: 10e4,
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_ROOMS: 1,
  MAX_ROOMS: 8,
  MIN_GUESTS: 1,
  MAX_GUESTS: 8,
};
const CoordinatesValidation = {
  MIN_LATITUDE: 48,
  MAX_LATITUDE: 54,
  MIN_LONGITUDE: 2,
  MAX_LONGITUDE: 10,
};

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.offerPreview);
    const images = getRandomItems<string>(this.mockData.offerImages).join(';');
    const isPremium = Boolean(generateRandomValue(0, 1));
    const rating = generateRandomValue(OfferValidation.MIN_RATING, OfferValidation.MAX_RATING, 1);
    const type = getRandomItem([
      OfferVariant.Apartment,
      OfferVariant.Hotel,
      OfferVariant.House,
      OfferVariant.Room,
    ]);
    const rooms = generateRandomValue(OfferValidation.MIN_ROOMS, OfferValidation.MAX_ROOMS);
    const guests = generateRandomValue(OfferValidation.MIN_GUESTS, OfferValidation.MAX_GUESTS);
    const price = generateRandomValue(OfferValidation.MIN_PRICE, OfferValidation.MAX_PRICE).toString();
    const features = getRandomItems<string>(this.mockData.offerFeatures).join(';');
    const author = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const [DefaultUser, ProUser] = userRoles;
    const userRole = getRandomItem<UserRole>([DefaultUser, ProUser]);
    const coordinates = [
      generateRandomValue(CoordinatesValidation.MIN_LATITUDE, CoordinatesValidation.MAX_LATITUDE, 5),
      generateRandomValue(CoordinatesValidation.MIN_LONGITUDE, CoordinatesValidation.MAX_LONGITUDE, 5),
    ];
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      city,
      preview,
      images,
      isPremium,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      author,
      email,
      avatar,
      password,
      userRole,
      coordinates,
    ].join('\t');
  }
}
