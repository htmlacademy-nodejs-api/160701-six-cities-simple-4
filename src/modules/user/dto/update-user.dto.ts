import { IsEmail, IsEnum, IsString, Length, IsOptional, IsArray, ArrayUnique } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { UserRole, userRoles } from '../../../types/user.type.js';
import { Expose } from 'class-transformer';

export default class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsEmail()
  public email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(UserV.Name.Min, UserV.Name.Max)
  public firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public avatarPath?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(UserV.Password.Min, UserV.Password.Max)
  public password?: string;

  @Expose()
  @IsOptional()
  @IsEnum(userRoles, { message: UserV.Type.Message })
  public type?: UserRole;

  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  public favorites?: string[];
}
