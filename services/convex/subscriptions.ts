/**
 * Convex Subscriptions
 * 
 * Example subscriptions for real-time updates.
 * Replace with actual Convex subscriptions when backend is ready.
 * 
 * Usage:
 * const orders = useSubscription(api.subscriptions.onOrders, { status: 'SUBMITTED' });
 */

import { Order, Notification } from '@/types';

// ============================================================================
// Order Subscriptions
// ============================================================================

/**
 * Subscribes to order updates
 * @param filter - Filter options
 * @returns Real-time order updates
 */
export async function* onOrders(filter?: {
  status?: string;
  meseroId?: string;
  tableId?: string;
}): AsyncGenerator<Order> {
  // TODO: Implement Convex subscription
  // This should yield orders as they are created/updated
  // Example:
  // for await (const order of convexSubscription) {
  //   yield order;
  // }
}

/**
 * Subscribes to a specific order
 * @param orderId - Order ID
 * @returns Real-time order updates
 */
export async function* onOrderById(orderId: string): AsyncGenerator<Order> {
  // TODO: Implement Convex subscription for specific order
}

/**
 * Subscribes to pending orders (for cashier)
 * @returns Real-time pending order updates
 */
export async function* onPendingOrders(): AsyncGenerator<Order> {
  // TODO: Implement Convex subscription for pending orders
}

// ============================================================================
// Notification Subscriptions
// ============================================================================

/**
 * Subscribes to notifications
 * @param userId - User ID
 * @returns Real-time notifications
 */
export async function* onNotifications(userId: string): AsyncGenerator<Notification> {
  // TODO: Implement Convex subscription for notifications
}

/**
 * Subscribes to order submitted notifications (for cashier)
 * @returns Real-time order submitted notifications
 */
export async function* onOrderSubmittedNotifications(): AsyncGenerator<Notification> {
  // TODO: Implement Convex subscription
  // Triggered when mesero submits an order
}

/**
 * Subscribes to payment notifications
 * @returns Real-time payment notifications
 */
export async function* onPaymentNotifications(): AsyncGenerator<Notification> {
  // TODO: Implement Convex subscription
  // Triggered when payment is recorded
}

// ============================================================================
// Real-time Hooks (React Integration)
// ============================================================================

/**
 * Hook for subscribing to orders in real-time
 * Usage: const orders = useOrdersSubscription({ status: 'SUBMITTED' });
 */
export function useOrdersSubscription(filter?: {
  status?: string;
  meseroId?: string;
  tableId?: string;
}) {
  // TODO: Implement using Convex useSubscription hook
  // Example:
  // return useSubscription(api.subscriptions.onOrders, filter);
  return [];
}

/**
 * Hook for subscribing to pending orders in real-time
 * Usage: const pendingOrders = usePendingOrdersSubscription();
 */
export function usePendingOrdersSubscription() {
  // TODO: Implement using Convex useSubscription hook
  return [];
}

/**
 * Hook for subscribing to notifications in real-time
 * Usage: const notifications = useNotificationsSubscription();
 */
export function useNotificationsSubscription() {
  // TODO: Implement using Convex useSubscription hook
  return [];
}
