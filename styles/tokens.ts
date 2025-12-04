/**
 * Design Tokens for El Sazón Uvitano
 * 
 * IMPORTANT: Replace the color values below with the actual colors from the logo.
 * These are placeholder values. Update them in:
 * 1. This file (tokens.ts)
 * 2. tailwind.config.js
 * 3. .env file
 */

export const tokens = {
  colors: {
    // Primary color - replace with logo primary color (hex)
    primary: '#0A5F3A',        // Placeholder: Green
    primary700: '#084D30',     // Darker shade
    primary600: '#0D6B42',     // Medium shade
    
    // Accent color - replace with logo accent color (hex)
    accent: '#FFD166',         // Placeholder: Gold/Yellow
    accentDark: '#F4A460',     // Darker accent
    
    // Neutral colors
    bg: '#FFFFFF',             // Background
    bgSecondary: '#F9FAFB',    // Secondary background
    text: '#1F2937',           // Primary text
    textSecondary: '#6B7280',  // Secondary text
    textLight: '#9CA3AF',      // Light text
    
    // Semantic colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Borders and dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },
  
  radius: {
    xs: 4,
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
    full: 9999,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export type Tokens = typeof tokens;
