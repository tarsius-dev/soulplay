/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { AdminProfile } from '../types';

interface AuthContextType {
  user: { id: string; email: string } | null;
  adminProfile: AdminProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  isAdmin: false,
  isLoading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

const DEMO_ADMIN_KEY = 'seoulplay_demo_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            // Verify admin_profiles
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile && profile.role === 'administrator') {
              setAdminProfile(profile);
              setIsAdmin(true);
            } else {
              setAdminProfile(null);
              setIsAdmin(false);
            }
          }
        } else {
          // Check local demo admin session in localStorage
          const saved = localStorage.getItem(DEMO_ADMIN_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setUser(parsed.user);
              setAdminProfile(parsed.profile);
              setIsAdmin(true);
            } catch {
              localStorage.removeItem(DEMO_ADMIN_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Error verifying auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Verify admin_profiles table
          const { data: profile, error: profileErr } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profileErr || !profile || profile.role !== 'administrator') {
            await supabase.auth.signOut();
            return {
              success: false,
              error: 'Access denied: Your account is not authorized in admin_profiles.',
            };
          }

          setUser({ id: data.user.id, email: data.user.email || '' });
          setAdminProfile(profile);
          setIsAdmin(true);
          return { success: true };
        }
        return { success: false, error: 'Sign in failed.' };
      } else {
        // Deterministic local demo authentication
        // Standard demo administrator credentials
        if (
          email.toLowerCase() === 'admin@seoulplay.example.com' ||
          email.toLowerCase() === 'admin@seoulplay.com' ||
          (email.includes('admin') && password.length >= 6)
        ) {
          const mockUser = {
            id: '99999999-0000-0000-0000-000000000001',
            email: email.trim(),
          };
          const mockProfile: AdminProfile = {
            id: mockUser.id,
            email: mockUser.email,
            role: 'administrator',
            created_at: new Date().toISOString(),
          };

          localStorage.setItem(
            DEMO_ADMIN_KEY,
            JSON.stringify({ user: mockUser, profile: mockProfile })
          );
          setUser(mockUser);
          setAdminProfile(mockProfile);
          setIsAdmin(true);
          return { success: true };
        } else {
          return {
            success: false,
            error: 'Invalid administrator credentials. For local preview, use admin@seoulplay.example.com (pass: any 6+ chars).',
          };
        }
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(DEMO_ADMIN_KEY);
      setUser(null);
      setAdminProfile(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
