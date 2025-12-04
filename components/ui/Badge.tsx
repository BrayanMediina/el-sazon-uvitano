/**
 * Badge Component
 * 
 * Reusable badge component for displaying status and labels.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/styles/tokens';

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const Badge = React.forwardRef<View, BadgeProps>(
  ({ label, variant = 'primary', style }, ref) => {
    const badgeStyles = getBadgeStyles(variant);

    return (
      <View ref={ref} style={[badgeStyles.container, style]}>
        <Text style={badgeStyles.text}>{label}</Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';

function getBadgeStyles(variant: BadgeVariant) {
  const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: any }> = {
    primary: {
      container: {
        backgroundColor: tokens.colors.primary,
      },
      text: {
        color: tokens.colors.bg,
      },
    },
    success: {
      container: {
        backgroundColor: tokens.colors.success,
      },
      text: {
        color: tokens.colors.bg,
      },
    },
    error: {
      container: {
        backgroundColor: tokens.colors.error,
      },
      text: {
        color: tokens.colors.bg,
      },
    },
    warning: {
      container: {
        backgroundColor: tokens.colors.warning,
      },
      text: {
        color: tokens.colors.bg,
      },
    },
    info: {
      container: {
        backgroundColor: tokens.colors.info,
      },
      text: {
        color: tokens.colors.bg,
      },
    },
  };

  const styles = variantStyles[variant];

  return {
    container: [
      {
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        borderRadius: tokens.radius.full,
        alignSelf: 'flex-start',
      },
      styles.container,
    ],
    text: [
      {
        fontSize: tokens.typography.fontSize.xs,
        fontWeight: '600',
      },
      styles.text,
    ],
  };
}

export default Badge;
