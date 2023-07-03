import { Expose, Type } from 'class-transformer';
import CreatedUserRdo from '../../user/rdo/created-user.rdo.js';

export default class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public createdAt!: string;

  @Expose({ name: 'userId' })
  @Type(() => CreatedUserRdo)
  public author!: CreatedUserRdo;
}
