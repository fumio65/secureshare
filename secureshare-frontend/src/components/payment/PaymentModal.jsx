// src/components/payment/PaymentModal.jsx
// Payment modal for Stripe Checkout

import React, { useState } from 'react';
import { CreditCard, X, FileArchive, File, AlertCircle, Loader } from 'lucide-react';
import CustomButton from '../forms/CustomButton';
import { createCheckoutSession, redirectToCheckout } from '../../services/stripeAPI';

/**
 * PaymentModal Component
 * Shows pricing and redirects to Stripe Checkout
 * 
 * @param {boolean} isOpen - Modal visibility
 * @param {Function} onClose - Close handler
 * @param {Object} pricing - Pricing information from calculateTotalPricing
 * @param {Array} files - Selected files
 * @param {string} token - JWT authentication token
 */
const PaymentModal = ({ isOpen, onClose, pricing, files = [], token }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !pricing || !pricing.requiresPayment) return null;

  const handlePayment = async () => {
  setIsProcessing(true);
  setError(null);

  try {
    // Determine tier based on price
    const tier = pricing.totalPrice === 3 ? 'premium' : 'large';
    
    console.log('Creating checkout with:', {
      amount: pricing.totalPrice * 100,
      tier: tier
    });

    // Create checkout session
    const checkoutData = await createCheckoutSession({
      amount: pricing.totalPrice * 100, // Convert dollars to cents
      paymentTier: tier,
      token: token
    });

    console.log('Checkout session created:', checkoutData);

    // Redirect to Stripe Checkout
    await redirectToCheckout(checkoutData.checkout_url);

  } catch (err) {
    console.error('Payment error:', err);
    setError(err.message);
    setIsProcessing(false);
  }
};

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Required
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pricing.tier === 'premium' ? 'Premium' : 'Large'} file upload
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* File Info */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                {files.length > 1 ? (
                  <FileArchive className="w-5 h-5 text-gray-400" />
                ) : (
                  <File className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total size: {formatFileSize(pricing.totalSize)}
                  </p>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && files.length <= 5 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Files to upload:
                  </p>
                  <ul className="space-y-1">
                    {files.slice(0, 5).map((file, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        • {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing Details */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Fee
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${pricing.totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {pricing.tier === 'premium' 
                  ? 'Files between 100MB and 1GB'
                  : 'Files between 1GB and 5GB'
                }
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
              <p className="text-xs text-green-800 dark:text-green-200">
                🔒 <strong>Secure Payment:</strong> Processed by Stripe. Your payment information is encrypted and secure.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <CustomButton
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                onClick={handlePayment}
                disabled={isProcessing}
                loading={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${pricing.totalPrice.toFixed(2)}
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;