/**
 * Order Details Screen (Mesero)
 * 
 * Allows mesero to add items to an order and submit to cashier.
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ListItem from '@/components/ui/ListItem';
import Badge from '@/components/ui/Badge';
import { useOrders } from '@/hooks/useOrders';
import { useMenu } from '@/hooks/useMenu';
import { useNotifications } from '@/hooks/useNotifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { tableId } = useLocalSearchParams<{ tableId: string }>();
  const { orders, submitOrder, addItemsToOrder, removeItemFromOrder, updateItemQuantity } =
    useOrders();
  const { dishes } = useMenu();
  const { notifyOrderSubmitted } = useNotifications();

  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    { dishId: string; quantity: number }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = orders.find((o) => o.tableId === tableId);

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Order Not Found" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const handleAddItems = () => {
    setShowAddItemsModal(true);
  };

  const handleSelectDish = (dishId: string) => {
    const existing = selectedItems.find((item) => item.dishId === dishId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.dishId === dishId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { dishId, quantity: 1 }]);
    }
  };

  const handleConfirmAddItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items', 'Please select at least one item');
      return;
    }

    const itemsToAdd = selectedItems.map((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);
      return {
        dishId: item.dishId,
        dishName: dish?.name || 'Unknown',
        price: dish?.price || 0,
        quantity: item.quantity,
        subtotal: (dish?.price || 0) * item.quantity,
      };
    });

    addItemsToOrder(order.id, itemsToAdd);
    setShowAddItemsModal(false);
    setSelectedItems([]);
  };

  const handleSubmitOrder = async () => {
    if (order.items.length === 0) {
      Alert.alert('Empty Order', 'Please add items before submitting');
      return;
    }

    Alert.alert(
      'Submit Order',
      `Submit order for ${order.tableName} to cashier?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Submit',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              submitOrder(order.id);
              notifyOrderSubmitted(order.id, order.tableName);
              Alert.alert('Success', 'Order submitted to cashier');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to submit order');
              console.error('Submit order error:', error);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = (dishId: string) => {
    removeItemFromOrder(order.id, dishId);
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(dishId);
    } else {
      updateItemQuantity(order.id, dishId, quantity);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={order.tableName}
        subtitle={`${order.items.length} item${order.items.length !== 1 ? 's' : ''}`}
        leftAction={{
          icon: (
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={tokens.colors.bg}
            />
          ),
          onPress: () => router.back(),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Items */}
        {order.items.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsList}>
              {order.items.map((item, index) => (
                <Card key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.dishName}</Text>
                      <Text style={styles.itemPrice}>
                        ${item.price.toFixed(2)} each
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.dishId)}
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={24}
                        color={tokens.colors.error}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(item.dishId, item.quantity - 1)
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleUpdateQuantity(item.dishId, item.quantity + 1)
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.subtotal}>
                      ${item.subtotal.toFixed(2)}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptyText}>Add items to start the order</Text>
          </View>
        )}

        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="Add Items"
          onPress={handleAddItems}
          variant="secondary"
          fullWidth
          style={styles.footerButton}
        />
        <Button
          title="Submit to Cashier"
          onPress={handleSubmitOrder}
          loading={isSubmitting}
          disabled={isSubmitting || order.items.length === 0}
          fullWidth
        />
      </View>

      {/* Add Items Modal */}
      <Modal
        visible={showAddItemsModal}
        onClose={() => {
          setShowAddItemsModal(false);
          setSelectedItems([]);
        }}
        title="Add Items"
        actions={[
          {
            label: 'Cancel',
            onPress: () => {
              setShowAddItemsModal(false);
              setSelectedItems([]);
            },
            variant: 'secondary',
          },
          {
            label: 'Add',
            onPress: handleConfirmAddItems,
            variant: 'primary',
          },
        ]}
      >
        <ScrollView style={styles.dishList}>
          {dishes.filter((d) => d.isAvailable).map((dish) => {
            const selectedItem = selectedItems.find((i) => i.dishId === dish.id);
            return (
              <TouchableOpacity
                key={dish.id}
                onPress={() => handleSelectDish(dish.id)}
                style={[
                  styles.dishItem,
                  selectedItem && styles.dishItemSelected,
                ]}
              >
                <View style={styles.dishItemContent}>
                  <Text style={styles.dishItemName}>{dish.name}</Text>
                  <Text style={styles.dishItemPrice}>
                    ${dish.price.toFixed(2)}
                  </Text>
                </View>
                {selectedItem && (
                  <Badge label={`${selectedItem.quantity}`} variant="primary" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  errorText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.error,
    marginBottom: tokens.spacing.lg,
  },
  errorButton: {
    minWidth: 120,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  itemsList: {
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  itemCard: {
    paddingVertical: tokens.spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  itemPrice: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  quantityButtonText: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  quantity: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.primary,
    marginLeft: 'auto',
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
  summaryCard: {
    marginBottom: tokens.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: tokens.spacing.md,
  },
  summaryLabel: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
  },
  summaryValue: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  totalLabel: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  totalValue: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    gap: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  footerButton: {
    marginBottom: tokens.spacing.sm,
  },
  dishList: {
    maxHeight: 300,
  },
  dishItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  dishItemSelected: {
    backgroundColor: tokens.colors.bgSecondary,
  },
  dishItemContent: {
    flex: 1,
  },
  dishItemName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  dishItemPrice: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
});
