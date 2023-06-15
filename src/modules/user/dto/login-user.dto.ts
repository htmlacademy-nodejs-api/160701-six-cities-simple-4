import { IsEmail, IsString, Length } from 'class-validator';
import { UserV } from '../../../const/validation.js';

export default class LoginUserDto {
  @IsEmail({}, { message: 'email must be a valid address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @Length(UserV.Password.Min, UserV.Password.Max, {
    message: `Min length for password is ${UserV.Password.Min}, max is ${UserV.Password.Max}`,
  })
  public password!: string;
}
