/**
 * Dish Details Screen
 * 
 * Shows dish details. Cajeros can edit/delete.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useMenu } from '@/hooks/useMenu';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DishDetailsScreen() {
  const router = useRouter();
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const { getDishById, editDish, deleteDish } = useMenu();
  const { selectedRole } = useAuth();

  const dish = getDishById(dishId || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    price: dish?.price.toString() || '',
    category: dish?.category || '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!dish) {
    return (
      <View style={styles.container}>
        <Header title="Dish Not Found" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dish not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Dish name is required';
    }

    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price))) {
      errors.price = 'Price must be a number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validateForm()) return;

    try {
      editDish(dish.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        category: formData.category.trim() || undefined,
      });

      setShowEditModal(false);
      Alert.alert('Success', 'Dish updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update dish');
      console.error('Update dish error:', error);
    }
  };

  const handleDeleteDish = () => {
    Alert.alert(
      'Delete Dish',
      `Are you sure you want to delete "${dish.name}"?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => {
            try {
              deleteDish(dish.id);
              Alert.alert('Success', 'Dish deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete dish');
              console.error('Delete dish error:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={dish.name}
        leftAction={{
          icon: (
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={tokens.colors.bg}
            />
          ),
          onPress: () => router.back(),
        }}
        rightAction={
          selectedRole === 'CAJERO'
            ? {
                icon: (
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color={tokens.colors.bg}
                  />
                ),
                onPress: () => setShowEditModal(true),
              }
            : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dish Info */}
        <Card style={styles.infoCard}>
          <View style={styles.priceSection}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.price}>${dish.price.toFixed(2)}</Text>
          </View>

          {dish.category && (
            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.category}>{dish.category}</Text>
            </View>
          )}

          {dish.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.description}>{dish.description}</Text>
            </View>
          )}

          <View style={styles.statusSection}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.status,
                {
                  color: dish.isAvailable
                    ? tokens.colors.success
                    : tokens.colors.error,
                },
              ]}
            >
              {dish.isAvailable ? '✓ Available' : '✗ Unavailable'}
            </Text>
          </View>
        </Card>

        {/* Audit Info */}
        <Card style={styles.auditCard}>
          <Text style={styles.auditTitle}>Audit Information</Text>
          <View style={styles.auditRow}>
            <Text style={styles.auditLabel}>Created by</Text>
            <Text style={styles.auditValue}>{dish.createdBy}</Text>
          </View>
          <View style={styles.auditRow}>
            <Text style={styles.auditLabel}>Created at</Text>
            <Text style={styles.auditValue}>
              {new Date(dish.createdAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.auditRow}>
            <Text style={styles.auditLabel}>Last updated</Text>
            <Text style={styles.auditValue}>
              {new Date(dish.updatedAt).toLocaleString()}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      {selectedRole === 'CAJERO' && (
        <View style={styles.footer}>
          <Button
            title="Delete Dish"
            onPress={handleDeleteDish}
            variant="danger"
            fullWidth
          />
        </View>
      )}

      {/* Edit Modal */}
      {selectedRole === 'CAJERO' && (
        <Modal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setFormData({
              name: dish.name,
              description: dish.description || '',
              price: dish.price.toString(),
              category: dish.category || '',
            });
            setFormErrors({});
          }}
          title="Edit Dish"
          actions={[
            {
              label: 'Cancel',
              onPress: () => {
                setShowEditModal(false);
                setFormData({
                  name: dish.name,
                  description: dish.description || '',
                  price: dish.price.toString(),
                  category: dish.category || '',
                });
                setFormErrors({});
              },
              variant: 'secondary',
            },
            {
              label: 'Save',
              onPress: handleSaveChanges,
              variant: 'primary',
            },
          ]}
        >
          <Input
            label="Dish Name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData({ ...formData, name: text })
            }
            error={formErrors.name}
            containerStyle={styles.modalInput}
            required
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            containerStyle={styles.modalInput}
            multiline
          />

          <Input
            label="Price"
            value={formData.price}
            onChangeText={(text) =>
              setFormData({ ...formData, price: text })
            }
            keyboardType="decimal-pad"
            error={formErrors.price}
            containerStyle={styles.modalInput}
            required
          />

          <Input
            label="Category"
            value={formData.category}
            onChangeText={(text) =>
              setFormData({ ...formData, category: text })
            }
            containerStyle={styles.modalInput}
          />
        </Modal>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  errorText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.error,
    marginBottom: tokens.spacing.lg,
  },
  errorButton: {
    minWidth: 120,
  },
  infoCard: {
    marginBottom: tokens.spacing.lg,
  },
  priceSection: {
    marginBottom: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  label: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
  },
  price: {
    fontSize: tokens.typography.fontSize['2xl'],
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  categorySection: {
    marginBottom: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  category: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  description: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
    lineHeight: 22,
  },
  statusSection: {
    marginBottom: 0,
  },
  status: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '600',
  },
  auditCard: {
    backgroundColor: tokens.colors.bgSecondary,
  },
  auditTitle: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  auditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  auditLabel: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
  },
  auditValue: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.text,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  modalInput: {
    marginBottom: tokens.spacing.md,
  },
});
