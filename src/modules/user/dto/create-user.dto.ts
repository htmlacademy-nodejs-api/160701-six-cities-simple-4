import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { UserRole, userRoles } from '../../../types/user.type.js';
import { Expose } from 'class-transformer';

export default class CreateUserDto {
  @Expose()
  @IsEmail()
  public email!: string;

  @Expose()
  @IsString()
  @Length(UserV.Name.Min, UserV.Name.Max)
  public firstName!: string;

  @Expose()
  @IsString()
  @Length(UserV.Password.Min, UserV.Password.Max)
  public password!: string;

  @Expose()
  @IsOptional()
  @IsIn(userRoles)
  public type?: UserRole;
}
