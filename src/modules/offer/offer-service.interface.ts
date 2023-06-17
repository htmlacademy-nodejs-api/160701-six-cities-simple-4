import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { SortVariants } from '../../types/request-query.type.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number, sortType?: SortVariants): Promise<DocumentType<OfferEntity>[]>;
  findByCityId(cityId: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
  findPremium(cityId: string): Promise<DocumentType<OfferEntity>[]>;
}
