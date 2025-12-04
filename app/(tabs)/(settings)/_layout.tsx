/**
 * Settings Module Layout
 * 
 * Layout for the settings module (available to all roles).
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function SettingsLayout() {
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
        name="index"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
