/**
 * Header Component
 * 
 * Reusable header component for screen titles and navigation.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  style?: ViewStyle;
}

const Header = React.forwardRef<View, HeaderProps>(
  ({ title, subtitle, leftAction, rightAction, style }, ref) => {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <View ref={ref} style={styles.content}>
          {leftAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={leftAction.onPress}
            >
              {leftAction.icon}
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {rightAction && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={rightAction.onPress}
            >
              {rightAction.icon}
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
);

Header.displayName = 'Header';

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.primary,
    paddingBottom: tokens.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  actionButton: {
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: tokens.typography.fontSize.xl,
    fontWeight: '700',
    color: tokens.colors.bg,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.bg,
    opacity: 0.8,
    marginTop: tokens.spacing.xs,
  },
});

export default Header;
