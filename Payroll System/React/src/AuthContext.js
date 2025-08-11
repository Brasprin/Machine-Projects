import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from './ConfigContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

const checkAuthStatus = async () => {
  try {
    console.log('🔍 Checking auth status...');
    
    // ALWAYS check cookies, regardless of sessionStorage
    // This enables persistence across tabs and browser sessions
    const response = await fetch(`${BASE_URL}/api/verify-auth`, {
      credentials: 'include',
    });
    
    console.log('📡 Auth check response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Auth check successful:', data.user);
        setIsAuthenticated(true);
        setUser(data.user);
        
        // Sync sessionStorage with the verified auth data
        sessionStorage.setItem('userValid', 'true');
        sessionStorage.setItem('company', data.user.companyId);
        sessionStorage.setItem('companyName', data.user.companyName);
        sessionStorage.setItem('username', data.user.username);
      } else {
        console.log('❌ Auth check failed:', data);
        setIsAuthenticated(false);
        setUser(null);
        clearSessionStorage();
      }
    } else {
      console.log('❌ Auth check failed with status:', response.status);
      setIsAuthenticated(false);
      setUser(null);
      clearSessionStorage();
    }
  } catch (error) {
    console.error('❌ Auth check error:', error);
    setIsAuthenticated(false);
    setUser(null);
    clearSessionStorage();
  } finally {
    setLoading(false);
  }
};

const clearSessionStorage = () => {
  sessionStorage.removeItem('userValid');
  sessionStorage.removeItem('company');
  sessionStorage.removeItem('companyName');
  sessionStorage.removeItem('username');
};

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch(`${BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear all auth state
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('userValid');
    sessionStorage.removeItem('company');
    sessionStorage.removeItem('companyName');
    sessionStorage.removeItem('username');
    
    console.log('✅ Logout complete');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      checkAuthStatus,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};