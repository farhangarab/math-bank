import { createContext } from "react";
import type { AuthUser } from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string,
    remember: boolean,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
