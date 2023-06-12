export type Comment<O, U> = {
  text: string;
  offerId: O;
  userId: U;
  createdAt?: Date;
  rating: number;
};
