import store from '../store';

import type { Offer, Comment, City, SortName, User, OfferMin } from './types';
import { AuthorizationStatus, SubmitStatus } from '../const';

export type SiteData = {
  offers: OfferMin[];
  isOffersLoading: boolean;
  offer: Offer | null;
  isOfferLoading: boolean;
  favoriteOffers: OfferMin[];
  isFavoriteOffersLoading: boolean;
  premiumOffers: OfferMin[];
  comments: Comment[];
  commentStatus: SubmitStatus;
};

export type SiteProcess = {
  city: City;
  sorting: SortName;
};

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  user: User['email'];
};

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
