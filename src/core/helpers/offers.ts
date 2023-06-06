/* eslint-disable @typescript-eslint/no-unused-vars */
import { TCities } from '../../types/cities.type.js';
import { Offer, TOfferFeatures, TOfferVariants } from '../../types/offer.type.js';
import { UserRole, User } from '../../types/user.type.js';

export function createOffer(offerData: string): Offer<User, TCities> {
  const [
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
    firstName,
    email,
    avatarPath,
    password,
    userType,
    commentsCount,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const isEmpty = (field: string): boolean => field === '-';

  const parseGroup = (str: string): string[] => {
    if (!str) {
      return [];
    }
    return str.split(';');
  };

  const [latitude = null, longitude = null] = parseGroup(coordinates);

  return {
    title,
    description,
    createdAt: new Date(createdDate),
    city: city as TCities,
    preview,
    images: parseGroup(images),
    isPremium: !isEmpty(isPremium),
    rating: Number(rating),
    type: type as TOfferVariants,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    features: parseGroup(features) as TOfferFeatures[],
    author: {
      firstName,
      email,
      avatarPath: isEmpty(avatarPath) ? '' : avatarPath,
      type: userType as UserRole,
      password,
    },
    commentsCount: Number(commentsCount),
    coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
  };
}
