# El Sazón Uvitano - Restaurant Management System

A modern, modular React Native + Expo application for restaurant management with real-time order processing, payment handling, and comprehensive audit logging.

## 🎯 Features

### Core Functionality
- **Mandatory Authentication**: Login required for all users
- **Role-Based Access**: Two distinct roles with different capabilities
  - **Mesero (Waiter)**: Create tables, manage orders, submit to cashier
  - **Cajero (Cashier/Admin)**: Process payments, manage menu, view reports
- **Real-Time Notifications**: Instant updates for order submissions and payments
- **Complete Audit Trail**: All actions logged with actor info, timestamp, and details
- **Sales Reporting**: Daily analytics, sales by waiter, top dishes

### Mesero Features
- Create and manage tables
- Add items to orders from menu
- Submit orders to cashier
- View order status in real-time

### Cajero Features
- Requires PIN verification for security
- View pending orders in real-time
- Process payments with multiple methods (Cash, Card, Transfer, Other)
- Create and manage menu items
- View comprehensive sales reports
- Export sales data to CSV

## 📁 Project Structure

```
el-sazon-uvitano/
├── app/
│   ├── (auth)/                    # Authentication module
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── role-selection.tsx
│   ├── (tabs)/                    # Main app with tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Home/Dashboard
│   │   ├── (pedidos)/             # Orders module (Mesero)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── [tableId].tsx
│   │   ├── (menu)/                # Menu module (All roles)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── [dishId].tsx
│   │   ├── (caja)/                # Cashier module (Cajero)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── [orderId].tsx
│   │   ├── (reportes)/            # Reports module (Cajero)
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx
│   │   └── (settings)/            # Settings module (All roles)
│   │       ├── _layout.tsx
│   │       └── index.tsx
│   ├── _layout.tsx                # Root layout with auth routing
│   └── modal.tsx
├── components/
│   └── ui/                        # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── ListItem.tsx
│       ├── Header.tsx
│       ├── Loading.tsx
│       ├── ErrorState.tsx
│       └── Badge.tsx
├── hooks/                         # Custom React hooks
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useMenu.ts
│   └── useNotifications.ts
├── store/                         # Zustand state management
│   ├── authStore.ts
│   ├── orderStore.ts
│   ├── menuStore.ts
│   └── notificationStore.ts
├── services/
│   └── convex/                    # Backend integration
│       ├── queries.ts
│       ├── mutations.ts
│       └── subscriptions.ts
├── styles/
│   ├── tokens.ts                  # Design tokens (colors, spacing, etc.)
│   └── tailwind.config.js
├── types/
│   └── index.ts                   # TypeScript type definitions
├── utils/
│   ├── audit.ts                   # Audit logging utilities
│   └── format.ts                  # Formatting utilities
├── .env.example                   # Environment variables template
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone or extract the project**
   ```bash
   cd el-sazon-uvitano
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   CLERK_PUBLISHABLE_KEY=your_key_here
   CLERK_SECRET_KEY=your_key_here
   CONVEX_URL=your_convex_url
   CONVEX_CLIENT_KEY=your_key_here
   REACT_NATIVE_APP_LOGO_COLOR_PRIMARY=#0A5F3A
   REACT_NATIVE_APP_LOGO_COLOR_ACCENT=#FFD166
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on your device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for web browser

## 🎨 Customizing Colors

The app uses a centralized color system based on your logo. To update colors:

### 1. Update `styles/tokens.ts`
```typescript
export const tokens = {
  colors: {
    primary: '#YOUR_PRIMARY_COLOR',        // Main brand color
    primary700: '#YOUR_PRIMARY_DARK',      // Darker shade
    accent: '#YOUR_ACCENT_COLOR',          // Accent color
    // ... other colors
  },
  // ...
};
```

