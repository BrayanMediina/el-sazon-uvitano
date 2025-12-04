/**
 * Role Selection Screen
 * 
 * Allows user to select their role (Mesero or Cajero/Admin).
 * If Cajero is selected, prompts for admin PIN verification.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { selectRole, verifyAdminPin, setAdminPinVerified } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'CAJERO') {
      setSelectedRole(role);
      setShowPinModal(true);
    } else {
      selectRole(role);
      router.replace('/(tabs)');
    }
  };

  const handlePinVerification = async () => {
    if (!pin) {
      setPinError('PIN is required');
      return;
    }

    if (pin.length < 4) {
      setPinError('PIN must be at least 4 digits');
      return;
    }

    setIsVerifying(true);
    try {
      // TODO: Replace with actual backend PIN verification
      // const isValid = await verifyAdminPin(pin, user.id);

      // Mock verification - accept any 4+ digit PIN
      if (/^\d{4,}$/.test(pin)) {
        selectRole('CAJERO');
        setAdminPinVerified(true);
        setShowPinModal(false);
        router.replace('/(tabs)');
      } else {
        setPinError('Invalid PIN format');
      }
    } catch (error) {
      setPinError('PIN verification failed');
      console.error('PIN verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePinModalClose = () => {
    setShowPinModal(false);
    setPin('');
    setPinError('');
    setSelectedRole(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose how you'll use the system</Text>
      </View>

      {/* Role Cards */}
      <View style={styles.rolesContainer}>
        {/* Mesero Card */}
        <TouchableOpacity
          onPress={() => handleRoleSelect('MESERO')}
          activeOpacity={0.7}
        >
          <Card style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <Text style={styles.icon}>👨‍💼</Text>
            </View>
            <Text style={styles.roleName}>Mesero</Text>
            <Text style={styles.roleDescription}>
              Take orders, manage tables, and send to cashier
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.feature}>✓ Create tables</Text>
              <Text style={styles.feature}>✓ Add items to orders</Text>
              <Text style={styles.feature}>✓ Submit to cashier</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Cajero Card */}
        <TouchableOpacity
          onPress={() => handleRoleSelect('CAJERO')}
          activeOpacity={0.7}
        >
          <Card style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <Text style={styles.icon}>💰</Text>
            </View>
            <Text style={styles.roleName}>Cajero (Admin)</Text>
            <Text style={styles.roleDescription}>
              Process payments, manage menu, view reports
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.feature}>✓ Process payments</Text>
              <Text style={styles.feature}>✓ Manage menu</Text>
              <Text style={styles.feature}>✓ View sales reports</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <Card style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Roles</Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Mesero:</Text> Waiter role for taking orders and managing tables.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Cajero:</Text> Cashier/Admin role requiring PIN verification for security.
        </Text>
      </Card>

      {/* PIN Verification Modal */}
      <Modal
        visible={showPinModal}
        onClose={handlePinModalClose}
        title="Admin PIN Verification"
        actions={[
          {
            label: 'Cancel',
            onPress: handlePinModalClose,
            variant: 'secondary',
          },
          {
            label: 'Verify',
            onPress: handlePinVerification,
            variant: 'primary',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Enter your personal PIN to access the cashier panel.
        </Text>
        <Input
          label="PIN"
          placeholder="••••"
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setPinError('');
          }}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={6}
          editable={!isVerifying}
          error={pinError}
          containerStyle={styles.pinInput}
        />
        <Text style={styles.pinHint}>
          Demo: Enter any 4+ digit number
        </Text>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.xl,
    backgroundColor: tokens.colors.bg,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  title: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: '700',
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
  },
  rolesContainer: {
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  roleCard: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
  },
  roleIcon: {
    marginBottom: tokens.spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  roleName: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  roleDescription: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  roleFeatures: {
    gap: tokens.spacing.sm,
  },
  feature: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.success,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: tokens.colors.bgSecondary,
  },
  infoTitle: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  infoText: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: tokens.colors.text,
  },
  modalText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  pinInput: {
    marginBottom: tokens.spacing.md,
  },
  pinHint: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
    fontStyle: 'italic',
  },
});
