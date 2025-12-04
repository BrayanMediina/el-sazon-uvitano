/**
 * Home Screen
 * 
 * Dashboard showing role-specific information and quick actions.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user, selectedRole, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Header
        title="El Sazón Uvitano"
        subtitle={`Welcome, ${user?.name || 'User'}`}
        rightAction={{
          icon: <MaterialCommunityIcons name="logout" size={24} color={tokens.colors.bg} />,
          onPress: handleLogout,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Role Badge */}
        <Card style={styles.roleCard}>
          <View style={styles.roleBadgeContainer}>
            <Text style={styles.roleBadgeIcon}>
              {selectedRole === 'MESERO' ? '👨‍💼' : '💰'}
            </Text>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>Current Role</Text>
              <Text style={styles.roleName}>
                {selectedRole === 'MESERO' ? 'Mesero (Waiter)' : 'Cajero (Cashier)'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
            <Text style={styles.statValue}>0</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>💵</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
            <Text style={styles.statValue}>$0.00</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {selectedRole === 'MESERO' ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/(pedidos)')}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={32}
                color={tokens.colors.primary}
              />
              <Text style={styles.actionTitle}>New Order</Text>
              <Text style={styles.actionDescription}>Create a new table or order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/(menu)')}
            >
              <MaterialCommunityIcons
                name="book-open"
                size={32}
                color={tokens.colors.primary}
              />
              <Text style={styles.actionTitle}>View Menu</Text>
              <Text style={styles.actionDescription}>Browse available dishes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/(caja)')}
            >
              <MaterialCommunityIcons
                name="cash-register"
                size={32}
                color={tokens.colors.primary}
              />
              <Text style={styles.actionTitle}>Process Payment</Text>
              <Text style={styles.actionDescription}>View pending orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/(menu)')}
            >
              <MaterialCommunityIcons
                name="plus"
                size={32}
                color={tokens.colors.primary}
              />
              <Text style={styles.actionTitle}>Add Dish</Text>
              <Text style={styles.actionDescription}>Create new menu item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/(reportes)')}
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={32}
                color={tokens.colors.primary}
              />
              <Text style={styles.actionTitle}>View Reports</Text>
              <Text style={styles.actionDescription}>Sales and analytics</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ System Status</Text>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={tokens.colors.success}
            />
            <Text style={styles.statusText}>Connected to server</Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={tokens.colors.success}
            />
            <Text style={styles.statusText}>Real-time notifications enabled</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
  },
  roleCard: {
    marginBottom: tokens.spacing.lg,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  roleBadgeIcon: {
    fontSize: 40,
  },
  roleInfo: {
    flex: 1,
  },
  roleLabel: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  roleName: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: tokens.spacing.sm,
  },
  statLabel: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xs,
  },
  statValue: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  actionsContainer: {
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  actionCard: {
    backgroundColor: tokens.colors.bgSecondary,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  actionTitle: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
    marginTop: tokens.spacing.sm,
  },
  actionDescription: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  infoCard: {
    backgroundColor: tokens.colors.bgSecondary,
  },
  infoTitle: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  statusText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
});
