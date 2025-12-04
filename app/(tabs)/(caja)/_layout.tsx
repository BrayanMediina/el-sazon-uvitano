/**
 * Caja (Cashier) Module Layout
 * 
 * Layout for the cashier/payment processing module (Cajero role).
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function CajaLayout() {
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
          title: 'Cashier',
        }}
      />
      <Stack.Screen
        name="[orderId]"
        options={{
          title: 'Process Payment',
        }}
      />
    </Stack>
  );
}
