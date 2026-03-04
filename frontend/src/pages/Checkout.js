/**
 * Checkout Page Component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import { orderAPI } from '../services/api';
import './Checkout.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    useSameAddress: true
  });

  const [paymentStatus, setPaymentStatus] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create payment intent
      const paymentData = await orderAPI.createPaymentIntent({
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress
      });

      // In a real app, you would integrate with Stripe's payment form here
      // For now, we'll complete the checkout with the payment intent ID

      const orderData = await orderAPI.checkout({
        paymentIntentId: paymentData.data.data.paymentIntentId,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.useSameAddress ? formData.shippingAddress : formData.billingAddress
      });

      await clearCart();
      setPaymentStatus('success');
      
      setTimeout(() => {
        navigate(`/orders/${orderData.data.data.id}`);
      }, 2000);
    } catch (error) {
      console.error('Checkout failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const shipping = 10;
  const tax = cart.totalPrice * 0.1;
  const total = cart.totalPrice + tax + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          {/* Form Section */}
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <section className="form-section">
                <h2>Personal Information</h2>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </section>

              {/* Shipping Address */}
              <section className="form-section">
                <h2>Shipping Address</h2>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
                  required
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleAddressChange('shippingAddress', 'state', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={formData.shippingAddress.zip}
                    onChange={(e) => handleAddressChange('shippingAddress', 'zip', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.shippingAddress.country}
                    onChange={(e) => handleAddressChange('shippingAddress', 'country', e.target.value)}
                    required
                  />
                </div>
              </section>

              {/* Billing Address */}
              <section className="form-section">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.useSameAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, useSameAddress: e.target.checked }))}
                  />
                  <span>Use same address for billing</span>
                </label>

                {!formData.useSameAddress && (
                  <>
                    <h2>Billing Address</h2>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.billingAddress.street}
                      onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                      required
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleAddressChange('billingAddress', 'state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.billingAddress.zip}
                        onChange={(e) => handleAddressChange('billingAddress', 'zip', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={formData.billingAddress.country}
                        onChange={(e) => handleAddressChange('billingAddress', 'country', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </section>

              {paymentStatus === 'success' && (
                <div className="success-message">
                  ✓ Order placed successfully! Redirecting...
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="error-message">
                  ✗ Checkout failed. Please try again.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-items">
              {cart.items.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <span>{item.productId}</span>
                  <span>x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
