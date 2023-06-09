import { Expose } from 'class-transformer';
import { UserRole } from '../../../types/user.type';

export default class UserRdo {
  @Expose()
  public firstName!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public type!: UserRole;
}
