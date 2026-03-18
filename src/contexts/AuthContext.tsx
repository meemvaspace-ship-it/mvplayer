import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("mv-user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = () => {
    // Placeholder - will be replaced with Google OAuth via Lovable Cloud
    const mockUser: User = {
      id: crypto.randomUUID(),
      name: "Demo User",
      email: "demo@example.com",
    };
    setUser(mockUser);
    localStorage.setItem("mv-user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mv-user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
