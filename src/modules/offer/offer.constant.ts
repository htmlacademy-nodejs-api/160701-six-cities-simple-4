import { SortType } from '../../types/sort-type.enum.js';

export const DEFAULT_OFFER_COUNT = 60;
export const DEFAULT_MAX_OFFER_COUNT = 500;
export const DEFAULT_OFFER_PREMIUM_COUNT = 3;

export const OFFER_SORT = {
  Default: { createdAt: SortType.Down },
  Rated: { rating: SortType.Down },
  Popular: { commentsCount: SortType.Down },
  PriceTop: { price: SortType.Down },
  PriceDown: { price: SortType.Up },
};
