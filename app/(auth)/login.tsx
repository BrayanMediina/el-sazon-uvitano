/**
 * Login Screen
 * 
 * Handles user authentication with email and password.
 * After successful login, user is prompted to select their role.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setIsSignedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual Clerk authentication
      // const { user } = await signInWithPassword({ email, password });

      // Mock user for demo
      const mockUser = {
        id: `user_${Date.now()}`,
        clerkId: `clerk_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'MESERO' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        auditLogs: [],
      };

      setUser(mockUser);
      setIsSignedIn(true);

      // Navigate to role selection
      router.replace('/(auth)/role-selection');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️</Text>
          <Text style={styles.title}>El Sazón Uvitano</Text>
          <Text style={styles.subtitle}>Restaurant Management System</Text>
        </View>

        {/* Login Form */}
        <Card style={styles.card}>
          <Text style={styles.formTitle}>Sign In</Text>

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            error={errors.email}
            containerStyle={styles.inputContainer}
            required
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            error={errors.password}
            containerStyle={styles.inputContainer}
            required
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          <Text style={styles.demoText}>
            Demo: Use any email and password (min 6 chars)
          </Text>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 El Sazón Uvitano. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: '700',
    color: tokens.colors.primary,
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  card: {
    marginBottom: tokens.spacing.xl,
  },
  formTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '600',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.lg,
  },
  inputContainer: {
    marginBottom: tokens.spacing.md,
  },
  loginButton: {
    marginTop: tokens.spacing.lg,
  },
  demoText: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
    marginTop: tokens.spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    marginTop: tokens.spacing.xl,
  },
  footerText: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.textLight,
  },
});
