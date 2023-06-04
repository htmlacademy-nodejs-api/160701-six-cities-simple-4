import { inject, injectable } from 'inversify';
import { CityServiceInterface } from './city-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import CreateCityDto from './dto/create-city.dto.js';
import { CityEntity } from './city.entity.js';
import { types } from '@typegoose/typegoose';

@injectable()
export default class CityService implements CityServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.CityModel) private readonly cityModel: types.ModelType<CityEntity>,
  ) {}

  public async create(dto: CreateCityDto): Promise<types.DocumentType<CityEntity>> {
    const result = await this.cityModel.create(dto);
    this.logger.info(`New city created: ${dto.name}`);

    return result;
  }

  public async findByCityId(cityId: string): Promise<types.DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId).exec();
  }

  public async findByCityName(cityName: string): Promise<types.DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name: cityName }).exec();
  }

  public async findByCityNameOrCreate(
    cityName: string,
    dto: CreateCityDto,
  ): Promise<types.DocumentType<CityEntity>> {
    const existedCity = await this.findByCityName(cityName);

    return existedCity ?? this.create(dto);
  }

  public async find(): Promise<types.DocumentType<CityEntity>[]> {
    return this.cityModel
      .aggregate([
        {
          $lookup: {
            from: 'offers',
            let: { cityId: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $in: ['$$cityId', '$city'] } },
              },
              {
                $project: { _id: 1 },
              },
            ],
            as: 'offers',
          },
        },
        {
          $addFields: {
            id: { $toString: '$_id' },
            offerCount: { $size: '$offers' },
          },
        },
      ])
      .exec();
  }
}
