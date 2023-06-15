import { DocumentType } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import CreateCityDto from './dto/create-city.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface CityServiceInterface extends DocumentExistsInterface {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByCityId(cityId: string): Promise<DocumentType<CityEntity> | null>;
  findByCityName(cityName: string): Promise<DocumentType<CityEntity> | null>;
  findByCityNameOrCreate(cityName: string, dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
}
