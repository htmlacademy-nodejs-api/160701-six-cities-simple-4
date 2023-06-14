import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import HttpError from '../../core/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../core/helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import * as core from 'express-serve-static-core';
import { ParamsGetOffer } from '../offer/offer.controller.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,

    @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async create({ body }: Request<object, object, CreateCommentDto>, res: Response) {
    const { offerId, rating } = body;
    const exists = await this.offerService.exists(offerId);

    if (!exists) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`, 'CommentController');
    }

    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(offerId, rating);
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async show({ params }: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const { offerId } = params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.created(res, fillDTO(CommentRdo, comments));
  }
}
