"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
interface User {
  id: string;
  email: string;
  name?: string | null;
}
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [ user, setUser ] = useState<User | null>(null);
  const [ loading, setLoading ] = useState(true);

  async function fetchMe() {
    try {
      const data = await apiFetch<{ user: User }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiFetch<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password})
    });
    setUser(data.user);
  }

  async function register(email: string, password: string, name?: string) {
    const data = await apiFetch<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name })
    });
    setUser(data.user);
  }

  async function logout() {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng trong AuthProvider");
  return ctx;
}