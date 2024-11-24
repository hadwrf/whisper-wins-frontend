'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  account: string | null;
  isAuthenticated: boolean;
  setAccount: (address: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem('userAccount');
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  const logout = () => {
    setAccount(null);
    localStorage.removeItem('userAccount');
  };

  useEffect(() => {
    if (account) {
      localStorage.setItem('userAccount', account);
    }
  }, [account]);

  return (
    <AuthContext.Provider value={{ account, isAuthenticated: !!account, setAccount, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
