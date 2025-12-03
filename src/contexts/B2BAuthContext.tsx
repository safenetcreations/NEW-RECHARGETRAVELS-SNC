import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { B2BAgency, B2BAuthResponse, B2BLoginCredentials, B2BRegisterData } from '@/types/b2b';

interface B2BAuthContextType {
  agency: B2BAgency | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: B2BLoginCredentials) => Promise<B2BAuthResponse>;
  register: (data: B2BRegisterData) => Promise<B2BAuthResponse>;
  logout: () => void;
  verifyEmail: (agencyId: string, code: string) => Promise<B2BAuthResponse>;
  resetPassword: (email: string) => Promise<B2BAuthResponse>;
}

const B2BAuthContext = createContext<B2BAuthContextType | undefined>(undefined);

const B2B_API_BASE = '/api/b2b';

export const B2BAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agency, setAgency] = useState<B2BAgency | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('b2b_token');
    const storedAgency = localStorage.getItem('b2b_agency');
    
    if (storedToken && storedAgency) {
      setToken(storedToken);
      setAgency(JSON.parse(storedAgency));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: B2BLoginCredentials): Promise<B2BAuthResponse> => {
    try {
      const response = await fetch(`${B2B_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        setToken(data.token);
        setAgency(data.agency);
        localStorage.setItem('b2b_token', data.token);
        localStorage.setItem('b2b_agency', JSON.stringify(data.agency));
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  };

  const register = async (data: B2BRegisterData): Promise<B2BAuthResponse> => {
    try {
      const response = await fetch(`${B2B_API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  };

  const verifyEmail = async (agencyId: string, code: string): Promise<B2BAuthResponse> => {
    try {
      const response = await fetch(`${B2B_API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, verificationCode: code }),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Verification failed. Please try again.',
      };
    }
  };

  const resetPassword = async (email: string): Promise<B2BAuthResponse> => {
    try {
      const response = await fetch(`${B2B_API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      return await response.json();
    } catch (error) {
      return {
        success: false,
        message: 'Password reset request failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setAgency(null);
    localStorage.removeItem('b2b_token');
    localStorage.removeItem('b2b_agency');
  };

  return (
    <B2BAuthContext.Provider
      value={{
        agency,
        token,
        isAuthenticated: !!token && !!agency,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        resetPassword,
      }}
    >
      {children}
    </B2BAuthContext.Provider>
  );
};

export const useB2BAuth = () => {
  const context = useContext(B2BAuthContext);
  if (context === undefined) {
    throw new Error('useB2BAuth must be used within a B2BAuthProvider');
  }
  return context;
};
