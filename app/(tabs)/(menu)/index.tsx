/**
 * Menu List Screen
 * 
 * Displays all available dishes. Meseros can view, Cajeros can also create/edit.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/styles/tokens';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Loading from '@/components/ui/Loading';
import { useMenu } from '@/hooks/useMenu';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMenu } from '@/services/convex/queries';

export default function MenuListScreen() {
  const router = useRouter();
  const { selectedRole } = useAuth();
  const { dishes, setDishes, isLoading, setIsLoading, createDish } = useMenu();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const menuData = await getMenu();
      setDishes(menuData);
    } catch (error) {
      console.error('Load menu error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCreateDish = () => {
    if (!validateForm()) return;

    try {
      createDish({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        category: formData.category.trim() || undefined,
      });

      setShowCreateModal(false);
      setFormData({ name: '', description: '', price: '', category: '' });
      setFormErrors({});
      Alert.alert('Success', 'Dish created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create dish');
      console.error('Create dish error:', error);
    }
  };

  const handleDishPress = (dishId: string) => {
    router.push(`/(tabs)/(menu)/${dishId}`);
  };

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Menu" />
        <Loading fullScreen message="Loading menu..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Menu"
        subtitle={`${filteredDishes.length} dish${filteredDishes.length !== 1 ? 'es' : ''}`}
        rightAction={
          selectedRole === 'CAJERO'
            ? {
                icon: (
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={24}
                    color={tokens.colors.bg}
                  />
                ),
                onPress: () => setShowCreateModal(true),
              }
            : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <Input
          placeholder="Search dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />

        {/* Dishes List */}
        {filteredDishes.length > 0 ? (
          <View style={styles.dishesList}>
            {filteredDishes.map((dish) => (
              <TouchableOpacity
                key={dish.id}
                onPress={() => handleDishPress(dish.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.dishCard}>
                  <View style={styles.dishHeader}>
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      {dish.category && (
                        <Text style={styles.dishCategory}>{dish.category}</Text>
                      )}
                      {dish.description && (
                        <Text
                          style={styles.dishDescription}
                          numberOfLines={2}
                        >
                          {dish.description}
                        </Text>
                      )}
                    </View>
                    <View style={styles.dishPrice}>
                      <Text style={styles.price}>
                        ${dish.price.toFixed(2)}
                      </Text>
                      {!dish.isAvailable && (
                        <Text style={styles.unavailable}>Unavailable</Text>
                      )}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No dishes found' : 'No dishes yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search'
                : 'Create your first dish'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Dish Modal */}
      {selectedRole === 'CAJERO' && (
        <Modal
          visible={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({ name: '', description: '', price: '', category: '' });
            setFormErrors({});
          }}
          title="Create New Dish"
          actions={[
            {
              label: 'Cancel',
              onPress: () => {
                setShowCreateModal(false);
                setFormData({ name: '', description: '', price: '', category: '' });
                setFormErrors({});
              },
              variant: 'secondary',
            },
            {
              label: 'Create',
              onPress: handleCreateDish,
              variant: 'primary',
            },
          ]}
        >
          <Input
            label="Dish Name"
            placeholder="e.g., Ceviche"
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
            placeholder="Optional description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            containerStyle={styles.modalInput}
            multiline
          />

          <Input
            label="Price"
            placeholder="0.00"
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
            placeholder="e.g., Appetizers"
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
  searchInput: {
    marginBottom: tokens.spacing.lg,
  },
  dishesList: {
    gap: tokens.spacing.md,
  },
  dishCard: {
    paddingVertical: tokens.spacing.md,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishInfo: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  dishName: {
    fontSize: tokens.typography.fontSize.base,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  dishCategory: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.accent,
    fontWeight: '600',
    marginTop: tokens.spacing.xs,
  },
  dishDescription: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  dishPrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  unavailable: {
    fontSize: tokens.typography.fontSize.xs,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: tokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: tokens.typography.fontSize.lg,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    fontSize: tokens.typography.fontSize.base,
    color: tokens.colors.textSecondary,
  },
  modalInput: {
    marginBottom: tokens.spacing.md,
  },
});
