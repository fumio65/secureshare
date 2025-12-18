// src/services/stripeAPI.js
// Stripe payment service

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * Create Stripe Checkout Session and redirect to payment
 * 
 * @param {Object} params - Payment parameters
 * @param {string} params.uploadId - Upload ID (optional)
 * @param {number} params.amount - Amount in cents (300 or 800)
 * @param {string} params.paymentTier - 'premium' or 'large'
 * @param {string} params.token - JWT authentication token
 * @returns {Promise<Object>} - Checkout session data
 */
export const createCheckoutSession = async ({ uploadId, amount, paymentTier, token }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  const response = await fetch(`${apiUrl}/payments/create-checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      upload_id: uploadId,
      amount: amount,
      payment_tier: paymentTier,
      success_url: `${window.location.origin}/dashboard?payment=success`,
      cancel_url: `${window.location.origin}/dashboard?payment=canceled`
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  return await response.json();
};

/**
 * Redirect to Stripe Checkout
 * 
 * @param {string} checkoutUrl - Stripe Checkout URL
 */
export const redirectToCheckout = async (checkoutUrl) => {
  window.location.href = checkoutUrl;
};

/**
 * Get payment status
 * 
 * @param {string} paymentId - Payment ID
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} - Payment data
 */
export const getPaymentStatus = async (paymentId, token) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  const response = await fetch(`${apiUrl}/payments/${paymentId}/status/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get payment status');
  }

  return await response.json();
};

/**
 * Get payment history
 * 
 * @param {string} token - JWT authentication token
 * @returns {Promise<Array>} - List of payments
 */
export const getPaymentHistory = async (token) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  const response = await fetch(`${apiUrl}/payments/history/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get payment history');
  }

  return await response.json();
};

export default {
  createCheckoutSession,
  redirectToCheckout,
  getPaymentStatus,
  getPaymentHistory
};