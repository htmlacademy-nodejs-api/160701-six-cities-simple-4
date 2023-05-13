import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Offer, OfferFeatures, OfferType } from '../../types/offer.type.js';
import { UserRole } from '../../types/user.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map((data) => {
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
          userType,
          commentsCount,
          coordinates,
        ] = data;
        const [latitude, longitude] = coordinates.split(';');

        return {
          title,
          description,
          createdAt: new Date(createdDate),
          city,
          preview,
          images: images.split(';'),
          isPremium: Boolean(isPremium),
          rating: Number(rating),
          type: type as OfferType,
          rooms: Number(rooms),
          guests: Number(guests),
          price: Number(price),
          features: features.split(';') as OfferFeatures[],
          author: { firstName, email, avatarPath, type: userType as UserRole },
          commentsCount: Number(commentsCount),
          coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
        };
      });
  }
}
