import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from '../utils/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const data = await apiCall('/auth/me');
        setUser(data.user);
      }
    } catch (e) {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }

  async function loginFn(email: string, password: string) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await AsyncStorage.setItem('access_token', data.access_token);
    setUser(data.user);
  }

  async function registerFn(name: string, email: string, password: string, role: string) {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    await AsyncStorage.setItem('access_token', data.access_token);
    setUser(data.user);
  }

  async function logoutFn() {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  async function refreshUser() {
    try {
      const data = await apiCall('/auth/me');
      setUser(data.user);
    } catch (e) {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login: loginFn, register: registerFn, logout: logoutFn, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
