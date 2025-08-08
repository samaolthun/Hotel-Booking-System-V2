"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/types";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    let role: "customer" | "owner" | "admin" = "customer";
    if (email === "admin@gmail.com") {
      role = "admin";
    } else {
      // Check if email is in approved owners
      const approvedOwners = JSON.parse(
        localStorage.getItem("approvedOwners") || "[]"
      );
      if (approvedOwners.includes(email)) {
        role = "owner";
      }
    }
    const userData: User = {
      id: 1,
      name: email.split("@")[0],
      email,
      avatar: `https://ui-avatars.com/api/?name=${
        email.split("@")[0]
      }&background=4f46e5&color=fff`,
      role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    let role: "customer" | "owner" | "admin" = "customer";
    if (email === "admin@gmail.com") {
      role = "admin";
    } else if (email.includes("owner")) {
      role = "owner";
    }
    const userData: User = {
      id: Date.now(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=4f46e5&color=fff`,
      role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
