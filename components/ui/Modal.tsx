/**
 * Modal Component
 * 
 * Reusable modal component for dialogs and overlays.
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { tokens } from '@/styles/tokens';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'danger' | 'secondary';
  }[];
  contentStyle?: ViewStyle;
}

const Modal = React.forwardRef<View, ModalProps>(
  ({ visible, onClose, title, children, actions, contentStyle }, ref) => {
    return (
      <RNModal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View ref={ref} style={[styles.container, contentStyle]}>
            {title && <Text style={styles.title}>{title}</Text>}

            <View style={styles.content}>{children}</View>

            {actions && (
              <View style={styles.actions}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.actionButton,
                      getActionButtonStyle(action.variant || 'secondary'),
                    ]}
                    onPress={action.onPress}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        getActionTextStyle(action.variant || 'secondary'),
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </RNModal>
    );
  }
);

Modal.displayName = 'Modal';

function getActionButtonStyle(variant: string) {
  const styles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: tokens.colors.primary,
    },
    danger: {
      backgroundColor: tokens.colors.error,
    },
    secondary: {
      backgroundColor: tokens.colors.bgSecondary,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
  };
  return styles[variant] || styles.secondary;
}

function getActionTextStyle(variant: string) {
  const styles: Record<string, any> = {
    primary: {
      color: tokens.colors.bg,
    },
    danger: {
      color: tokens.colors.bg,
    },
    secondary: {
      color: tokens.colors.text,
    },
  };
  return styles[variant] || styles.secondary;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: tokens.colors.bg,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    maxWidth: '90%',
    ...tokens.shadows.lg,
  },
  title: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  content: {
    marginBottom: tokens.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  actionText: {
    fontSize: tokens.typography.fontSize.sm,
    fontWeight: '600',
  },
});

export default Modal;
