import { Expose } from 'class-transformer';

export default class UploadPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public preview!: string;
}
