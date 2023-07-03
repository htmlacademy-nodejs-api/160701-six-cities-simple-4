// import CategoryDto from '../../dto/category/category.dto';
// import CityRdo from '../../dto/city/city.rdo.js';
// import CommentDto from '../../dto/comment/comment.dto';

import OfferFullRdo from '../../dto/offer/offer-full.rdo.js';
import OfferMinRdo from '../../dto/offer/offer.rdo.js';
// import LoggedUserRdo from '../../dto/user/logged-user.rdo.js';
// import UserWithTokenDto from '../../dto/user/user-with-token.dto';

// import { Categories } from '../../types/category';
// import { Comments } from '../../types/comment';
// import { Tickets } from '../../types/ticket';
import { Offer, OfferMin, User } from '../../types/types.js';
import CreatedUserRdo from '../../dto/user/created-user.rdo.js';
// import { User } from '../../types/user';

// export const adaptCategoriesToClient = (categories: CityRdo[]): Categories =>
//   categories.map((category: CategoryDto) => ({
//     id: category.id,
//     title: category.name,
//     image: category.cityImage,
//     itemsCount: Number(category.offerCount),
//   }));

// export const adaptLoginToClient = (user: LoggedUserRdo): User => ({
//   name: user.firstName,
//   surname: '',
//   email: user.email,
//   avatar: user.avatarPath,
//   token: user.token,
// });

export const adaptUserToClient = (user: CreatedUserRdo): User => ({
  name: user.firstName,
  email: user.email,
  avatarUrl: user.avatarPath,
  type: user.type,
});

export const adaptOffersToClient = (offers: OfferMinRdo[]): OfferMin[] =>
  offers
    // .filter((offer: OfferDto) => offer.a !== null)
    .map((offer: OfferMinRdo) => ({
      id: offer.id,
      price: offer.price,
      rating: offer.rating,
      title: offer.title,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      city: offer.city,
      previewImage: offer.preview,
      type: offer.type,
    }));

export const adaptOneOfferToClient = (offer: OfferFullRdo): Offer => ({
  id: offer.id,
  title: offer.title,
  description: offer.description,
  price: offer.price,
  rating: offer.rating,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: offer.city,
  previewImage: offer.preview,
  type: offer.type,
  location: offer.coordinates,
  bedrooms: offer.rooms,
  goods: offer.features,
  host: adaptUserToClient(offer.author),
  images: offer.images,
  maxAdults: offer.guests,
});

// export const adaptCommentsToClient = (comments: CommentDto[]): Comments =>
//   comments
//     .filter((comment: CommentDto) => comment.user !== null)
//     .map((comment: CommentDto) => ({
//       id: comment.id,
//       text: comment.text,
//       publishedDate: comment.postDate,
//       user: adaptUserToClient(comment.user),
//     }));
