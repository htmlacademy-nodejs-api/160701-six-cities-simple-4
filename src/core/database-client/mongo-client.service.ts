import { inject, injectable } from 'inversify';
import { DatabaseClientInterface } from './databese-client.interface.js';
import mongoose, { Mongoose } from 'mongoose';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { setTimeout } from 'node:timers/promises';

const RetryConfig = {
  Count: 5,
  Timeout: 1000,
} as const;

@injectable()
export default class MongoClientService implements DatabaseClientInterface {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {}

  private async _connectWithRetry(uri: string): Promise<Mongoose> {
    let attempt = 0;

    while (attempt < RetryConfig.Count) {
      try {
        return await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 1000,
        });
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`);
        await setTimeout(RetryConfig.Timeout);
      }
    }

    this.logger.error(`Unable to establish database connection after ${attempt}`);
    throw new Error('Failed to connect to tah database');
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB');
    this.mongooseInstance = await this._connectWithRetry(uri);
    this.isConnected = true;
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('MongoDB client not connected');
    }

    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
    this.logger.info('Database connection closed.');
  }
}
