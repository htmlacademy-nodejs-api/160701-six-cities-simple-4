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
    const lines = this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'));

    return lines.map((data) => {
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
      ] = data;
      const [latitude = null, longitude = null] = this.parseGroup(coordinates);

      return {
        title,
        description,
        createdAt: new Date(createdDate),
        city,
        preview,
        images: this.parseGroup(images),
        isPremium: !this.isEmpty(isPremium),
        rating: Number(rating),
        type: type as OfferType,
        rooms: Number(rooms),
        guests: Number(guests),
        price: Number(price),
        features: this.parseGroup(features) as OfferFeatures[],
        author: {
          firstName,
          email,
          avatarPath: this.isEmpty(avatarPath) ? undefined : avatarPath,
          password,
          type: userType as UserRole,
        },
        commentsCount: Number(commentsCount),
        coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
      };
    });
  }

  private isEmpty(field: string): boolean {
    return field === '-';
  }

  private parseGroup(str: string): string[] {
    if (!str) {
      return [];
    }
    return str.split(';');
  }
}
