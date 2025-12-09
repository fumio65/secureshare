import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

/**
 * ProgressBar Component
 * Visual progress indicator with status states
 * 
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} status - Status (uploading, success, error, idle)
 * @param {string} label - Label text
 * @param {boolean} showPercentage - Show percentage text
 * @param {string} size - Size variant (sm, md, lg)
 */
const ProgressBar = ({
  progress = 0,
  status = 'idle',
  label = '',
  showPercentage = true,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const statusColors = {
    idle: 'bg-gray-200 dark:bg-gray-700',
    uploading: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    error: 'bg-red-600 dark:bg-red-500'
  };

  const statusIcons = {
    uploading: <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />,
    success: <Check className="w-4 h-4 text-green-600 dark:text-green-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
  };

  const heightClass = sizeClasses[size] || sizeClasses.md;
  const progressColor = statusColors[status] || statusColors.idle;

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Status */}
      {(label || showPercentage || statusIcons[status]) && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {statusIcons[status]}
            {label && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
          </div>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${progressColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;