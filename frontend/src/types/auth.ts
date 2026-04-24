export type UserRole = "STUDENT" | "TEACHER";

export type AuthUser = {
  id: number;
  username: string;
  full_name: string;
  role: UserRole;
};
