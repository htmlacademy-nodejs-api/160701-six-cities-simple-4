import { Expose } from 'class-transformer';

export default class UploadImagesRdo {
  @Expose()
  public id!: string;

  @Expose()
  public images!: string[];
}
