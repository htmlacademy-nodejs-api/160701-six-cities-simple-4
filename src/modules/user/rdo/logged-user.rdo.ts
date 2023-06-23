import { Expose } from 'class-transformer';
import { UserRole, UserWithoutPassword } from '../../../types/user.type';

export default class LoggedUserRdo implements UserWithoutPassword {
  @Expose()
  public email!: string;

  @Expose()
  public token!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public firstName!: string;

  @Expose()
  public type!: UserRole;
}
