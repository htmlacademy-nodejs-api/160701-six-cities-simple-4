export const userRoles = ['default', 'pro'] as const;
export type UserRole = (typeof userRoles)[number];

export type User = {
  firstName: string;
  email: string;
  avatarPath: string;
  type?: UserRole;
  favorites?: string[];
  password: string;
};

export type UserWithoutPassword = Omit<User, 'password'>;

export type JwtUserPayload = {
  id: string;
  email: string;
}
