import { Cities } from '../../types/cities.type.js';
import { Offer, OfferFeatures, OfferVariant } from '../../types/offer.type.js';
import { UserRole } from '../../types/user.type.js';

export function createOffer(offerData: string): Offer {
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
    city: city as Cities,
    preview,
    images: parseGroup(images),
    isPremium: !isEmpty(isPremium),
    rating: Number(rating),
    type: type as OfferVariant,
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    features: parseGroup(features) as OfferFeatures[],
    author: {
      firstName,
      email,
      avatarPath: isEmpty(avatarPath) ? '' : avatarPath,
      type: userType as UserRole,
    },
    commentsCount: Number(commentsCount),
    coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
  };
}
