import { IsEmail, IsString, Length } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { Expose } from 'class-transformer';

export default class LoginUserDto {
  @Expose()
  @IsEmail()
  public email!: string;

  @Expose()
  @IsString()
  @Length(UserV.Password.Min, UserV.Password.Max)
  public password!: string;
}
