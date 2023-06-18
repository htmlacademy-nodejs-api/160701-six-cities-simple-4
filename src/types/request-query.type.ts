export type SortVariants = 'Default' | 'Rated' | 'Popular' | 'PriceTop' | 'PriceDown';
export type RequestQuery = {
  limit?: number;
  sortType?: SortVariants;
};
