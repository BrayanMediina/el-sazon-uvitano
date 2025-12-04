/**
 * Menu Store
 * 
 * Manages menu/dishes state including available dishes and dish details.
 * Uses Zustand for state management.
 */

import { create } from 'zustand';
import { Dish } from '@/types';

interface MenuState {
  dishes: Dish[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setDishes: (dishes: Dish[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (dishId: string, updates: Partial<Dish>) => void;
  removeDish: (dishId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMenu: () => void;
  getAvailableDishes: () => Dish[];
  getDishById: (dishId: string) => Dish | undefined;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  dishes: [],
  isLoading: false,
  error: null,

  setDishes: (dishes) => set({ dishes }),

  addDish: (dish) =>
    set((state) => ({
      dishes: [dish, ...state.dishes],
    })),

  updateDish: (dishId, updates) =>
    set((state) => ({
      dishes: state.dishes.map((dish) =>
        dish.id === dishId ? { ...dish, ...updates } : dish
      ),
    })),

  removeDish: (dishId) =>
    set((state) => ({
      dishes: state.dishes.filter((dish) => dish.id !== dishId),
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearMenu: () =>
    set({
      dishes: [],
      error: null,
    }),

  getAvailableDishes: () => {
    const state = get();
    return state.dishes.filter((dish) => dish.isAvailable);
  },

  getDishById: (dishId) => {
    const state = get();
    return state.dishes.find((dish) => dish.id === dishId);
  },
}));
