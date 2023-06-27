import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { RequestQuery } from '../../types/request-query.type.js';
import { DocumentCreatedByUserInterface } from '../../types/document-created-by-user.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface, DocumentCreatedByUserInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(config: RequestQuery): Promise<DocumentType<OfferEntity>[]>;
  findByCityId(cityId: string, config?: RequestQuery): Promise<DocumentType<OfferEntity>[]>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
  findPremium(cityId: string, config?: RequestQuery): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(offersId: string[], config?: RequestQuery): Promise<DocumentType<OfferEntity>[]>;
}
