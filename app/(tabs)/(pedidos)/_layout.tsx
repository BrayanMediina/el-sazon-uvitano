/**
 * Pedidos (Orders) Module Layout
 * 
 * Layout for the orders/tables management module (Mesero role).
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function PedidosLayout() {
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
          title: 'Orders',
        }}
      />
      <Stack.Screen
        name="[tableId]"
        options={{
          title: 'Order Details',
        }}
      />
    </Stack>
  );
}
