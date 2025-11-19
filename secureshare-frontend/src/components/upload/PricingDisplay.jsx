import React from 'react';
import { DollarSign, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { calculateTotalPricing } from '../../utils/fileUtils';

/**
 * PricingDisplay Component
 * Shows detailed pricing breakdown for selected files
 * 
 * @param {Array<File>} files - Array of selected files
 */
const PricingDisplay = ({ files }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const pricing = calculateTotalPricing(files);
  const isValid = pricing.tier.tier !== 'invalid';

  const tierInfo = {
    free: {
      color: 'green',
      bgLight: 'bg-green-50',
      bgDark: 'dark:bg-green-900/10',
      borderLight: 'border-green-200',
      borderDark: 'dark:border-green-700',
      textLight: 'text-green-700',
      textDark: 'dark:text-green-300',
      icon: CheckCircle,
      message: 'Your files are within the free tier!'
    },
    premium: {
      color: 'blue',
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-900/10',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-700',
      textLight: 'text-blue-700',
      textDark: 'dark:text-blue-300',
      icon: DollarSign,
      message: 'Premium tier - Payment required to upload'
    },
    large: {
      color: 'purple',
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-900/10',
      borderLight: 'border-purple-200',
      borderDark: 'dark:border-purple-700',
      textLight: 'text-purple-700',
      textDark: 'dark:text-purple-300',
      icon: DollarSign,
      message: 'Large tier - Payment required to upload'
    },
    invalid: {
      color: 'red',
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-900/10',
      borderLight: 'border-red-200',
      borderDark: 'dark:border-red-700',
      textLight: 'text-red-700',
      textDark: 'dark:text-red-300',
      icon: AlertCircle,
      message: 'Files exceed maximum size limit'
    }
  };

  const info = tierInfo[pricing.tier.tier];
  const Icon = info.icon;

  return (
    <div className={`
      border-2 rounded-xl p-4 transition-all duration-300
      ${info.bgLight} ${info.bgDark}
      ${info.borderLight} ${info.borderDark}
    `}>
      <div className="flex items-start space-x-3">
        <div className={`
          p-2 rounded-lg shrink-0
          ${info.bgLight} ${info.bgDark}
        `}>
          <Icon className={`w-6 h-6 ${info.textLight} ${info.textDark}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-base font-semibold ${info.textLight} ${info.textDark}`}>
              {pricing.tier.tier === 'free' ? 'Free Upload' : `${pricing.tier.label} Required`}
            </h3>
            {pricing.requiresPayment && (
              <span className={`
                text-xl font-bold ${info.textLight} ${info.textDark}
              `}>
                ${pricing.totalPrice}
              </span>
            )}
          </div>

          <p className={`text-sm ${info.textLight} ${info.textDark} mb-3`}>
            {info.message}
          </p>

          {/* File Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Files:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pricing.fileCount} {pricing.fileCount === 1 ? 'file' : 'files'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Size:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {pricing.formattedSize}
              </span>
            </div>
            {pricing.requiresPayment && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Stripe Checkout
                </span>
              </div>
            )}
          </div>

          {/* Pricing Tier Info */}
          <div className={`
            mt-3 p-2 rounded-lg border
            bg-white dark:bg-gray-800
            border-gray-200 dark:border-gray-700
          `}>
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {pricing.tier.tier === 'free' && 'Files up to 100MB total are free to upload.'}
                {pricing.tier.tier === 'premium' && 'Files between 100MB and 1GB require a $3 payment.'}
                {pricing.tier.tier === 'large' && 'Files between 1GB and 5GB require an $8 payment.'}
                {pricing.tier.tier === 'invalid' && 'Maximum total file size is 5GB. Please remove some files.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingDisplay;