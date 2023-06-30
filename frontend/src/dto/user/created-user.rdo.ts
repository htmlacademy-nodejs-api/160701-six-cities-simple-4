import { UserType } from '../../const.js';

export default class CreatedUserRdo {
  public id!: string;

  public firstName!: string;

  public email!: string;

  public avatarPath!: string;

  public type!: UserType;

  public token!: string;
}
