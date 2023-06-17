import { inject, injectable } from 'inversify';
import { OfferServiceInterface } from './offer-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {
  DEFAULT_MAX_OFFER_COUNT,
  DEFAULT_OFFER_COUNT,
  DEFAULT_OFFER_PREMIUM_COUNT,
  OFFER_SORT,
} from './offer.constant.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { SortVariants } from '../../types/request-query.type.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async deleteById(id: string): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, dto, { new: true }).populate(['author', 'city']).exec();
  }

  public async findById(id: string): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate(['author', 'city']).exec();
  }

  public async find(
    count?: number,
    sortType: SortVariants = 'Default',
  ): Promise<types.DocumentType<OfferEntity>[]> {
    let limit = count ?? DEFAULT_OFFER_COUNT;
    if (limit >= DEFAULT_MAX_OFFER_COUNT) {
      limit = DEFAULT_MAX_OFFER_COUNT;
    }

    return this.offerModel
      .find({}, {}, { limit, sort: OFFER_SORT[sortType] })
      .populate(['author', 'city'])
      .exec();
  }

  public async findByCityId(cityId: string, count?: number): Promise<types.DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .find({ city: cityId }, {}, { limit })
      .sort(OFFER_SORT.Default)
      .populate(['author', 'city'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async incCommentCount(id: string, rating: number): Promise<types.DocumentType<OfferEntity> | null> {
    const existOffer = await this.findById(id);

    if (!existOffer) {
      throw new Error(`The offer with id: ${id} doesn't exist`);
    }
    const { rating: offerRating, commentsCount } = existOffer;

    const newRating = ((offerRating * commentsCount + rating) / (commentsCount + 1)).toFixed(1);

    return this.offerModel
      .findByIdAndUpdate(id, {
        $inc: {
          commentsCount: 1,
        },
        $set: {
          rating: newRating,
        },
      })
      .exec();
  }

  public async findPremium(cityId: string): Promise<types.DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({
        city: {
          _id: cityId,
        },
        isPremium: true,
      })
      .limit(DEFAULT_OFFER_PREMIUM_COUNT)
      .populate(['author', 'city'])
      .exec();
  }
}
