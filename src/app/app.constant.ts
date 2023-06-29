import { Cities } from '../types/cities.type.js';

export const DefaultFileName = {
  AVATAR: 'default-avatar.jpg',
  OFFER_PREVIEW: 'default-preview.jpg',
  OFFER_IMAGES: 'default-image.jpg',
};
export const DEFAULT_CITIES_FILE_NAME = Cities.map((city) => `city-${city.toLocaleLowerCase()}.jpg`);

export const DEFAULT_STATIC_IMAGES = [
  ...Object.values(DefaultFileName),
  ...DEFAULT_CITIES_FILE_NAME,
];

export const STATIC_RESOURCE_FIELDS = [
  { property: 'avatarPath', path: 'users/avatar' },
  { property: 'preview', path: 'offers/:id/preview' },
  { property: 'images', path: 'offers/:id/images' },
  { property: 'cityImage', path: '' },
];
