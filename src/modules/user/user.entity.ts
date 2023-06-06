import { UserNameLength } from '../../const/validation.js';
import { createSHA256 } from '../../core/helpers/common.js';
import { userRoles, UserRole, UserWithoutPassword } from '../../types/user.type.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';

const [defaultUser] = userRoles;
const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements UserWithoutPassword {
  @prop({ required: true, minlength: UserNameLength.Min, maxlength: UserNameLength.Max })
  public firstName: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatarPath: string;

  @prop({
    type: () => String,
    enum: userRoles,
    default: defaultUser,
    required: false,
  })
  public type?: UserRole;

  @prop({ required: true, default: '' })
  private password?: string;

  constructor({ email, firstName, avatarPath, type }: UserWithoutPassword) {
    super();

    this.email = email;
    this.firstName = firstName;
    this.avatarPath = avatarPath;
    this.type = type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
