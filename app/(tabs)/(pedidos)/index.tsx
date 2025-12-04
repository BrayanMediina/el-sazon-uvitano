/**
 * Orders List Screen (Mesero)
 * 
 * Displays list of tables and allows creating new tables or adding items to existing ones.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ListItem from '@/components/ui/ListItem';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OrdersListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, createOrder } = useOrders();

  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [tableName, setTableName] = useState('');
  const [tableError, setTableError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTable = async () => {
    if (!tableName.trim()) {
      setTableError('Table name is required');
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Call backend to create table
      // For now, create a mock order
      const mockOrder = {
        id: `order_${Date.now()}`,
        tableId: `table_${Date.now()}`,
        tableName: tableName.trim(),
        meseroId: user?.id || 'mesero_1',
        meseroName: user?.name || 'Mesero',
        items: [],
        status: 'DRAFT' as const,
        subtotal: 0,
        tax: 0,
        total: 0,
        createdAt: new Date().toISOString(),
        auditLogs: [],
      };

      createOrder(mockOrder);
      setShowCreateTableModal(false);
      setTableName('');
      setTableError('');

      // Navigate to the new table
      router.push(`/(tabs)/(pedidos)/${mockOrder.tableId}`);
    } catch (error) {
      setTableError('Failed to create table');
      console.error('Create table error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTablePress = (tableId: string) => {
    router.push(`/(tabs)/(pedidos)/${tableId}`);
  };

  const draftOrders = orders.filter((o) => o.status === 'DRAFT');
  const submittedOrders = orders.filter((o) => o.status === 'SUBMITTED');

  return (
    <View style={styles.container}>
      <Header
        title="Orders"
        subtitle={`${draftOrders.length} active table(s)`}
        rightAction={{
          icon: (
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color={tokens.colors.bg}
            />
          ),
          onPress: () => setShowCreateTableModal(true),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Tables */}
        {draftOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Tables</Text>
            <View style={styles.tablesList}>
              {draftOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => handleTablePress(order.tableId)}
                  activeOpacity={0.7}
                >
                  <Card style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                      <View>
                        <Text style={styles.tableName}>{order.tableName}</Text>
                        <Text style={styles.tableInfo}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <View style={styles.tableTotal}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>
                          ${order.total.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Submitted Orders */}
        {submittedOrders.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Submitted to Cashier</Text>
            <View style={styles.tablesList}>
              {submittedOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => handleTablePress(order.tableId)}
                  activeOpacity={0.7}
                >
                  <Card style={[styles.tableCard, styles.submittedCard]}>
                    <View style={styles.tableHeader}>
                      <View>
                        <Text style={styles.tableName}>{order.tableName}</Text>
                        <Text style={styles.tableInfo}>
                          Submitted • {order.items.length} item
                          {order.items.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <View style={styles.tableTotal}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>
                          ${order.total.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyText}>
              Create a new table to start taking orders
            </Text>
            <Button
              title="Create Table"
              onPress={() => setShowCreateTableModal(true)}
              style={styles.emptyButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Create Table Modal */}
      <Modal
        visible={showCreateTableModal}
        onClose={() => {
          setShowCreateTableModal(false);
          setTableName('');
          setTableError('');
        }}
        title="Create New Table"
        actions={[
          {
            label: 'Cancel',
            onPress: () => {
              setShowCreateTableModal(false);
              setTableName('');
              setTableError('');
            },
            variant: 'secondary',
          },
          {
            label: 'Create',
            onPress: handleCreateTable,
            variant: 'primary',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Enter a name for the table (e.g., "Mesa 5 - Patio")
        </Text>
        <Input
          label="Table Name"
          placeholder="Mesa 1"
          value={tableName}
          onChangeText={(text) => {
            setTableName(text);
            setTableError('');
          }}
          editable={!isCreating}
          error={tableError}
          containerStyle={styles.modalInput}
          required
        />
      </Modal>
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
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  tablesList: {
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  tableCard: {
    paddingVertical: tokens.spacing.md,
  },
  submittedCard: {
    opacity: 0.7,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  tableInfo: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  tableTotal: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textSecondary,
  },
  totalAmount: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
    marginTop: tokens.spacing.xs,
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
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: tokens.spacing.md,
  },
  modalText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  modalInput: {
    marginBottom: tokens.spacing.md,
  },
});
