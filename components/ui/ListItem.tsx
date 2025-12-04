/**
 * ListItem Component
 * 
 * Reusable list item component for displaying items in lists.
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  badge?: string;
  badgeColor?: string;
}

const ListItem = React.forwardRef<TouchableOpacity, ListItemProps>(
  (
    {
      title,
      subtitle,
      description,
      onPress,
      leftElement,
      rightElement,
      style,
      badge,
      badgeColor,
    },
    ref
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {badge && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: badgeColor || tokens.colors.primary },
                ]}
              >
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>

          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}

          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>

        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </TouchableOpacity>
    );
  }
);

ListItem.displayName = 'ListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
    backgroundColor: tokens.colors.bg,
  },
  leftElement: {
    marginRight: tokens.spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  title: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
    flex: 1,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  description: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textLight,
    marginTop: tokens.spacing.xs,
  },
  badge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.full,
  },
  badgeText: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: '600',
    color: tokens.colors.bg,
  },
  rightElement: {
    marginLeft: tokens.spacing.md,
  },
});

export default ListItem;
