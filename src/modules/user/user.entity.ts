import { User, userRoles } from '../../types/user.type.js';
const [defaultUser] = userRoles;
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';

const { prop } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public firstName = '';

  @prop({ unique: true, required: true })
  public email = '';

  @prop({ required: false, default: '' })
  public avatarPath = '';

  @prop({
    type: () => String,
    enum: userRoles,
  })
  public type = defaultUser;

  @prop({ required: false, default: '' })
  public password = '';
}

export const UserModel = getModelForClass(UserEntity);
