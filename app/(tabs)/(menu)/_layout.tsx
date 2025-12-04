/**
 * Menu Module Layout
 * 
 * Layout for the menu management module (available to both roles).
 */

import { Stack } from 'expo-router';
import { tokens } from '@/styles/tokens';

export default function MenuLayout() {
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
          title: 'Menu',
        }}
      />
      <Stack.Screen
        name="[dishId]"
        options={{
          title: 'Dish Details',
        }}
      />
    </Stack>
  );
}
