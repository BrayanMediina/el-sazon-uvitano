# El Sazón Uvitano - API Documentation

Complete API reference for backend integration with Convex or your preferred backend service.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Orders](#orders)
3. [Menu/Dishes](#menudishes)
4. [Payments](#payments)
5. [Tables](#tables)
6. [Reports](#reports)
7. [Audit Logs](#audit-logs)
8. [Real-Time Subscriptions](#real-time-subscriptions)
9. [Error Handling](#error-handling)
10. [Example Payloads](#example-payloads)

---

## Authentication

### Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "mesero@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "clerkId": "clerk_123",
      "email": "mesero@example.com",
      "name": "Juan",
      "role": "MESERO",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Verify Admin PIN
**Endpoint**: `POST /auth/verify-pin`

**Request**:
```json
{
  "userId": "user_456",
  "pin": "1234"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "verified": true,
    "token": "jwt_token_with_admin_access"
  }
}
```

### Logout
**Endpoint**: `POST /auth/logout`

**Request**:
```json
{
  "userId": "user_123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Orders

### Create Order
**Endpoint**: `POST /orders`

**Request**:
```json
{
  "tableId": "table_001",
  "tableName": "Mesa 5 - Patio",
  "meseroId": "user_123",
  "meseroName": "Juan",
  "items": [
    {
      "dishId": "dish_1",
      "dishName": "Ceviche",
      "price": 12.99,
      "quantity": 2,
      "subtotal": 25.98
    },
    {
      "dishId": "dish_2",
      "dishName": "Lomo Saltado",
      "price": 18.99,
      "quantity": 1,
      "subtotal": 18.99
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "tableId": "table_001",
    "tableName": "Mesa 5 - Patio",
    "meseroId": "user_123",
    "meseroName": "Juan",
    "items": [...],
    "status": "DRAFT",
    "subtotal": 44.97,
    "tax": 4.50,
    "total": 49.47,
    "createdAt": "2024-01-15T14:30:00Z",
    "auditLogs": [
      {
        "id": "audit_001",
        "actorId": "user_123",
        "actorName": "Juan",
        "actorRole": "MESERO",
        "action": "CREATE_ORDER",
        "resourceType": "ORDER",
        "resourceId": "order_789",
        "timestamp": "2024-01-15T14:30:00Z",
        "details": {
          "tableId": "table_001",
          "itemsCount": 2,
          "total": 49.47
        }
      }
    ]
  }
}
```

### Get Orders
**Endpoint**: `GET /orders?status=SUBMITTED&meseroId=user_123`

**Query Parameters**:
- `status` (optional): DRAFT, SUBMITTED, IN_PROCESS, PAID, CANCELLED
- `meseroId` (optional): Filter by mesero
- `tableId` (optional): Filter by table
- `limit` (optional): Default 50
- `offset` (optional): Default 0

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 15,
    "page": 1,
    "pageSize": 50,
    "hasMore": false
  }
}
```

### Get Order by ID
**Endpoint**: `GET /orders/:orderId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    ...
  }
}
```

### Update Order
**Endpoint**: `PUT /orders/:orderId`

**Request**:
```json
{
  "addItems": [
    {
      "dishId": "dish_3",
      "dishName": "Aji de Gallina",
      "price": 14.99,
      "quantity": 1,
      "subtotal": 14.99
    }
  ],
  "removeItems": ["dish_1"],
  "changeQty": [
    {
      "dishId": "dish_2",
      "quantity": 2
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "items": [...],
    "subtotal": 64.96,
    "tax": 6.50,
    "total": 71.46,
    "auditLogs": [...]
  }
}
```

### Submit Order to Cashier
**Endpoint**: `POST /orders/:orderId/submit`

**Request**:
```json
{
  "meseroId": "user_123",
  "meseroName": "Juan"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "status": "SUBMITTED",
    "submittedAt": "2024-01-15T14:45:00Z",
    "auditLogs": [...]
  }
}
```

### Cancel Order
**Endpoint**: `POST /orders/:orderId/cancel`

**Request**:
```json
{
  "reason": "Customer requested cancellation"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "status": "CANCELLED",
    "auditLogs": [...]
  }
}
```

---

## Menu/Dishes

### Get All Dishes
**Endpoint**: `GET /dishes?category=Main%20Courses&available=true`

**Query Parameters**:
- `category` (optional): Filter by category
- `available` (optional): true/false
- `search` (optional): Search by name or description
- `limit` (optional): Default 100
- `offset` (optional): Default 0

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "dish_1",
        "name": "Ceviche",
        "description": "Fresh fish ceviche with lime and cilantro",
        "price": 12.99,
        "category": "Appetizers",
        "imageUrl": "https://...",
        "isAvailable": true,
        "createdBy": "user_456",
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z",
        "auditLogs": [...]
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 100,
    "hasMore": false
  }
}
```

### Get Dish by ID
**Endpoint**: `GET /dishes/:dishId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "dish_1",
    ...
  }
}
```

### Create Dish
**Endpoint**: `POST /dishes`

**Request**:
```json
{
  "name": "Causa Limeña",
  "description": "Layered potato dish with avocado and lime",
  "price": 11.99,
  "category": "Appetizers",
  "imageUrl": "https://...",
  "createdBy": "user_456",
  "createdByName": "Carlos"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "dish_new_001",
    "name": "Causa Limeña",
    "price": 11.99,
    "isAvailable": true,
    "createdAt": "2024-01-15T15:00:00Z",
    "auditLogs": [
      {
        "id": "audit_002",
        "actorId": "user_456",
        "actorName": "Carlos",
        "actorRole": "CAJERO",
        "action": "CREATE_DISH",
        "resourceType": "DISH",
        "resourceId": "dish_new_001",
        "timestamp": "2024-01-15T15:00:00Z",
        "details": {
          "name": "Causa Limeña",
          "price": 11.99,
          "category": "Appetizers"
        }
      }
    ]
  }
}
```

### Update Dish
**Endpoint**: `PUT /dishes/:dishId`

**Request**:
```json
{
  "name": "Causa Limeña Premium",
  "price": 13.99,
  "isAvailable": true,
  "updatedBy": "user_456",
  "updatedByName": "Carlos"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "dish_1",
    "name": "Causa Limeña Premium",
    "price": 13.99,
    "updatedAt": "2024-01-15T15:15:00Z",
    "auditLogs": [...]
  }
}
```

### Delete Dish
**Endpoint**: `DELETE /dishes/:dishId`

**Request**:
```json
{
  "deletedBy": "user_456",
  "deletedByName": "Carlos"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Dish deleted successfully",
  "data": {
    "id": "dish_1",
    "auditLogs": [...]
  }
}
```

---

## Payments

### Record Payment
**Endpoint**: `POST /payments`

**Request**:
```json
{
  "orderId": "order_789",
  "amount": 49.47,
  "method": "CASH",
  "cashierId": "user_456",
  "cashierName": "Carlos"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "payment_001",
    "orderId": "order_789",
    "amount": 49.47,
    "method": "CASH",
    "cashierId": "user_456",
    "cashierName": "Carlos",
    "createdAt": "2024-01-15T15:30:00Z",
    "auditLogs": [
      {
        "id": "audit_003",
        "actorId": "user_456",
        "actorName": "Carlos",
        "actorRole": "CAJERO",
        "action": "RECORD_PAYMENT",
        "resourceType": "PAYMENT",
        "resourceId": "payment_001",
        "timestamp": "2024-01-15T15:30:00Z",
        "details": {
          "orderId": "order_789",
          "amount": 49.47,
          "method": "CASH"
        }
      }
    ]
  }
}
```

### Get Payments
**Endpoint**: `GET /payments?startDate=2024-01-15&endDate=2024-01-15&cashierId=user_456`

**Query Parameters**:
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date
- `cashierId` (optional): Filter by cashier
- `method` (optional): CASH, CARD, TRANSFER, OTHER
- `limit` (optional): Default 50

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 8,
    "page": 1,
    "pageSize": 50,
    "hasMore": false
  }
}
```

---

## Tables

### Create Table
**Endpoint**: `POST /tables`

**Request**:
```json
{
  "name": "Mesa 5 - Patio",
  "meseroId": "user_123",
  "meseroName": "Juan"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "table_001",
    "name": "Mesa 5 - Patio",
    "meseroId": "user_123",
    "meseroName": "Juan",
    "createdAt": "2024-01-15T14:00:00Z",
    "auditLogs": [...]
  }
}
```

### Get Tables
**Endpoint**: `GET /tables?meseroId=user_123`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 5
  }
}
```

---

## Reports

### Daily Sales Report
**Endpoint**: `GET /reports/daily?date=2024-01-15`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalOrders": 12,
    "totalRevenue": 487.50,
    "totalTax": 48.75,
    "ordersByMesero": [
      {
        "meseroId": "user_123",
        "meseroName": "Juan",
        "ordersCount": 7,
        "revenue": 287.50
      },
      {
        "meseroId": "user_124",
        "meseroName": "Maria",
        "ordersCount": 5,
        "revenue": 200.00
      }
    ],
    "ordersByDish": [
      {
        "dishId": "dish_1",
        "dishName": "Ceviche",
        "quantitySold": 15,
        "revenue": 194.85
      }
    ],
    "ordersByPaymentMethod": [
      {
        "method": "CASH",
        "count": 8,
        "amount": 350.00
      },
      {
        "method": "CARD",
        "count": 4,
        "amount": 137.50
      }
    ]
  }
}
```

### Sales by Date Range
**Endpoint**: `GET /reports/range?startDate=2024-01-01&endDate=2024-01-31`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "totalOrders": 10,
      "totalRevenue": 450.00,
      ...
    },
    ...
  ]
}
```

### Sales by Mesero
**Endpoint**: `GET /reports/by-mesero?startDate=2024-01-01&endDate=2024-01-31`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "meseroId": "user_123",
      "meseroName": "Juan",
      "totalOrders": 45,
      "totalRevenue": 2250.00,
      "averageOrderValue": 50.00
    }
  ]
}
```

