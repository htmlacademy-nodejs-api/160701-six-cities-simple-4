import { User, userRoles } from '../../types/user.type.js';
const [defaultUser] = userRoles;
import typegoose, { getModelForClass } from '@typegoose/typegoose';

const { prop } = typegoose;

export class UserEntity implements User {
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
