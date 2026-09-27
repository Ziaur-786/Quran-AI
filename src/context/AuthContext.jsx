import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'quran_ai_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user session from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Decode standard JWT from Google Identity Services
  const decodeGoogleJwt = (credential) => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Failed to decode Google JWT', err);
      return null;
    }
  };

  // Login handler for actual Google Credential
  const loginWithGoogleCredential = (credential) => {
    const payload = decodeGoogleJwt(credential);
    if (!payload) return false;

    const userData = {
      id: payload.sub,
      name: payload.name,
      given_name: payload.given_name || payload.name?.split(' ')[0] || 'Believer',
      family_name: payload.family_name || '',
      email: payload.email,
      picture: payload.picture,
      provider: 'google',
      signedInAt: Date.now()
    };

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setIsAuthModalOpen(false);
    return true;
  };

  // Quick Demo / Test Google Account Login (instant local preview)
  const loginWithDemoGoogle = (customData = {}) => {
    const defaultData = {
      id: 'google_user_demo_108',
      name: customData.name || 'Ziaur Rahman',
      given_name: customData.given_name || 'Ziaur',
      family_name: customData.family_name || 'Rahman',
      email: customData.email || 'ziaur.quran@gmail.com',
      picture: customData.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      provider: 'google',
      signedInAt: Date.now()
    };

    setUser(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    setIsAuthModalOpen(false);
  };

  // Sign out
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogleCredential,
        loginWithDemoGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
