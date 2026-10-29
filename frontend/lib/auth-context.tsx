"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

const TOKEN_KEY = "sih3_admin_token";
const USER_KEY = "sih3_admin_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with /auth/me in background
        axios
          .get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          .then((res) => {
            if (res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
            }
          })
          .catch(() => {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
          });
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const adminToken = response.data.token;
        const adminUser = response.data.user;

        setToken(adminToken);
        setUser(adminUser);

        localStorage.setItem(TOKEN_KEY, adminToken);
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser));

        return { success: true };
      }
      return { success: false, message: response.data?.message || "Login gagal." };
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan saat login.";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // Ignored
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

