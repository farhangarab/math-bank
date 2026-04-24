import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/auth";
import type { AuthUser } from "../types/auth";

type AuthContextValue = {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