### Export Report to CSV
**Endpoint**: `GET /reports/export?format=csv&startDate=2024-01-01&endDate=2024-01-31`

**Response** (200 OK):
```
Content-Type: text/csv
Content-Disposition: attachment; filename="sales_report_2024-01-01_to_2024-01-31.csv"

Date,Total Orders,Total Revenue,Total Tax,Top Mesero,Top Dish
2024-01-01,10,450.00,45.00,Juan,Ceviche
...
```

---

## Audit Logs

### Get Audit Logs
**Endpoint**: `GET /audit-logs?action=CREATE_ORDER&startDate=2024-01-15&endDate=2024-01-15`

**Query Parameters**:
- `action` (optional): CREATE_ORDER, UPDATE_ORDER, RECORD_PAYMENT, etc.
- `actorId` (optional): Filter by actor
- `resourceType` (optional): ORDER, DISH, PAYMENT, TABLE
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date
- `limit` (optional): Default 100

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "audit_001",
        "actorId": "user_123",
        "actorName": "Juan",
        "actorRole": "MESERO",
        "action": "CREATE_ORDER",
        "resourceType": "ORDER",
        "resourceId": "order_789",
        "timestamp": "2024-01-15T14:30:00Z",
        "details": {
          "tableId": "table_001",
          "itemsCount": 2,
          "total": 49.47
        }
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 100,
    "hasMore": false
  }
}
```

---

## Real-Time Subscriptions

### Subscribe to Orders
**WebSocket**: `wss://api.example.com/ws/orders`

