import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (username, password) => Promise<void>;
  signup: (userData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AuthService.getToken();
      if (token) {
        // Ideally verify token with backend here, for now just assume valid if exists
        // Or decode it if it's a JWT to get user info
        setUser({ token }); // Placeholder user object
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    const user = await AuthService.login(username, password);
    setUser(user);
  };

  const signup = async (userData) => {
    const user = await AuthService.signup(userData);
    setUser(user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