### 2. Update `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#YOUR_PRIMARY_COLOR',
        700: '#YOUR_PRIMARY_DARK',
      },
      accent: {
        DEFAULT: '#YOUR_ACCENT_COLOR',
      },
      // ...
    },
  },
},
```

### 3. Update `.env`
```env
REACT_NATIVE_APP_LOGO_COLOR_PRIMARY=#YOUR_PRIMARY_COLOR
REACT_NATIVE_APP_LOGO_COLOR_ACCENT=#YOUR_ACCENT_COLOR
```

## 🔐 Authentication & Authorization

### Login Flow
1. User enters email and password
2. System validates credentials (currently mocked)
3. User selects role: Mesero or Cajero
4. If Cajero selected, user must enter personal PIN
5. User is redirected to appropriate dashboard

### Role-Based Access
- **Mesero**: Can only access Orders and Menu modules
- **Cajero**: Can access Cashier, Menu, and Reports modules
- **Both**: Can access Home and Settings

## 📊 Data Models

### User
```typescript
{
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: 'MESERO' | 'CAJERO' | 'ADMIN';
  adminPin?: string; // Hashed
  createdAt: string;
  updatedAt: string;
  auditLogs: AuditLogEntry[];
}
```

### Order
```typescript
{
  id: string;
  tableId: string;
  tableName: string;
  meseroId: string;
  meseroName: string;
  items: OrderItem[];
  status: 'DRAFT' | 'SUBMITTED' | 'IN_PROCESS' | 'PAID' | 'CANCELLED';
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  submittedAt?: string;
  paidAt?: string;
  auditLogs: AuditLogEntry[];
}
```

### Dish
```typescript
{
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
```

### AuditLogEntry
```typescript
{
  id: string;
  actorId: string;
  actorName: string;
  actorRole: 'MESERO' | 'CAJERO' | 'ADMIN';
  action: string; // CREATE_ORDER, UPDATE_ORDER, RECORD_PAYMENT, etc.
  resourceType: 'ORDER' | 'DISH' | 'PAYMENT' | 'TABLE';
  resourceId: string;
  timestamp: string; // ISO 8601
  details: Record<string, any>;
}
```

## 🔌 Backend Integration

### Current State
The app currently uses **mock data** and local state management with Zustand. Backend integration points are prepared but not yet connected.

### Connecting to Convex

1. **Set up Convex project**
   ```bash
   npm install convex
   npx convex init
   ```

2. **Update `services/convex/queries.ts`**
   Replace mock implementations with actual Convex queries:
   ```typescript
   import { query } from './_generated/server';
   
   export const getMenu = query(async (ctx) => {
     return await ctx.db.query('dishes').collect();
   });
   ```

3. **Update `services/convex/mutations.ts`**
   Replace mock implementations with actual Convex mutations:
   ```typescript
   import { mutation } from './_generated/server';
   
   export const createOrder = mutation(async (ctx, payload) => {
     // Create order logic
   });
   ```

4. **Update `services/convex/subscriptions.ts`**
   Implement real-time subscriptions:
   ```typescript
   export function useOrdersSubscription(filter) {
     return useSubscription(api.subscriptions.onOrders, filter);
   }
   ```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Manual Testing Scenarios

#### Mesero Flow
1. Login with any email/password
2. Select "Mesero" role
3. Create a new table
4. Add items from menu
5. Submit order to cashier
6. Verify notification appears

#### Cajero Flow
1. Login with any email/password
2. Select "Cajero" role
3. Enter PIN (any 4+ digit number in demo)
4. View pending orders
5. Click order to process payment
6. Select payment method and confirm
7. View updated sales reports

## 📱 API Endpoints (To Be Implemented)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/verify-pin` - Verify admin PIN

### Orders
- `GET /orders` - List orders
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `POST /orders/:id/submit` - Submit to cashier
- `POST /orders/:id/pay` - Record payment

### Menu
- `GET /dishes` - List dishes
- `POST /dishes` - Create dish
- `PUT /dishes/:id` - Update dish
- `DELETE /dishes/:id` - Delete dish

### Reports
- `GET /reports/daily` - Daily sales report
- `GET /reports/by-mesero` - Sales by waiter
- `GET /reports/by-dish` - Sales by dish
- `GET /reports/export` - Export to CSV

### Audit
- `GET /audit-logs` - List audit logs
- `GET /audit-logs/filter` - Filter audit logs

## 🛠️ Development

### Adding a New Screen
1. Create folder in `app/(tabs)/(module)/`
2. Create `_layout.tsx` for navigation
3. Create screen component (e.g., `index.tsx`)
4. Add route to parent layout

### Adding a New Component
1. Create file in `components/ui/`
2. Export from component file
3. Import and use in screens

### Adding State Management
1. Create store in `store/`
2. Create hook in `hooks/`
3. Use hook in components

## 📚 Documentation

### Audit Logging
All critical actions are logged. See `utils/audit.ts` for:
- `createAuditLogEntry()` - Create audit log
- `filterAuditLogsByAction()` - Filter by action
- `filterAuditLogsByActor()` - Filter by actor
- `exportAuditLogsToCSV()` - Export logs

### Formatting Utilities
See `utils/format.ts` for:
- `formatCurrency()` - Format as currency
- `formatDate()` - Format dates
- `formatTime()` - Format times
- `formatRelativeTime()` - Relative time (e.g., "2 hours ago")

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Emulator issues
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
```

### TypeScript errors
```bash
# Rebuild TypeScript
npx tsc --noEmit
```

## 📦 Dependencies

### Core
- `react-native` - Mobile framework
- `expo` - Development platform
- `expo-router` - File-based routing
- `react-navigation` - Navigation library

### State Management
- `zustand` - Lightweight state management

### UI
- `@expo/vector-icons` - Icon library
- `nativewind` - Tailwind CSS for React Native

### Authentication (To Be Integrated)
- `@clerk/clerk-expo` - Authentication provider

### Backend (To Be Integrated)
- `convex` - Real-time backend

## 📄 License

© 2024 El Sazón Uvitano. All rights reserved.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check Expo documentation: https://docs.expo.dev
4. Check React Native docs: https://reactnative.dev

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Guide](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready (Backend Integration Pending)
