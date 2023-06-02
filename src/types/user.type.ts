export const userRoles = ['default', 'pro'] as const;
export type UserRole = (typeof userRoles)[number];

export type User = {
  firstName: string;
  email: string;
  avatarPath: string;
  type?: UserRole;
  password: string;
};

export type UserWithoutPassword = Omit<User, 'password'>;
