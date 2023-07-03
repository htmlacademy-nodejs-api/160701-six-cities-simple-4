export type SortVariants = 'DateNew' | 'Rated' | 'Popular' | 'PriceTop' | 'PriceDown';
export type RequestQuery = {
  limit?: number;
  sortType?: SortVariants;
};
