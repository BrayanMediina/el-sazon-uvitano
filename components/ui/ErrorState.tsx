/**
 * ErrorState Component
 * 
 * Reusable error state component for displaying error messages.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

const ErrorState = React.forwardRef<View, ErrorStateProps>(
  ({ title = 'Error', message, onRetry, style }, ref) => {
    return (
      <View ref={ref} style={[styles.container, style]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

ErrorState.displayName = 'ErrorState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg,
  },
  iconContainer: {
    marginBottom: tokens.spacing.lg,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.error,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  retryButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
  },
  retryText: {
    color: tokens.colors.bg,
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
  },
});

export default ErrorState;
