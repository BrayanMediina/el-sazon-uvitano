/**
 * useOrders Hook
 * 
 * Custom hook for managing orders and order operations.
 */

import { useOrderStore } from '@/store/orderStore';
import { Order, OrderItem } from '@/types';

export function useOrders() {
  const {
    orders,
    currentOrder,
    pendingOrders,
    isLoading,
    error,
    setOrders,
    addOrder,
    updateOrder,
    removeOrder,
    setCurrentOrder,
    setPendingOrders,
    addPendingOrder,
    removePendingOrder,
    setIsLoading,
    setError,
    clearOrders,
  } = useOrderStore();

  const createOrder = (order: Order) => {
    addOrder(order);
    return order;
  };

  const submitOrder = (orderId: string) => {
    updateOrder(orderId, {
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    });
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      addPendingOrder(order);
    }
  };

  const recordPayment = (orderId: string, amount: number) => {
    updateOrder(orderId, {
      status: 'PAID',
      paidAt: new Date().toISOString(),
    });
    removePendingOrder(orderId);
  };

  const addItemsToOrder = (orderId: string, items: OrderItem[]) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const updatedItems = [...order.items, ...items];
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      updateOrder(orderId, {
        items: updatedItems,
        subtotal,
        tax,
        total,
      });
    }
  };

  const removeItemFromOrder = (orderId: string, dishId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const updatedItems = order.items.filter((item) => item.dishId !== dishId);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      updateOrder(orderId, {
        items: updatedItems,
        subtotal,
        tax,
        total,
      });
    }
  };

  const updateItemQuantity = (orderId: string, dishId: string, quantity: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const updatedItems = order.items.map((item) =>
        item.dishId === dishId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity,
            }
          : item
      );
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      updateOrder(orderId, {
        items: updatedItems,
        subtotal,
        tax,
        total,
      });
    }
  };

  return {
    orders,
    currentOrder,
    pendingOrders,
    isLoading,
    error,
    createOrder,
    submitOrder,
    recordPayment,
    addItemsToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    setCurrentOrder,
    updateOrder,
    removeOrder,
    setIsLoading,
    setError,
    clearOrders,
  };
}
