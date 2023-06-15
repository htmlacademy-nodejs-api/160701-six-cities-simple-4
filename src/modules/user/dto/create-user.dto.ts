import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserV } from '../../../const/validation.js';
import { UserRole, userRoles } from '../../../types/user.type.js';

export default class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'firstname is required' })
  @Length(UserV.Name.Min, UserV.Name.Max, {
    message: `Min length is ${UserV.Name.Min}, max is ${UserV.Name.Max}`,
  })
  public firstName!: string;

  @IsString({ message: 'avatarPath is required' })
  public avatarPath!: string;

  @IsString({ message: 'password is required' })
  @Length(UserV.Password.Min, UserV.Password.Max, {
    message: `Min length for password is ${UserV.Password.Min}, max is ${UserV.Password.Max}`,
  })
  public password!: string;

  @IsOptional()
  @IsEnum(userRoles, { message: UserV.Type.Message })
  public type?: UserRole;
}