**Subscribe Message**:
```json
{
  "type": "subscribe",
  "channel": "orders",
  "filter": {
    "status": "SUBMITTED"
  }
}
```

**Update Message** (from server):
```json
{
  "type": "order_update",
  "data": {
    "id": "order_789",
    "status": "SUBMITTED",
    "tableName": "Mesa 5",
    "meseroName": "Juan",
    "total": 49.47,
    "timestamp": "2024-01-15T14:45:00Z"
  }
}
```

### Subscribe to Notifications
**WebSocket**: `wss://api.example.com/ws/notifications`

**Subscribe Message**:
```json
{
  "type": "subscribe",
  "channel": "notifications",
  "userId": "user_456"
}
```

**Notification Message** (from server):
```json
{
  "type": "notification",
  "data": {
    "id": "notif_001",
    "type": "ORDER_SUBMITTED",
    "title": "New Order",
    "message": "Order from Mesa 5 has been submitted",
    "data": {
      "orderId": "order_789",
      "tableName": "Mesa 5"
    },
    "timestamp": "2024-01-15T14:45:00Z"
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "INVALID_REQUEST",
  "message": "Email is required",
  "statusCode": 400
}
```

### Common Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

### Error Examples

**Validation Error**:
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "price": "Price must be a positive number"
  },
  "statusCode": 400
}
```

**Authentication Error**:
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid credentials",
  "statusCode": 401
}
```

**Permission Error**:
```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "Only Cajero can access this resource",
  "statusCode": 403
}
```

---

## Example Payloads

### Complete Order Creation Flow

1. **Create Table**
```bash
POST /tables
{
  "name": "Mesa 5 - Patio",
  "meseroId": "user_123",
  "meseroName": "Juan"
}
```

2. **Create Order**
```bash
POST /orders
{
  "tableId": "table_001",
  "tableName": "Mesa 5 - Patio",
  "meseroId": "user_123",
  "meseroName": "Juan",
  "items": [
    {
      "dishId": "dish_1",
      "dishName": "Ceviche",
      "price": 12.99,
      "quantity": 2,
      "subtotal": 25.98
    }
  ]
}
```

3. **Submit Order**
```bash
POST /orders/order_789/submit
{
  "meseroId": "user_123",
  "meseroName": "Juan"
}
```

4. **Record Payment**
```bash
POST /payments
{
  "orderId": "order_789",
  "amount": 49.47,
  "method": "CASH",
  "cashierId": "user_456",
  "cashierName": "Carlos"
}
```

5. **View Daily Report**
```bash
GET /reports/daily?date=2024-01-15
```

---

## Rate Limiting

- **Default**: 100 requests per minute per user
- **Burst**: 10 requests per second
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Pagination

All list endpoints support pagination:
- `limit`: Items per page (default: 50, max: 500)
- `offset`: Starting position (default: 0)

**Response**:
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "pageSize": 50,
  "hasMore": true
}
```

---

**API Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation
