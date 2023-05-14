import { FileReaderInterface } from './file-reader.interface.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

const CHUNK_SIZE = 2 ** 14; // 16KB
export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const steram = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });
    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of steram) {
      remainingData += chunk.toString();
      nextLinePosition = remainingData.indexOf('\n');

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);

        importedRowCount++;

        this.emit('readline', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }
}
