import CreateUserDto from '../../dto/user/create-user.dto.js';
import { UserRegister } from '../../types/types.js';

export const adaptSignupToServer = (user: UserRegister): CreateUserDto => ({
  firstName: user.name,
  email: user.email,
  // avatarPath: ' ',
  password: user.password,
});
