/**
 * Convex Queries
 * 
 * Example queries for fetching data from the backend.
 * Replace with actual Convex queries when backend is ready.
 * 
 * Usage:
 * const { data: dishes } = useQuery(api.queries.getMenu);
 * const { data: orders } = useQuery(api.queries.getOrders, { status: 'SUBMITTED' });
 */

import { Order, Dish, Payment, DailySalesReport, SalesFilter } from '@/types';

// ============================================================================
// Menu Queries
// ============================================================================

/**
 * Fetches all dishes from the menu
 * @returns Array of dishes
 */
export async function getMenu(): Promise<Dish[]> {
  // Mock data - replace with actual Convex query
  return [
    {
      id: 'dish_1',
      name: 'Ceviche',
      description: 'Fresh fish ceviche with lime and cilantro',
      price: 12.99,
      category: 'Appetizers',
      isAvailable: true,
      createdBy: 'admin_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLogs: [],
    },
    {
      id: 'dish_2',
      name: 'Lomo Saltado',
      description: 'Stir-fried beef with potatoes and onions',
      price: 18.99,
      category: 'Main Courses',
      isAvailable: true,
      createdBy: 'admin_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLogs: [],
    },
    {
      id: 'dish_3',
      name: 'Aji de Gallina',
      description: 'Creamy chicken stew with aji peppers',
      price: 14.99,
      category: 'Main Courses',
      isAvailable: true,
      createdBy: 'admin_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLogs: [],
    },
  ];
}

/**
 * Fetches a single dish by ID
 * @param dishId - Dish ID
 * @returns Dish object or null
 */
export async function getDishById(dishId: string): Promise<Dish | null> {
  const dishes = await getMenu();
  return dishes.find((d) => d.id === dishId) || null;
}

// ============================================================================
// Order Queries
// ============================================================================

/**
 * Fetches orders with optional filtering
 * @param filter - Filter options (status, meseroId, etc.)
 * @returns Array of orders
 */
export async function getOrders(filter?: {
  status?: string;
  meseroId?: string;
  tableId?: string;
}): Promise<Order[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches a single order by ID
 * @param orderId - Order ID
 * @returns Order object or null
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  // Mock data - replace with actual Convex query
  return null;
}

/**
 * Fetches pending orders (submitted but not paid)
 * @returns Array of pending orders
 */
export async function getPendingOrders(): Promise<Order[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches orders for a specific table
 * @param tableId - Table ID
 * @returns Array of orders
 */
export async function getOrdersByTable(tableId: string): Promise<Order[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches orders for a specific mesero
 * @param meseroId - Mesero ID
 * @returns Array of orders
 */
export async function getOrdersByMesero(meseroId: string): Promise<Order[]> {
  // Mock data - replace with actual Convex query
  return [];
}

// ============================================================================
// Payment Queries
// ============================================================================

/**
 * Fetches payments with optional filtering
 * @param filter - Filter options
 * @returns Array of payments
 */
export async function getPayments(filter?: {
  startDate?: Date;
  endDate?: Date;
  cashierId?: string;
}): Promise<Payment[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches a single payment by ID
 * @param paymentId - Payment ID
 * @returns Payment object or null
 */
export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  // Mock data - replace with actual Convex query
  return null;
}

// ============================================================================
// Sales & Reporting Queries
// ============================================================================

/**
 * Fetches daily sales report
 * @param date - Date for the report
 * @returns Daily sales report
 */
export async function getDailySalesReport(date: Date): Promise<DailySalesReport> {
  // Mock data - replace with actual Convex query
  return {
    date: date.toISOString().split('T')[0],
    totalOrders: 0,
    totalRevenue: 0,
    totalTax: 0,
    ordersByMesero: [],
    ordersByDish: [],
    ordersByPaymentMethod: [],
  };
}

/**
 * Fetches sales report for a date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of daily sales reports
 */
export async function getSalesReportByDateRange(
  startDate: Date,
  endDate: Date
): Promise<DailySalesReport[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches sales by mesero for a date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Sales data by mesero
 */
export async function getSalesByMesero(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  // Mock data - replace with actual Convex query
  return [];
}

/**
 * Fetches sales by dish for a date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Sales data by dish
 */
export async function getSalesByDish(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  // Mock data - replace with actual Convex query
  return [];
}

// ============================================================================
// Audit Log Queries
// ============================================================================

/**
 * Fetches audit logs with optional filtering
 * @param filter - Filter options
 * @returns Array of audit logs
 */
export async function getAuditLogs(filter?: {
  action?: string;
  actorId?: string;
  resourceType?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<any[]> {
  // Mock data - replace with actual Convex query
  return [];
}
