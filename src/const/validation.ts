import { Cities } from '../types/cities.type.js';
import { OfferFeatures, OfferVariants } from '../types/offer.type.js';

export const enum UserNameLength {
  Min = 1,
  Max = 15,
}

export const enum UserPasswordLength {
  Min = 6,
  Max = 12,
}

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
    Message: 'Координаты должны быть заданы числом',
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
