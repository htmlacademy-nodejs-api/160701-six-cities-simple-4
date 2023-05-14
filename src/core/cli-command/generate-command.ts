import { MockData } from '../../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';
import got from 'got';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch (error) {
      console.log(`Can't fetch data from ${url}.`);
    }
  }
}
