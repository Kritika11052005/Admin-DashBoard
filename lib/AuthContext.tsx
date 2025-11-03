'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState<string | null>(storedToken);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkAuth = (): boolean => {
    const storedToken = localStorage.getItem('token');
    return !!storedToken;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default value instead of throwing error
    return {
      user: null,
      token: null,
      logout: () => {},
      isLoading: false,
      checkAuth: () => false,
    };
  }
  return context;
}