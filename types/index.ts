/**
 * Type Definitions for El Sazón Uvitano
 * 
 * Central location for all TypeScript interfaces and types used throughout the app.
 */

import { AuditLogEntry } from '@/utils/audit';

// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = 'MESERO' | 'CAJERO' | 'ADMIN';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  adminPin?: string; // Hashed PIN for admin users
  createdAt: string;
  updatedAt: string;
  auditLogs: AuditLogEntry[];
}

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
}

// ============================================================================
// Menu & Dish Types
// ============================================================================

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  auditLogs: AuditLogEntry[];
}

export interface DishInput {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

// ============================================================================
// Table & Order Types
// ============================================================================

export interface Table {
  id: string;
  name: string; // e.g., "Mesa 5 - Patio"
  meseroId: string;
  meseroName: string;
  createdAt: string;
  updatedAt: string;
  auditLogs: AuditLogEntry[];
}

export interface TableInput {
  name: string;
}

export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_PROCESS'
  | 'PAID'
  | 'CANCELLED';

export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  meseroId: string;
  meseroName: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  submittedAt?: string;
  paidAt?: string;
  auditLogs: AuditLogEntry[];
}

export interface OrderInput {
  tableId: string;
  tableName: string;
  items: OrderItem[];
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  auditLogs: AuditLogEntry[];
}

export interface PaymentInput {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

// ============================================================================
// Sales & Reporting Types
// ============================================================================

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  ordersByMesero: MeseroSalesData[];
  ordersByDish: DishSalesData[];
  ordersByPaymentMethod: PaymentMethodSalesData[];
}

export interface MeseroSalesData {
  meseroId: string;
  meseroName: string;
  ordersCount: number;
  revenue: number;
}

export interface DishSalesData {
  dishId: string;
  dishName: string;
  quantitySold: number;
  revenue: number;
}

export interface PaymentMethodSalesData {
  method: PaymentMethod;
  count: number;
  amount: number;
}

export interface SalesFilter {
  startDate?: Date;
  endDate?: Date;
  meseroId?: string;
  dishId?: string;
  paymentMethod?: PaymentMethod;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'ORDER_SUBMITTED'
  | 'ORDER_UPDATED'
  | 'ORDER_PAID'
  | 'DISH_CREATED'
  | 'DISH_UPDATED'
  | 'ERROR'
  | 'SUCCESS'
  | 'INFO';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Form Types
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AdminPinFormData {
  pin: string;
}

export interface CreateDishFormData {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
}

export interface CreateTableFormData {
  name: string;
}

export interface AddItemsFormData {
  items: {
    dishId: string;
    quantity: number;
  }[];
}

export interface RecordPaymentFormData {
  method: PaymentMethod;
  amount: number;
}
