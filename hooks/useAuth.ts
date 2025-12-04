/**
 * useAuth Hook
 * 
 * Custom hook for managing authentication state and operations.
 */

import { useAuthStore } from '@/store/authStore';
import { User, UserRole } from '@/types';

export function useAuth() {
  const {
    user,
    isSignedIn,
    isLoading,
    selectedRole,
    adminPinVerified,
    setUser,
    setIsSignedIn,
    setIsLoading,
    setSelectedRole,
    setAdminPinVerified,
    logout,
    reset,
  } = useAuthStore();

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const verifyAdminPin = (pin: string) => {
    // In a real app, this would validate against the backend
    // For now, we'll just set the verified state
    setAdminPinVerified(true);
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Call Clerk signOut or your auth provider
      logout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canAccessCashier = () => {
    return selectedRole === 'CAJERO' && adminPinVerified;
  };

  const canAccessWaiter = () => {
    return selectedRole === 'MESERO';
  };

  return {
    user,
    isSignedIn,
    isLoading,
    selectedRole,
    adminPinVerified,
    setUser,
    setIsSignedIn,
    setIsLoading,
    selectRole,
    verifyAdminPin,
    signOut,
    canAccessCashier,
    canAccessWaiter,
  };
}
