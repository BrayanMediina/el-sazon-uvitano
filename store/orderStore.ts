/**
 * Order Store
 * 
 * Manages order state including current orders, pending orders, and order history.
 * Uses Zustand for state management.
 */

import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  pendingOrders: Order[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  setCurrentOrder: (order: Order | null) => void;
  setPendingOrders: (orders: Order[]) => void;
  addPendingOrder: (order: Order) => void;
  removePendingOrder: (orderId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  pendingOrders: [],
  isLoading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  updateOrder: (orderId, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
      currentOrder:
        state.currentOrder?.id === orderId
          ? { ...state.currentOrder, ...updates }
          : state.currentOrder,
    })),

  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  setPendingOrders: (orders) => set({ pendingOrders: orders }),

  addPendingOrder: (order) =>
    set((state) => ({
      pendingOrders: [order, ...state.pendingOrders],
    })),

  removePendingOrder: (orderId) =>
    set((state) => ({
      pendingOrders: state.pendingOrders.filter((order) => order.id !== orderId),
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearOrders: () =>
    set({
      orders: [],
      currentOrder: null,
      pendingOrders: [],
      error: null,
    }),
}));
