import React from 'react';
import { File, FileText, Image, Video, Music, Archive, X, Check, AlertCircle } from 'lucide-react';
import { formatFileSize, getPricingTier } from '../../utils/fileUtils';

/**
 * Get file icon based on type
 */
const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.startsWith('audio/')) return Music;
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return Archive;
  if (fileType.includes('text') || fileType.includes('document')) return FileText;
  return File;
};

/**
 * FilePreview Component
 * Displays selected file information with pricing and validation
 * 
 * @param {File} file - The selected file object
 * @param {Function} onRemove - Callback to remove the file
 */
const FilePreview = ({ file, onRemove }) => {
  const FileIcon = getFileIcon(file.type);
  const pricing = getPricingTier(file.size);
  const isValid = pricing.tier !== 'invalid';

  const tierColors = {
    free: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    premium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    large: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    invalid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className={`
      border-2 rounded-xl p-4 transition-all duration-300
      ${isValid 
        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10' 
        : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
      }
    `}>
      <div className="flex items-start space-x-3">
        {/* File Icon */}
        <div className={`
          p-2.5 rounded-lg shrink-0
          ${isValid 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'
          }
        `}>
          <FileIcon className={`
            w-7 h-7
            ${isValid 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
            }
          `} />
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {file.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {formatFileSize(file.size)}
                {file.type && (
                  <span className="ml-2 text-gray-400 dark:text-gray-500">
                    • {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </span>
                )}
              </p>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={onRemove}
              className="
                p-1 rounded-lg transition-colors duration-200 shrink-0
                hover:bg-gray-200 dark:hover:bg-gray-700
                text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
              "
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing and Status */}
          <div className="flex items-center space-x-2 mt-2">
            {isValid ? (
              <>
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Valid File
                  </span>
                </div>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-semibold
                  ${tierColors[pricing.tier]}
                `}>
                  {pricing.label}
                </span>
              </>
            ) : (
              <div className="flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-700 dark:text-red-400">
                  File exceeds 5GB maximum
                </span>
              </div>
            )}
          </div>

          {/* Pricing Information */}
          {isValid && pricing.price > 0 && (
            <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This file requires a <span className="font-semibold text-gray-900 dark:text-gray-100">${pricing.price}</span> payment to upload.
                Files under 100MB are free.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;