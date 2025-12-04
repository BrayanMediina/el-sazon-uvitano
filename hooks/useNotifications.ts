/**
 * useNotifications Hook
 * 
 * Custom hook for managing notifications.
 */

import { useNotificationStore } from '@/store/notificationStore';
import { NotificationType } from '@/types';

export function useNotifications() {
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearNotifications,
    getUnreadCount,
  } = useNotificationStore();

  const notify = (
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
  ) => {
    addNotification({
      type,
      title,
      message,
      data,
    });
  };

  const notifySuccess = (title: string, message: string) => {
    notify('SUCCESS', title, message);
  };

  const notifyError = (title: string, message: string) => {
    notify('ERROR', title, message);
  };

  const notifyInfo = (title: string, message: string) => {
    notify('INFO', title, message);
  };

  const notifyOrderSubmitted = (orderId: string, tableName: string) => {
    notify(
      'ORDER_SUBMITTED',
      'New Order',
      `Order from ${tableName} has been submitted`,
      { orderId, tableName }
    );
  };

  const notifyOrderUpdated = (orderId: string, tableName: string) => {
    notify(
      'ORDER_UPDATED',
      'Order Updated',
      `Order from ${tableName} has been updated`,
      { orderId, tableName }
    );
  };

  const notifyOrderPaid = (orderId: string, amount: number) => {
    notify(
      'ORDER_PAID',
      'Payment Recorded',
      `Order paid: $${amount.toFixed(2)}`,
      { orderId, amount }
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearNotifications,
    getUnreadCount,
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyOrderSubmitted,
    notifyOrderUpdated,
    notifyOrderPaid,
  };
}
