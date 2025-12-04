/**
 * Authentication Store
 * 
 * Manages user authentication state, role selection, and admin PIN verification.
 * Uses Zustand for state management.
 */

import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  selectedRole: UserRole | null;
  adminPinVerified: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedRole: (role: UserRole | null) => void;
  setAdminPinVerified: (verified: boolean) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignedIn: false,
  isLoading: true,
  selectedRole: null,
  adminPinVerified: false,

  setUser: (user) => set({ user }),
  setIsSignedIn: (isSignedIn) => set({ isSignedIn }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedRole: (selectedRole) => set({ selectedRole }),
  setAdminPinVerified: (adminPinVerified) => set({ adminPinVerified }),

  logout: () =>
    set({
      user: null,
      isSignedIn: false,
      selectedRole: null,
      adminPinVerified: false,
    }),

  reset: () =>
    set({
      user: null,
      isSignedIn: false,
      isLoading: true,
      selectedRole: null,
      adminPinVerified: false,
    }),
}));
