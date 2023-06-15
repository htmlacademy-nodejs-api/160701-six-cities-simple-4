import { IsEmail, IsEnum, IsString, Length, IsOptional } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { UserRole, userRoles } from '../../../types/user.type.js';

export default class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'email must be valid address' })
  public email?: string;

  @IsOptional()
  @IsString({ message: 'firstname is required' })
  @Length(UserV.Name.Min, UserV.Name.Max, {
    message: `Min length is ${UserV.Name.Min}, max is ${UserV.Name.Max}`,
  })
  public firstName?: string;

  @IsOptional()
  @IsString({ message: 'avatarPath is required' })
  public avatarPath?: string;

  @IsOptional()
  @IsString({ message: 'password is required' })
  @Length(UserV.Password.Min, UserV.Password.Max, {
    message: `Min length for password is ${UserV.Password.Min}, max is ${UserV.Password.Max}`,
  })
  public password?: string;

  @IsOptional()
  @IsEnum(userRoles, { message: UserV.Type.Message })
  public type?: UserRole;
}
