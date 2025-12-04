/**
 * Sales Reports Screen
 * 
 * Displays sales analytics and reports for the cashier.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useOrders } from '@/hooks/useOrders';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SalesReportsScreen() {
  const { orders } = useOrders();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Calculate statistics
  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const totalTax = paidOrders.reduce((sum, order) => sum + order.tax, 0);
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Group by mesero
  const salesByMesero = paidOrders.reduce(
    (acc, order) => {
      const existing = acc.find((m) => m.meseroId === order.meseroId);
      if (existing) {
        existing.orders += 1;
        existing.revenue += order.total;
      } else {
        acc.push({
          meseroId: order.meseroId,
          meseroName: order.meseroName,
          orders: 1,
          revenue: order.total,
        });
      }
      return acc;
    },
    [] as Array<{ meseroId: string; meseroName: string; orders: number; revenue: number }>
  );

  // Group by dish
  const salesByDish = paidOrders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const existing = acc.find((d) => d.dishId === item.dishId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          acc.push({
            dishId: item.dishId,
            dishName: item.dishName,
            quantity: item.quantity,
            revenue: item.subtotal,
          });
        }
      });
      return acc;
    },
    [] as Array<{ dishId: string; dishName: string; quantity: number; revenue: number }>
  );

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    alert('CSV export functionality coming soon');
  };

  return (
    <View style={styles.container}>
      <Header title="Sales Reports" subtitle="Daily analytics" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setSelectedPeriod(period)}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>📊</Text>
            <Text style={styles.metricLabel}>Total Orders</Text>
            <Text style={styles.metricValue}>{paidOrders.length}</Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>💰</Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
            <Text style={styles.metricValue}>
              ${totalRevenue.toFixed(2)}
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>📈</Text>
            <Text style={styles.metricLabel}>Avg Order</Text>
            <Text style={styles.metricValue}>
              ${averageOrderValue.toFixed(2)}
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>🏛️</Text>
            <Text style={styles.metricLabel}>Total Tax</Text>
            <Text style={styles.metricValue}>${totalTax.toFixed(2)}</Text>
          </Card>
        </View>

        {/* Sales by Mesero */}
        {salesByMesero.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Sales by Waiter</Text>
            <Card style={styles.tableCard}>
              {salesByMesero.map((mesero, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tableRow,
                    idx !== salesByMesero.length - 1 && styles.tableRowBorder,
                  ]}
                >
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{mesero.meseroName}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{mesero.orders}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={[styles.tableCellText, styles.tableCellAmount]}>
                      ${mesero.revenue.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Top Dishes */}
        {salesByDish.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Top Dishes</Text>
            <Card style={styles.tableCard}>
              {salesByDish
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((dish, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.tableRow,
                      idx !== Math.min(4, salesByDish.length - 1) &&
                        styles.tableRowBorder,
                    ]}
                  >
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{dish.dishName}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{dish.quantity}x</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={[styles.tableCellText, styles.tableCellAmount]}>
                        ${dish.revenue.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
            </Card>
          </>
        )}

        {/* Export Button */}
        <Button
          title="Export as CSV"
          onPress={handleExportCSV}
          variant="secondary"
          fullWidth
          style={styles.exportButton}
          icon={
            <MaterialCommunityIcons
              name="download"
              size={20}
              color={tokens.colors.primary}
            />
          }
        />

        {/* Empty State */}
        {paidOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Sales Data</Text>
            <Text style={styles.emptyText}>
              Sales data will appear here once orders are paid
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
  periodSelector: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.bgSecondary,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  periodButtonText: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  periodButtonTextActive: {
    color: tokens.colors.bg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: tokens.spacing.sm,
  },
  metricLabel: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xs,
  },
  metricValue: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  tableCard: {
    marginBottom: tokens.spacing.lg,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: tokens.spacing.md,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  tableCell: {
    flex: 1,
  },
  tableCellText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.text,
  },
  tableCellAmount: {
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  exportButton: {
    marginBottom: tokens.spacing.lg,
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
