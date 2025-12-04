# El Sazón Uvitano - Quick Start Guide

Get the app running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Emulator
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web Browser

## 🎮 Demo Credentials

### Login
- **Email**: Any email (e.g., `mesero@example.com`)
- **Password**: Any password (min 6 characters)

### Role Selection
- **Mesero**: Select to manage orders
- **Cajero**: Select and enter PIN (any 4+ digit number)

## 📱 Testing Flows

### Mesero (Waiter) Flow
1. Login → Select "Mesero"
2. **Home**: View dashboard
3. **Orders**: 
   - Click "Create Table"
   - Enter table name (e.g., "Mesa 5")
   - Click table to open order
   - Click "Add Items"
   - Select dishes and quantities
   - Click "Submit to Cashier"
4. **Menu**: Browse available dishes
5. **Settings**: View profile and app settings

### Cajero (Cashier) Flow
1. Login → Select "Cajero"
2. Enter PIN (any 4+ digits)
3. **Home**: View dashboard
4. **Cashier Panel**:
   - View pending orders from meseros
   - Click order to process payment
   - Select payment method
   - Confirm payment
5. **Menu**: Create/edit dishes
6. **Reports**: View sales analytics
7. **Settings**: View profile

## 🎨 Customizing Colors

### Update Logo Colors
Edit `styles/tokens.ts`:
```typescript
export const tokens = {
  colors: {
    primary: '#YOUR_COLOR',      // Main brand color
    primary700: '#YOUR_DARK',    // Darker shade
    accent: '#YOUR_ACCENT',      // Accent color
    // ...
  },
};
```

Also update `tailwind.config.js` and `.env` file.

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root navigation & auth routing |
| `app/(auth)/login.tsx` | Login screen |
| `app/(auth)/role-selection.tsx` | Role selection & PIN verification |
| `app/(tabs)/index.tsx` | Home/Dashboard |
| `app/(tabs)/(pedidos)/` | Orders module (Mesero) |
| `app/(tabs)/(caja)/` | Cashier module (Cajero) |
| `app/(tabs)/(menu)/` | Menu management |
| `styles/tokens.ts` | Design tokens & colors |
| `store/` | State management (Zustand) |
| `hooks/` | Custom React hooks |

## �� Common Tasks

### Add a New Screen
1. Create folder: `app/(tabs)/(module)/`
2. Create `_layout.tsx` for navigation
3. Create screen component: `index.tsx`

### Add a New Component
1. Create file: `components/ui/MyComponent.tsx`
2. Export from component
3. Import and use in screens

### Change App Colors
1. Edit `styles/tokens.ts`
2. Update `tailwind.config.js`
3. Update `.env` file

### Add State Management
1. Create store: `store/myStore.ts`
2. Create hook: `hooks/useMyStore.ts`
3. Use hook in components

## 🐛 Troubleshooting

### App won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Emulator not working
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
```

### Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npm start
```

## 📚 Documentation

- **Full README**: See `README.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **Code Comments**: Check inline comments in source files

## 🚀 Next Steps

1. **Integrate Backend**: Connect to Convex or your backend
2. **Add Authentication**: Integrate Clerk or your auth provider
3. **Customize UI**: Update colors and branding
4. **Add Features**: Extend with additional functionality
5. **Deploy**: Build and deploy to app stores

## 📞 Support

- Check `README.md` for detailed documentation
- Review `API_DOCUMENTATION.md` for backend integration
- Check code comments for implementation details
- Visit [Expo Docs](https://docs.expo.dev) for framework help

## ✅ Checklist

- [ ] Dependencies installed
- [ ] App running on emulator/device
- [ ] Can login with any credentials
- [ ] Can select role (Mesero/Cajero)
- [ ] Can create table and add items (Mesero)
- [ ] Can view pending orders (Cajero)
- [ ] Can process payment (Cajero)
- [ ] Colors customized to match logo

---

**Ready to go!** 🎉

Start by exploring the app, then customize it for your restaurant.
