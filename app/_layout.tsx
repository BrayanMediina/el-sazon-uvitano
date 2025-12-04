/**
 * Root Layout
 * 
 * Main app layout that handles authentication state and routing.
 * Redirects to login if not authenticated.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { tokens } from '@/styles/tokens';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isSignedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthGroup) {
      // Redirect to login if not signed in
      router.replace('/(auth)/login');
    } else if (isSignedIn && inAuthGroup) {
      // Redirect to home if signed in and in auth group
      router.replace('/(tabs)');
    }
  }, [isSignedIn, isLoading, segments]);

  if (isLoading) {
    return null; // Or show a splash screen
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
