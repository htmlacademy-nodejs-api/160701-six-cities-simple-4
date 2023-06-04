import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findByCityId(cityId: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(): Promise<DocumentType<OfferEntity>[]>;
}
