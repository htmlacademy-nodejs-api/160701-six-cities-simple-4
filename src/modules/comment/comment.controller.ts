import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { fillDTO } from '../../core/helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import * as core from 'express-serve-static-core';
import { ParamsGetOffer, ParamsNames } from '../../types/params.type.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { EntityNames } from '../../types/entity-names.enum.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,

    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamsNames.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityNames.Offer, ParamsNames.OfferId),
      ],
    });
  }

  public async create(
    { body, params, user }: Request<core.ParamsDictionary | ParamsGetOffer, object, CreateCommentDto>,
    res: Response,
  ) {
    const { rating } = body;
    const { offerId } = params;
    const { id } = user;

    const comment = await this.commentService.create({ ...body, offerId, userId: id });
    await this.offerService.incCommentCount(offerId, rating);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async show({ params }: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
