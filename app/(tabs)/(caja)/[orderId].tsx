/**
 * Payment Processing Screen
 * 
 * Allows cashier to process payment for an order.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaymentMethod } from '@/types';

export default function PaymentProcessingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { orders, recordPayment } = useOrders();
  const { user } = useAuth();
  const { notifyOrderPaid } = useNotifications();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const order = orders.find((o) => o.id === orderId);

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

  const handleProcessPayment = async (amount: number) => {
    setIsProcessing(true);
    try {
      recordPayment(order.id, amount);
      notifyOrderPaid(order.id, amount);
      Alert.alert('Success', `Payment of $${amount.toFixed(2)} recorded`);
      setShowPaymentModal(false);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomAmount = () => {
    if (!customAmount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    handleProcessPayment(amount);
  };

  const paymentMethods: { method: PaymentMethod; label: string; icon: string }[] = [
    { method: 'CASH', label: 'Cash', icon: '💵' },
    { method: 'CARD', label: 'Card', icon: '💳' },
    { method: 'TRANSFER', label: 'Transfer', icon: '📱' },
    { method: 'OTHER', label: 'Other', icon: '❓' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Process Payment"
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
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>{order.tableName}</Text>
            <Badge label={`${order.items.length} items`} variant="primary" />
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Mesero</Text>
            <Text style={styles.value}>{order.meseroName}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>
              {new Date(order.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        </Card>

        {/* Order Items */}
        <Text style={styles.sectionTitle}>Order Items</Text>
        <Card style={styles.itemsCard}>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.dishName}</Text>
                <Text style={styles.itemQty}>
                  {item.quantity}x @ ${item.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemTotal}>
                ${item.subtotal.toFixed(2)}
              </Text>
            </View>
          ))}
        </Card>

        {/* Totals */}
        <Card style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (10%)</Text>
            <Text style={styles.totalValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalLabel}>Total Due</Text>
            <Text style={styles.finalAmount}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </Card>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          {paymentMethods.map((pm) => (
            <TouchableOpacity
              key={pm.method}
              onPress={() => {
                setPaymentMethod(pm.method);
                setShowPaymentModal(true);
              }}
              style={[
                styles.paymentMethodCard,
                paymentMethod === pm.method && styles.paymentMethodSelected,
              ]}
            >
              <Text style={styles.paymentMethodIcon}>{pm.icon}</Text>
              <Text style={styles.paymentMethodLabel}>{pm.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <Button
          title={`Charge $${order.total.toFixed(2)}`}
          onPress={() => setShowPaymentModal(true)}
          fullWidth
        />
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setCustomAmount('');
        }}
        title={`Payment - ${paymentMethod}`}
        actions={[
          {
            label: 'Cancel',
            onPress: () => {
              setShowPaymentModal(false);
              setCustomAmount('');
            },
            variant: 'secondary',
          },
          {
            label: 'Confirm',
            onPress: () => handleCustomAmount(),
            variant: 'primary',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Enter the amount received or confirm the total:
        </Text>

        <View style={styles.amountOptions}>
          <TouchableOpacity
            style={styles.amountButton}
            onPress={() => handleProcessPayment(order.total)}
          >
            <Text style={styles.amountButtonLabel}>Exact Amount</Text>
            <Text style={styles.amountButtonValue}>
              ${order.total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>or enter custom amount:</Text>

        <Input
          label="Amount"
          placeholder="0.00"
          value={customAmount}
          onChangeText={setCustomAmount}
          keyboardType="decimal-pad"
          containerStyle={styles.customAmountInput}
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
  summaryCard: {
    marginBottom: tokens.spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  summaryTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
  },
  label: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  value: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  itemsCard: {
    marginBottom: tokens.spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  itemQty: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  itemTotal: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  totalsCard: {
    marginBottom: tokens.spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  finalTotal: {
    borderBottomWidth: 0,
    paddingVertical: tokens.spacing.md,
  },
  totalLabel: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
  },
  totalValue: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  finalLabel: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  finalAmount: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  paymentMethodCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.bgSecondary,
  },
  paymentMethodSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: tokens.colors.bg,
  },
  paymentMethodIcon: {
    fontSize: 32,
    marginBottom: tokens.spacing.sm,
  },
  paymentMethodLabel: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  modalText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  amountOptions: {
    marginBottom: tokens.spacing.lg,
  },
  amountButton: {
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.bgSecondary,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  amountButtonLabel: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  amountButtonValue: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
    marginTop: tokens.spacing.sm,
  },
  orText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  customAmountInput: {
    marginBottom: 0,
  },
});
