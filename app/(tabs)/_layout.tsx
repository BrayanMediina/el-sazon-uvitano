/**
 * Tabs Layout
 * 
 * Main navigation layout with bottom tabs for different modules.
 * Tabs shown depend on user role (Mesero vs Cajero).
 */

import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/hooks/useAuth';
import { tokens } from '@/styles/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { selectedRole } = useAuth();

  const tabScreenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: tokens.colors.primary,
    tabBarInactiveTintColor: tokens.colors.textLight,
    tabBarStyle: {
      backgroundColor: tokens.colors.bg,
      borderTopColor: tokens.colors.border,
      borderTopWidth: 1,
      paddingBottom: 8,
      paddingTop: 8,
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      {/* Home Tab - Available to all */}
      <Tab.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Mesero Tabs */}
      {selectedRole === 'MESERO' && (
        <>
          <Tab.Screen
            name="(pedidos)"
            options={{
              title: 'Orders',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="(menu)"
            options={{
              title: 'Menu',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book-open" color={color} size={size} />
              ),
            }}
          />
        </>
      )}

      {/* Cajero Tabs */}
      {selectedRole === 'CAJERO' && (
        <>
          <Tab.Screen
            name="(caja)"
            options={{
              title: 'Cashier',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cash-register" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="(menu)"
            options={{
              title: 'Menu',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book-open" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="(reportes)"
            options={{
              title: 'Reports',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
              ),
            }}
          />
        </>
      )}

      {/* Settings Tab - Available to all */}
      <Tab.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
