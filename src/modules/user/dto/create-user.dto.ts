import { IsEmail, IsString, Length } from 'class-validator';
import { UserNameLength, UserPasswordLength } from '../../../const/validation.js';

export default class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'firstname is required' })
  @Length(UserNameLength.Min, UserNameLength.Max, {
    message: `Min length is ${UserNameLength.Min}, max is ${UserNameLength.Max}`,
  })
  public firstName!: string;

  @IsString({ message: 'avatarPath is required' })
  public avatarPath!: string;

  @IsString({ message: 'password is required' })
  @Length(UserPasswordLength.Min, UserPasswordLength.Max, {
    message: `Min length for password is ${UserPasswordLength.Min}, max is ${UserPasswordLength.Max}`,
  })
  public password!: string;
}
