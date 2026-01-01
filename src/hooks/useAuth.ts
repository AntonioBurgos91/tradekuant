'use client';

import { useEffect, useState } from 'react';
import { supabase, signIn, signOut, getUser } from '@/lib/db/supabase';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  error: Error | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check current session
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get user'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { user: signedInUser } = await signIn(email, password);
      setUser(signedInUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign in failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has admin role (for demo, any authenticated user is admin)
  // In production, check user metadata or a separate admin table
  const isAdmin = !!user;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    signIn: handleSignIn,
    signOut: handleSignOut,
    logout: handleSignOut, // Alias for convenience
    error,
  };
}
