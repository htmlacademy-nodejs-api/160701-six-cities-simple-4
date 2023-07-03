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
import { RequestQuery } from '../../types/request-query.type.js';
import { DefaultFileName } from '../../app/app.constant.js';
import { OfferV } from '../../const/validation.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({
      ...dto,
      preview: DefaultFileName.OFFER_PREVIEW,
      images: Array.from({ length: OfferV.Images.Min }).map(() => DefaultFileName.OFFER_IMAGES),
    });
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async deleteById(id: string): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .populate(['author', 'city'])
      .exec();
  }

  public async findById(id: string): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate(['author', 'city']).exec();
  }

  public async find(
    config: RequestQuery,
    findParam: Record<string, unknown> = {},
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const { limit, sortType = 'DateNew' } = config;
    let limitValue = limit ?? DEFAULT_OFFER_COUNT;
    if (limitValue >= DEFAULT_MAX_OFFER_COUNT) {
      limitValue = DEFAULT_MAX_OFFER_COUNT;
    }

    return this.offerModel
      .find(findParam, {}, { limit: limitValue, sort: OFFER_SORT[sortType] })
      .populate(['author', 'city'])
      .exec();
  }

  public async findByCityId(
    cityId: string,
    config: RequestQuery,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    return this.find(config, { city: cityId });
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

  public async findPremium(cityId: string, config: RequestQuery): Promise<types.DocumentType<OfferEntity>[]> {
    return this.find(
      { ...config, limit: DEFAULT_OFFER_PREMIUM_COUNT },
      {
        city: {
          _id: cityId,
        },
        isPremium: true,
      },
    );
  }

  public async findFavorites(
    offersId: string[],
    config: RequestQuery,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    return this.find(
      { ...config },
      {
        _id: { $in: offersId },
      },
    );
  }

  public async createdByUser(documentId: string, userId: string): Promise<boolean> {
    const offer = await this.findById(documentId);

    return offer?.author?.id === userId;
  }
}
