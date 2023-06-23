import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { UserRole, userRoles } from '../../../types/user.type.js';

export default class CreateUserDto {
  @IsEmail()
  public email!: string;

  @IsString()
  @Length(UserV.Name.Min, UserV.Name.Max)
  public firstName!: string;

  @IsString()
  public avatarPath!: string;

  @IsString()
  @Length(UserV.Password.Min, UserV.Password.Max)
  public password!: string;

  @IsOptional()
  @IsIn(userRoles)
  public type?: UserRole;
}
