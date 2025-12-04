/**
 * Audit Logging Utilities
 * 
 * Handles creation and management of audit log entries for all critical actions.
 * Every action (create, update, delete) must be logged with actor info, timestamp, and details.
 */

export type AuditAction =
  | 'CREATE_ORDER'
  | 'UPDATE_ORDER'
  | 'DELETE_ORDER'
  | 'SUBMIT_ORDER_TO_CASHIER'
  | 'CREATE_DISH'
  | 'UPDATE_DISH'
  | 'DELETE_DISH'
  | 'RECORD_PAYMENT'
  | 'CREATE_TABLE'
  | 'UPDATE_TABLE'
  | 'DELETE_TABLE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'VERIFY_ADMIN_PIN';

export type ResourceType =
  | 'ORDER'
  | 'DISH'
  | 'PAYMENT'
  | 'TABLE'
  | 'USER'
  | 'AUDIT_LOG';

export type UserRole = 'MESERO' | 'CAJERO' | 'ADMIN';

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  timestamp: string; // ISO 8601
  details: Record<string, any>;
}

/**
 * Creates a new audit log entry
 * @param params - Audit log parameters
 * @returns AuditLogEntry object
 */
export function createAuditLogEntry(params: {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  details?: Record<string, any>;
}): AuditLogEntry {
  return {
    id: generateAuditId(),
    actorId: params.actorId,
    actorName: params.actorName,
    actorRole: params.actorRole,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    timestamp: new Date().toISOString(),
    details: params.details || {},
  };
}

/**
 * Generates a unique audit log ID
 * @returns Unique ID string
 */
export function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats audit log entry for display
 * @param entry - Audit log entry
 * @returns Formatted string
 */
export function formatAuditLogEntry(entry: AuditLogEntry): string {
  const date = new Date(entry.timestamp);
  const timeStr = date.toLocaleTimeString();
  return `[${timeStr}] ${entry.actorName} (${entry.actorRole}) - ${entry.action} on ${entry.resourceType} ${entry.resourceId}`;
}

/**
 * Filters audit logs by action
 * @param logs - Array of audit log entries
 * @param action - Action to filter by
 * @returns Filtered audit logs
 */
export function filterAuditLogsByAction(
  logs: AuditLogEntry[],
  action: AuditAction
): AuditLogEntry[] {
  return logs.filter((log) => log.action === action);
}

/**
 * Filters audit logs by actor
 * @param logs - Array of audit log entries
 * @param actorId - Actor ID to filter by
 * @returns Filtered audit logs
 */
export function filterAuditLogsByActor(
  logs: AuditLogEntry[],
  actorId: string
): AuditLogEntry[] {
  return logs.filter((log) => log.actorId === actorId);
}

/**
 * Filters audit logs by date range
 * @param logs - Array of audit log entries
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Filtered audit logs
 */
export function filterAuditLogsByDateRange(
  logs: AuditLogEntry[],
  startDate: Date,
  endDate: Date
): AuditLogEntry[] {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return logs.filter((log) => {
    const logTime = new Date(log.timestamp).getTime();
    return logTime >= start && logTime <= end;
  });
}

/**
 * Exports audit logs to CSV format
 * @param logs - Array of audit log entries
 * @returns CSV string
 */
export function exportAuditLogsToCSV(logs: AuditLogEntry[]): string {
  const headers = [
    'ID',
    'Actor ID',
    'Actor Name',
    'Actor Role',
    'Action',
    'Resource Type',
    'Resource ID',
    'Timestamp',
    'Details',
  ];

  const rows = logs.map((log) => [
    log.id,
    log.actorId,
    log.actorName,
    log.actorRole,
    log.action,
    log.resourceType,
    log.resourceId,
    log.timestamp,
    JSON.stringify(log.details),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}
