import { User, userRoles } from '../../types/user.type.js';
const [defaultUser] = userRoles;

export class UserEntity implements User {
  public firstName = '';
  public email = '';
  public avatarPath = '';
  public type = defaultUser;
  public password = '';
}
