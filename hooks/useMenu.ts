/**
 * useMenu Hook
 * 
 * Custom hook for managing menu and dishes.
 */

import { useMenuStore } from '@/store/menuStore';
import { Dish, DishInput } from '@/types';

export function useMenu() {
  const {
    dishes,
    isLoading,
    error,
    setDishes,
    addDish,
    updateDish,
    removeDish,
    setIsLoading,
    setError,
    clearMenu,
    getAvailableDishes,
    getDishById,
  } = useMenuStore();

  const createDish = (dishInput: DishInput): Dish => {
    const dish: Dish = {
      id: `dish_${Date.now()}`,
      ...dishInput,
      isAvailable: dishInput.isAvailable ?? true,
      createdBy: 'system', // Should be set from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditLogs: [],
    };
    addDish(dish);
    return dish;
  };

  const editDish = (dishId: string, updates: Partial<DishInput>) => {
    updateDish(dishId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteDish = (dishId: string) => {
    removeDish(dishId);
  };

  const toggleDishAvailability = (dishId: string) => {
    const dish = getDishById(dishId);
    if (dish) {
      updateDish(dishId, {
        isAvailable: !dish.isAvailable,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const searchDishes = (query: string): Dish[] => {
    const lowerQuery = query.toLowerCase();
    return dishes.filter(
      (dish) =>
        dish.name.toLowerCase().includes(lowerQuery) ||
        dish.description?.toLowerCase().includes(lowerQuery)
    );
  };

  const getDishesbyCategory = (category: string): Dish[] => {
    return dishes.filter((dish) => dish.category === category);
  };

  return {
    dishes,
    isLoading,
    error,
    createDish,
    editDish,
    deleteDish,
    toggleDishAvailability,
    searchDishes,
    getDishesbyCategory,
    getAvailableDishes,
    getDishById,
    setDishes,
    setIsLoading,
    setError,
    clearMenu,
  };
}
