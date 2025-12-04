/**
 * Reportes (Reports) Module Layout
 * 
 * Layout for the sales reports module (Cajero role).
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function ReportesLayout() {
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
          title: 'Reports',
        }}
      />
    </Stack>
  );
}
