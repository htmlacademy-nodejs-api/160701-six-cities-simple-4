import { Cities } from '../types/cities.type.js';
import { OfferFeatures, OfferVariants } from '../types/offer.type.js';
import { userRoles } from '../types/user.type.js';

export const UserV = {
  Name: {
    Min: 1,
    Max: 15,
  },
  Password: {
    Min: 6,
    Max: 15,
  },
  Type: {
    Message: `Тип пользователя не входит в список разрешенных: ${userRoles.join(', ')}`,
  },
};

export const OfferV = {
  Title: {
    Min: 10,
    Max: 100,
  },
  Description: {
    Min: 20,
    Max: 1024,
  },
  Rooms: {
    Min: 1,
    Max: 8,
  },
  Guests: {
    Min: 1,
    Max: 10,
  },
  Price: {
    Min: 100,
    Max: 100_000,
  },
  Rating: {
    Default: 0,
    Min: 1,
    Max: 5,
  },
  Variants: {
    Message: `Тип жилья не входит в список разрешенных: ${OfferVariants.join(', ')}`,
  },
  Features: {
    Message: `Удобства не входят в список разрешенных: ${OfferFeatures.join(', ')}`,
  },
  Coordinates: {
    Message: {
      isNumber: 'Координаты должны быть заданы числом',
      isValid: 'Координаты с невалидными значениями',
    },
  },
} as const;

export const CommentV = {
  Text: {
    Min: 5,
    Max: 1024,
  },

  Rating: {
    Min: OfferV.Rating.Min,
    Max: OfferV.Rating.Max,
  },
} as const;

export const CityV = {
  Name: {
    Message: `Город не входит в список разрешенных: ${Cities.join(', ')}`,
  },
} as const;
