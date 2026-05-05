import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/auth";
import type { AuthUser } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Hydrate auth state from the server-side session on first load.
    void refreshUser();
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    login: async (identifier, password, remember) => {
      const data = await loginUser(identifier, password, remember);
      setUser(data.user);
      return data.user;
    },
    logout: async () => {
      try {
        await logoutUser();
      } finally {
        setUser(null);
      }
    },
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
