/**
 * Input Component
 * 
 * Reusable text input component with validation and error states.
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  helperText?: string;
  required?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      containerStyle,
      helperText,
      required,
      style,
      editable = true,
      ...props
    },
    ref
  ) => {
    const inputStyles = getInputStyles(!!error, !editable);

    return (
      <View style={containerStyle}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[inputStyles, style]}
          placeholderTextColor={tokens.colors.textLight}
          editable={editable}
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

function getInputStyles(hasError: boolean, disabled: boolean) {
  return {
    borderWidth: 1,
    borderColor: hasError ? tokens.colors.error : tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.text,
    backgroundColor: disabled ? tokens.colors.bgSecondary : tokens.colors.bg,
    minHeight: 44,
  };
}

const styles = StyleSheet.create({
  label: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: '600',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  required: {
    color: tokens.colors.error,
  },
  error: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
  helperText: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
    marginTop: tokens.spacing.xs,
  },
});

export default Input;
