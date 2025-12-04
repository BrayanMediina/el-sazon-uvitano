/**
 * Settings Screen
 * 
 * User settings and app configuration.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ListItem from '@/components/ui/ListItem';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAbout = () => {
    Alert.alert(
      'About El Sazón Uvitano',
      'Version 1.0.0\n\nA modern restaurant management system built with React Native and Expo.\n\n© 2024 El Sazón Uvitano'
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile */}
        <Text style={styles.sectionTitle}>Profile</Text>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileRole}>{user?.role}</Text>
            </View>
          </View>
        </Card>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive order and payment alerts
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: tokens.colors.border,
                true: tokens.colors.primary,
              }}
              thumbColor={tokens.colors.bg}
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowBorder]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound</Text>
              <Text style={styles.settingDescription}>
                Play sound for notifications
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{
                false: tokens.colors.border,
                true: tokens.colors.primary,
              }}
              thumbColor={tokens.colors.bg}
              disabled={!notificationsEnabled}
            />
          </View>
        </Card>

        {/* App Settings */}
        <Text style={styles.sectionTitle}>App</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>English</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowBorder]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>Light</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>1.0.0</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons
              name="help-circle"
              size={24}
              color={tokens.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help with the app
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowBorder]}
            onPress={handleAbout}
          >
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={tokens.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>About</Text>
              <Text style={styles.settingDescription}>
                App information and credits
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <MaterialCommunityIcons
              name="file-document"
              size={24}
              color={tokens.colors.primary}
              style={styles.settingIcon}
            />
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Read our privacy policy
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={tokens.colors.textLight}
            />
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.settingsCard}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
          />
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 El Sazón Uvitano. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  profileCard: {
    marginBottom: tokens.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: '700',
    color: tokens.colors.bg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  profileEmail: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  profileRole: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.accent,
    fontWeight: '600',
    marginTop: tokens.spacing.xs,
  },
  settingsCard: {
    marginBottom: tokens.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  settingIcon: {
    marginRight: tokens.spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  settingDescription: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: tokens.spacing.xl,
    marginBottom: tokens.spacing.lg,
  },
  footerText: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
  },
});
