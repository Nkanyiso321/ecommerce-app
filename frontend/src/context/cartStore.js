/**
 * Cart Store - Shopping cart state management
 */

import create from 'zustand';
import { cartAPI } from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.getCart();
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.removeFromCart({ productId });
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await cartAPI.updateCartItem({ productId, quantity });
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartAPI.clearCart();
      set({ cart: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart?.totalPrice || 0;
  },

  getCartItemCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }
}));
