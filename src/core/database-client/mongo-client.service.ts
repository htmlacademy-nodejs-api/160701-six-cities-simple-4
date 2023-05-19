import { inject, injectable } from 'inversify';
import { DatabaseClientInterface } from './databese-client.interface.js';
import mongoose, { Mongoose } from 'mongoose';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {}

  private async _connect(uri: string): Promise<void> {
    this.mongooseInstance = await mongoose.connect(uri);
    this.isConnected = true;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB');
    await this._connect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('MongoDB client not connected');
    }

    await this._disconnect();
    this.logger.info('Database connection closed.');
  }

  private async _disconnect(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }
}
