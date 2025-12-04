/**
 * Cashier Panel Screen
 * 
 * Real-time view of pending orders from meseros.
 * Cajero can process payments and view order details.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import { useOrders } from '@/hooks/useOrders';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CashierPanelScreen() {
  const router = useRouter();
  const { orders, pendingOrders, isLoading, setIsLoading } = useOrders();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    // In a real app, this would subscribe to real-time updates
    // For now, we'll just load the pending orders
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    try {
      // TODO: Fetch pending orders from backend
      // For now, filter from local state
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Load pending orders error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPendingOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/(tabs)/(caja)/${orderId}`);
  };

  const submittedOrders = orders.filter((o) => o.status === 'SUBMITTED');
  const paidOrders = orders.filter((o) => o.status === 'PAID');

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header title="Cashier Panel" />
        <Loading fullScreen message="Loading orders..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Cashier Panel"
        subtitle={`${submittedOrders.length} pending order${submittedOrders.length !== 1 ? 's' : ''}`}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Orders */}
        {submittedOrders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Orders</Text>
              <Badge label={submittedOrders.length.toString()} variant="error" />
            </View>

            <View style={styles.ordersList}>
              {submittedOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => handleOrderPress(order.id)}
                  activeOpacity={0.7}
                >
                  <Card style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View style={styles.orderInfo}>
                        <Text style={styles.tableName}>{order.tableName}</Text>
                        <Text style={styles.meseroName}>
                          {order.meseroName}
                        </Text>
                      </View>
                      <View style={styles.orderMeta}>
                        <Text style={styles.itemsCount}>
                          {order.items.length} item
                          {order.items.length !== 1 ? 's' : ''}
                        </Text>
                        <Text style={styles.time}>
                          {new Date(order.submittedAt || order.createdAt).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.orderItems}>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <Text key={idx} style={styles.itemPreview}>
                          • {item.quantity}x {item.dishName}
                        </Text>
                      ))}
                      {order.items.length > 2 && (
                        <Text style={styles.moreItems}>
                          +{order.items.length - 2} more
                        </Text>
                      )}
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalAmount}>
                        ${order.total.toFixed(2)}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={tokens.colors.primary}
                        style={styles.chevron}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Paid Orders */}
        {paidOrders.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Paid Orders</Text>
              <Badge label={paidOrders.length.toString()} variant="success" />
            </View>

            <View style={styles.ordersList}>
              {paidOrders.slice(0, 5).map((order) => (
                <Card key={order.id} style={[styles.orderCard, styles.paidCard]}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.tableName}>{order.tableName}</Text>
                      <Text style={styles.meseroName}>{order.meseroName}</Text>
                    </View>
                    <View style={styles.orderMeta}>
                      <Text style={styles.totalAmount}>
                        ${order.total.toFixed(2)}
                      </Text>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={tokens.colors.success}
                      />
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </>
        )}

        {/* Empty State */}
        {submittedOrders.length === 0 && paidOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Orders</Text>
            <Text style={styles.emptyText}>
              Waiting for meseros to submit orders...
            </Text>
          </View>
        )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  ordersList: {
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  orderCard: {
    paddingVertical: tokens.spacing.md,
  },
  paidCard: {
    opacity: 0.6,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  orderInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  meseroName: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  itemsCount: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  time: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
    marginTop: tokens.spacing.xs,
  },
  orderItems: {
    marginBottom: tokens.spacing.md,
  },
  itemPreview: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xs,
  },
  moreItems: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  totalAmount: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  chevron: {
    marginLeft: tokens.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: tokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
  },
});
