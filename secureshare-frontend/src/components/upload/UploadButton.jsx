import React from 'react';
import { Upload, CreditCard, Lock } from 'lucide-react';
import { calculateTotalPricing } from '../../utils/fileUtils';
import CustomButton from '../forms/CustomButton';

/**
 * UploadButton Component
 * Smart button that handles both free and paid uploads
 * 
 * @param {Array<File>} files - Array of selected files
 * @param {Function} onContinue - Callback when user clicks to continue (receives pricing info)
 * @param {boolean} disabled - Whether button is disabled
 */
const UploadButton = ({ files, onContinue, disabled = false }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const pricing = calculateTotalPricing(files);
  const isValid = pricing.tier.tier !== 'invalid';

  const handleClick = () => {
    if (onContinue) {
      onContinue(pricing);
    }
  };

  // Invalid files - show error button
  if (!isValid) {
    return (
      <CustomButton
        variant="outline"
        className="w-full"
        disabled={true}
      >
        <Lock className="h-5 w-5 mr-2" />
        Cannot Upload - Files Too Large
      </CustomButton>
    );
  }

  // Free upload
  if (!pricing.requiresPayment) {
    return (
      <CustomButton
        variant="primary"
        onClick={handleClick}
        disabled={disabled}
        className="w-full"
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload {pricing.fileCount} {pricing.fileCount === 1 ? 'File' : 'Files'} (Free)
      </CustomButton>
    );
  }

  // Paid upload
  return (
    <div className="space-y-2">
      <CustomButton
        variant="primary"
        onClick={handleClick}
        disabled={disabled}
        className="w-full"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Continue to Payment (${pricing.totalPrice})
      </CustomButton>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Secure payment via Stripe • Your files will upload after payment
      </p>
    </div>
  );
};

export default UploadButton;