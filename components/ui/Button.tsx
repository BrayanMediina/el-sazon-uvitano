/**
 * Button Component
 * 
 * Reusable button component with multiple variants and sizes.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { tokens } from '@/styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      style,
      textStyle,
      icon,
    },
    ref
  ) => {
    const buttonStyles = getButtonStyles(variant, size, disabled, fullWidth);
    const textStyles = getTextStyles(variant, size);

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        disabled={disabled || loading}
        style={[buttonStyles.container, style]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={textStyles.color} size="small" />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text style={[textStyles, textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

function getButtonStyles(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
  fullWidth: boolean
) {
  const baseStyles: ViewStyle = {
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  };

  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      minHeight: 32,
    },
    md: {
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      minHeight: 56,
    },
  };

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: tokens.colors.primary,
    },
    secondary: {
      backgroundColor: tokens.colors.bgSecondary,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    danger: {
      backgroundColor: tokens.colors.error,
    },
    success: {
      backgroundColor: tokens.colors.success,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: tokens.colors.primary,
    },
  };

  const disabledStyle: ViewStyle = disabled
    ? {
        opacity: 0.5,
      }
    : {};

  const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

  return {
    container: [
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      disabledStyle,
      widthStyle,
    ],
  };
}

function getTextStyles(variant: ButtonVariant, size: ButtonSize): TextStyle {
  const baseStyles: TextStyle = {
    fontWeight: '600',
  };

  const sizeStyles: Record<ButtonSize, TextStyle> = {
    sm: {
      fontSize: tokens.typography.fontSize.sm,
    },
    md: {
      fontSize: tokens.typography.fontSize.base,
    },
    lg: {
      fontSize: tokens.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<ButtonVariant, TextStyle> = {
    primary: {
      color: tokens.colors.bg,
    },
    secondary: {
      color: tokens.colors.text,
    },
    danger: {
      color: tokens.colors.bg,
    },
    success: {
      color: tokens.colors.bg,
    },
    outline: {
      color: tokens.colors.primary,
    },
  };

  return {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
}

export default Button;
