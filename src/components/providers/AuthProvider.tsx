"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserFromCookies = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserFromCookies();
  }, [fetchUserFromCookies]);

  const login = (userData: User) => {
    setUser(userData);
    setToken("cookie-auth");
    fetchUserFromCookies();
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      setToken(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
