import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { usersApi } from '../api/users.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('eldercare_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('eldercare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await usersApi.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('eldercare_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Token invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('eldercare_token', newToken);
    localStorage.setItem('eldercare_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eldercare_token');
    localStorage.removeItem('eldercare_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('eldercare_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
