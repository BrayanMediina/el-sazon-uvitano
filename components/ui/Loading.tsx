/**
 * Loading Component
 * 
 * Reusable loading indicator component.
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface LoadingProps {
  visible?: boolean;
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  fullScreen?: boolean;
}

const Loading = React.forwardRef<View, LoadingProps>(
  (
    {
      visible = true,
      message,
      size = 'large',
      style,
      fullScreen = false,
    },
    ref
  ) => {
    if (!visible) return null;

    const containerStyle = fullScreen ? styles.fullScreen : styles.container;

    return (
      <View ref={ref} style={[containerStyle, style]}>
        <ActivityIndicator
          size={size}
          color={tokens.colors.primary}
          style={styles.indicator}
        />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }
);

Loading.displayName = 'Loading';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colors.bg,
  },
  indicator: {
    marginBottom: tokens.spacing.md,
  },
  message: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.md,
  },
});

export default Loading;
