/**
 * Auth Layout
 * 
 * Layout for authentication screens (login, role selection).
 * These screens are not part of the main tab navigation.
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: tokens.colors.bg,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="role-selection"
        options={{
          title: 'Select Role',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
