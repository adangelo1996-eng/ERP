"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type AuthState = {
  token: string | null;
  user: { email: string; fullName: string; role: string } | null;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "erp_token";
const USER_KEY = "erp_user";
const DEMO_ADMIN = { email: "admin@erp.local", password: "admin123" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; fullName: string; role: string } | null>(null);
  const autoLoginTried = useRef(false);

  const doLogin = useCallback(async (email: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (data.access_token && data.user) {
      localStorage.setItem(STORAGE_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.access_token);
      setUser(data.user);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
      return;
    }
    // Auto-login admin per fase di test (NEXT_PUBLIC_AUTO_LOGIN=true o non impostato in dev)
    const autoLogin = process.env.NEXT_PUBLIC_AUTO_LOGIN !== "false";
    if (autoLogin && !autoLoginTried.current) {
      autoLoginTried.current = true;
      doLogin(DEMO_ADMIN.email, DEMO_ADMIN.password).catch(() => {});
    }
  }, [doLogin]);

  const login = useCallback(
    (email: string, password: string) => doLogin(email, password),
    [doLogin],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
