import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Designation } from '../types';

interface AuthContextType {
  user: User | null;
  login: (name: string, designation: Designation, code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, these would be in Firestore. For this version, let's use a simple check.
// We can later move this to a Firestore 'settings' collection if needed.
const ROLE_CODES: Record<string, Designation> = {
  'FOUNDER77': 'Owner',
  'OPSHEAD01': 'Operational Head',
  'GENMGR22': 'General Manager',
  'SOCIAL10': 'Social Media Manager',
  'TEACHER00': 'Teacher',
  'ADMIN99': 'Admin',
  'TEACH123': 'Owner'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('teachflow_user');
    const lastVerified = localStorage.getItem('teachflow_last_verified');

    if (savedUser && lastVerified) {
      const parsedUser = JSON.parse(savedUser);
      const lastVerifiedDate = new Date(lastVerified);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastVerifiedDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays < 7) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('teachflow_user');
        localStorage.removeItem('teachflow_last_verified');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (name: string, designation: Designation, code: string) => {
    // Check if the code matches the intended designation
    const expectedDesignation = ROLE_CODES[code];
    
    // We allow any valid code to grant its respective role, 
    // even if the user selected a different one in the dropdown (it overrides).
    if (expectedDesignation) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        designation: expectedDesignation
      };
      setUser(newUser);
      localStorage.setItem('teachflow_user', JSON.stringify(newUser));
      localStorage.setItem('teachflow_last_verified', new Date().toISOString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teachflow_user');
    localStorage.removeItem('teachflow_last_verified');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
