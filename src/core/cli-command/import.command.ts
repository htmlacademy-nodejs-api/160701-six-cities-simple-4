import { CityServiceInterface } from '../../modules/city/city-service.interface.js';
import { CityModel } from '../../modules/city/city.entity.js';
import CityService from '../../modules/city/city.service.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import OfferService from '../../modules/offer/offer.service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserModel } from '../../modules/user/user.entity.js';
import UserService from '../../modules/user/user.service.js';
import { TCities } from '../../types/cities.type.js';
import { Offer } from '../../types/offer.type.js';
import { User } from '../../types/user.type.js';
import { DatabaseClientInterface } from '../database-client/databese-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import TSVFileReader from '../file-reader/file-reader.js';
import { getErrorMessage, createOffer, getMongoURI } from '../helpers/index.js';
import ConsoleLoggerService from '../logger/console.service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { CliCommandInterface } from './cli-command.interface.js';

const Default = {
  DB_PORT: '27017',
  USER_PASSWORD: '123456',
};

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private cityService!: CityServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.cityService = new CityService(this.logger, CityModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: Offer<User, TCities>) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: offer.author.password || Default.USER_PASSWORD,
      },
      this.salt,
    );
    const city = await this.cityService.findByCityNameOrCreate(offer.city, { name: offer.city });

    await this.offerService.create({
      ...offer,
      city: city.id,
      author: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);

    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, Default.DB_PORT, dbname);

    this.salt = salt;
    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('readline', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
