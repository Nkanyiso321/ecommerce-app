/**
 * Auth Store - User authentication state management
 */

import create from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  authToken: localStorage.getItem('authToken') || null,
  isLoading: false,
  error: null,

  register: async (firstName, lastName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword: password
      });

      const { user, token } = response.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      set({ user, authToken: token, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Registration failed';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });

      const { user, token } = response.data.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);

      set({ user, authToken: token, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    set({ user: null, authToken: null, error: null });
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update profile';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setError: (error) => set({ error })
}));
