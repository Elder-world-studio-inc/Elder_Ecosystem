import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { saveToken, getToken, removeToken } from '../services/storage';

interface User {
  id: string;
  username: string;
  scan_count: number;
  is_elite: boolean;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Ideally verify token with backend, for now assume valid or fail on next request
        // Fetch profile to get user data
        // We don't have a /me endpoint in existing auth, but we can use /adcam/quota to get some info
        // Or just store user in local storage too. For now, let's try to fetch quota to validate.
        try {
          const response = await api.get('/adcam/quota');
          setUser({ 
             id: 'unknown', 
             username: 'User', 
             scan_count: response.data.scan_count,
             is_elite: response.data.is_elite 
          });
        } catch (e) {
            // Token might be expired
            await removeToken();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, user } = response.data;
    await saveToken(token);
    setUser({
        ...user,
        scan_count: user.scan_count || 0
    });
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  const refreshUser = async () => {
      try {
        const response = await api.get('/adcam/quota');
        if (user) {
            setUser({
                ...user,
                scan_count: response.data.scan_count,
                is_elite: response.data.is_elite
            });
        }
      } catch (e) {
          console.error("Failed to refresh user", e);
      }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
