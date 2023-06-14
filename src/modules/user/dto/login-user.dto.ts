import { IsEmail, IsString, Length } from 'class-validator';
import { UserPasswordLength } from '../../../const/validation.js';

export default class LoginUserDto {
  @IsEmail({}, { message: 'email must be a valid address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @Length(UserPasswordLength.Min, UserPasswordLength.Max, {
    message: `Min length for password is ${UserPasswordLength.Min}, max is ${UserPasswordLength.Max}`,
  })
  public password!: string;
}
