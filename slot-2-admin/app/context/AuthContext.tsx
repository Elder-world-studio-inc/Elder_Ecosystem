"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'division';
  divisionId: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Ensure token is not expired
        if (decoded.exp * 1000 > Date.now()) {
             // eslint-disable-next-line react-hooks/set-state-in-effect
             setUser({
                id: decoded.id,
                username: decoded.username,
                role: decoded.role,
                divisionId: decoded.divisionId
             });
        } else {
            Cookies.remove('token');
        }
      } catch (error) {
        Cookies.remove('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    setUser(userData);
    if (userData.role === 'admin') {
      router.push('/command-center');
    } else if (userData.role === 'division' && userData.divisionId) {
      router.push(`/divisions/${userData.divisionId}`);
    } else {
        router.push('/');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
      if (!isLoading && !user && pathname !== '/login') {
          router.push('/login');
      }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
