import { Expose } from 'class-transformer';
import { UserRole, UserWithoutPassword } from '../../../types/user.type';

export default class CreatedUserRdo implements UserWithoutPassword {
  @Expose()
  public id!: string;

  @Expose()
  public firstName!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;

  @Expose()
  public type!: UserRole;

  @Expose()
  public token!: string;
}
