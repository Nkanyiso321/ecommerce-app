/**
 * Frontend utils - Helper functions for common tasks
 */

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Truncate text
export const truncateText = (text, length = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isStrongPassword = (password) => {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[0-9]/.test(password);
};

// Get rating color
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return '#16a34a';
  if (rating >= 3.5) return '#eab308';
  if (rating >= 2.5) return '#f97316';
  return '#dc2626';
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    pending: '#fbbf24',
    processing: '#3b82f6',
    shipped: '#10b981',
    delivered: '#059669',
    cancelled: '#ef4444',
    refunded: '#8b5cf6'
  };
  return colors[status] || '#6b7280';
};

// Calculate discount percentage
export const calculateDiscount = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

// Debounce function
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Local storage helpers
export const storage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};
