import { appendFile } from 'node:fs/promises';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';
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

    const offerGenerator = new OfferGenerator(this.initialData);

    for (let i = 0; i < offerCount; i++) {
      await appendFile(filepath, `${offerGenerator.generate()}\n`, 'utf-8');
    }

    console.log(`File ${filepath} was created!`);
  }
}
