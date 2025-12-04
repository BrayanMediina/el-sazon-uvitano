/**
 * Card Component
 * 
 * Reusable card component for displaying content in a contained box.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = React.forwardRef<View, CardProps>(
  ({ children, style, onPress, variant = 'default' }, ref) => {
    const cardStyles = getCardStyles(variant);

    return (
      <View ref={ref} style={[cardStyles, style]}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

function getCardStyles(variant: 'default' | 'elevated' | 'outlined'): ViewStyle {
  const baseStyles: ViewStyle = {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg,
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    elevated: {
      ...tokens.shadows.md,
    },
    outlined: {
      borderWidth: 2,
      borderColor: tokens.colors.primary,
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
  };
}

export default Card;
