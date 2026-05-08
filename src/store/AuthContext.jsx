import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'paradise_barber_auth';

/**
 * @typedef {Object} AuthUser
 * @property {string} phone - normalized +34XXXXXXXXX
 * @property {string} name
 * @property {'guest'|'registered'} type
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login as guest (no OTP required)
   * @param {string} name
   * @param {string} phone - raw phone
   */
  const loginAsGuest = useCallback((name, phone) => {
    const normalized = bookingService.normalizePhone(phone);
    const userData = { phone: normalized, name: name.trim(), type: 'guest' };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  /**
   * Login as registered user (after OTP verified)
   * @param {string} name
   * @param {string} phone
   */
  const loginAsRegistered = useCallback((name, phone) => {
    const normalized = bookingService.normalizePhone(phone);
    const userData = { phone: normalized, name: name.trim(), type: 'registered' };
    // Save user to registered users list
    const regKey = 'paradise_registered_users';
    try {
      const raw = localStorage.getItem(regKey);
      const users = raw ? JSON.parse(raw) : {};
      if (!users[normalized]) users[normalized] = { name: name.trim(), phone: normalized, createdAt: new Date().toISOString() };
      localStorage.setItem(regKey, JSON.stringify(users));
    } catch {
      // ignore
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  /**
   * Check if phone is registered
   * @param {string} phone
   * @returns {string|null} name if registered, null otherwise
   */
  const checkRegistered = useCallback((phone) => {
    const normalized = bookingService.normalizePhone(phone);
    try {
      const raw = localStorage.getItem('paradise_registered_users');
      const users = raw ? JSON.parse(raw) : {};
      return users[normalized]?.name || null;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginAsGuest, loginAsRegistered, checkRegistered, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 * @returns {Object}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
