export const ParamsNames = {
  OfferId: 'offerId',
  CityId: 'cityId',
} as const;

export type ParamsGetOffer = {
  [ParamsNames.OfferId]: string;
};

export type ParamsGetCity = {
  [ParamsNames.CityId]: string;
};
